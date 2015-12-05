var d3 = require("d3");
var Model = require("model-js");
var ChiasmComponent = require("chiasm-component");
var mixins = require("../mixins");
var ChiasmDataset = require("chiasm-dataset");
var getColumnMetadata = ChiasmDataset.getColumnMetadata;

function BarChart(){

  var my = new ChiasmComponent({
    xColumn: Model.None,
    yColumn: Model.None
  });

  var svg = d3.select(my.initSVG());
  var g = mixins.marginConvention(my, svg);

  var xAxisG = mixins.xAxis(my, g);
  mixins.scale(my, "x", "ordinal");
  mixins.xAxisLabel(my, xAxisG);

  var yAxisG = mixins.yAxis(my, g);
  mixins.scale(my, "y", "linear");
  mixins.yAxisLabel(my, yAxisG);

  mixins.marginEditor(my, svg);

  my.when(["dataset", "xColumn"], function (dataset, xColumn){
    if(xColumn !== Model.None){
      var interval = getColumnMetadata(dataset, xColumn).interval;
      if(interval){
        my.xScaleType = "linear";
        my.xScaleDomain = d3.extent(dataset.data, function (d) { return d[xColumn]; });
        my.xScaleDomain[1] += interval;
      } else {
        my.xScaleType = "ordinal";
        my.xScaleDomain = dataset.data.map( function (d) { return d[xColumn]; });
      }
    }
  });
  
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
