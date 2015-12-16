var d3 = require("d3");

module.exports = function xAxis(my, g){
  var axisG = g.append("g").attr("class", "x axis");
  var axis = d3.svg.axis();

  my.addPublicProperty("xAxisTickDensity", 70);
  my.addPublicProperty("xAxisTickAngle", 0);

  my.when(["xScale", "xAxisTickDensity", "xAxisTickAngle", "width"], function (xScale, xAxisTickDensity, xAxisTickAngle, width){
    axis.scale(xScale).ticks(width / xAxisTickDensity)
    axisG.call(axis);

    var text = axisG.selectAll("text")  
      .attr("transform", "rotate(-" + xAxisTickAngle + ")" );

    if(xAxisTickAngle > 45){
      // TODO try to find a way to have this non-hard-coded
      text
        .attr("dx", "-0.9em")
        .attr("dy", "-0.6em")
        .style("text-anchor", "end");
    } else {
      text
        .attr("dx", "0em")
        //.attr("dy", "0em")
        //.style("text-anchor", "middle");
    }

    // Make labels vertical on click.
    // TODO add drag interaction here for continuous editing.
    text.on("click", function (){
      if(my.xAxisTickAngle === 0){
        my.xAxisTickAngle = 90;
      } else {
        my.xAxisTickAngle = 0;
      }
    });
  });

  my.when("height", function (height){
    axisG.attr("transform", "translate(0," + height + ")");
  });

  return axisG;
}
