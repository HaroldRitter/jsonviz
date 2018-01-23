"use strict";

// ------------ Requirements ------------ //

var Viz = require("viz.js"),
    fs = require("fs");

// ------------------------------------------- //
// ------------ CLASS JSONGraph ------------ //

function JSONGraph(opts)
{
    this.strict = opts.strict ? true : false;
    this.type = opts.type || "digraph";
    this.name = opts.name || "";
    this.graph = opts.graph || {};
    this.node = opts.node || {};
    this.edge = opts.edge || {};
    this.styles = opts.styles || {};
    this.statements = opts.statements || opts.stmts || [];
    
    this._computedDot = null;
}

// ------------ JSONGraph Public Static Methods ------------ //

JSONGraph.import = function(json)
{
    return new JSONGraph(__getJSON(json));
};

JSONGraph.generate = function(opts, dotOpts, path, cb)
{
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

// ------------ JSONGraph Public Methods ------------ //

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
        graph: __clone(this.graph),
        node: __clone(this.node),
        edge: __clone(this.edge),
        styles: __clone(this.styles),
        statements: __clone(this.statements)
    });
};

// ------------ JSONGraph Protected Methods ------------ //

Object.defineProperties(JSONGraph.prototype,
{
    _dot: {value:  function(tab)
    {
        return tab + (this.strict ? "strict " : "") + this.type + (this.name ? " " + __ID(this.name) : "") +
                tab +"\n{\n" +
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
        if(typeof(stmt) == "string")
        {
            return tab + stmt + ";\n";
        }
        
        var s = stmt.statement || stmt.stmt,
            a = stmt.attributes || stmt.attrs;
        if(s && s instanceof JSONGraph)
        {
            return s._dot(tab) + "\n";
        }
        
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
        var str = "", s, i = 0;
        for(; i < n.length; i++)
        {
            s = this.styles[n];
            if(s)
            {
                if(str) str += ", ";
                str += this._nAttributes(s, lb);
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
        return s ? "label=<" + s + __escapeHTML(lb) + e + ">" : "";
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
            if(str) str += ", ";
            str += n == "ref" ? this._styles(attrs[n], lb) :
                    n == "textstyle" ? this._textStyle(attrs[n], lb) :
                        __ID(n) + "=" + __ID(attrs[n]);
        }
        
        return str;
    }}
});

// ---------------------------------------------- //
// ------------ CLASS JSONGraph.SVG ------------ //

JSONGraph.SVG = function(txt)
{
    this.text = txt;
};

// ------------ Public Methods ------------ //

JSONGraph.SVG.prototype.toString = function()
{
    return this.text;
};

JSONGraph.SVG.prototype.save = function(path, cb)
{
    if(cb === true || cb === undefined)
    {
        fs.writeFileSync(path, this.text);
    }
    else
    {
        fs.writeFile(path, this.text, cb);
    }
    return this;
};

// ---------------------------------------------- //
// -------------- CLASS JSONGraph.HTML -------------- //

Object.defineProperty(JSONGraph, "HTML",
    {
        value: function(content)
        {
            if(this instanceof JSONGraph.HTML)
            {
                this.content = content || "";
            }
            else
            {
                return new JSONGraph.HTML(content);
            }
        }
    });

JSONGraph.HTML.prototype.toString = function()
{
    return this.content;
};

// -------------- PRIVATE -------------- //

var __textStyles = {italic: "i", bold: "b", underline: "u", stoke: "s",
                    i: "i", b: "b", u: "u", s: "s"};

// --> Escape

function __escapeHTML(s)
{
    return s.toString() 
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&apos;");
}


function __escapeString(s, single)
{
    return s.toString()
                .replace(/\\/g, "\\\\")
                .replace(/\r/g, "\\r")
                .replace(/\n/g, "\\n")
                .replace(single ? /'/g : /"/g, single ? "\\'" : '\\"');
}

function __ID(s)
{
    if(s instanceof JSONGraph.HTML)
    {
        return "<" + s + ">";
    }
    return "\"" + __escapeHTML(__escapeString(s)) + "\"";
}


// --> Clone

function __cloneA(o)
{
    var c = [], i = 0;
    for(; i < o.length; i++)
    {
        c[i] = __clone(o[i]);
    }
    return c;
}

function __cloneO(o)
{
    var c = {}, n;
    for(n in o)
    {
        c[n] = __clone(o[n]);
    }
    return c;
}

function __clone(v)
{
    return v && typeof(v) == "object" ? (v instanceof Array ? __cloneA(v) : __cloneO(v)) : v;
}

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


// -------------- EXPORTS THE MODULE -------------- //

exports = module.exports = JSONGraph;