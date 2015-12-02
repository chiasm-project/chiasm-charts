var Model = require("model-js");
var ChiasmComponent = require("chiasm-component");
var mixins = require("../mixins");

function LineChart(){

  var my = new ChiasmComponent({
    xColumn: Model.None,
    yColumn: Model.None,
    lineStroke: "black",
    lineStrokeWidth: "1px"
  });

  var svg = d3.select(my.initSVG());
  var g = mixins.marginConvention(my, svg);

  var line = d3.svg.line().interpolate("basis");
  var path = g.append("path").attr("fill", "none");

  var xAxisG = mixins.xAxis(my, g);
  mixins.scale(my, "x", "time");
  mixins.xAxisLabel(my, xAxisG);

  var yAxisG = mixins.yAxis(my, g);
  mixins.scale(my, "y", "linear");
  mixins.yAxisLabel(my, yAxisG);

  my.when(["dataset", "xColumn"], function (dataset, xColumn){
    if(xColumn !== Model.None){
      my.xScaleDomain = d3.extent(dataset.data, function (d) { return d[xColumn]; });
    }
  });
  
  my.when(["dataset", "yColumn"], function (dataset, yColumn){
    if(yColumn !== Model.None){
      my.yScaleDomain = d3.extent(dataset.data, function (d) { return d[yColumn]; });
    }
  });

  my.when(["dataset", "xScale", "xColumn", "yScale", "yColumn"],
      function (dataset, xScale, xColumn, yScale, yColumn) {

    line
      .x(function(d) { return xScale(d[xColumn]); })
      .y(function(d) { return yScale(d[yColumn]); });

    path.attr("d", line(dataset.data));

  });

  my.when("lineStroke", function (lineStroke){
    path.attr("stroke", lineStroke);
  });

  my.when("lineStrokeWidth", function (lineStrokeWidth){
    path.attr("stroke-width", lineStrokeWidth);
  });

  return my;
}

module.exports = LineChart;
