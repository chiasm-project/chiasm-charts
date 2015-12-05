// A bot plot component.
// Draws from this box plot example http://bl.ocks.org/mbostock/4061502

var d3 = require("d3");
var Model = require("model-js");
var ChiasmComponent = require("chiasm-component");
var mixins = require("../mixins");

function BoxPlot(){

  var my = new ChiasmComponent({
    xColumn: Model.None,
    yColumn: Model.None,

    fill: "white",
    stroke: "black",
    strokeWidth: "1px"
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

  my.when(["dataset", "xAccessor"], function (dataset, xAccessor){
    my.xScaleDomain = dataset.data.map(xAccessor);
  });
  
  my.when(["dataset", "yAccessor"], function (dataset, yAccessor){
    my.yScaleDomain = d3.extent(dataset.data, yAccessor);
  });

  my.when(["dataset", "xAccessor", "yAccessor"], function (dataset, xAccessor, yAccessor) {
    my.boxPlotData = d3.nest()
      .key(xAccessor)
      .entries(dataset.data)
      .map(function (d){
        var sorted = d.values.map(yAccessor).sort();
        d.quartileData = quartiles(sorted);
        d.whiskerData = [sorted[0], sorted[sorted.length - 1]];
        return d;
      });
  });

  my.when(["boxPlotData", "xScale", "yScale", "fill", "stroke", "strokeWidth" ],
      function (boxPlotData, xScale, yScale, fill, stroke, strokeWidth){

    // The center lines that span the whiskers.
    var center = g.selectAll("line.center").data(boxPlotData);
    center.enter().append("line").attr("class", "center");
    center.exit().remove();
    center
      .attr("x1", function (d){ return xScale(d.key) + (xScale.rangeBand() / 2); })
      .attr("x2", function (d){ return xScale(d.key) + (xScale.rangeBand() / 2); })
      .attr("y1", function (d){ return yScale(d.whiskerData[0]); })
      .attr("y2", function (d){ return yScale(d.whiskerData[1]); })
      .style("stroke", stroke)
      .style("stroke-width", strokeWidth);

    // The top whiskers.
    var whiskerTop = g.selectAll("line.whisker-top").data(boxPlotData);
    whiskerTop.enter().append("line").attr("class", "whisker-top");
    whiskerTop.exit().remove();
    whiskerTop
      .attr("x1", function (d){ return xScale(d.key); })
      .attr("x2", function (d){ return xScale(d.key) + xScale.rangeBand(); })
      .attr("y1", function (d){ return yScale(d.whiskerData[0]); })
      .attr("y2", function (d){ return yScale(d.whiskerData[0]); })
      .style("stroke", stroke)
      .style("stroke-width", strokeWidth);

    // The bottom whiskers.
    var whiskerBottom = g.selectAll("line.whisker-bottom").data(boxPlotData);
    whiskerBottom.enter().append("line").attr("class", "whisker-bottom");
    whiskerBottom.exit().remove();
    whiskerBottom
      .attr("x1", function (d){ return xScale(d.key); })
      .attr("x2", function (d){ return xScale(d.key) + xScale.rangeBand(); })
      .attr("y1", function (d){ return yScale(d.whiskerData[1]); })
      .attr("y2", function (d){ return yScale(d.whiskerData[1]); })
      .style("stroke", stroke)
      .style("stroke-width", strokeWidth);

    // The box that shows the upper and lower quartiles.
    var boxRect = g.selectAll("rect.box").data(boxPlotData);
    boxRect.enter().append("rect").attr("class", "box");
    boxRect.exit().remove();
    boxRect
      .attr("x", function (d){ return xScale(d.key); })
      .attr("width", xScale.rangeBand())
      .attr("y", function (d){ return yScale(d.quartileData[2]); })
      .attr("height", function (d){
        return yScale(d.quartileData[0]) - yScale(d.quartileData[2]);
      })
      .style("stroke", stroke)
      .style("stroke-width", strokeWidth)
      .style("fill", fill);

    // The horizontal line inside the box that shows the median.
    var median = g.selectAll("line.median").data(boxPlotData);
    median.enter().append("line").attr("class", "median");
    median.exit().remove();
    median
      .attr("x1", function (d){ return xScale(d.key) })
      .attr("x2", function (d){ return xScale(d.key) + xScale.rangeBand(); })
      .attr("y1", function (d){ return yScale(d.quartileData[1]); })
      .attr("y2", function (d){ return yScale(d.quartileData[1]); })
      .style("stroke", stroke)
      .style("stroke-width", strokeWidth);
  });

  return my;
}

function quartiles(d) {
  return [
    d3.quantile(d, .25),
    d3.quantile(d, .5),
    d3.quantile(d, .75)
  ];
}

module.exports = BoxPlot;
