// d3.select("body").style("background-color", "#cce2e1");

// var xData = [1,2,3,4,5,6,7,8,9];
// var yData = [0.2,1.9,1.8,5.1,5.7,5,6.9,8.9,13];

var dataset = [
  [1, 0.2],
  [2, 1.9],
  [3, 1.8],
  [4, 5.1],
  [5, 5.7],
  [6, 5],
  [7, 6.9],
  [8, 8.9],
  [9, 13]
];

var w = window.innerWidth / 2.5;
var h = Math.min(w, window.innerHeight);
var margin,
    xScale,
    yScale,
    svg,
    tooltip,
    xAxis,
    yAxis,
    xSeries,
    ySeries,
    leastSquaresCoeff,
    x1,
    x2,
    y1,
    y2,
    trendData,
    trendLine;


window.onload = genScatterPlot;
window.onresize = getDimensions;

function getDimensions(){
    w = window.innerWidth / 2.5;
    h = Math.min(w, window.innerHeight);;
    xScale.range = [0, w];
    yScale.range = [0, h];
    removePlot();
    genScatterPlot();
}

function genScatterPlot() {
  margin = { top: 30, right: 30, bottom: 50, left: 50 };

  xScale = d3.scaleLinear()
              .domain([0, d3.max(dataset, function(d) { return d[0]; })])
                       .range([0, w]);
  yScale = d3.scaleLinear()
              .domain([0, d3.max(dataset, function(d) { return d[1]; })])
              .range([h, 0]);

  svg = d3.select("body")
              .append("svg")
              .attr("width", w + margin.left + margin.right)
              .attr("height", h + margin.top + margin.bottom)
              .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  svg.append("g")
      .attr("transform", "translate(0," + h + ")")
      .call(d3.axisBottom(xScale)
            /*.ticks(0)
            .tickSize(0)*/);
  svg.append("text")
      .attr("transform", "translate(" + (w / 2) + "," + (h + 40) + ")")
      .text("x axis label");
  svg.append("g")
      .call(d3.axisLeft(yScale)
              /*.ticks(0)
              .tickSize(0)*/);
  svg.append("text")
      .attr("transform", "translate(" + (-40) + "," + (h / 2) + ")rotate(-90)")
      .text("y axis label");

  tooltip = d3.select("body")
              .append("div")
              .style("position", "absolute")
              .style("padding", "3px 8px")
              .style("background", "blue")
              .style("color", "white")
              .style("opacity", 0);

  svg.selectAll("circle")
      .data(dataset)
      .enter()
      .append("circle")
      .attr("cx", function(d) {
        return xScale(d[0]);
      })
      .attr("cy", function(d) {
        return yScale(d[1]);
      })
      .attr("r", 3)
      .on("mouseover", function(d) {
        tooltip.transition().duration(200)
              .style("opacity", 0.9);
        tooltip.html('<div style="font-size:12px; font-family:' + "'Open Sans'" + ', sans-serif">' + '(' + d[0] + ', ' + d[1] + ')</div>')
            .style("left", (d3.event.pageX - 35) + 'px')
            .style("top", (d3.event.pageY - 35) + 'px')
      })
      .on("mouseout", function(d) {
        tooltip.transition().duration(200)
               .style("opacity", 0);
      });

  xSeries = dataset.map(function(d) {
    return d[0];
  });
  ySeries = dataset.map(function(d) {
    return d[1]
  });
  leastSquaresCoeff = leastSquares(xSeries, ySeries);
  x1 = xSeries[0];
  y1 = leastSquaresCoeff[0] + leastSquaresCoeff[1];
  x2 = xSeries[xSeries.length - 1];
  y2 = leastSquaresCoeff[0] * xSeries.length + leastSquaresCoeff[1];
  trendData = [[x1,y1,x2,y2]];
  trendline = svg.selectAll(".trendline")
    			.data(dataset);

  trendline.enter()
    			.append("line")
    			.attr("class", "trendline")
    			.attr("x1", function() { return xScale(x1); })
    			.attr("y1", function() { return yScale(y1); })
    			.attr("x2", function() { return xScale(x2); })
    			.attr("y2", function() { return yScale(y2); })
    			.attr("stroke", "black")
    			.attr("stroke-width", 1);
}

function removePlot() {
  d3.select("svg").remove();
}

function leastSquares(xSeries, ySeries) {
  var reduceSumFunc = function(prev, cur) { return prev + cur; };

	var xBar = xSeries.reduce(reduceSumFunc) * 1.0 / xSeries.length;
	var yBar = ySeries.reduce(reduceSumFunc) * 1.0 / ySeries.length;

	var ssXX = xSeries.map(function(d) { return Math.pow(d - xBar, 2); })
		.reduce(reduceSumFunc);

	var ssYY = ySeries.map(function(d) { return Math.pow(d - yBar, 2); })
		.reduce(reduceSumFunc);

	var ssXY = xSeries.map(function(d, i) { return (d - xBar) * (ySeries[i] - yBar); })
		.reduce(reduceSumFunc);

	var slope = ssXY / ssXX;
	var intercept = yBar - (xBar * slope);
	var rSquare = Math.pow(ssXY, 2) / (ssXX * ssYY);

	return [slope, intercept, rSquare];
}
