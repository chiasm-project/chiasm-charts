var d3 = require("d3");
var Model = require("model-js");
var ChiasmComponent = require("chiasm-component");
var mixins = require("../mixins");

// TODO split this mixin out
function brush(my, g){
  my.addPublicProperty("brushEnabled", false);
  my.when("brushEnabled", function (brushEnabled){
    if(brushEnabled){
      console.log("brush enabled");
    }
  });
}

function ScatterPlot(){

  var my = new ChiasmComponent({
    // TODO add a size column, use sqrt scale.
    circleRadius: 5
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

  mixins.autoScaleType(my, "x", "Points");
  mixins.autoScaleType(my, "y", "Points");

  var xAxisG = mixins.xAxis(my, g);
  var yAxisG = mixins.yAxis(my, g);

  mixins.xAxisLabel(my, svg);
  mixins.yAxisLabel(my, svg);

  //mixins.brush(my, g);
  brush(my, g);

  my.xScaleRangePadding = 0.5;
  my.yScaleRangePadding = 0.5;

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

  my.when("dataset", function (dataset) {
    var marks = g.selectAll("circle").data(dataset.data);
    marks.enter().append("circle");
    marks.exit().remove();
    my.marks = marks;
  });

  my.when(["marks", "xScaled", "yScaled", "circleRadius"],
      function (marks, xScaled, yScaled, circleRadius) {
    marks
      .attr("cx", xScaled)
      .attr("cy", yScaled)
      .attr("r", circleRadius);
  });

  // TODO figure out how to deal with color scales, then make this a mixin.
  my.addPublicProperties({
    fill: "black",
    stroke: "none",
    strokeWidth: "1px"
  });
  my.when(["marks", "fill", "stroke", "strokeWidth"], function (marks, fill, stroke, strokeWidth){
    marks
      .style("stroke", stroke)
      .style("stroke-width", strokeWidth)
      .style("fill", fill);
  });

  return my;
}

module.exports = ScatterPlot;
