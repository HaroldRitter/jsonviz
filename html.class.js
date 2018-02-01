"use strict";

function HTML(content)
{
    if(this instanceof HTML)
    {
        this.content = content || "";
    }
    else
    {
        return new HTML(content);
    }
}


HTML.prototype.toString = function()
{
    return this.content;
};

exports = module.exports = HTML;