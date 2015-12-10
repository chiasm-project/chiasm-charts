var d3 = require("d3");
var Model = require("model-js");
var ChiasmComponent = require("chiasm-component");
var mixins = require("../mixins");

function BarChart(){

  var my = ChiasmComponent();

  var svg = d3.select(my.initSVG());
  var g = mixins.marginConvention(my, svg);

  mixins.column(my, "x");
  mixins.scale(my, "x");
  mixins.autoScaleType(my, "x");
  mixins.rangeBands(my, "x");

  var xAxisG = mixins.xAxis(my, g);
  mixins.xAxisLabel(my, xAxisG);

  mixins.column(my, "y");
  mixins.scale(my, "y", "linear");
  var yAxisG = mixins.yAxis(my, g);
  mixins.yAxisLabel(my, yAxisG);

  mixins.marginEditor(my, svg);
  
  // Use a zero based Y scale.
  my.when(["dataset", "yAccessor"], function (dataset, yAccessor){
    my.yScaleDomain = [ 0, d3.max(dataset.data, yAccessor) ]
  });

  my.when(["dataset", "xScaled", "yScaled", "height", "xRangeBand"],
      function (dataset, xScaled, yScaled, height, xRangeBand) {

    var bars = g.selectAll("rect").data(dataset.data);
    bars.enter().append("rect");
    bars
      .attr("x", xScaled)
      .attr("width", xRangeBand)
      .attr("y", yScaled)
      .attr("height", function (d){ return height - yScaled(d); });
    bars.exit().remove();

  });

  return my;
}

module.exports = BarChart;
