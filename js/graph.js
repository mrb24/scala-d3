
 
/*var data = [
	{ letter:'A', frequency:'.08167' },
	{ letter:'B', frequency:'.01492' },
	{ letter:'C', frequency:'.02780' },
	{ letter:'D', frequency:'.04253' },
	{ letter:'E', frequency:'.12702' },
	{ letter:'F', frequency:'.02288' },
	{ letter:'G', frequency:'.02022' },
	{ letter:'H', frequency:'.06094' },
	{ letter:'I', frequency:'.06973' },
	{ letter:'J', frequency:'.00153' },
	{ letter:'K', frequency:'.00747' },
	{ letter:'L', frequency:'.04025' },
	{ letter:'M', frequency:'.02517' },
	{ letter:'N', frequency:'.06749' },
	{ letter:'O', frequency:'.07507' },
	{ letter:'P', frequency:'.01929' },
	{ letter:'Q', frequency:'.00098' },
	{ letter:'R', frequency:'.05987' },
	{ letter:'S', frequency:'.06333' },
	{ letter:'T', frequency:'.09056' },
	{ letter:'U', frequency:'.02758' },
	{ letter:'V', frequency:'.01037' },
	{ letter:'W', frequency:'.02465' },
	{ letter:'X', frequency:'.00150' },
	{ letter:'Y', frequency:'.01971' },
	{ letter:'Z', frequency:'.00074' }
];*/


var data = scdata;//JSON.parse(scdata);

//addcss('body{font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;position:relative;width:960px}.axis text{font:10px sans-serif}.axis line,.axis path{fill:none;stroke:#000;shape-rendering:crispEdges}.bar{fill:#4682b4;fill-opacity:.9}.x.axis path{display:none}label{position:absolute;top:10px;right:10px}');

var margin = {top: 20, right: 20, bottom: 30, left: 40},
width = 960 - margin.left - margin.right,
height = 500 - margin.top - margin.bottom;


var formatPercent = d3.format(".0%");

var x = d3.scaleBand()
.range([0, width], .1, 1);

var y = d3.scaleLinear()
.range([height, 0]);

var xAxis = d3.axisBottom(x);

var yAxis = d3.axisLeft(y)
.tickFormat(formatPercent);

var svg = d3.select("body").append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  data.forEach(function(d) {
    d.frequency = +d.frequency;
  });

  x.domain(data.map(function(d) { return d.letter; }));
  y.domain([0, d3.max(data, function(d) { return d.frequency; })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Frequency");

  svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.letter) +2; })
      .attr("width", x.bandwidth()-2)
      .attr("y", function(d) { return y(d.frequency); })
      .attr("height", function(d) { return height - y(d.frequency); })
      .attr("fill","steelblue");

  //d3.select("input").on("change", change);

  //var sortTimeout = setTimeout(function() {
    d3.select("input").property("checked", true).each(change);
  //}, 2000);*/

  function change() {
    //clearTimeout(sortTimeout);

    // Copy-on-write since tweens are evaluated after a delay.
    var x0 = x.domain(data.sort(this.checked
        ? function(a, b) { return b.frequency - a.frequency; }
        : function(a, b) { return d3.ascending(a.letter, b.letter); })
        .map(function(d) { return d.letter; }))
        .copy();

    svg.selectAll(".bar")
        .sort(function(a, b) { return x0(a.letter) - x0(b.letter); });

    var transition = svg.transition().duration(750),
        delay = function(d, i) { return i * 50; };

    transition.selectAll(".bar")
        .delay(delay)
        .attr("x", function(d) { return x0(d.letter); });

    transition.select(".x.axis")
        .call(xAxis)
      .selectAll("g")
        .delay(delay);
  }

  /*var svgOut = d3.select("svg").node().parentNode.innerHTML;
  Packages.edu.buffalo.odin.scalad3.D3.outputSVG(svgOut);
  
  var htmlOut = d3.select("svg").node().parentNode.innerHTML;
  Packages.edu.buffalo.odin.scalad3.D3.outputHTML(htmlOut);
  
  var svgOut = d3.select("svg").node().parentNode.innerHTML;
  Packages.edu.buffalo.odin.scalad3.D3.outputPNG(svgOut);*/
  
  var svgOut = d3.select("svg").node().parentNode.innerHTML;
  Packages.edu.buffalo.odin.scalad3.D3.outputPDF(svgOut);

