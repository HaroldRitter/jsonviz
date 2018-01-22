# jsonviz

A Node.js module that converts *JSON* to *DOT language* and can create [*GraphViz*](http://www.graphviz.org/)
*svg* graphics with the [viz.js](https://www.npmjs.com/package/viz.js).

The **jsonviz** module is not an abstraction level that makes UML creation very easier.
It is just a JSON format that describes dot graphs. That helps to create graphs
in a more intuitive way with JavaScript objects and to update your graph in a
script before it is created.


## JSONGraph class

The jsonviz module exports the JSONGraph class constructor.
This class allows the creation of a GraphViz graph with the JavaScript object syntax.

### Constructor

``new JSONGraph(object opts);``

> *Arguments*:

* ``object opts``: contains the constructor arguments
    * ``boolean opts.strict = false``
    * ``string opts.type = "digraph"``
    * ``string opts.name = ""``
    * ``object opts.graph = {}``
    * ``object opts.node = {}``
    * ``object opts.edge = {}``
    * ``Array opts.statements = []``

For more information about the arguments, see the JSONGraph [attributes section](#attributes).

### Example of usage

```js
// Gets the jsonviz module
var jsonviz = require("jsonviz");

// Creates the JSONGraph instance
var o = new jsonviz(
    {
        // Styles applies on all nodes of the graph
        node: {fillcolor: "#eeeeee", style: "filled,rounded", shape: "rect"},
        
        // A collection of styles than can be referred from their names
        styles:
        {
            selected: {fillcolor: "#bbccff:#ddeeff"},
            depends: {label: "depends", style: "dashed", arrowhead: "open"}
        }
        
        // All statements in DOT language in order
        statements:
        [
            // The B node will use the selected style
            {stmt: "B", attributes: {ref: "selected"}},
            // Adds a simple statement without any attribute (the nodes use the generic attributes set above)
            "B -> C",
            // Adds a statement with attributes that are added to the generic ones defined above
            //  The edge uses the depends style and have a blue color
            {stmt: "A -> B", attributes: {ref: "depends", color: "#8888cc"}}
        ]
    });

// Generates the DOT version, then generates the svg one, saves it and returns it (JSONGraph.SVG object)
//  If the second parameter is set to true, the save is asynchronous, else a callback function that
//  takes an error string can be passed
var svg = o.save("./UML.svg" /*, true*/);

// Prints the svg as a text (implicitely call the toString method of JSONGraph.SVG)
console.log("SVG:\n" + svg);

// You can also recover the dot version (cached in the instance)
console.log(o.dot());
```

### <a name="attributes"></a>JSONGraph attributes

#### ``boolean strict``

The graph use the strict mode. As explained on the GraphViz web site,
this forbids the creation of multi-edges, i.e., there can be at most one
edge with a given tail node and head node in the directed case.

#### ``string type``

The graph use the strict mode. As explained on the GraphViz web site,
this forbids the creation of multi-edges, i.e., there can be at most one
edge with a given tail node and head node in the directed case.

#### ``string name``

Provides a name the graph.

#### ``object|string|string[] graph``

A key-value pair of
[DOT attributes](https://www.graphviz.org/doc/info/attrs.html)
that define the appearence of the graph. It can also be one or several
references to a style in ``styles``. Note that if ``graph`` is a string,
it can contain several styles separated with comas.

#### ``object|string|string[] node``

A key-value pair of
[DOT attributes](https://www.graphviz.org/doc/info/attrs.html)
that define the generic appearence of all nodes. It can also be one or several
references to a style in ``styles``. Note that if ``node`` is a string,
it can contain several styles separated with comas.

#### ``object|string|string[] edge``

A key-value pair of
[DOT attributes](https://www.graphviz.org/doc/info/attrs.html)
that define the generic appearence of all edges. It can also be one or several
references to a style in ``styles``. Note that if ``edge`` is a string,
it can contain several styles separated with comas.

#### ``object styles``

A key-value pair of styles that are themselves a key-value pair of
[DOT attributes](https://www.graphviz.org/doc/info/attrs.html).
A style can be used inside the attributes on any statement with
the ``(string|string[]) ref`` attribute. It can also be used instead
of the attribute list in a statement or for inside the global styles
(``graph``, ``node``, ``edge``).


#### ``(string|JSONGraph|object)[] statements``

An array that contains all statements of the graph:

* It can be a simple ``string`` that contains the statement such like ``A -> B``
or even ``A -> B[label="depends", style="dashed"]``.
* Or another ``JSONGraph`` that must have the ``subgraph`` type.
* Or a key-value pair ``object`` that contains the statement and attributes.
** ``string statement`` or ``stmt``: the statement without the attributes such like 
``RGB`` or ``RGB -> Color``
** ``object|string|string[] attributes`` or ``attrs``: the key-value pair of 
[DOT attributes](https://www.graphviz.org/doc/info/attrs.html) that define
the appearence of the node, if the statement is just a node identifier,
or the edge(s) in other cases. It can also be one or several
references to a style in ``styles``. Note that if ``attributes`` is a string,
it can contain several styles separated with comas.

### JSONGraph methods

#### JSONGraph.generate

``static boolean generate(object opts[, object dotOpts[, string path[, function cb(string error)]]])``   
``static boolean generate(object opts[, object dotOpts[, string path[, boolean ansyc]]])``   
``static boolean generate(object opts[, string path[, function cb(string error)]])``   
``static boolean generate(object opts[, string path[, boolean async]])``

Generates the svg text from the JSONGraph options, and save it if ``path`` is defined.
        
> *Arguments*:
* ``object opts``: the JSONGraph constructor options
* ``object dotOpts={}``: the [viz.js graph creation options](https://www.npmjs.com/package/viz.js#vizsrc-options-formatsvg-enginedot-scale-images-path-width-height--totalmemory16777216-)
* ``string path=""``: the path where to save the final svg file. If it is not set, the result is not saved.
* ``function cb(string error)=null``: the callback used after the result is saved in the given path.
* ``boolean async=false``: instead of using a callback, set async to true to save the result asynchromously.

> *Returns*: ``JSONGraph.SVG`` - the generated SVG.

#### JSONGraph#reset

``JSONGraph reset()``

Resets the dot code generated. Uses that function if the arguments where changed after
a call to the ``dot``, ``generate`` or ``save`` method.

> *Returns*: ``JSONGraph`` - this instance to chain actions.
    

#### JSONGraph#dot

``JSONGraph dot()``

Generates the dot code according to the attributes values, and returns it.
The generated code is internaly stored. The ``reset`` method can be used to remove it.

> *Returns*: ``string`` - the dot code used by GraphViz to generate the final graph.


#### JSONGraph#generate

``JSONGraph generate([object dotOpts])``

Generates the final svg graph text according to the attributes values.

> *Arguments*:
* ``object dotOpts={}``: the [viz.js graph creation options](https://www.npmjs.com/package/viz.js#vizsrc-options-formatsvg-enginedot-scale-images-path-width-height--totalmemory16777216-)

> *Returns*: ``JSONGraph.SVG`` - the generated svg.


#### JSONGraph#svg

``JSONGraph svg([object dotOpts])``

An alias of the ``generate`` method.

> *Arguments*:
* ``object dotOpts={}``: the [viz.js graph creation options](https://www.npmjs.com/package/viz.js#vizsrc-options-formatsvg-enginedot-scale-images-path-width-height--totalmemory16777216-)

> *Returns*: ``JSONGraph.SVG`` - the generated svg.
    
#### JSONGraph#save

``JSONGraph save(string path[, object dotOpts[, function cb(string error)]])``   
``JSONGraph save(string path[, object dotOpts[, boolean asnyc]])``   
``JSONGraph save(string path[, function cb(string error)]])``   
``JSONGraph save(string path[, boolean asnyc]])``
    
Generates the dot code according to the attributes values, save it to the
given path and then returns it.

> *Arguments*: 
* ``string path``: the path where to save the final svg file.
* ``object dotOpts={}``: the [viz.js graph creation options](https://www.npmjs.com/package/viz.js#vizsrc-options-formatsvg-enginedot-scale-images-path-width-height--totalmemory16777216-)
* ``function cb(string error)=null``: the callback used after the result is saved in the given path.
* ``boolean async=false``: instead of using a callback, set async to true to save the result asynchromously.

> *Returns*: ``JSONGraph.SVG`` - the generated svg.
     
#### JSONGraph#clone

``JSONGraph clone()``
  
Clones the ``JSONGraph`` instance by deeply copying all the attributes.

> *Returns*: ``JSONGraph`` - the cloned instance.
  
## JSONGraph.SVG class

This class is created by the ``JSONGraph#generate`` and ``JSONGraph#save`` methods.
It contains the generated svg text and allows it to be saved.

### Constructor

``new JSONGraph.SVG(string text);``

> *Arguments*:

``string text``, the svg text.

### JSONGraph.SVG attributes

#### ``string text``

The svg text.

### JSONGraph.SVG methods

#### JSONGraph#toString

``string toString()``
    
Returns the svg text. So a JSONGraph.SVG instance will return its text
when it is used as a string.

> *Returns*: ``string`` - the svg text.
    
### JSONGraph.SVG methods    

#### JSONGraph.SVG#save

``string save(string path[, function cb(string error)])``   
``string save(string path[, boolean asnyc])``
    
Saves the svg text to the given destination path.

> *Arguments*: 
* ``string path``: the path where to save the svg text.
* ``function cb(string error)=null``: the callback used after the svg text is saved in the given path.
* ``boolean async=false``: instead of using a callback, set async to true to save the svg text asynchromously.

> *Returns*: ``JSONGraph.SVG`` - this isntance to chain actions.
    
## JSONGraph.HTML class

This class is used to insert HTML content inside ``label``
[DOT attributes](https://www.graphviz.org/doc/info/attrs.html)
(``label``, ``headlabel``, ``taillabel``, ``xlabel``).

### Constructor

``new JSONGraph.HTML(string content);``

> *Arguments*:

* ``string content``: the HTML content. It must escape the html special characters with html entities.

### As a Function

``JSONGraph.HTML`` can also be used as a function:

```js
// The following declaration...
new JSONGraph.HTML("<i>A</i>");

// ...is the same than the following function call
JSONGraph.HTML("<i>A</i>");
```

### JSONGraph.HTML attributes

#### ``string content``

The HTML content. It must escape the html special characters with html entities.

### JSONGraph.HTML methods

#### JSONGraph#toString

``string toString()``

Returns the html content.

> *Returns*: ``string`` - the html content.
    
## Additional attributes

In addition of the [DOT language attributes](https://www.graphviz.org/doc/info/attrs.html),
*jsonviz* provides its own attributes :

* ``string|string[] ref``: the name(s) of a(several) style(s) stored inside the ``JSONGraph#styles``
attribute. The attribute of the style(s) will be copied in order before the attribute
list that contains the reference. If ``ref`` is a string, several styles can be used by
using a coma separators, so the style names cannot contain any coma.
* ``string|string[] textstyle``: the name(s) of a(several) text style(s). It will replace
the ``label`` attribute so it cannot be used at the same type than a ``label`` attribute.
If ``textstyle`` is a string, several styles can be used by using a coma separators. The accepted
styles are the following ones:
    * ``bold`` or ``b``
    * ``italic`` or ``i``
    * ``underline`` or ``u``
    * ``stroke`` or ``s``

## DOT language

The jsonviz module produces DOT language and then svg graphics with the
[viz.js](https://www.npmjs.com/package/viz.js) module. For more information,
here are some documentations on the GraphViz web site:

* [Syntax guide](https://graphviz.gitlab.io/_pages/doc/info/lang.html)
* [Attribute reference](https://www.graphviz.org/doc/info/attrs.html)
* [Shape reference](https://www.graphviz.org/doc/info/shapes.html)