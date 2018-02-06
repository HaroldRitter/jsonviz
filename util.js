"use strict";

var raw = require("jsonviz/raw.class"),
    html = require("jsonviz/html.class");

// ----------------------- Private Functions ----------------------- //
// Declared before the public ones to link them in the exported object

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

// --> CSS

function __buildStyle(style)
{
    var n, n2, s = "";
    if(style)
    {
        for(n in style)
        {
            n2 = n.replace(/([a-z])([A-Z])/g, function(r, a, b){ return a + "-" + b.toLowerCase()});
            s += "\t" + n2 + ": " + style[n] + ";\n";
        }
    }
    return s;
}

// ----------------------- Public Functions ----------------------- //

exports = module.exports = {
// --> Clone

    clone: __clone,
    
// --> Escape

    escapeHTML: function(s)
    {
        return s.toString() 
                    .replace(/&/g, "&amp;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;")
                    .replace(/"/g, "&quot;")
                    .replace(/'/g, "&apos;");
    },
    
    escapeString: function(s, single)
    {
        return s.toString()
                    .replace(/\\/g, "\\\\")
                    .replace(/\r/g, "\\r")
                    .replace(/\n/g, "\\n")
                    .replace(single ? /'/g : /"/g, single ? "\\'" : '\\"');
    },
    
    ID: function(s)
    {
        if(s instanceof raw)
        {
            return "\"" + this.escapeString(s) + "\"";
        }
        if(s instanceof html)
        {
            return "<" + s + ">";
        }
        return "\"" + this.escapeHTML(this.escapeString(s)) + "\"";
    },
    
// --> CSS

    css: function(css)
    {
        var i = 0, s = "", d, c;
        if(css && css.length)
        {
            for(; i < css.length; i++)
            {
                c = css[i];
                d = c.select;
                if(i) s += "\n";
                s += (d instanceof Array ? d.join(", ") : d) + "\n{\n" + __buildStyle(c.style) + "}";
            }
        }
        return s;
    }
    
};