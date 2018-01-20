# jsonviz

A Node.js module that converts JSON to DOT language and can create [GraphViz](http://www.graphviz.org/)
graphics with the [viz.js](https://www.npmjs.com/package/viz.js).

The **jsonviz** module is not an abstraction level that makes UML creation very easier.
It is just a JSON format that describes dot graphs. That helps to create graphs
in a more intuitive way with JavaScript objects.

## API

The jsonviz module exports the JSONGraph class constructor.

### JSONGraph class

This class is the one returned by the module and allows the creation of a
GraphViz graph with the JavaScript object syntax.

The constructor argument is an ``opts object`` that contains the
values of the public attributes:

* ``boolean opts.strict = false``
* ``string opts.type = "digraph"``
* ``string opts.name = ""``
* ``object opts.graph = {}``
* ``object opts.node = {}``
* ``object opts.edge = {}``
* ``Array opts.statements = []``

For more information, see the attributes section.

#### Example of usage

```js
// Creates the JSONGraph instance
var jsonviz = require("jsonviz"),
    o = new jsonviz({
        node: {fillcolor: "#eeeeee", style: "filled,rounded", shape: "rect"},
        statements:
        [
            {stmt: "A -> B", attributes: {label: "depends", style: "dashed", arrowhead: "open"}},
            "B -> C"
        ]
    });

// Saves the (return the JSONGraph.SVG object)
var svg = jsonviz.save("./UML.svg");

// Prints the svg as a text (implicitely call the toString method)
console.log("SVG:\n" + svg);
```

#### JSONGraph attributes

<dl>
  <dt style="color:#2d3e58"><code>boolean strict</code></dt>
    <dd>The graph use the strict mode. As explained on the GraphViz web site,
    this forbids the creation of multi-edges, i.e., there can be at most one
    edge with a given tail node and head node in the directed case.</dd>
    
  <dt style="color:#2d3e58"><code>string type</code></dt>
    <dd>The graph use the strict mode. As explained on the GraphViz web site,
    this forbids the creation of multi-edges, i.e., there can be at most one
    edge with a given tail node and head node in the directed case.</dd>
  
  <dt style="color:#2d3e58"><code>string name</code></dt>
    <dd>Provides a name the graph.</dd>
  
  <dt style="color:#2d3e58"><code>object|string|string[] graph</code></dt>
    <dd>A key-value pair of
        <a href="https://www.graphviz.org/doc/info/attrs.html">attributes</a>
        that define the appearence of the graph. It can also be one or several
        references to a style in <code>styles</code>. Note that if <code>graph</code> is a string,
        it can contain several styles separated with comas.</dd>
    
  <dt style="color:#2d3e58"><code>object|string|string[] node</code></dt>
    <dd>A key-value pair of
        <a href="https://www.graphviz.org/doc/info/attrs.html">attributes</a>
        that define the generic appearence of all nodes. It can also be one or several
        references to a style in <code>styles</code>. Note that if <code>node</code> is a string,
        it can contain several styles separated with comas.</dd>
  
  <dt style="color:#2d3e58"><code>object|string|string[] edge</code></dt>
    <dd>A key-value pair of
        <a href="https://www.graphviz.org/doc/info/attrs.html">attributes</a>
        that define the generic appearence of all edges. It can also be one or several
        references to a style in <code>styles</code>. Note that if <code>edge</code> is a string,
        it can contain several styles separated with comas.</dd>
  
  <dt style="color:#2d3e58"><code>object styles</code></dt>
    <dd>
        A key-value pair of styles that are themselves a key-value pair of
        <a href="https://www.graphviz.org/doc/info/attrs.html">attributes</a>.
        A style can be used inside the attributes on any statement with
        the <code>(string|string[]) ref</code> attribute. It can also be used instead
        of the attribute list in a statement or for inside the global styles
        (<code>graph</code>, <code>node</code>, <code>edge</code>).
    </dd>
  
  <dt style="color:#2d3e58"><code>(string|JSONGraph|object)[] statements</code></dt>
    <dd>
An array that contains all statements of the graph:

* It can be a simple <code>string</code> that contains the statement such like <code>A -> B</code>
or even <code>A -> B[label="depends", style="dashed"]</code>.
* Or another <code>JSONGraph</code> that must have the <code>subgraph</code> type.
* Or a key-value pair <code>object</code> that contains the statement and attributes.
** <code>string statement</code> or <code>stmt</code>: the statement without the attributes such like 
<code>RGB</code> or <code>RGB -> Color</code>
** <code>object|string|string[] attributes</code> or <code>attrs</code>: the key-value pair of 
[attributes](https://www.graphviz.org/doc/info/attrs.html) that define
the appearence of the node, if the statement is just a node identifier,
or the edge(s) in other cases. It can also be one or several
references to a style in <code>styles</code>. Note that if <code>attributes</code> is a string,
it can contain several styles separated with comas.
    </dd>
</dl>

#### JSONGraph methods

<dl>
  <dt style="color:#2d3e58"><code>static boolean generate(object opts[, object dotOpts[, string path[, function cb(string error)]]])</code><br/>
  <code>static boolean generate(object opts[, object dotOpts[, string path[, boolean ansyc]]])</code><br/>
  <code>static boolean generate(object opts[, string path[, function cb(string error)]])</code><br/>
  <code>static boolean generate(object opts[, string path[, boolean async]])</code>
  </dt>
    <dd>
Generates the svg text from the JSONGraph options, and save it if <code>path</code> is defined.
        
**Arguments**:
* <code>object opts</code>: the JSONGraph constructor options
* <code>object dotOpts={}</code>: the [viz.js graph creation options](https://www.npmjs.com/package/viz.js#vizsrc-options-formatsvg-enginedot-scale-images-path-width-height--totalmemory16777216-)
* <code>string path=""</code>: the path where to save the final svg file. If it is not set, the result is not saved.
* <code>function cb(string error)=null</code>: the callback used after the result is saved in the given path.
* <code>boolean async=false</code>: instead of using a callback, set async to true to save the result asynchromously.

**Returns**: <code>JSONGraph.SVG</code> - the generated SVG.
  </dd>
    
  <dt style="color:#2d3e58"><code>JSONGraph reset()</code></dt>
    <dd>
Resets the dot code generated. Uses that function if the arguments where changed after
a call to the <code>dot</code>, <code>generate</code> or <code>save</code> method.

**Returns**: <code>JSONGraph</code> - this instance to chain actions.
    </dd>
    
  <dt style="color:#2d3e58"><code>JSONGraph dot()</code></dt>
    <dd>
Generates the dot code according to the attributes values, and returns it.
The generated code is internaly stored. The <code>reset</code> method can be used to remove it.

**Returns**: <code>string</code> - the dot code used by GraphViz to generate the final graph.
    </dd>
    
  <dt style="color:#2d3e58"><code>JSONGraph.SVG generate([object dotOpts])</code></dt>
    <dd>
Generates the final svg graph text according to the attributes values.

**Arguments**:
* <code>object dotOpts={}</code>: the [viz.js graph creation options](https://www.npmjs.com/package/viz.js#vizsrc-options-formatsvg-enginedot-scale-images-path-width-height--totalmemory16777216-)

**Returns**: <code>JSONGraph.SVG</code> - the generated svg.
    </dd>   
    
  <dt style="color:#2d3e58">
  <code>JSONGraph.SVG save(string path[, object dotOpts[, function cb(string error)]])</code><br/>
  <code>JSONGraph.SVG save(string path[, object dotOpts[, boolean asnyc]])</code><br/>
  <code>JSONGraph.SVG save(string path[, function cb(string error)]])</code><br/>
  <code>JSONGraph.SVG save(string path[, boolean asnyc]])</code><br/>
  </dt>
    <dd>
Generates the dot code according to the attributes values, save it to the
given path and then returns it.

**Arguments**: 
* <code>string path</code>: the path where to save the final svg file.
* <code>object dotOpts={}</code>: the [viz.js graph creation options](https://www.npmjs.com/package/viz.js#vizsrc-options-formatsvg-enginedot-scale-images-path-width-height--totalmemory16777216-)
* <code>function cb(string error)=null</code>: the callback used after the result is saved in the given path.
* <code>boolean async=false</code>: instead of using a callback, set async to true to save the result asynchromously.

**Returns**: <code>JSONGraph.SVG</code> - the generated svg.
    </dd>
       
  <dt style="color:#2d3e58"><code>JSONGraph clone()</code></dt>
    <dd>
Clones the <code>JSONGraph</code> instance by deeply copying all the attributes.

**Returns**: <code>JSONGraph</code> - the cloned instance.
    </dd>
</dl>

### JSONGraph.SVG class

This class is created by the ``JSONGraph#generate`` and ``JSONGraph#save`` methods.
It contains the generated svg text and allows it to be saved.

The constructor accepts only a required argument: ``string text``, the svg text.

#### JSONGraph.SVG attributes

<dl>
  <dt style="color:#2d3e58"><code>string text</code></dt>
    <dd>The svg text.</dd>
</dl>

#### JSONGraph.SVG methods

<dl>
    <dt style="color:#2d3e58"><code>string toString()</code></dt>
    <dd>
Returns the svg text. So a JSONGraph.SVG instance will return its text
when it is used as a string.

**Returns**: <code>string</code> - the svg text.
    </dd>
    
  <dt style="color:#2d3e58">
    <code>string save(string path[, function cb(string error)])</code><br/>
    <code>string save(string path[, boolean asnyc])</code><br/>
  </dt>
    <dd>
Saves the svg text to the given destination path.

**Arguments**: 
* <code>string path</code>: the path where to save the svg text.
* <code>function cb(string error)=null</code>: the callback used after the svg text is saved in the given path.
* <code>boolean async=false</code>: instead of using a callback, set async to true to save the svg text asynchromously.

**Returns**: <code>JSONGraph.SVG</code> - this isntance to chain actions.
    </dd>
</dl>

### JSONGraph.HTML class

This class is created by the ``JSONGraph#generate`` and ``JSONGraph#save`` methods.
It contains the generated svg text and allows it to be saved.

The constructor accepts only a required argument: ``string content``.
It must escape the html special characters with html entities.

``JSONGraph.HTML`` can also be used as a method:

```js
// The following declaration...
new JSONGraph.HTML("<i>A</i>");

// ...is the same than the following function call
JSONGraph.HTML("<i>A</i>");
```

#### JSONGraph.HTML attributes

<dl>
  <dt style="color:#2d3e58"><code>string content</code></dt>
    <dd>The HTML content. It must escape the html special characters with html entities.</dd>
</dl>

#### JSONGraph.HTML methods

<dl>
    <dt style="color:#2d3e58"><code>string toString()</code></dt>
    <dd>
Returns the html content.

**Returns**: <code>string</code> - the html content.
    </dd>
</dl>

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
** ``bold`` or ``b``
** ``italic`` or ``i``
** ``underline`` or ``u``
** ``stroke`` or ``s``

## DOT language

The jsonviz module produces DOT language and then svg graphics with the
[viz.js](https://www.npmjs.com/package/viz.js) module. For more information,
here are some documentations on the GraphViz web site:

* [Syntax guide](https://graphviz.gitlab.io/_pages/doc/info/lang.html)
* [Attribute reference](https://www.graphviz.org/doc/info/attrs.html)
* [Shape reference](https://www.graphviz.org/doc/info/shapes.html)