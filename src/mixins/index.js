var d3 = require("d3");
var Model = require("model-js");
var ChiasmDataset = require("chiasm-dataset");
var getColumnMetadata = ChiasmDataset.getColumnMetadata;

// TODO split up this file.
// TODO migrate to ES6 modules & Rollup.

function marginConvention(my, svg){
  var g = svg.append("g");

  // TODO maybe the margin would be better suited as 4 separate properties?
  // margin-top
  // margin-bottom
  // margin-left
  // margin-right
  my.addPublicProperty("margin", {top: 20, right: 20, bottom: 50, left: 60});

  my.when(["box", "margin"], function (box, margin){
    my.width = box.width - margin.left - margin.right;
    my.height = box.height - margin.top - margin.bottom;
    g.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  });

  return g;
}

function marginEditor(my, svg){

  // The width of the handles.
  my.addPublicProperty("marginEditorWidth", 15);

  // The color of the handles on hover.
  my.addPublicProperty("marginEditorFill", "rgba(0, 0, 0, 0.2)");

  var data = [ "left", "right", "top", "bottom" ];

  var handles = svg.selectAll(".margin-handle").data(data);
  handles.enter().append("rect")
    .attr("class", "margin-handle")
    .style("fill", "none")
    .style("pointer-events", "all")

  var drag = d3.behavior.drag().on("drag", function (d) {

    // Mutate the margin object.
    my.margin[d] = {
      left:    d3.event.x,
      right:  -d3.event.x,
      top:     d3.event.y,
      bottom: -d3.event.y,
    }[d];

    // Notify model-js that the margin object has been mutated.
    my.margin = my.margin;

    // Hide the handles during drag.
    handles.style("fill", "none");
  });

  handles.call(drag);

  // Fill in the handles on hover.
  my.when("marginEditorFill", function (marginEditorFill){
    handles
      .on("mouseenter", function (){
        d3.select(this).style("fill", marginEditorFill);
      })
      .on("mouseout", function (){
        d3.select(this).style("fill", "none");
      });
  });

  // Update the drag origin function based on the margin.
  my.when("margin", function (margin){
    var origins = {
      left:   { x: margin.left,   y: 0 },
      right:  { x: -margin.right, y: 0 },
      top:    { x: 0,             y: margin.top },
      bottom: { x: 0,             y: -margin.bottom },
    };
    drag.origin(function(d) {
      return origins[d];
    });
  });

  // Render the handles
  my.when(["margin", "marginEditorWidth", "width", "height"],
      function (margin, marginEditorWidth, width, height){

    var x = {
      left:   margin.left         - marginEditorWidth / 2,
      right:  margin.left + width - marginEditorWidth / 2,
      top:    margin.left,
      bottom: margin.left
    };

    var y = {
      left:   margin.top,
      right:  margin.top,
      top:    margin.top          - marginEditorWidth / 2,
      bottom: margin.top + height - marginEditorWidth / 2
    };

    var w = {
      left:   marginEditorWidth,
      right:  marginEditorWidth,
      top:    width,
      bottom: width
    };

    var h = {
      left:   height,
      right:  height,
      top:    marginEditorWidth,
      bottom: marginEditorWidth
    };

    var cursor = {
      left:   "ew-resize",
      right:  "ew-resize",
      top:    "ns-resize",
      bottom: "ns-resize"
    };

    handles
      .attr("x",       function (d){ return x[d]; })
      .attr("y",       function (d){ return y[d]; })
      .attr("width",   function (d){ return w[d]; })
      .attr("height",  function (d){ return h[d]; })
      .style("cursor", function (d){ return cursor[d]; })

      // Rounded corners.
      .attr("rx", function (d){ return marginEditorWidth / 2; })
      .attr("ry", function (d){ return marginEditorWidth / 2; });

  });
}

function scale(my, prefix, initialScaleType){

  var scaleName    = prefix + "Scale";
  var scaleDomain  = prefix + "ScaleDomain";
  var scaleRange   = prefix + "ScaleRange";
  var scalePadding = prefix + "ScaleRangePadding"
  var scaleType    = prefix + "ScaleType";

  var columnName     = prefix + "Column";
  var columnAccessor = prefix + "Accessor";
  var scaled         = prefix + "Scaled";
  var columnMetadata = prefix + "Metadata";

  my.addPublicProperty(columnName, Model.None);

  // TODO this feels like it should be elsewhere.
  if(prefix === "x"){
    my.when("width", function (width){
      my[scaleRange] = [0, width];
    });
  } else if(prefix === "y"){
    my.when("height", function (height){
      my[scaleRange] = [height, 0];
    });
  }

  var scaleTypes = {
    linear: function (my){
      var myScale = d3.scale.linear();
      return my.when([scaleDomain, scaleRange], function (domain, range){
        if(domain !== Model.None && range !== Model.None){
          my[scaleName] = myScale.domain(domain).range(range);
        }
      });
    },
    ordinal: function (my){
      var myScale = d3.scale.ordinal();
      return my.when([scaleDomain, scaleRange, scalePadding], function (domain, range, padding){
        if(domain !== Model.None && range !== Model.None){

          // TODO what about rangePoints?
          my[scaleName] = myScale.domain(domain).rangeBands(range, padding);
        }
      });
    },
    time: function (my){
      var myScale = d3.time.scale();
      return my.when([scaleDomain, scaleRange], function (domain, range){
        if(domain !== Model.None && range !== Model.None){
          my[scaleName] = myScale.domain(domain).range(range);
        }
      });
    }
  };

  my.addPublicProperty(scaleDomain, Model.None);
  my.addPublicProperty(scaleType, initialScaleType ? initialScaleType : Model.None )

  // This property is relevant only for ordinal scales.
  my.addPublicProperty(scalePadding, 0.1);

  var oldListener;
  my.when(scaleType, function (type){

    if(type !== Model.None){

      // TODO add tests for this line.
      if(oldListener){ my.cancel(oldListener); }

      oldListener = scaleTypes[type](my);
    }
  });

  my.when(columnName, function (column){
    my[columnAccessor] = function (d){ return d[column]; };
  });

  my.when([scaleName, columnName], function (scale, column){
    my[scaled] = function (d){ return scale(d[column]); };
  });
  
  my.when(["dataset", columnName], function (dataset, column){
    if(column !== Model.None){
      my[columnMetadata] = getColumnMetadata(dataset, column);
    }
  });

}


// TODO figure out what this really is about.
// The name autoScaleType does not really express what it does.
// It really is more the thing that isolates the difference between
// a bar chart and a histogram.
// This is used in the histogram and heatmap visualizations.
// It has to do with "rangeBands" vs. "rangePoints" too.
function autoScaleType(my, prefix){

  // TODO move these into functions, eliminate duplicate code.
  var columnName = prefix + "Column";
  var columnAccessor = prefix + "Accessor";
  var scaleDomain  = prefix + "ScaleDomain";
  var scaleType = prefix + "ScaleType";
  var columnAccessor = prefix + "Accessor";
  var columnMetadata = prefix + "Metadata";

  my.when(["dataset", columnMetadata, columnAccessor], function (dataset, meta, accessor){
    if(meta.interval){

      // TODO use symbols, e.g. ChiasmDataset.NUMBER rather than strings.
      // TODO use ES6 modules, where symbols make more sense.
      var columnIsNumber = (meta.type === "number");
      var columnIsDate = (meta.type === "date");

      if(columnIsNumber){

        // Histogram bins.
        my[scaleType] = "linear";
        my[scaleDomain] = d3.extent(dataset.data, accessor);
        my[scaleDomain][1] += meta.interval;

      } else if(columnIsDate){

        // TODO support time intervals.
      }

    } else {

      // Typical ordinal bars.
      my[scaleType] = "ordinal";
      my[scaleDomain] = dataset.data.map(accessor);
    }
  });
}

function rangeBands(my, prefix){

  // TODO make these into functions, reduce duplicate code.
  var scaleName = prefix + "Scale";
  var columnMetadata = prefix + "Metadata";
  var rangeBand = prefix + "RangeBand";

  my.when([columnMetadata, scaleName], function (metadata, scale) {
    if(metadata.interval){

      // Histogram bins.
      my[rangeBand] = Math.abs( scale(metadata.interval) - scale(0) );
    } else {

      // Typical ordinal bars.
      my[rangeBand] = scale.rangeBand();
    }
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
  marginEditor: marginEditor,
  scale: scale,
  autoScaleType: autoScaleType,
  rangeBands: rangeBands,
  xAxis: xAxis,
  xAxisLabel: xAxisLabel,
  yAxis: yAxis,
  yAxisLabel: yAxisLabel
};
