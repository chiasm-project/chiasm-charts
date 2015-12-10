var d3 = require("d3");
var Model = require("model-js");
var ChiasmComponent = require("chiasm-component");
var mixins = require("../mixins");

function HeatMap() {

  var my = ChiasmComponent();

  var svg = d3.select(my.initSVG());
  mixins.backgroundColor(my, svg);

  var g = mixins.marginConvention(my, svg);
  mixins.marginEditor(my, svg);

  mixins.column(my, "x");
  mixins.column(my, "y");

  mixins.scaleRange(my, "x");
  mixins.scaleRange(my, "y");

  mixins.scale(my, "x");
  mixins.scale(my, "y");

  mixins.autoScaleType(my, "x", "Bands");
  mixins.autoScaleType(my, "y", "Bands");

  var xAxisG = mixins.xAxis(my, g);
  var yAxisG = mixins.yAxis(my, g);

  mixins.xAxisLabel(my, svg);
  mixins.yAxisLabel(my, svg);


  // TODO make this color scale into a mixin.
  my.addPublicProperty("colorColumn", Model.None);
  my.addPublicProperty("colorRangeMin", "#FFFFFF");
  my.addPublicProperty("colorRangeMax", "#000000");

  my.when(["dataset", "colorColumn", "colorRangeMin", "colorRangeMax"],
      function (dataset, colorColumn, colorRangeMin, colorRangeMax){

    var colorScale = d3.scale.linear()
      .domain([0, d3.max(dataset.data, function (d){ return d[colorColumn]; })])
      .range([colorRangeMin, colorRangeMax]);

    my.colorScaled = function(d) {
      return colorScale(d[colorColumn]);
    };
  });

  my.when(["dataset", "xScaled", "yScaled", "xRangeBand", "yRangeBand", "colorScaled"],
      function (dataset, xScaled, yScaled, xRangeBand, yRangeBand, colorScaled) {

    var bars = g.selectAll("rect").data(dataset.data);
    bars.enter().append("rect");
    bars
      .attr("x", xScaled)
      .attr("width", xRangeBand)
      .attr("y", function (d){ return yScaled(d) - yRangeBand; })
      .attr("height", yRangeBand)
      .attr("fill", colorScaled);
    bars.exit().remove();

  });


  //my.when(["data", "yScale", "yColumn", "height"], function (data, yScale, yColumn, height){
  //  // TODO move this logic to scale creation
  //  yScale.rangeBands([height, 0]);
  //  my.y = function(d) { 

  //    // Using yScale.step here is kind of an ugly hack to get the
  //    // right behavior for both linear and ordinal id scales on the Y axis.
  //    return yScale(d[yColumn] + yScale.step);
  //  };
  //});

  //function updateBarStyles(){
  //  my.rects
  //    .attr("stroke", my.stroke)
  //    .attr("stroke-width", my.strokeWidth);
  //}
  //my.when(["rects", "stroke", "strokeWidth"], updateBarStyles)

  return my;
}

module.exports = HeatMap;
