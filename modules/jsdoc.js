exports = module.exports = function(JSONGraph)
{
// -------------------- Public Static Methods -------------------- //

    JSONGraph.JSDoc =
    {
        getClassesByName: function(classes)
        {
            if(!classes.byNames)
            {
                var i = 0, c, map = {};
                
                for(; i < classes.length; i++)
                {
                    c = classes[i];
                    map[c.longname] = c;
                }
                
                classes.byNames = map;
            }
            
            return classes.byNames;
        },
        
        addSubClasses: function(classes)
        {
            if(classes.length && !classes[0].subClasses)
            {
                var i = 0, j, c, ps, p,
                    byName = this.getClassesByName(classes);
                
                for(; i < classes.length; i++)
                {
                    classes[i].subClasses = [];
                }
                for(i = 0; i < classes.length; i++)
                {
                    c = classes[i];
                    ps = c.augments;
                    if(ps)
                    {
                        for(j = 0; j < ps.length; j++)
                        {
                            p = byName[ps[j]];
                            if(p)
                            {
                                p.subClasses.push(c.longname);
                            }
                        }
                    }
                }
            }
        
            return classes;
        }
    };

// -------------------- Public Methods -------------------- //

    JSONGraph.prototype.fromJSDoc = function(classes, opts)
    {
        var oClass, s = this.styles,
            byName = JSONGraph.JSDoc.getClassesByName(classes);
        
        __added = {};
            
        // > Adds name
        if(opts.changeName || opts.changeName === undefined)
        {
            this.name = "class " + opts.className + " diagram";
        }
        
        // > Adds styles
        // Graph
        this.graph.rankdir = "BT";
        // Edge
        if(!s.edge_extends)
        {
            s.edge_extends = {arrowhead: "empty"};
        }
        if(!s.edge_implements)
        {
            s.edge_implements = {style: "dashed"};
        }
        // Node
        if(!s.node_class)
        {
            s.node_class = {shape: "rect", style: "rounded,filled"};
        }
        
        // > Gets the class by names and all sub-classes
        JSONGraph.JSDoc.addSubClasses(classes);
        oClass = byName[opts.className];
        
        // > Resets
        this.reset();
        if(opts.reset || opts.reset === undefined)
        {
            this.statements = [];
        }
        
        // > Builds the JSON statements
        this._addUMLClass(oClass, opts.select || opts.select === undefined, opts);
        if(opts.parents || opts.parents === undefined)
        {
            this._getUMLFamily(oClass, byName, "augments", false, opts);
        }
        if(opts.children || opts.children === undefined)
        {
            this._getUMLFamily(oClass, byName, "subClasses", true, opts);
        }
        
        return this;
    };
    
// -------------------- Protected Methods -------------------- //
    
    Object.defineProperties(JSONGraph.prototype,
    {
        _addUMLClass: {value: function(oClass, select, opts)
        {
            if(!__added[oClass.longname])
            {
                var a = {ref: ["node_class", "class"]};
                a.textstyle = [];
                if(select)
                {
                    a.ref.push("node_selected");
                    a.textstyle.push("bold");
                }
                if(oClass.virtual)
                {
                    a.textstyle.push("italic");
                }
                __added[oClass.longname] = true;
                oClass.fullname = a.tooltip = (oClass.virtual ? "abstract " : (oClass.final ? "final " : "")) +
                                        "class " + oClass.longname;
                if(opts.links)
                {
                    a.URL = oClass.longname + ".html";
                }
                this.addNode(oClass.longname, a);
            }
            return null;
        }},
        
        _getUMLFamily: {value : function(cl, classes, prop, desc, opts)
        {
            var i = 0, c, cp, cc = cl, a, tt, members = cl[prop];
            
            if(members)
            {
                for(; i < members.length; i++)
                {
                    c = cp = classes[members[i]];
                    
                    this._addUMLClass(c, false, opts);
                    
                    if(desc)
                    {
                        cp = cl;
                        cc = c;
                    }
                    
                    tt = cc.longname + (cp.virtual ? " implements " : " extends ") + cp.longname;
                    a = {edgetooltip: tt, ref: ["edge_extends", "extends"]};
                    if(cp.virtual)
                    {
                        a.ref.push("edge_implements", "implements");
                    }
                    
                    this.addEdge([cc.longname, cp.longname], a);
                    this._getUMLFamily(c, classes, prop, desc, opts);
                }
            }
        }}
    });
};

// -------------------- Private Variables -------------------- //

var __added = {};