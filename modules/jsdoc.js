exports = module.exports = function(JSONGraph)
{
// -------------------- Public Static Methods -------------------- //

    JSONGraph.JSDoc =
    {
        getClassesByName: function(classes)
        {
            var i = 0, c, map = {};
            
            for(; i < classes.length; i++)
            {
                c = classes[i];
                map[c.longname] = c;
            }
        
            return map;
        },
        
        addSubClasses: function(members)
        {
            var i = 0, j, c, ps, classes = members.classes, byName = members.classByNames;
            
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
                        byName[ps[j]].subClasses.push(c.longname);
                    }
                }
            }
        
            return classes;
        }
    };

// -------------------- Public Methods -------------------- //

    JSONGraph.prototype.fromJSDoc = function(members, opts)
    {
        var oClass, s = this.styles, classes = members.classByNames;
        
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
        if(!classes)
        {
            classes = members.classByNames = JSONGraph.JSDoc.getClassesByName(members.classes);
            JSONGraph.JSDoc.addSubClasses(members);
        }
        oClass = classes[opts.className];
        
        // > Resets
        this.reset();
        if(opts.reset || opts.reset === undefined)
        {
            this.statements = [];
        }
        
        // > Builds the JSON statements
        this._addUMLClass(oClass, true, opts);
        if(opts.parents || opts.parents === undefined)
        {
            this._getUMLFamily(oClass, classes, "augments", false, opts);
        }
        if(opts.children || opts.children === undefined)
        {
            this._getUMLFamily(oClass, classes, "subClasses", true, opts);
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
                var a = {ref: ["node_class"]};
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
            var i = 0, c, a, tt, members = cl[prop];
            
            if(members)
            {
                for(; i < members.length; i++)
                {
                    c = classes[members[i]];
                    
                    this._addUMLClass(c, false, opts);
                    
                    tt = cl.longname + (c.virtual ? " implements " : " extends ") + c.longname;
                    a = {edgetooltip: tt, ref: ["edge_extends", "extends"]};
                    if(c.virtual)
                    {
                        a.ref.push("edge_implements", "implements");
                    }
                    
                    this.addEdge(desc ? [c.longname, cl.longname] : [cl.longname, c.longname], a);
                    this._getUMLFamily(c, classes, prop, desc, opts);
                }
            }
        }}
    });
};

// -------------------- Private Variables -------------------- //

var __added = {};