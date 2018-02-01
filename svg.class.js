"use strict";

var fs = require("fs");

function SVG(txt)
{
    this.text = txt;
}

// ------------ Public Methods ------------ //

SVG.prototype.toString = function()
{
    return this.text;
};

SVG.prototype.save = function(path, cb)
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

exports = module.exports = SVG;