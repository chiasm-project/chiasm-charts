var d3 = require("d3");

function marginConvention(my, svg){
  var g = svg.append("g");

  my.addPublicProperty("margin", {top: 20, right: 20, bottom: 50, left: 60});

  my.when(["box", "margin"], function (box, margin){
    my.width = box.width - margin.left - margin.right;
    my.height = box.height - margin.top - margin.bottom;
    g.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  });

  return g;
}

function xScale(my){
  var scaleTypes = {
    linear: function (my){
      var scale = d3.scale.linear();
      return my.when(["xScaleDomain", "width"], function (xScaleDomain, width){
        my.xScale = scale.domain(xScaleDomain).range([0, width]);
      });
    },
    ordinal: function (my){
      var scale = d3.scale.ordinal();
      return my.when(["xScaleDomain", "width", "xScaleRangePadding"], function (xScaleDomain, width, xScaleRangePadding){
        my.xScale = scale.domain(xScaleDomain).rangeBands([0, width], xScaleRangePadding);
      });
    },
    time: function (my){
      var scale = d3.time.scale();
      return my.when(["xScaleDomain", "width"], function (xScaleDomain, width){
        my.xScale = scale.domain(xScaleDomain).range([0, width]);
      });
    }
  };

  my.addPublicProperty("xScaleDomain", [0, 1000]);
  my.addPublicProperty("xScaleType", "linear");

  // This property is relevant only for ordinal scales.
  my.addPublicProperty("xScaleRangePadding", 0.1);

  var oldListener;
  my.when("xScaleType", function (scaleType){

    // TODO add tests for this line.
    if(oldListener){ my.cancel(oldListener); }

    oldListener = scaleTypes[scaleType](my);
  });
}


function xScaleLinear(my){
  xScale(my);
  my.xScaleType = "linear";
}

function xScaleOrdinal(my){
  xScale(my);
  my.xScaleType = "ordinal";
}

function xScaleTime(my){
  xScale(my);
  my.xScaleType = "time";
}

function yScaleLinear(my){
  var scale = d3.scale.linear();
  my.addPublicProperty("yScaleDomain", [0, 1000]);
  my.when(["yScaleDomain", "height"], function (yScaleDomain, height){
    my.yScale = scale.domain(yScaleDomain).range([height, 0]);
  });
}

function xAxis(my, g){
  var axisG = g.append("g").attr("class", "x axis");
  var axis = d3.svg.axis();

  my.addPublicProperty("xAxisTickDensity", 70);

  my.when(["xScale", "xAxisTickDensity", "width"], function (xScale, xAxisTickDensity, width){
    axis.scale(xScale).ticks(width / xAxisTickDensity)
    axisG.call(axis);
  });

  my.when("height", function (height){
    axisG.attr("transform", "translate(0," + height + ")");
  });

  return axisG;
}

function yAxis(my, g){
  var axisG = g.append("g").attr("class", "y axis");
  var axis = d3.svg.axis().orient("left");

  my.addPublicProperty("yAxisTickDensity", 30);

  my.when(["yScale", "yAxisTickDensity", "height"], function (yScale, yAxisTickDensity, height){
    axis.scale(yScale).ticks(height / yAxisTickDensity)
    axisG.call(axis);
  });

  return axisG;
}

function xAxisLabel(my, xAxisG){
  var label = xAxisG.append("text").attr("class", "x axis-label");
  my.addPublicProperty("xAxisLabelText", "X Axis Label");
  my.addPublicProperty("xAxisLabelTextOffset", 43);

  my.when("xAxisLabelText", function (xAxisLabelText){
    label.text(xAxisLabelText);
  });

  my.when("xAxisLabelTextOffset", function (xAxisLabelTextOffset){
    label.attr("y", xAxisLabelTextOffset);
  });

  my.when("width", function (width){
    label.attr("x", width / 2);
  });
}

function yAxisLabel(my, yAxisG){
  var label = yAxisG.append("text").attr("class", "y axis-label");
  my.addPublicProperty("yAxisLabelText", "Y Axis Label");
  my.addPublicProperty("yAxisLabelTextOffset", 35);

  my.when("yAxisLabelText", function (yAxisLabelText){
    label.text(yAxisLabelText);
  });

  my.when(["yAxisLabelTextOffset", "height"], function (offset, height){
    label.attr("transform", "translate(-" + offset + "," + (height / 2) + ") rotate(-90)")
  });
}

module.exports = {
  marginConvention: marginConvention,
  xScaleLinear: xScaleLinear,
  xScaleOrdinal: xScaleOrdinal,
  xScaleTime: xScaleTime,
  yScaleLinear: yScaleLinear,
  xAxis: xAxis,
  xAxisLabel: xAxisLabel,
  yAxis: yAxis,
  yAxisLabel: yAxisLabel
};
