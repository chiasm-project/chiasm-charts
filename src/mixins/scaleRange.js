// These are rules that are specific to well-known column names.
var ranges = {
  x: function (my, scaleRange){
    my.when("width", function (width){
      my[scaleRange] = [0, width];
    });
  },
  y: function (my, scaleRange){
    my.when("height", function (height){
      my[scaleRange] = [height, 0];
    });
  }
};

module.exports = function scaleRange(my, name){
  ranges[name](my, name + "ScaleRange");
}
