module.exports = function marginConvention(my, svg){
  var g = svg.append("g");

  // TODO maybe the margin would be better suited as 4 separate properties?
  // margin-top
  // margin-bottom
  // margin-left
  // margin-right
  // this would simplify the margin editor implementation.

  my.addPublicProperty("margin", {top: 20, right: 20, bottom: 50, left: 60});

  my.when(["box", "margin"], function (box, margin){
    my.width = box.width - margin.left - margin.right;
    my.height = box.height - margin.top - margin.bottom;
    g.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  });

  return g;
}
