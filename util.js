"use strict";

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

// ----------------------- Public Functions ----------------------- //

exports = module.exports = function(JSONGraph)
{
    return {
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
            if(s instanceof JSONGraph.HTML)
            {
                return "<" + s + ">";
            }
            return "\"" + this.escapeHTML(this.escapeString(s)) + "\"";
        }
    };
};