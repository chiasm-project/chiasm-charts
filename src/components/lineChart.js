var d3 = require("d3");
var Model = require("model-js");
var ChiasmComponent = require("chiasm-component");
var mixins = require("../mixins");

function LineChart(){

  var my = new ChiasmComponent({
    lineStroke: "black",
    lineStrokeWidth: "1px"
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

  mixins.autoScaleType(my, "x");
  mixins.autoScaleType(my, "y");

  var xAxisG = mixins.xAxis(my, g);
  var yAxisG = mixins.yAxis(my, g);

  mixins.xAxisLabel(my, svg);
  mixins.yAxisLabel(my, svg);

  var line = d3.svg.line()
  
    // TODO make this interpolate method configurable.
    .interpolate("basis");

  var path = g.append("path").attr("fill", "none");

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

  my.when(["dataset", "xScaled", "yScaled"], function (dataset, xScaled, yScaled) {
    line.x(xScaled).y(yScaled);
    path.attr("d", line(dataset.data));
  });

  my.when("lineStroke", function (lineStroke){
    path.attr("stroke", lineStroke);
  });

  my.when("lineStrokeWidth", function (lineStrokeWidth){
    path.attr("stroke-width", lineStrokeWidth);
  });

  return my;
}

module.exports = LineChart;
