module.exports = function yAxisLabel(my, svg){

  var label = svg.append("text").attr("class", "y axis-label");
  my.addPublicProperty("yAxisLabelText", "Y Axis Label");
  my.addPublicProperty("yAxisLabelTextOffset", 15);

  my.when("yAxisLabelText", function (yAxisLabelText){
    label.text(yAxisLabelText);
  });

  my.when(["yAxisLabelTextOffset", "height", "margin"], function (offset, height, margin){
    label.attr("transform", [
      "translate(",
      offset,
      ",",
      margin.top + height / 2,
      ") rotate(-90)"
    ].join(""));
  });
}
