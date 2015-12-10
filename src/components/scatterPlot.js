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

  mixins.column(my, "x");
  mixins.column(my, "y");

  mixins.scale(my, "x");
  mixins.scale(my, "y");

  mixins.scaleRange(my, "x");
  mixins.scaleRange(my, "y");

  mixins.autoScaleType(my, "x", "Points");
  mixins.autoScaleType(my, "y", "Points");

  my.xScaleRangePadding = 0.5;
  my.yScaleRangePadding = 0.5;

  var xAxisG = mixins.xAxis(my, g);
  var yAxisG = mixins.yAxis(my, g);

  mixins.xAxisLabel(my, xAxisG);
  mixins.yAxisLabel(my, yAxisG);

  mixins.marginEditor(my, svg);

  
  //// Allow the API client to optionally specify fixed min and max values.
  //model.xDomainMin = None;
  //model.xDomainMax = None;
  //model.when(["data", "getX", "xDomainMin", "xDomainMax"],
  //    function (data, getX, xDomainMin, xDomainMax) {

  //  if(xDomainMin === None && xDomainMax === None){
  //    model.xDomain = d3.extent(data, getX);
  //  } else {
  //    if(xDomainMin === None){
  //      xDomainMin = d3.min(data, getX);
  //    }
  //    if(xDomainMax === None){
  //      xDomainMax = d3.max(data, getX);
  //    }
  //    model.xDomain = [xDomainMin, xDomainMax]
  //  }
  //});

  // TODO move this elsewhere
  //my.when(["dataset", "xAccessor"], function (dataset, xAccessor){
  //  my.xScaleDomain = d3.extent(dataset.data, xAccessor);
  //});
  
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
