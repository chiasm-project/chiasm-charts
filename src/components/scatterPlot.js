var d3 = require("d3");
var Model = require("model-js");
var ChiasmComponent = require("chiasm-component");
var mixins = require("../mixins");

function ScatterPlot(){

  var my = new ChiasmComponent({
    // TODO add a size column, use sqrt scale.
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

  mixins.marginEditor(my, svg);

  my.when(["dataset", "xAccessor"], function (dataset, xAccessor){
    my.xScaleDomain = d3.extent(dataset.data, xAccessor);
  });
  
  my.when(["dataset", "yAccessor"], function (dataset, yAccessor){
    my.yScaleDomain = d3.extent(dataset.data, yAccessor);
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
