
var data = scdata;

var svg =  d3.select("body").append("svg"),
	margin = {top: 20, right: 20, bottom: 30, left: 40},
	width = 960 - margin.left - margin.right,
	height = 500 - margin.top - margin.bottom;

svg.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom);

var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
    y = d3.scaleLinear().rangeRound([height, 0]);

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  
  x.domain(data.map(function(d) { return d.letter; }));
  y.domain([0, d3.max(data, function(d) { return d.frequency; })]);

  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y).ticks(10, "%"))
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Frequency");

  g.selectAll(".bar")
    .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.letter); })
      .attr("y", function(d) { return y(d.frequency); })
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return height - y(d.frequency); })
      .attr("fill","steelblue");
  		
  
  /*var svgOut = d3.select("svg").node().parentNode.innerHTML;
  Packages.edu.buffalo.odin.scalad3.D3.outputSVG(svgOut);
  
  var htmlOut = d3.select("svg").node().parentNode.innerHTML;
  Packages.edu.buffalo.odin.scalad3.D3.outputHTML(htmlOut);
  
  var svgOut = d3.select("svg").node().parentNode.innerHTML;
  Packages.edu.buffalo.odin.scalad3.D3.outputPNG(svgOut);*/
  
  var svgOut = d3.select("svg").node().parentNode.innerHTML;
  Packages.edu.buffalo.odin.scalad3.D3.outputPDF(svgOut);