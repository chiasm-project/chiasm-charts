module.exports = function xAxisLabel(my, svg){

  var label = svg.append("text").attr("class", "x axis-label");
  my.addPublicProperty("xAxisLabelText", "X Axis Label");
  my.addPublicProperty("xAxisLabelTextOffset", 5);

  my.when("xAxisLabelText", function (xAxisLabelText){
    label.text(xAxisLabelText);
  });

  my.when(["box", "xAxisLabelTextOffset"], function (box, offset){
    label.attr("y", box.height - offset);
  });

  my.when(["margin", "width"], function (margin, width){
    label.attr("x", margin.left + width / 2);
  });
}
