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
var h = window.innerWidth / 2.5;

var xScale = d3.scaleLinear()
                     .domain([0, d3.max(dataset, function(d) { return d[0]; })])
                     .range([0, w]);
var yScale = d3.scaleLinear()
                     .domain([0, d3.max(dataset, function(d) { return d[1]; })])
                     .range([0, h]);
var svg = d3.select("body")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

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
