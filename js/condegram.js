var width = 500,
      height = 500,
      start = 0,
      end = 2.25,
      numSpirals = 3
      margin = {top:50,bottom:50,left:50,right:50};

    var theta = function(r) {
      return numSpirals * Math.PI * r;
    };

    var parseTime = d3.timeParse("%m-%d-%Y");
    
    // used to assign nodes color by group
    var color = d3.scaleOrdinal(d3.schemeCategory10);

    var r = d3.min([width, height]) / 2 - 40;

    var radius = d3.scaleLinear()
      .domain([start, end])
      .range([40, r]);

    var svg = d3.select("body").append("svg")
      .attr("xmlns:xlink","http://www.w3.org/1999/xlink")
      .attr("width", width + margin.right + margin.left)
      .attr("height", height + margin.left + margin.right)
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var points = d3.range(start, end + 0.001, (end - start) / 1000);

    var spiral = d3.radialLine()
      .curve(d3.curveCardinal)
      .angle(theta)
      .radius(radius);

    var path = svg.append("path")
      .datum(points)
      .attr("id", "spiral")
      .attr("d", spiral)
      .style("fill", "none")
      .style("stroke", "steelblue");

    
    Packages.edu.buffalo.odin.scalad3.D3.parseSvg(d3.select("svg").node().parentNode.innerHTML)
    
    //var barCount = 364;
    //commented lines below are for slow, hacky javascript impl of getTotalLength and getPointatLength - we are now using better JVM impl
    /*var fudgeCalcSpiralLength = Packages.edu.buffalo.odin.scalad3.D3.getSVGPathTotalLength();//path.node().getTotalLength();
    var fudgeCalcBarWidth = (fudgeCalcSpiralLength / barCount) - 1;
    var fudgeLengthMinus = 12*fudgeCalcBarWidth; */
    var spiralLength = Packages.edu.buffalo.odin.scalad3.D3.getSVGPathTotalLength()-10;//fudgeCalcSpiralLength + fudgeLengthMinus,
        barWidth = (spiralLength / barCount) -1 ;
  
    //console.log("spiralLength: " + spiralLength);
    
    for (var i = 0; i < someData.length; i++) {
    	someData[i].date = parseTime(someData[i].date);
    }
        
    var timeScale = d3.scaleTime()
      .domain(d3.extent(someData, function(d){
    	  return d.date;
      }))
      .range([0, spiralLength]);
    
    // yScale for the bar height
    var yScale = d3.scaleLinear()
      .domain([0, d3.max(someData, function(d){
        return d.value;
      })])
      .range([0, (r / numSpirals) - 30]);

    path.node().getPointAtLength(0.0);
    
    svg.selectAll("rect")
      .data(someData)
      .enter()
      .append("rect")
      .attr("x", function(d,i){
    
    	  console.log("date: " + d.date);
    	  console.log("pos: " + timeScale(d.date));
    	  
        var linePer = timeScale(d.date),
        	posOnLine = JSON.parse(Packages.edu.buffalo.odin.scalad3.D3.getSVGPathPointAtLength(linePer+ barWidth)),//path.node().getPointAtLength(linePer+ barWidth),
            angleOnLine = JSON.parse(Packages.edu.buffalo.odin.scalad3.D3.getSVGPathPointAtLength(linePer));//path.node().getPointAtLength(linePer);
        console.log("bar: " + i);
        console.log("linePer: " + linePer);
        console.log("barWidth: " + barWidth);
        console.log("posOnLine x: " + posOnLine.x);
        console.log("posOnLine y: " + posOnLine.y);
        console.log("angleOnLine x: " + angleOnLine.x);
        console.log("angleOnLine y: " + angleOnLine.y);
        d.linePer = linePer; // % distance are on the spiral
        d.x = posOnLine.x; // x postion on the spiral
        d.y = posOnLine.y; // y position on the spiral
        
        d.a = (Math.atan2(angleOnLine.y, angleOnLine.x) * 180 / Math.PI) - 90; //angle at the spiral position

        return d.x;
      })
      .attr("y", function(d){
        return d.y;
      })
      .attr("width", function(d){
        return barWidth;
      })
      .attr("height", function(d){
        return yScale(d.value);
      })
      .style("fill", function(d){return color(d.group);})
      .style("stroke", "none")
      .attr("transform", function(d){
        return "rotate(" + d.a + "," + d.x  + "," + d.y + ")"; // rotate the bar
      });
    
    // add date labels
    var tF = d3.timeFormat("%b %Y"),
        firstInMonth = {};

    svg.selectAll("text")
      .data(someData)
      .enter()
      // only add for the first of each month  
      .filter(function(d){
        var sd = tF(d.date);
        if (!firstInMonth[sd]){
          firstInMonth[sd] = 1;
          return true;
        }
        return false;
      })
      .append("text")
      .attr("dy", 10)
      .style("text-anchor", "start")
      .style("font", "10px arial")
      .append("textPath")
      .text(function(d){
        return tF(d.date);
      })
      // place text along spiral
      .attr("xlink:href", "#spiral")
      .style("fill", "grey")
      .attr("startOffset", function(d){
        return ((d.linePer / (spiralLength/*-fudgeLengthMinus*/)) * 100) + "%";
      })


     //this is for interactivity if we are doing html output
     /*var tooltip = d3.select("body")
    .append('div')
    .attr('class', 'tooltip');

    tooltip.append('div')
    .attr('class', 'date');
    tooltip.append('div')
    .attr('class', 'value');

    svg.selectAll("rect")
    .on('mouseover', function(d) {

        tooltip.select('.date').html("Date: <b>" + d.date.toDateString() + "</b>");
        tooltip.select('.value').html("Value: <b>" + Math.round(d.value*100)/100 + "<b>");

        d3.select(this)
        .style("fill","#FFFFFF")
        .style("stroke","#000000")
        .style("stroke-width","2px");

        tooltip.style('display', 'block');
        tooltip.style('opacity',2);

    })
    .on('mousemove', function(d) {
        tooltip.style('top', (d3.event.layerY + 10) + 'px')
        .style('left', (d3.event.layerX - 25) + 'px');
    })
    .on('mouseout', function(d) {
        d3.selectAll("rect")
        .style("fill", function(d){return color(d.group);})
        .style("stroke", "none")

        tooltip.style('display', 'none');
        tooltip.style('opacity',0);
    });*/
    
    /*var svgOut = d3.select("svg").node().parentNode.innerHTML;
    Packages.edu.buffalo.odin.scalad3.D3.outputSVG(svgOut);
    
    var htmlOut = d3.select("html").node().parentNode.innerHTML;
    Packages.edu.buffalo.odin.scalad3.D3.outputHTML(htmlOut);
    
    var svgOut = d3.select("svg").node().parentNode.innerHTML;
    Packages.edu.buffalo.odin.scalad3.D3.outputPNG(svgOut);*/
    
    var svgOut = d3.select("svg").node().parentNode.innerHTML;
    Packages.edu.buffalo.odin.scalad3.D3.outputPDF(svgOut);