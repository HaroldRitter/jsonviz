# jsonviz

A Node.js module that converts JSON to DOT language and can create GraphViz graphics with viz.js.
The jsonviz module is not an abstraction level that makes UML creation very easier.
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

#### JSONGraph instance attributes

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
  
  <dt>``object graph``</dt>
    <dd>A key-value pair of
        <a href="https://www.graphviz.org/doc/info/attrs.html">attributes</a>
        that define the appearence of the graph.</dd>
    
  <dt>``object node``</dt>
    <dd>A key-value pair of
        <a href="https://www.graphviz.org/doc/info/attrs.html">attributes</a>
        that define the generic appearence of all nodes.</dd>
  
  <dt>``object edge``</dt>
    <dd>A key-value pair of
        <a href="https://www.graphviz.org/doc/info/attrs.html">attributes</a>
        that define the generic appearence of all edges.</dd>
  
  <dt>``(string|JSONGraph|object)[] statements``</dt>
    <dd>
        An array that contains all statements of the graph:
        * It can be a simple ``string`` that contains the statement such like ``A -> B``
        or even ``A -> B[label="depends", style="dashed"]``.
        * Or another ``JSONGraph`` that must have the ``subgraph`` type.
        * Or a key-value pair ``object`` that contains the statement and attributes.
        ** ``string statement`` or ``stmt``: the statement without the attributes such like 
        ``RGB`` or ``RGB -> Color``
        ** ``object attributes`` or ``attrs``: the key-value pair of 
        <a href="https://www.graphviz.org/doc/info/attrs.html">attributes</a> that define
        the appearence of the node, if the statement is just a node identifier,
        or the edge(s) in other cases.
    </dd>
</dl>
