// Set the dimensions of the canvas / graph
const margin = { top: 40, right: 40, bottom: 60, left: 60 };
const width = 1100 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;

// Append the svg object to the body of the page
const svg = d3.select("#chart")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Define the tooltip
const tooltip = d3.select("#container")
  .append("div")
  .attr("id", "tooltip")
  .style("opacity", 0)
  .style("position", "absolute");

// Parse the data
d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json").then(function(data) {
  // Parse the date strings into date objects
  const parseDate = d3.timeParse("%Y-%m-%d");
  data = data.data.map(d => [parseDate(d[0]), d[1]]);

  // Define X axis
  const x = d3.scaleTime()
    .range([0, width])
    .domain(d3.extent(data, d => d[0]));
  
  // Define Y axis
  const y = d3.scaleLinear()
    .range([height, 0])
    .domain([0, d3.max(data, d => d[1])]);

  // Draw X axis
  svg.append("g")
    .attr("id", "x-axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x)
      .tickFormat(d3.timeFormat("%Y")));
    
  // Draw Y axis
  svg.append("g")
    .attr("id", "y-axis")
    .call(d3.axisLeft(y));
  
  // Add Y-axis label
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 70 - margin.left)
    .attr("x", 20 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Gross Domestic Product");

  // Calculate the width of each bar
  const barWidth = width / data.length;

  // Draw bars
  svg.selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("data-date", d => d3.timeFormat("%Y-%m-%d")(d[0]))
    .attr("data-gdp", d => d[1])
    .attr("x", d => x(d[0]))
    .attr("y", d => y(d[1]))
    .attr("width", barWidth)
    .attr("height", d => height - y(d[1]))
    .attr("fill", "dodgerblue")
    .on("mouseover", function(event, d) {
      d3.select(this).attr("fill", "white");
      tooltip.style("opacity", 0.9)
        .html(`Date: ${d3.timeFormat("%Y-%m-%d")(d[0])}<br>GDP: $${d[1]} billion`)
        .attr("data-date", d3.timeFormat("%Y-%m-%d")(d[0]))
        .style("left", x(d[0]) + 450 + "px")
        .style("top", 68 + "%")
        .style("border", "1px solid black")
        .style("background-color", "grey")
        .style("padding", "10px");
    })
    .on("mouseout", function(event, d) {
      d3.select(this).attr("fill", "dodgerblue");
      tooltip.style("opacity", 0);
    });
});