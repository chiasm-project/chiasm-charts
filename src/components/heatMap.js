var d3 = require("d3");
var Model = require("model-js");
var ChiasmComponent = require("chiasm-component");
var mixins = require("../mixins");

function HeatMap() {

  var my = ChiasmComponent();

  var svg = d3.select(my.initSVG());
  mixins.backgroundColor(my, svg);

  var g = mixins.marginConvention(my, svg);
  mixins.marginEditor(my, svg);

  mixins.column(my, "x");
  mixins.column(my, "y");

  mixins.scaleRange(my, "x");
  mixins.scaleRange(my, "y");

  mixins.scale(my, "x");
  mixins.scale(my, "y");

  mixins.autoScaleType(my, "x", "Bands");
  mixins.autoScaleType(my, "y", "Bands");

  var marksG = g.append("g");

  var xAxisG = mixins.xAxis(my, g);
  var yAxisG = mixins.yAxis(my, g);

  mixins.xAxisLabel(my, svg);
  mixins.yAxisLabel(my, svg);


  // TODO make this color scale into a mixin.
  my.addPublicProperty("colorColumn", Model.None);
  my.addPublicProperty("colorRangeMin", "#EEEECC");
  my.addPublicProperty("colorRangeMax", "#000000");

  my.when(["dataset", "colorColumn", "colorRangeMin", "colorRangeMax"],
      function (dataset, colorColumn, colorRangeMin, colorRangeMax){

    var colorScale = d3.scale.linear()
      .domain([0, d3.max(dataset.data, function (d){ return d[colorColumn]; })])
      .range([colorRangeMin, colorRangeMax]);

    my.colorScaled = function(d) {
      return colorScale(d[colorColumn]);
    };
  });

  my.when("dataset", function (dataset){
    var marks = marksG.selectAll("rect").data(dataset.data);
    marks.enter().append("rect");
    marks.exit().remove();
    my.marks = marks;
  });

  my.when(["marks", "xScaled", "yScaled", "xRangeBand", "yRangeBand", "colorScaled"],
      function (marks, xScaled, yScaled, xRangeBand, yRangeBand, colorScaled) {
    marks
      .attr("x", xScaled)
      .attr("width", xRangeBand)
      .attr("y", function (d){ return yScaled(d) - yRangeBand; })
      .attr("height", yRangeBand)
  });

  my.when(["marks", "colorScaled"], function (marks, colorScaled){
    marks.style("fill", colorScaled);
  });

  //my.when(["fill", "stroke", "strokeWidth"], function (fill, stroke, strokeWidth){
  //  marks
  //    .style("stroke", stroke)
  //    .style("stroke-width", strokeWidth)
  //    .style("fill", fill);
  //});

  return my;
}

module.exports = HeatMap;
