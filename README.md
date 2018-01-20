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
  <dt>``boolean strict``</dt>
    <dd>The graph use the strict mode. As explained on the GraphViz web site,
    this forbids the creation of multi-edges, i.e., there can be at most one
    edge with a given tail node and head node in the directed case.</dd>
    
  <dt>``string type``</dt>
    <dd>The graph use the strict mode. As explained on the GraphViz web site,
    this forbids the creation of multi-edges, i.e., there can be at most one
    edge with a given tail node and head node in the directed case.</dd>
  
  <dt>``string name``</dt>
    <dd>Provides a name the graph.</dd>
  
  <dt>``object|string|string[] graph``</dt>
    <dd>A key-value pair of
        <a href="https://www.graphviz.org/doc/info/attrs.html">attributes</a>
        that define the appearence of the graph. It can also be one or several
        references to a style in ``styles``.</dd>
    
  <dt>``object|string|string[] node``</dt>
    <dd>A key-value pair of
        <a href="https://www.graphviz.org/doc/info/attrs.html">attributes</a>
        that define the generic appearence of all nodes. It can also be one or several
        references to a style in ``styles``.</dd>
  
  <dt>``object|string|string[] edge``</dt>
    <dd>A key-value pair of
        <a href="https://www.graphviz.org/doc/info/attrs.html">attributes</a>
        that define the generic appearence of all edges. It can also be one or several
        references to a style in ``styles``.</dd>
  
  <dt>``object styles``</dt>
    <dd>
        A key-value pair of styles that are themselves a key-value pair of
        <a href="https://www.graphviz.org/doc/info/attrs.html">attributes</a>.
        A style can be used inside the attributes on any statement with
        the ``(string|string[]) ref`` attribute. It can also be used instead
        of the attribute list in a statement or for inside the global styles
        (``graph``, ``node``, ``edge``).
    </dd>
  
  <dt>``(string|JSONGraph|object)[] statements``</dt>
    <dd>
        An array that contains all statements of the graph:
        * It can be a simple ``string`` that contains the statement such like ``A -> B``
        or even ``A -> B[label="depends", style="dashed"]``.
        * Or another ``JSONGraph`` that must have the ``subgraph`` type.
        * Or a key-value pair ``object`` that contains the statement and attributes.
        ** ``string statement`` or ``stmt``: the statement without the attributes such like 
        ``RGB`` or ``RGB -> Color``
        ** ``object|string|string[] attributes`` or ``attrs``: the key-value pair of 
        <a href="https://www.graphviz.org/doc/info/attrs.html">attributes</a> that define
        the appearence of the node, if the statement is just a node identifier,
        or the edge(s) in other cases. It can also be one or several
        references to a style in ``styles``.
    </dd>
</dl>

#### JSONGraph methods

<dl>
  <dt>``static boolean generate(object opts[, object dotOpts[, string path[, function cb(string error)]]])``<br/>
  ``static boolean generate(object opts[, object dotOpts[, string path[, boolean ansyc]]])``<br/>
  ``static boolean generate(object opts[, string path[, function cb(string error)]])``<br/>
  ``static boolean generate(object opts[, string path[, boolean async]])``
  </dt>
    <dd>
        Generates the svg text from the JSONGraph options, and save it if ``path`` is defined.
        
        **Arguments**:
        - ``object opts``: the JSONGraph constructor options
        - ``object dotOpts={}``: the [viz.js graph creation options](https://www.npmjs.com/package/viz.js#vizsrc-options-formatsvg-enginedot-scale-images-path-width-height--totalmemory16777216-)
        - ``string path=""``: the path where to save the final svg file. If it is not set, the result is not saved.
        - ``function cb(string error)=null``: the callback used after the result is saved in the given path.
        - ``boolean async=false``: instead of using a callback, set async to true to save the result asynchromously.
        
        **Returns**: ``JSONGraph.SVG`` - the generated SVG.
    </dd>
    
  <dt>``JSONGraph reset()``</dt>
    <dd>
        Resets the dot code generated. Uses that function if the arguments where changed after
        a call to the ``dot``, ``generate`` or ``save`` method.
        
        **Returns**: ``JSONGraph`` - this instance to chain actions.
    </dd>
    
  <dt>``JSONGraph dot()``</dt>
    <dd>
        Generates the dot code according to the attributes values, and returns it.
        The generated code is internaly stored. The ``reset`` method can be used to remove it.
        
        **Returns**: ``string`` - the dot code used by GraphViz to generate the final graph.
    </dd>
    
  <dt>``JSONGraph.SVG generate([object dotOpts])``</dt>
    <dd>
        Generates the final svg graph text according to the attributes values.
        
        **Arguments**:
        - ``object dotOpts={}``: the [viz.js graph creation options](https://www.npmjs.com/package/viz.js#vizsrc-options-formatsvg-enginedot-scale-images-path-width-height--totalmemory16777216-)
        
        **Returns**: ``JSONGraph.SVG`` - the generated svg.
    </dd>   
    
  <dt>
  ``JSONGraph.SVG save(string path[, object dotOpts[, function cb(string error)]])``<br/>
  ``JSONGraph.SVG save(string path[, object dotOpts[, boolean asnyc]])``<br/>
  ``JSONGraph.SVG save(string path[, function cb(string error)]])``<br/>
  ``JSONGraph.SVG save(string path[, boolean asnyc]])``<br/>
  </dt>
    <dd>
        Generates the dot code according to the attributes values, save it to the
        given path and then returns it.
        
        **Arguments**: 
        - ``string path``: the path where to save the final svg file.
        - ``object dotOpts={}``: the [viz.js graph creation options](https://www.npmjs.com/package/viz.js#vizsrc-options-formatsvg-enginedot-scale-images-path-width-height--totalmemory16777216-)
        - ``function cb(string error)=null``: the callback used after the result is saved in the given path.
        - ``boolean async=false``: instead of using a callback, set async to true to save the result asynchromously.
        
        **Returns**: ``JSONGraph.SVG`` - the generated svg.
    </dd>
</dl>

### JSONGraph.SVG class

This class is created by the ``JSONGraph#generate`` and ``JSONGraph#save`` methods.
It contains the generated svg text and allows it to be saved.

The constructor accepts only a required argument: ``string text``, the svg text.

#### JSONGraph.SVG attributes

<dl>
  <dt>``string text``</dt>
    <dd>The svg text.</dd>
</dl>

#### JSONGraph.SVG methods

<dl>
    <dt>``string toString()``</dt>
    <dd>
        Returns the svg text. So a JSONGraph.SVG instance will return its text
        when it is used as a string.
        
        **Returns**: ``string`` - the svg text.
    </dd>
    
  <dt>
    ``string save(string path[, function cb(string error)])``<br/>
    ``string save(string path[, boolean asnyc])``<br/>
  </dt>
    <dd>
        Saves the svg text to the given destination path.
        
        **Arguments**: 
        - ``string path``: the path where to save the svg text.
        - ``function cb(string error)=null``: the callback used after the svg text is saved in the given path.
        - ``boolean async=false``: instead of using a callback, set async to true to save the svg text asynchromously.
        
        **Returns**: ``JSONGraph.SVG`` - this isntance to chain actions.
    </dd>
</dl>

### JSONGraph.HTML class

This class is created by the ``JSONGraph#generate`` and ``JSONGraph#save`` methods.
It contains the generated svg text and allows it to be saved.

The constructor accepts only a required argument: ``string content``.
It must escape the &gt; (&amp;gt;) and &lt; (&amp;lt;) charcters.

``JSONGraph.HTML`` can also be used as a method:

```js
// The following declaration...
new JSONGraph.HTML("<i>A</i>");

// ...is the same than the following function call
JSONGraph.HTML("<i>A</i>");
```

#### JSONGraph.HTML attributes

<dl>
  <dt>``string content``</dt>
    <dd>The HTML content. It must escape the &gt; (&amp;gt;) and &lt; (&amp;lt;) charcters.</dd>
</dl>

#### JSONGraph.HTML methods

<dl>
    <dt>``string toString()``</dt>
    <dd>
        Returns the html content.
        
        **Returns**: ``string`` - the html content.
    </dd>
</dl>

## Additional attributes

In addition of the [DOT language attributes](https://www.graphviz.org/doc/info/attrs.html),
*jsonviz* provides its own attributes :

* ``string|string[] ref``: the name(s) of a style(s) stored inside the ``JSONGraph#styles``
attribute. The attribute of the style(s) will be copied in order before the attribute
list that contains the reference.

## DOT language

The jsonviz module produces DOT language and then svg graphics with the
[viz.js](https://www.npmjs.com/package/viz.js) module. For more information,
here are some documentations on the GraphViz web site:

* [Syntax guide](https://graphviz.gitlab.io/_pages/doc/info/lang.html)
* [Attribute reference](https://www.graphviz.org/doc/info/attrs.html)
* [Shape reference](https://www.graphviz.org/doc/info/shapes.html)