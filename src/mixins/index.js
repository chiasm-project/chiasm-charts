var d3 = require("d3");
var Model = require("model-js");
var ChiasmDataset = require("chiasm-dataset");
var getColumnMetadata = ChiasmDataset.getColumnMetadata;


// TODO figure out what this really is about.
// The name autoScaleType does not really express what it does.
// It really is more the thing that isolates the difference between
// a bar chart and a histogram.
// This is used in the histogram and heatmap visualizations.
// It has to do with "rangeBands" vs. "rangePoints" too.
function autoScaleType(my, name, ordinalRangeType){

  ordinalRangeType = ordinalRangeType ? ordinalRangeType : "Points";

  // TODO move these into functions, eliminate duplicate code.
  var columnName     = name + "Column";
  var columnAccessor = name + "Accessor";
  var scaleDomain    = name + "ScaleDomain";
  var scaleType      = name + "ScaleType";
  var columnAccessor = name + "Accessor";
  var columnMetadata = name + "Metadata";

  my.when(["dataset", columnMetadata, columnAccessor], function (dataset, meta, accessor){
    if(meta.interval){

      if(meta.type === "number"){

        // Histogram bins.
        my[scaleType] = "linear";

        // TODO split out domain concerns.
        my[scaleDomain] = d3.extent(dataset.data, accessor);

        // This line only makes sense for rangeBands.
        // This should not be here for rangePoints.
        my[scaleDomain][1] += meta.interval;
      //my[rangeBand] = Math.abs( scale(metadata.interval) - scale(0) );

      } else if(meta.type === "date"){
        // Temporal bins.
        my[scaleType] = "time";

        // TODO support time intervals.
      }

    } else {

      if(meta.type === "number"){
        my[scaleType] = "linear";

        // TODO split out domain concerns.
        my[scaleDomain] = d3.extent(dataset.data, accessor);
      } else if(meta.type === "string"){

        // Typical ordinal bars.
        my[scaleType] = "ordinal" + ordinalRangeType;
        my[scaleDomain] = dataset.data.map(accessor);

      } else if(meta.type === "date"){
        my[scaleType] = "time";

        // TODO split out domain concerns.
        my[scaleDomain] = d3.extent(dataset.data, accessor);
      }
    }
  });

  var rangeBand = name + "RangeBand";
  var scaleName = name + "Scale";

  if(ordinalRangeType === "Bands"){
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
}

module.exports = {
  marginConvention: require("./marginConvention"),
  marginEditor: require("./marginEditor"),
  column: require("./column"),
  scale: require("./scale"),
  scaleRange: require("./scaleRange"),
  autoScaleType: autoScaleType,
  xAxis: require("./xAxis"),
  yAxis: require("./yAxis"),
  xAxisLabel: require("./xAxisLabel"),
  yAxisLabel: require("./yAxisLabel")
};
