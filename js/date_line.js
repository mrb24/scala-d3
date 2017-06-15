var svg =  d3.select("body").append("svg"),
    margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
svg.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom);

var parseTime = d3.timeParse("%d-%b-%y");

var x = d3.scaleTime()
    .rangeRound([0, width]);

var y = d3.scaleLinear()
    .rangeRound([height, 0]);

var line = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.close); });


var data = d3.tsvParse(tsvdata, function(d, i, columns) {
	d.date = parseTime(d.date);
	d.close = +d.close;
	return d;
}); 


  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain(d3.extent(data, function(d) { return d.close; }));

  g.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
    .select(".domain")
      .remove();

  g.append("g")
      .call(d3.axisLeft(y))
    .append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Price ($)");

  g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5)
      .attr("d", line);

  /*var svgOut = d3.select("svg").node().parentNode.innerHTML;
  Packages.edu.buffalo.odin.scalad3.D3.outputSVG(svgOut);
  
  var htmlOut = d3.select("html").node().parentNode.innerHTML;
  Packages.edu.buffalo.odin.scalad3.D3.outputHTML(htmlOut);
  
  var svgOut = d3.select("svg").node().parentNode.innerHTML;
  Packages.edu.buffalo.odin.scalad3.D3.outputPNG(svgOut);*/
  
  var svgOut = d3.select("svg").node().parentNode.innerHTML;
  Packages.edu.buffalo.odin.scalad3.D3.outputPDF(svgOut);