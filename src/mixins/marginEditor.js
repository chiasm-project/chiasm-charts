var d3 = require("d3");

module.exports = function marginEditor(my, svg){

  // The width of the handles.
  my.addPublicProperty("marginEditorWidth", 15);

  // The color of the handles on hover.
  my.addPublicProperty("marginEditorFill", "rgba(0, 0, 0, 0.2)");

  var data = [ "left", "right", "top", "bottom" ];

  var handles = svg.selectAll(".margin-handle").data(data);
  handles.enter().append("rect")
    .attr("class", "margin-handle")
    .style("fill", "none")
    .style("pointer-events", "all")

  var drag = d3.behavior.drag().on("drag", function (d) {
  
    // Update the margin based on the side being dragged.
    // "d" is one of "left", "right", "top", "bottom".
    my.margin = set(my.margin, d, {
      left:    d3.event.x,
      right:  -d3.event.x,
      top:     d3.event.y,
      bottom: -d3.event.y,
    }[d]);

    // Hide the handles during drag.
    handles.style("fill", "none");
  });

  handles.call(drag);

  // Fill in the handles on hover.
  my.when("marginEditorFill", function (marginEditorFill){
    handles
      .on("mouseenter", function (){
        // Do not show the handle if the user is in the middle of dragging something else.
        if(!d3.event.buttons){
          d3.select(this).style("fill", marginEditorFill);
        }
      })
      .on("mouseout", function (){
        d3.select(this).style("fill", "none");
      });
  });

  // Update the drag origin function based on the margin.
  my.when("margin", function (margin){
    var origins = {
      left:   { x: margin.left,   y: 0 },
      right:  { x: -margin.right, y: 0 },
      top:    { x: 0,             y: margin.top },
      bottom: { x: 0,             y: -margin.bottom },
    };
    drag.origin(function(d) {
      return origins[d];
    });
  });

  // Render the handles
  my.when(["margin", "marginEditorWidth", "width", "height"],
      function (margin, marginEditorWidth, width, height){

    var x = {
      left:   margin.left         - marginEditorWidth / 2,
      right:  margin.left + width - marginEditorWidth / 2,
      top:    margin.left,
      bottom: margin.left
    };

    var y = {
      left:   margin.top,
      right:  margin.top,
      top:    margin.top          - marginEditorWidth / 2,
      bottom: margin.top + height - marginEditorWidth / 2
    };

    var w = {
      left:   marginEditorWidth,
      right:  marginEditorWidth,
      top:    width,
      bottom: width
    };

    var h = {
      left:   height,
      right:  height,
      top:    marginEditorWidth,
      bottom: marginEditorWidth
    };

    var cursor = {
      left:   "ew-resize",
      right:  "ew-resize",
      top:    "ns-resize",
      bottom: "ns-resize"
    };

    handles
      .attr("x",       function (d){ return x[d]; })
      .attr("y",       function (d){ return y[d]; })
      .attr("width",   function (d){ return w[d]; })
      .attr("height",  function (d){ return h[d]; })
      .style("cursor", function (d){ return cursor[d]; })

      // Rounded corners.
      .attr("rx", function (d){ return marginEditorWidth / 2; })
      .attr("ry", function (d){ return marginEditorWidth / 2; });

  });
};

// Creates a new object with the given value changed.
// This is to approximate immutability to avoid issues that
// crop up when multiple components reference the same margin object.
function set(obj, property, value){
  var newObj = {};
  Object.keys(obj).forEach(function (d){
    newObj[d] = (d === property) ? value : obj[d];
  });
  return newObj;
}
