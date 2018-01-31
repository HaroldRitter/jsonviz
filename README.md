# jsonviz

A Node.js module that converts *JSON* to *DOT language* and can create [*GraphViz*](http://www.graphviz.org/)
*svg* graphics with the [viz.js](https://www.npmjs.com/package/viz.js) (does not need to install GraphViz).

The **jsonviz** module is not an abstraction level that makes UML creation very easier.
It is just a JSON format that describes dot graphs. That helps to create graphs
in a more intuitive way with JavaScript objects and to update your graph in a
script before it is created.

**Table of content**:
1. [JSONGraph class](#JSONGraphClass)
1. [JSONGraph.SVG class](#JSONGraph.SVG)
1. [JSONGraph.HTML class](#JSONGraph.HTML)
1. [JSONGraph.Raw class](#JSONGraph.Raw)
1. [Additional attributes](#AdditionalAttributes)
1. [Extensions](#extensions) | <sub><sup>[JSDoc](#jsdoc)</sup></sub>
1. [DOT language](#DOTLanguage)
1. [Version changes](#versionChanges)

## <a name="JSONGraphClass"></a>JSONGraph class

The jsonviz module exports the JSONGraph class constructor.
This class allows the creation of a GraphViz graph with the JavaScript object syntax.

### <a name="constructor"></a>Constructor

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

#### ``object[] css``

Some css to put inside the svg itself. It can be usefull to have local svg, but
it is essentially used if a global style does not affect the svg itself (for example,
changin the cursor on the anchor elements).

A css array is a collection of key-style pairs:
* `string|string[] select`: one or more [css selectors](https://www.w3schools.com/cssref/css_selectors.asp)
on which to apply the style.
* `object style`: the style as a property-value object (like ``{cursor: pointer}``).
CSS properties that use a dash can be put between double quotes or removes the dash
and set the case to the following character to upper case.

#### <a name="statements"><a>``(string|JSONGraph|object)[] statements``

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

#### <a name="import"></a>JSONGraph.import

``static JSONGraph import(string pathOrJSON)``

Imports a ``JSONGraph`` object by parsing a JSON string that defines its properties.

> *Arguments*:
* ``string pathOrJSON``: the JSON content is identified if the string begins with
optional white spaces and an opening curly bracket. In this case, the JSON string is
parsed and the result is passed as the options of the
[``JSONGraph`` constructor](#constructor). In the other case, the file is read from the
given path, and then the content parsed as a JSON string to be passed to the
[constructor](#constructor).

> *Returns*: ``JSONGraph`` - the JSONGraph created from the JSON options.


#### JSONGraph.generate

``static boolean generate(object|string opts[, object dotOpts[, string path[, function cb(string error)]]])``   
``static boolean generate(object opts[, object dotOpts[, string path[, boolean ansyc]]])``   
``static boolean generate(object opts[, string path[, function cb(string error)]])``   
``static boolean generate(object opts[, string path[, boolean async]])``

Generates the svg text from the JSONGraph options, and save it if ``path`` is defined.
        
> *Arguments*:
* ``object|string opts``: the JSONGraph constructor options. It can use the JSON string or a path to a file that contains the JSON option.
See the doc of the ``pathOrJSON`` argument of the [``JSONGraph.import``](#import) method above for details about the opts parsing if it is a string.
* ``object dotOpts={}``: the [viz.js graph creation options](https://www.npmjs.com/package/viz.js#vizsrc-options-formatsvg-enginedot-scale-images-path-width-height--totalmemory16777216-)
* ``string path=""``: the path where to save the final svg file. If it is not set, the result is not saved.
* ``function cb(string error)=null``: the callback used after the result is saved in the given path.
* ``boolean async=false``: instead of using a callback, set async to true to save the result asynchromously.

> *Returns*: ``JSONGraph.SVG`` - the generated SVG.

#### <a name="extends"></a>JSONGraph.extends

``static function extends(moduleName)``   

Extends the JSONGraph class with a JSONGraph extension. This function allows to load only a light version of jsonviz and
then to extends it with useful [features](#extensions).
        
> *Arguments*:
* ``string moduleName``: the module name or an absolute path to a module

> *Returns*: ``function``- the ``JSONGraph``constructor

> *See*: [Extensions](#extensions)

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
    
#### <a name="save"></a>JSONGraph#save

``JSONGraph save(string path[, object dotOpts[, function cb(string error)]])``   
``JSONGraph save(string path[, object dotOpts[, boolean sync]])``   
``JSONGraph save(string path[, function cb(string error)]])``   
``JSONGraph save(string path[, boolean sync]])``
    
Generates the dot code according to the attributes values, save it to the
given path and then returns it.

> *Arguments*: 
* ``string path``: the path where to save the final svg file.
* ``object dotOpts={}``: the [viz.js graph creation options](https://www.npmjs.com/package/viz.js#vizsrc-options-formatsvg-enginedot-scale-images-path-width-height--totalmemory16777216-)
* ``optional function cb(string error) || sync``: the callback used after the result is saved in the given path.
If nothing is provided, uses the snyc argument that is true by default.
* ``boolean sync=true``: instead of using a callback, set sync to true (default) to save the result synchromously.
Set this argument to false to proceed to an asynchronous save withotu any callback

> *Returns*: ``JSONGraph.SVG`` - the generated svg.
     
#### JSONGraph#clone

``JSONGraph clone([name])``
  
Clones the ``JSONGraph`` instance by deeply copying all the attributes.

> *Arguments*: 
* ``string name=null``: a new optional name for the cloned graph

> *Returns*: ``JSONGraph`` - the cloned instance.
  
#### <a name="toJSON"></a>JSONGraph#toJSON

``string toJSON([function|(string|number)[] replacer[, string|number space]])``
  
Converts the ``JSONGraph`` object to a JSON string.

> *Arguments*:
* ``function replacer(string error)|(string|number)[]=null``
* ``string|number space=null``

The optional arguments are the ones used in the
[``JSON.stringify``](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)
function. For more information about this arguments, see the
[MDN documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#Syntax).

> *Returns*: ``string`` - the stringified JSONGraph object.

#### <a name="addRaw"></a>JSONGraph#addRaw

``number addRaw(string raw)``
  
Adds a new node to the graph with its attributes.

> *Arguments*:
* ``string raw``: the raw content that will be converted to a [``JSONGraph.Raw``](JSONGraph.Raw) instance.

> *Returns*: ``number`` - the [statement](#statements) index that corresponds to the added raw statement.

#### <a name="addNode"></a>JSONGraph#addNode

``number addNode(string name[, object attrs])``
  
Adds a new node to the graph with its attributes.

> *Arguments*:
* ``string name``: the name of the node
* ``object attrs=null``: the attributes of the node

> *Returns*: ``number`` - the [statement](#statements) index that corresponds to the added node.

#### <a name="addEdge"></a>JSONGraph#addEdge

``number addEdge((string|number|object)[] nodes[, object attrs])``
  
Links nodes together with edges.

> *Arguments*:
* ``(string|number)[] nodes``: the names (or indices in the [statement](#statements))
of the nodes that will be linked. It can also be an object with the name of a structure as the kay
and the cell name as the value.
* ``object attrs=null``: the attributes of each link between the nodes

> *Returns*: ``number`` - the [statement](#statements) index that corresponds to the added edge.

#### <a name="linkNodes"></a>JSONGraph#linkNodes

An alias of the [``JSONGraph#addEdge``](#addEdge) method.

#### <a name="addStruct"></a>JSONGraph#addStruct

``number addStruct(string name, Array nodes[, object attrs])``
  
Adds a structure (a [record-based node](https://www.graphviz.org/doc/info/shapes.html#record))
to the graph.

> *Arguments*:
* ``string name``: the attributes of each link between the nodes
* ``Array nodes``: an array if cells.
* ``object attrs=null``: the attributes of each link between the nodes

> *Returns*: ``number`` - the [statement](#statements) index that corresponds to the added edge.

> *Example*:

```js
var jsonviz = require("jsonviz"),
    o = new jsonviz();

o.addStruct("struct1", ["A", ["B", ["C", "D", "E"], "F"], "G"]);
o.addStruct("struct2", [[["A", "B"], ["C", "D"]]]);
o.linkNodes([{struct1:"A"}, {struct2:"C"}]);
```

#### <a name="addSubgraph"></a>JSONGraph#addSubgraph

``number addSubgraph(JSONGraph|object graph)``
  
Adds a subgraph.

> *Arguments*:
* ``JSONGraph|object graph``: the graph or the graph options. The type is automatically set to "subgraph"

> *Returns*: ``number`` - the [statement](#statements) index that corresponds to the added subgraph.

## <a name="JSONGraph.SVG"></a>JSONGraph.SVG class

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
    
## <a name="JSONGraph.HTML"></a>JSONGraph.HTML class

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

#### JSONGraph.HTML#toString

``string toString()``

Returns the html content.

> *Returns*: ``string`` - the html content.

## <a name="JSONGraph.Raw"></a>JSONGraph.Raw class

This class is used to insert raw content in a statement or an attribute.
* When used for a statement, the string is used as raw string (html special chars and quotes are not escaped).
* When used for an attribute, the html sepcial characters are not escaped, but the quotes are escaped to put the
string between double quotes without errors.

### Constructor

``new JSONGraph.Raw(string content);``

> *Arguments*:

* ``string content``: the raw content. The html special characters will not be
automatically escaped while the DOT code is generated, so
if some of them must be escaped, it must done manually.

### As a Function

``JSONGraph.HTML`` can also be used as a function:

```js
// The following declaration...
new JSONGraph.Raw("struct [label=\"<A> A | B\"]");

// ...is the same than the following function call
JSONGraph.Raw("struct [label=\"<A> A | B\"]");
```

### JSONGraph.Raw attributes

#### ``string content``

The raw content. The html special characters will not be
automatically escaped while the DOT code is generated, so
if some of them must be escaped, it must done manually.

### JSONGraph.Raw methods

#### JSONGraph.Raw#toString

``string toString()``

Returns the raw content.

> *Returns*: ``string`` - the raw content.
    
## <a name="AdditionalAttributes"></a>Additional attributes

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

## <a name="extensions"></a>Extensions

For now, jsonviz only have one extension. You can easilly add your own extension by
creating a ``.js`` file and then exporting a function that takes the ``JSONGraph``
constructor to add members.

*/path/extension.js*:
```js
var util = require("jsonviz/util.js");

exports = module.exports = function(JSONGraph)
{
    // Adds a static attribute
    JSONGraph.helloSentence = "Hello !";
    
    // Adds an instance method
    JSONGraph.prototype.sayHello = function()
    {
        console.log(JSONGraph.helloSentence);
    };
    
    // Adds an instance method to JSONGraph.SVG
    JSONGraph.SVG.prototype.addSimpleMetaData = function(meta)
    {
        var str = "", n;
        for(n in meta)
        {
            meta[n];
        }
        this.text.replace(/<\/svg>/, "<metadata></metadata>\n<svg>");
    };
};
```

### <a name="jsdoc"></a>JSDoc

This extension allows to read the classes as generated with JSDoc and then generate
a class diagram (without members).

#### Example:

```js
var jsonviz = require("jsonviz"), i = 0, c,

    // Creates the grtaph that will be used to create all classes
graph = new jsonviz({
    // Defines a generic node style with a nice gradient
    node: 
    {
        fillcolor: "#dddddd:#ffffff",
        gradientangle: 90,
        fontsize: 8, 
        fontname: "arial"
    },
    // Adds the gree ngradient for the main node of the graph
    styles:
    {
        node_selected:      {fillcolor: "#bbccff:#ddeeff"}
    }
});

// Loops on each class providen in jsdoc
for(; i < classes.length; i++)
{
    // Gets the class
    c = classes[i];
    // Creates graph for the given class
    //  - By default, the statements are removed before, so the graph will not cumulate the previous classes
    //  - The graph will create the links to each class documentation
    graph   .fromJSDoc(members.classes, {className: c.longname, links: true})
    // Saves the graph
            .save(c.longname + ".svg", true);
}
```

#### <a name="JSONGraphJSDoc_getClassesByName"></a>JSONGraph.JSDoc.getClassesByName

``static object JSONGraph.JSDoc.getClassesByName(object[] classes)``

Returns an associative array (i.e. an object) of  JSDoc classes from which the key is the long name
of each class.

The associative array will also be added in a ``byNames`` property of the passed argument.
If this property is already defined, it will be returned without any new computation.

> *Note*: this method calls [JSONGraph.JSDoc.getClassesByName](#JSONGraphJSDoc_getClassesByName) method,
and the [JSONGraph.JSDoc.addSubClasses](#JSONGraphJSDoc_addSubClasses) if ``opts.children`` is true.

> *Arguments*: 
* ``object[] classes``: the classes as it is returned in the JSDoc's ``helper.getMembers()``
from *jsdoc/util/templateHelper* (see in the publish.js file of the JSDoc default template) or by using
``taffyData({kind: 'class'}).get()``.

> *Returns*: ``object`` - an associative array (i.e. an object) of  JSDoc classes from which the key is the long name
of each class.

#### <a name="JSONGraphJSDoc_addSubClasses"></a>JSONGraph.JSDoc.addSubClasses

``static object JSONGraph.JSDoc.addSubClasses(object[] classes)``

Adds the sub-classes in a ``string[] subClasses`` property (stores the long name as the ``augments`` property),
of each class in the argument array.
It requires to call the [JSONGraph.JSDoc.getClassesByName](#JSONGraphJSDoc_getClassesByName) method.

> *Note*: this method calls the [JSONGraph.JSDoc.getClassesByName](#JSONGraphJSDoc_getClassesByName) method,
and the [JSONGraph.JSDoc.addSubClasses](#JSONGraphJSDoc_addSubClasses) if ``opts.children`` is true.

> *Arguments*: 
* ``object[] classes``: the classes as it is returned in the JSDoc's ``helper.getMembers()``
from *jsdoc/util/templateHelper* (see in the publish.js file of the JSDoc default template) or by using
``taffyData({kind: 'class'}).get()``.

> *Returns*: ``object`` - an associative array (i.e. an object) of  JSDoc classes from which the key is the long name
of each class.

#### <a name="fromJSDoc"></a>JSONGraph#fromJSDoc

``JSONGraph JSONGraph.fromJSDoc(object[] classes, object opts)``

Adds all the statements to the ``JSONGraph`` instance to create the proper class
diagram from JSDoc.

> *Note*: this method calls [JSONGraph.JSDoc.getClassesByName](#JSONGraphJSDoc_getClassesByName) method,
and the [JSONGraph.JSDoc.addSubClasses](#JSONGraphJSDoc_addSubClasses) if ``opts.children`` is true.

> *Arguments*: 
* ``object[] classes``: the classes as it is returned in the JSDoc's ``helper.getMembers()``
from *jsdoc/util/templateHelper* (see in the publish.js file of the JSDoc default template) or by using
``taffyData({kind: 'class'}).get()``.
* ``object opts``: the creation options
    * ``string className``: the class from which to create the diagram (it must be the long name of the class).
    This is the only required option.
    * ``boolean opts.changeName=true``: if true, the diagrm name is changed for "class " <className> " diagram"
    * ``boolean opts.reset=true``: if true, the previous satements are deleted before the new one are created
    * ``boolean opts.parents=true``: if true, the diagram includes all the parents
    * ``boolean opts.children=true``: if true, the diagram includes all the children
    * ``boolean opts.select=true``: if true, the given class will use the node_selected style and it will appear in bold.
    * ``boolean opts.links=false``: if true, the class rects are clickables

> *Returns*: ``JSONGraph`` - this isntance to chain actions.

> *Styles*: the following styles can be added to the ``JSONGraph`` instance frmo which this method is called :
* ``node_selected``: applied on the node from which the graph is drawn
* ``extends``: an additional style for the *extends* and *implements* arrows (alos use an internal ``edge_extends`` style with arrowhead=empty)
* ``implements``: an additional style for the *implements* arrows (alos use an internal ``edge_implements`` style with style=dashed).
* ``node_class``: redefines the class style. By default: shape="rect" and style="rounded,filled"
* ``class``: an additional style for the *class* nodes

## <a name="DOTLanguage"></a>DOT language

The jsonviz module produces DOT language and then svg graphics with the
[viz.js](https://www.npmjs.com/package/viz.js) module. For more information,
here are some documentations on the GraphViz web site:

* [Syntax guide](https://graphviz.gitlab.io/_pages/doc/info/lang.html)
* [Attribute reference](https://www.graphviz.org/doc/info/attrs.html)
* [Shape reference](https://www.graphviz.org/doc/info/shapes.html)

## <a name="versionChanges"></a>Version changes

### 0.0.x

Creates the [``JSONGraph``](#JSONGraphClass), [``JSONGraph.SVG``](#JSONGraph.SVG) and [``JSONGraph.HTML``](#JSONGraph.HTML) classes.

### 0.1.x
* Can instanciate a JSONGraph without any arguments
* The [``JSONGraph#save``](#save) ``cb`` argument is not passed, jsonviz will use
the default ``sync`` value (true) and then uses a synchronous saving.
* Adds JSON import / export:
    * Adds the [``JSONGraph.import``](#import) method
    * Adds the [``JSONGraph#toJSON``](#toJSON) method
* Adds the [``JSONGraph.Raw``](#JSONGraph.Raw) class
* Adds the build methods:
    * Adds the [``JSONGraph#addRaw``](#addRaw) method
    * Adds the [``JSONGraph#addNode``](#addNode) method
    * Adds the [``JSONGraph#addEdge``](#addEdge)/[``JSONGraph#linkNodes``](#linkNodes) methods
    * Adds the [``JSONGraph#addStruct``](#addStruct) method
    * Adds the [``JSONGraph#addSubgraph``](#addSubgraph) method
* Adds the extension management:
    * Adds the [``JSONGraph#extends``](#extends) method
* Adds the JSDoc extension:
    * Adds the [``JSONGraph.JSDoc.getClassesByName``](#JSONGraphJSDoc_getClassesByName) method
    * Adds the [``JSONGraph.JSDoc.addSubClasses``](#JSONGraphJSDoc_addSubClasses) method
    * Adds the [``JSONGraph#fromJSDoc``](#fromJSDoc) method