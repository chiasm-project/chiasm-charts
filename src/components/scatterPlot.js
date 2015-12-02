var Model = require("model-js");
var ChiasmComponent = require("chiasm-component");
var mixins = require("../mixins");

function ScatterPlot(){

  var my = new ChiasmComponent({
    xColumn: Model.None,
    yColumn: Model.None,
    circleRadius: 5
  });

  var svg = d3.select(my.initSVG());
  var g = mixins.marginConvention(my, svg);

  mixins.scale(my, "x", "linear")
  var xAxisG = mixins.xAxis(my, g);
  mixins.xAxisLabel(my, xAxisG);

  mixins.scale(my, "y", "linear");
  var yAxisG = mixins.yAxis(my, g);
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

  my.when(["dataset", "xScale", "xColumn", "yScale", "yColumn", "circleRadius"],
      function (dataset, xScale, xColumn, yScale, yColumn, circleRadius) {

    var circles = g.selectAll("circle").data(dataset.data);
    circles.enter().append("circle");
    circles.exit().remove();

    circles
      .attr("cx", function (d){ return xScale(d[xColumn]); })
      .attr("cy", function (d){ return yScale(d[yColumn]); })
      .attr("r", circleRadius);

  });

  return my;
}

module.exports = ScatterPlot;
