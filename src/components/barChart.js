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

  var marksG = g.append("g");

  var xAxisG = mixins.xAxis(my, g);
  var yAxisG = mixins.yAxis(my, g);

  mixins.xAxisLabel(my, svg);
  mixins.yAxisLabel(my, svg);
  
  // Use a zero based Y scale.
  my.when(["dataset", "yAccessor"], function (dataset, yAccessor){
    my.yScaleDomain = [ 0, d3.max(dataset.data, yAccessor) ]
  });

  my.when("dataset", function (dataset){
    var marks = marksG.selectAll("rect").data(dataset.data);
    marks.enter().append("rect");
    marks.exit().remove();
    my.marks = marks;
  });

  my.when(["marks", "xScaled", "yScaled", "height", "xRangeBand"],
      function (marks, xScaled, yScaled, height, xRangeBand){
    marks
      .attr("x", xScaled)
      .attr("width", xRangeBand)
      .attr("y", yScaled)
      .attr("height", function (d){ return height - yScaled(d); });
  });

  my.when(["marks", "fill", "stroke", "strokeWidth"], function (marks, fill, stroke, strokeWidth){
    marks
      .style("stroke", stroke)
      .style("stroke-width", strokeWidth)
      .style("fill", fill);
  });

  return my;
}

module.exports = BarChart;
