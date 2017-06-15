
var svg =  d3.select("body").append("svg"),
    margin = {top: 20, right: 80, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
svg.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom);

var parseTime = d3.timeParse("%Y%m%d");

var x = d3.scaleTime().range([0, width]),
    y = d3.scaleLinear().range([height, 0]),
    z = d3.scaleOrdinal(d3.schemeCategory10);

var line = d3.line()
    .curve(d3.curveBasis)
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.temperature); });

var data = d3.tsvParse(tsvdata, function (d, i, columns) {
	  d.date = parseTime(d.date);
	  //for (var i = 1, n = columns.length, c; i < n; ++i){
		 // c = columns[i]
		 // d[c] = +d[c];
	  //}
	  return d;
	});

  var cities = data.columns.slice(1).map(function(id) {
    return {
      id: id,
      values: data.map(function(d) {
        return {date: d.date, temperature: d[id]};
      })
    };
  });

  x.domain(d3.extent(data, function(d) { return d.date; }));

  y.domain([
    d3.min(cities, function(c) { return d3.min(c.values, function(d) { return d.temperature; }); }),
    d3.max(cities, function(c) { return d3.max(c.values, function(d) { return d.temperature; }); })
  ]);

  z.domain(cities.map(function(c) { return c.id; }));

  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y))
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("fill", "#000")
      .text("Temperature, ºF");

  var city = g.selectAll(".city")
    .data(cities)
    .enter().append("g")
      .attr("class", "city");

  city.append("path")
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke-width", "1.5px")
      .attr("d", function(d) { return line(d.values); })
      .style("stroke", function(d) { return z(d.id); });

  city.append("text")
      .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
      .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.temperature) + ")"; })
      .attr("x", 3)
      .attr("dy", "0.35em")
      .style("font", "10px sans-serif")
      .text(function(d) { return d.id; });




/*var svgOut = d3.select("svg").node().parentNode.innerHTML;
Packages.edu.buffalo.odin.scalad3.D3.outputSVG(svgOut);

var htmlOut = d3.select("html").node().parentNode.innerHTML;
Packages.edu.buffalo.odin.scalad3.D3.outputHTML(htmlOut);

var svgOut = d3.select("svg").node().parentNode.innerHTML;
Packages.edu.buffalo.odin.scalad3.D3.outputPNG(svgOut);*/

var svgOut = d3.select("svg").node().parentNode.innerHTML;
Packages.edu.buffalo.odin.scalad3.D3.outputPDF(svgOut);