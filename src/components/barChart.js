var d3 = require("d3");
var Model = require("model-js");
var ChiasmComponent = require("chiasm-component");
var ChiasmDataset = require("chiasm-dataset");
var getColumnMetadata = ChiasmDataset.getColumnMetadata;
var mixins = require("../mixins");

function BarChart(){

  var my = new ChiasmComponent({

    // TODO move these to the "scale" mixin
    xColumn: Model.None,
    yColumn: Model.None
  });

  var svg = d3.select(my.initSVG());
  var g = mixins.marginConvention(my, svg);

  mixins.scale(my, "x");
  mixins.autoScaleType(my, "x");
  var xAxisG = mixins.xAxis(my, g);
  mixins.xAxisLabel(my, xAxisG);

  var yAxisG = mixins.yAxis(my, g);
  mixins.scale(my, "y", "linear");
  mixins.yAxisLabel(my, yAxisG);

  mixins.marginEditor(my, svg);
  
  my.when(["dataset", "yColumn"], function (dataset, yColumn){
    if(yColumn !== Model.None){
      my.yScaleDomain = [0, d3.max(dataset.data, function (d) { return d[yColumn]; })];
    }
  });

  my.when(["dataset", "xScale", "xColumn"], function (dataset, xScale, xColumn) {
    var interval = getColumnMetadata(dataset, xColumn).interval;
    if(interval){
      my.barWidth = xScale(interval) - xScale(0);
    } else {
      my.barWidth = xScale.rangeBand();
    }
  });

  my.when(["dataset", "xScaled", "yScaled", "height", "barWidth"],
      function (dataset, xScaled, yScaled, height, barWidth) {

    var bars = g.selectAll("rect").data(dataset.data);
    bars.enter().append("rect");
    bars
      .attr("x", xScaled)
      .attr("width", barWidth)
      .attr("y", yScaled)
      .attr("height", function (d){ return height - yScaled(d); });
    bars.exit().remove();

  });

  return my;
}

module.exports = BarChart;
