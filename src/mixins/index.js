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

      if(meta.type === "number"){

        // Histogram bins.
        my[scaleType] = "linear";
        my[scaleDomain] = d3.extent(dataset.data, accessor);
        my[scaleDomain][1] += meta.interval;

      } else if(meta.type === "date"){
        // TODO support time intervals.
      }

    } else {

      if(meta.type === "number"){
        my[scaleType] = "linear";
      } else if(meta.type === "string"){

        // Typical ordinal bars.
        my[scaleType] = "ordinal";
        my[scaleDomain] = dataset.data.map(accessor);

      } else if(meta.type === "date"){
        // TODO support time intervals.
      }

    }
  });
}

function rangeBands(my, prefix){

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

module.exports = {
  marginConvention: require("./marginConvention"),
  marginEditor: require("./marginEditor"),
  column: require("./column"),
  scale: require("./scale"),
  autoScaleType: autoScaleType,
  rangeBands: rangeBands,
  xAxis: require("./xAxis"),
  yAxis: require("./yAxis"),
  xAxisLabel: require("./xAxisLabel"),
  yAxisLabel: require("./yAxisLabel")
};
