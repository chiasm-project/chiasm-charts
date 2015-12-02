var Model = require("model-js");
var ChiasmComponent = require("chiasm-component");
var mixins = require("../mixins");

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


  my.when(["dataset", "xColumn"], function (dataset, xColumn){
    if(xColumn !== Model.None){
      my.xScaleDomain = dataset.data.map( function (d) { return d[xColumn]; });
    }
  });
  
  my.when(["dataset", "yColumn"], function (dataset, yColumn){
    if(yColumn !== Model.None){
      my.yScaleDomain = [0, d3.max(dataset.data, function (d) { return d[yColumn]; })];
    }
  });

  my.when(["dataset", "xScale", "xColumn", "yScale", "yColumn", "height"],
      function (dataset, xScale, xColumn, yScale, yColumn, height) {

    var bars = g.selectAll("rect").data(dataset.data);
      bars.enter().append("rect");
      bars.exit().remove();
      bars
        .attr("x", function (d){ return xScale(d[xColumn]); })
        .attr("width", xScale.rangeBand())
        .attr("y", function (d){ return yScale(d[yColumn]); })
        .attr("height", function (d){ return height - yScale(d[yColumn]); });

  });

  return my;
}

module.exports = BarChart;
