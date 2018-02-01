"use strict";

function Raw (content)
{
    if(this instanceof Raw)
    {
        this.content = content || "";
    }
    else
    {
        return new Raw(content);
    }
}

Raw.prototype.toString = function()
{
    return this.content;
};

exports = module.exports = Raw;