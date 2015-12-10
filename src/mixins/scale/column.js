var Model = require("model-js");
var getColumnMetadata = require("chiasm-dataset").getColumnMetadata;

module.exports = function column(my, name){

  var columnName     = name + "Column";
  var columnAccessor = name + "Accessor";
  var columnMetadata = name + "Metadata";

  my.addPublicProperty(columnName, Model.None);

  my.when(columnName, function (column){
    my[columnAccessor] = function (d){ return d[column]; };
  });

  my.when(["dataset", columnName], function (dataset, column){
    if(column !== Model.None){
      my[columnMetadata] = getColumnMetadata(dataset, column);
    }
  });
}
