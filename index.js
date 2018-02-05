"use strict";

// ------------ Requirements ------------ //

var Viz = require("viz.js"),
    fs = require("fs"),
    util = require("./util.js");

// ------------------------------------------- //
// ------------ CLASS JSONGraph ------------ //

function JSONGraph(opts)
{
    this.strict = opts && opts.strict ? true : false;
    this.type = opts && opts.type || "digraph";
    this.name = opts && opts.name || "";
    this.graph = opts && opts.graph || {};
    this.node = opts && opts.node || {};
    this.edge = opts && opts.edge || {};
    this.styles = opts && opts.styles || {};
    this.css = opts && opts.css || [];
    this.statements = opts && (opts.statements || opts.stmts) || [];
    
    this._computedDot = null;
}

// ------------ JSONGraph Public Static Methods ------------ //

JSONGraph.import = function(json)
{
    return new JSONGraph(__getJSON(json));
};

JSONGraph.generate = function(opts, dotOpts, path, cb)
{
    if(typeof(opts) == "string")
    {
        opts = __getJSON(opts);
    }
    if(typeof(dotOpts) == "string")
    {
        cb = path;
        path = dotOpts;
        dotOpts = undefined;
    }
    if(path)
    {
        return new JSONGraph(opts).save(path, dotOpts, cb);
    }
    return new JSONGraph(opts).generate(dotOpts);
};

JSONGraph.extends = function(modName)
{
    // Requires
    var path = require.resolve(modName.indexOf("/") > -1 ? modName : "./modules/" + modName + ".js"),
        extension = require.cache[path];
    
    if(!extension)
    {
         extension = require(path);
         extension(JSONGraph);
    }
    
    return JSONGraph;
};

// ------------ JSONGraph Public Methods ------------ //

// ---> Generates

JSONGraph.prototype.reset = function()
{
    this._computedDot = null;
    return this;
};

JSONGraph.prototype.dot = function()
{
    if(this._computedDot === null)
    {
        this._computedDot = this._dot("");
    }
    return this._computedDot;
};

JSONGraph.prototype.generate = function(dotOpts)
{
    var d = this.dot(), o;
    try
    {
        o = Viz(d, dotOpts);
        o = new JSONGraph.SVG(o);
        __addCSS(o, this.css);
    }
    catch(e)
    {
        throw new Error("Error while generating the dot graph.\nGraph:\n" + d + "\n\n" + e);
    }
    return o;
};

JSONGraph.prototype.svg = JSONGraph.prototype.generate;

JSONGraph.prototype.save = function(path, dotOpts, cb)
{
    if(dotOpts && typeof(dotOpts) != "object")
    {
        cb = dotOpts;
        dotOpts = undefined;
    }
    return this.generate(dotOpts).save(path, cb);
};

JSONGraph.prototype.clone = function(name)
{
    return new JSONGraph({
        strict: this.strict,
        type: this.type,
        name: name || this.name,
        graph: util.clone(this.graph),
        node: util.clone(this.node),
        edge: util.clone(this.edge),
        styles: util.clone(this.styles),
        css: util.clone(this.css),
        statements: util.clone(this.statements)
    });
};

// ---> Converts

JSONGraph.prototype.toJSON = function(replace, space)
{
    return JSON.stringify({
        strict: this.strict,
        type: this.type,
        name: this.name,
        graph: this.graph,
        node: this.node,
        edge: this.edge,
        styles: this.styles,
        css: this.css,
        statements: this.statements
    }, replace, space);
};

// ---> Statements

JSONGraph.prototype.addRaw = function(stmt)
{
    var n = this.statements.length;
    this.statements.push(new JSONGraph.Raw(stmt));
    return n;
};

JSONGraph.prototype.addNode = function(node, attrs)
{
    var n = this.statements.length;
    this.statements.push({stmt: __nodeName(node), attrs: attrs});
    return n;
};

JSONGraph.prototype.addEdge = 
JSONGraph.prototype.linkNodes = function(nodes, attrs)
{
    var n = this.statements.length;
    this.statements.push({stmt: nodes.map(__nodeDecl).join("->"), attrs: attrs});
    return n;
};

JSONGraph.prototype.addStruct = function(name, nodes, attrs)
{
    var n = this.statements.length;
    if(!attrs) attrs = {};
    attrs.label = new JSONGraph.Raw(__struct(nodes));
    attrs.shape = attrs.shape ? "record," + attrs.shape : "record";
    this.statements.push({stmt: __nodeName(name), attrs: attrs});
    return n;
};

JSONGraph.prototype.addSubgraph = function(sub)
{
    var n = this.statements.length;
    if(!(sub instanceof JSONGraph))
    {
        sub = new JSONGraph(sub);
    }
    sub.type = "subgraph";
    this.statements.push(sub);
    return n;
};

// ------------ JSONGraph Protected Methods ------------ //

Object.defineProperties(JSONGraph.prototype,
{
    _dot: {value:  function(tab)
    {
        return tab + (this.strict ? "strict " : "") + this.type + (this.name ? " " + util.ID(this.name) : "") +
                "\n" + tab + "{\n" +
                    this._statements(tab + "\t") +
                tab + "}";
    }},
    
    _statements: {value:  function(tab)
    {
        var i = 0, str = "", stmts = this.statements;
        
        str += this._eltStyle("graph", tab);
        str += this._eltStyle("node", tab);
        str += this._eltStyle("edge", tab);
        
        for(;i < stmts.length; i++)
        {
            str += this._statement(stmts[i], tab);
        }
        
        return str;
    }},
    
    _statement: {value:  function(stmt, tab)
    {
        // The statement is empty -> returns an empty string
        if(!stmt)
        {
            return "";
        }
        
        // The statement is a none empty string -> returns iut directly
        if(typeof(stmt) == "string")
        {
            return tab + stmt + ";\n";
        }
        if(stmt && stmt instanceof JSONGraph)
        {
            return stmt._dot(tab) + "\n";
        }
        if(stmt && stmt instanceof JSONGraph.Raw)
        {
            return tab + stmt.content + ";\n";
        }
        
        var s = stmt.statement || stmt.stmt,
            a = stmt.attributes || stmt.attrs;
        
        var str = s || "";
        if(a) str += this._attributes(a, s);
        
        return str ? tab + str + ";\n" : "";
    }},
    
    _eltStyle: {value:  function(n, tab)
    {
        var s = this[n], a = this._attributes(s);
        
        return a ? tab + n + " " + a + ";\n" : "";
    }},
    
    _array: {value:  function(a)
    {
        return a instanceof Array ? a : a.split(/,\s*/g);
    }},
    
    _styles: {value:  function(n, lb)
    {
        n = this._array(n);
        var str = "", s, i = 0, attrs;
        for(; i < n.length; i++)
        {
            s = this.styles[n[i]];
            if(s)
            {
                attrs = this._nAttributes(s, lb);
                if(attrs)
                {
                    if(str) str += ", ";
                    str += attrs;
                }
            }
        }
        
        return str;
    }},
    
    _textStyle: {value:  function(n, lb)
    {
        var a = n = this._array(n), i = 0, st, s = "", e = "";
        for(; i < a.length; i++)
        {
            st = __textStyles[a[i]];
            if(st)
            {
                s += "<" + st + ">";
                e = "</" + st + ">" + e;
            }
        }
        if(lb[0] == '"')
        {
            lb = lb.replace(/^\"/, "").replace(/\"\s*$/, "");
        }
        return s ? "label=<" + s + util.escapeHTML(lb) + e + ">" : "";
    }},
    
    _attributes: {value:  function(attrs, lb)
    {
        var str = "";
        
        // Attributes is a string ref
        if(typeof(attrs) == "string" || attrs instanceof Array)
        {
            str = this._styles(attrs, lb);
        }
        else
        {
            str = this._nAttributes(attrs, lb);
        }
        
        return str ? " [" + str + "]" : "";
    }},
    
    _nAttributes: {value:  function(attrs, lb)
    {
        var n, str = "";
        
        for(n in attrs)
        {
            n = n == "ref" ? this._styles(attrs[n], lb) :
                    n == "textstyle" ? this._textStyle(attrs[n], lb) :
                        util.ID(n) + "=" + util.ID(attrs[n]);
            if(n)
            {
                if(str) str += ", ";
                str += n;
            }
        }
        
        return str;
    }}
});

// ---------------------------------------------- //
// ------------ CLASS JSONGraph.SVG ------------ //

Object.defineProperty(JSONGraph, "SVG",
{
    value: require("jsonviz/svg.class")
});

// ---------------------------------------------- //
// -------------- CLASS JSONGraph.HTML -------------- //

Object.defineProperty(JSONGraph, "HTML",
{
    value: require("jsonviz/html.class")
});

// ---------------------------------------------- //
// -------------- CLASS JSONGraph.Raw -------------- //

Object.defineProperty(JSONGraph, "Raw",
{
    value: require("jsonviz/raw.class")
});

// -------------- PRIVATE -------------- //

var __textStyles = {italic: "i", bold: "b", underline: "u", stoke: "s",
                    i: "i", b: "b", u: "u", s: "s"};
    
// --> JSON

function __getJSON(json)
{
    // JSON string
    if(/^\s*\{/.test(json))
    {
        return JSON.parse(json);
    }
    // Path
    return JSON.parse(fs.readFIleSync(json, "utf8"));
}

// --> Node

function __nodeDecl(n)
{
    if(typeof(n) == "object")
    {
        var s = Object.keys(n);
        return "\"" + util.escapeString(s) + "\":\"" + util.escapeString(n[s]) + "\"";
    }
    return "\"" + util.escapeString(n) + "\"";
}

function __nodeName(n)
{
    return "\"" + util.escapeString(n) + "\"";
}

function __structElt(e)
{
    if(e instanceof Array)
    {
        return "{" + __struct(e) + "}";
    }
    if(/^\s*</.test(e))
    {
        return e;
    }
    e = util.escapeHTML(e);
    return "<" + e + "> " + e;
}

function __struct(a)
{
    return a.map(__structElt).join(" | ");
}

// --> SVG

function __addCSS(svg, css)
{
    var s = util.css(css);
    if(s)
    {
        svg.text = svg.text.replace(/<svg[\s\n](.|\n)*?>/, "$&\n<style>" + s + "</style>");
    }
}

// -------------- EXPORTS THE MODULE -------------- //

exports = module.exports = JSONGraph;