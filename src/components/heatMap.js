// This is an example Chaism plugin that uses D3 to make a heat map. 

var ChiasmComponent = require("chiasm-component");
var Model = require("model-js");
var d3 = require("d3");

function HeatMap() {

  var my = ChiasmComponent({

    margin: {
      left:   80,
      top:    30,
      right:  30,
      bottom: 60
    },

    colorColumn: Model.None,

    xColumn: Model.None,
    xLabel: Model.None,

    yColumn: Model.None,
    yLabel: Model.None,

    // These properties adjust spacing between rects.
    // The names correspond to the arguments passed to
    // d3.scale.ordinal.rangeRoundBands(interval[, padding[, outerPadding]])
    // https://github.com/mbostock/d3/wiki/Ordinal-Scales#ordinal_rangeRoundBands
    rectPadding: 0.1,
    rectOuterPadding: 0.1,

    colorRangeMin: "black",
    colorRangeMax: "white",

    stroke: "none",
    strokeWidth: "1px",

    // Desired number of pixels between tick marks.
    xAxisTickDensity: 50,

    // Translation down from the X axis line (pixels).
    xAxisLabelOffset: 50,

    // Desired number of pixels between tick marks.
    yAxisTickDensity: 30,

    // Translation left from the X axis line (pixels).
    yAxisLabelOffset: 45

  });

  my.el = document.createElement("div");
  var svg = d3.select(my.el).append("svg");
  var g = svg.append("g");

  var rectsG = g.append("g");

  var xAxis = d3.svg.axis().orient("bottom"); 
  var xAxisG = g.append("g").attr("class", "x axis");
  var xAxisLabel = xAxisG.append("text")
    .style("text-anchor", "middle")
    .attr("class", "label");

  var yAxis = d3.svg.axis().orient("left"); 
  var yAxisG = g.append("g").attr("class", "y axis");
  var yAxisLabel = yAxisG.append("text")
    .style("text-anchor", "middle")
    .attr("class", "label");

  // TODO think about adding this stuff as configurable
  // .tickFormat(d3.format("s"))
  // .outerTickSize(0);

  my.when("xLabel", function (xLabel){
    xAxisLabel.text(xLabel);
  });
  my.when(["width", "xAxisLabelOffset"], function (width, offset){
    xAxisLabel.attr("x", width / 2).attr("y", offset);
  });

  my.when(["height", "yAxisLabelOffset"], function(height, offset){
    yAxisLabel.attr("transform", [
      "translate(-" + offset + "," + (height / 2) + ") ",
      "rotate(-90)"
    ].join(""));
  });
  my.when("yLabel", function (yLabel){
    yAxisLabel.text(yLabel);
  });

  // Respond to changes in size and margin.
  // Inspired by D3 margin convention from http://bl.ocks.org/mbostock/3019563
  my.when("box", function (box){
    svg.attr("width", box.width)
       .attr("height", box.height);
  });
  my.when(["box", "margin"], function (box, margin){
    my.width = box.width - margin.left - margin.right;
    my.height = box.height - margin.top - margin.bottom;
    g.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  });

  my.when("height", function (height){
    xAxisG.attr("transform", "translate(0," + height + ")");
  });

  function genScale(column, dataset){

    // This metadata is only present for aggregated numeric columns.
    var meta = dataset.metadata[column];
    var scale;

    // Handle the case of an aggregated numeric column.
    if(meta){
      scale = d3.scale.linear();
      scale.domain(meta.domain);
      scale.rangeBand = function (){ return Math.abs(scale(meta.step) - scale(0)); };
      scale.rangeBands = function (extent){ scale.range(extent); };
      scale.step = meta.step;

    // Handle the case of a string (categorical) column.
    } else {
      scale = d3.scale.ordinal();
      scale.domain(dataset.data.map( function(d) { return d[column]; }));
      scale.step = "";
    }
    return scale;
  }

  my.when(["xColumn", "dataset"], function (xColumn, dataset){
    my.xScale = genScale(xColumn, dataset);
  });

  my.when(["yColumn", "dataset"], function (yColumn, dataset){
    my.yScale = genScale(yColumn, dataset);
  });

  my.when("dataset", function (dataset){
    my.data = dataset.data;
    my.metadata = dataset.metadata;
  });

  my.when(["data", "colorColumn", "colorRangeMin", "colorRangeMax"],
      function (data, colorColumn, colorRangeMin, colorRangeMax){

    var colorScale = d3.scale.linear()
      .domain([0, d3.max(data, function (d){ return d[colorColumn]; })])
      .range([colorRangeMin, colorRangeMax]);

    my.color = function(d) {
      return colorScale(d[colorColumn]);
    };
  });

  my.when(["data", "xScale", "xColumn", "width"], function (data, xScale, xColumn, width){
    // TODO move this logic to scale creation
    xScale.rangeBands([0, width]);//, rectPadding, rectOuterPadding);
    my.x = function(d) { return xScale(d[xColumn]); };
  });

  my.when(["data", "yScale", "yColumn", "height"], function (data, yScale, yColumn, height){
    // TODO move this logic to scale creation
    yScale.rangeBands([height, 0]);
    my.y = function(d) { 

      // Using yScale.step here is kind of an ugly hack to get the
      // right behavior for both linear and ordinal id scales on the Y axis.
      return yScale(d[yColumn] + yScale.step);
    };
  });

  my.when(["data", "color", "x", "xScale", "y", "yScale"],
      function (data, color, x, xScale, y, yScale){

    my.rects = rectsG.selectAll("rect").data(data);
    my.rects.enter().append("rect")
    
      // This makes it so that there are no anti-aliased spaces between the rects.
      .style("shape-rendering", "crispEdges");

    my.rects.exit().remove();
    my.rects
      .attr("x", x)
      .attr("width", xScale.rangeBand())
      .attr("y", y)
      .attr("height", yScale.rangeBand())
      .attr("fill", color);

    // Withouth this line, the rects added in the enter() phase
    // will flash as black for a fraction of a second.
    updateBarStyles();
  });

  function updateBarStyles(){
    my.rects
      .attr("stroke", my.stroke)
      .attr("stroke-width", my.strokeWidth);
  }
  my.when(["rects", "stroke", "strokeWidth"], updateBarStyles)

  my.when(["xScale", "width", "xAxisTickDensity"], function (xScale, width, density){
    xAxis.scale(xScale).ticks(width / density);
    xAxisG.call(xAxis);
  });

  my.when(["yScale", "height", "yAxisTickDensity"], function (yScale, height, density){
    yAxis.scale(yScale).ticks(height / density);
    yAxisG.call(yAxis);
  });

  return my;
}

module.exports = HeatMap;
