var d3 = require("d3");
var Model = require("model-js");
var ChiasmComponent = require("chiasm-component");
var mixins = require("../mixins");

function BarChart(){

  var my = ChiasmComponent({
    fill: "black",
    stroke: "none",
    strokeWidth: "1px"
  });

  var svg = d3.select(my.initSVG());
  mixins.backgroundColor(my, svg);

  var g = mixins.marginConvention(my, svg);
  mixins.marginEditor(my, svg);

  mixins.column(my, "x");
  mixins.column(my, "y");

  mixins.scale(my, "x");
  mixins.scale(my, "y");

  mixins.scaleRange(my, "x");
  mixins.scaleRange(my, "y");

  mixins.autoScaleType(my, "x", "Bands");
  mixins.autoScaleType(my, "y");

  // The placement of this line ensures that the bars are drawn
  // behind the axis.
  var barsG = g.append("g");

  var xAxisG = mixins.xAxis(my, g);
  var yAxisG = mixins.yAxis(my, g);

  mixins.xAxisLabel(my, svg);
  mixins.yAxisLabel(my, svg);
  
  // Use a zero based Y scale.
  my.when(["dataset", "yAccessor"], function (dataset, yAccessor){
    my.yScaleDomain = [ 0, d3.max(dataset.data, yAccessor) ]
  });

  my.when(["dataset", "xScaled", "yScaled", "height", "xRangeBand", "fill", "stroke", "strokeWidth"],
      function (dataset, xScaled, yScaled, height, xRangeBand, fill, stroke, strokeWidth){

    var bars = barsG.selectAll("rect").data(dataset.data);
    bars.enter().append("rect");
    bars
      .attr("x", xScaled)
      .attr("width", xRangeBand)
      .attr("y", yScaled)
      .attr("height", function (d){ return height - yScaled(d); })
      .style("stroke", stroke)
      .style("stroke-width", strokeWidth)
      .style("fill", fill);
    bars.exit().remove();

  });

  return my;
}

module.exports = BarChart;
