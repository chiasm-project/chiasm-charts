var d3 = require("d3");
var Model = require("model-js");
var ChiasmDataset = require("chiasm-dataset");
var getColumnMetadata = ChiasmDataset.getColumnMetadata;

module.exports = function scale(my, name){

  var scaleName    = name + "Scale";
  var scaleDomain  = name + "ScaleDomain";
  var scaleRange   = name + "ScaleRange";
  var scaleType    = name + "ScaleType";
  var scaled       = name + "Scaled";

  var scalePadding = name + "ScaleRangePadding"

  var columnName     = name + "Column";
  var columnAccessor = name + "Accessor";
  var columnMetadata = name + "Metadata";

  // TODO this feels like it should be elsewhere.
  if(name === "x"){
    my.when("width", function (width){
      my[scaleRange] = [0, width];
    });
  } else if(name === "y"){
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
          my[scaleName] = myScale.domain(domain)
            .rangeBands(range, padding);
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

  my.addPublicProperty(scaleType, Model.None )

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

  my.when([scaleName, columnAccessor], function (scale, accessor){
    my[scaled] = function (d){ return scale(accessor(d)); };
  });
}
