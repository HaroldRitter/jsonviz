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
