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

  my.when(["dataset", "xScaled", "yScaled", "circleRadius"],
      function (dataset, xScaled, yScaled, circleRadius) {

    var circles = g.selectAll("circle").data(dataset.data);
    circles.enter().append("circle");
    circles
      .attr("cx", xScaled)
      .attr("cy", yScaled)
      .attr("r", circleRadius);
    circles.exit().remove();

  });

  return my;
}

module.exports = ScatterPlot;
