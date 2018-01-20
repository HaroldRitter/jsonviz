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
    this.graph = opts.graph || {},
    this.node = opts.node || {},
    this.edge = opts.edge || {};
    this.statements = opts.statements || opts.stmts || [];
    
    this._computedDot = null;
}

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

JSONGraph.prototype.save = function(path, dotOpts, cb)
{
    if(dotOpts && typeof(dotOpts) != "object")
    {
        cb = dotOpts;
        dotOpts = undefined;
    }
    return this.generate(dotOpts).save(path, cb);
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
    
    _attributes: {value:  function(attrs)
    {
        var str = this._nAttributes(attrs);
        
        return str ? " [" + str + "]" : "";
    }},
    
    _nAttributes: {value:  function(attrs)
    {
        var n, str = "";
        
        for(n in attrs)
        {
            if(str) str += ", ";
            str += __ID(n) + "=" + __ID(attrs[n]);
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
    if(cb === true)
    {
        fs.writeFileSync(path, this.text);
    }
    else
    {
        fs.writeFile(path, this.text, cb);
    }
    return this;
};

// -------------- PRIVATE -------------- //

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
    return "\"" + __escapeHTML(__escapeString(s)) + "\"";
}


// -------------- EXPORTS THE MODULE -------------- //

exports = module.exports = JSONGraph;