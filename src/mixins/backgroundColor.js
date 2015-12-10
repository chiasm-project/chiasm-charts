module.exports = function backgroundColor(my, svg){
  var rect = svg.append("rect");

  my.addPublicProperty("backgroundColor", "white");

  my.when("backgroundColor", function (color){
    rect.attr("fill", color);
  });

  my.when("box", function (box) {
    rect
      .attr("width", box.width)
      .attr("height", box.height);
  });
}
