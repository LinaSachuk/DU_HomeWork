// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 50,
  right: 50,
  bottom: 100,
  left: 100,
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select('#scatter')
  .append('svg')
  .attr('width', svgWidth)
  .attr('height', svgHeight);

var chartGroup = svg
  .append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`);
console.log('I am here!');

// Initial Params
var chosenXAxis = 'poverty';
var chosenYAxis = 'healthcare';
var radius = 20;

// function used for updating x-scale var upon click on axis label
function xScale(data, chosenXAxis) {
  // create scales
  var xLinearScale = d3
    .scaleLinear()
    .domain([
      d3.min(data, (d) => d[chosenXAxis]) * 0.8,
      d3.max(data, (d) => d[chosenXAxis]) * 1.2,
    ])
    .range([0, width]);

  return xLinearScale;
}

//// function used for updating y-scale var upon click on axis label
function yScale(data, chosenYAxis) {
  // create scales
  var yLinearScale = d3
    .scaleLinear()
    .domain([
      d3.min(data, (d) => d[chosenYAxis]) * 0.8 - 1,
      d3.max(data, (d) => d[chosenYAxis]) * 1.2,
    ])
    .range([height, 0]);

  return yLinearScale;
}

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition().duration(1000).call(bottomAxis);

  return xAxis;
}

// function used for updating yAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition().duration(1000).call(leftAxis);

  return yAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis) {
  circlesGroup
    .transition()
    .duration(1000)
    .attr('cx', (d) => newXScale(d[chosenXAxis]));

  return circlesGroup;
}

// function used for updating circles group with a transition to
// new circles
function renderYCircles(circlesGroup, newYScale, chosenYAxis) {
  circlesGroup
    .transition()
    .duration(1000)
    .attr('cy', (d) => newYScale(d[chosenYAxis]));

  return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
  var labelX;
  var labelXX;
  var labelXXX;

  var labelY;

  if (chosenXAxis === 'poverty') {
    labelX = 'poverty';
    labelXX = '%';
    labelXXX = '';
  } else if (chosenXAxis === 'age') {
    labelX = 'age';
    labelXX = '';
    labelXXX = '';
  } else {
    labelX = 'income';
    labelXX = '';
    labelXXX = '$';
  }

  if (chosenYAxis === 'healthcare') {
    labelY = 'healthcare';
  } else if (chosenYAxis === 'smokes') {
    labelY = 'smokes';
  } else {
    labelY = 'obesity';
  }

  var toolTip = d3
    .tip()
    .attr('class', 'd3-tip')
    .offset([80, -60])
    .html(function (d) {
      return `${d.state}<br>${labelX}: ${labelXXX} ${d[chosenXAxis]}${labelXX}<br>${labelY}: ${d[chosenYAxis]}%`;
    });

  circlesGroup.call(toolTip);

  circlesGroup
    .on('mouseover', function (data) {
      toolTip.show(data);
    })
    // onmouseout event
    .on('mouseout', function (data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}

// Retrieve data from the CSV file and execute everything below
d3.csv('assets/data/data.csv')
  .then(function (data, err) {
    console.log('data:', data);
    if (err) throw err;

    // parse data
    data.forEach(function (d) {
      // d.state = d.state;
      // d.abbr = d.abbr;
      d.poverty = +d.poverty;
      d.age = +d.age;
      d.income = +d.income;
      d.healthcare = +d.healthcare;
      //   console.log('d.healthcare:', d.healthcare);
      d.obesity = +d.obesity;
      d.smokes = +d.smokes;
    });

    // xLinearScale function above csv import
    var xLinearScale = xScale(data, chosenXAxis);
    var yLinearScale = yScale(data, chosenYAxis);

    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append x axis
    var xAxis = chartGroup
      .append('g')
      .classed('x-axis', true)
      .attr('transform', `translate(0, ${height})`)
      .call(bottomAxis);

    // append y axis
    var yAxis = chartGroup.append('g').call(leftAxis);
    // append initial circles
    var circlesGroup = chartGroup
      .selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', (d) => xLinearScale(d[chosenXAxis]))
      .attr('cy', (d) => yLinearScale(d[chosenYAxis]))
      .attr('r', radius)
      .attr('class', function (d) {
        return 'stateCircle ' + d.abbr;
      })
      .attr('opacity', '.5');

    // Create group for  2 x- axis labels
    var labelsGroup = chartGroup
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height + 20})`);

    var povertyLabel = labelsGroup
      .append('text')
      .attr('x', 0)
      .attr('y', 20)
      .attr('value', 'poverty') // value to grab for event listener
      .classed('active', true)
      .text('In Poverty (%)');

    var ageLabel = labelsGroup
      .append('text')
      .attr('x', 0)
      .attr('y', 40)
      .attr('value', 'age') // value to grab for event listener
      .classed('inactive', true)
      .text('Age (Median)');

    var incomeLabel = labelsGroup
      .append('text')
      .attr('x', 0)
      .attr('y', 60)
      .attr('value', 'income') // value to grab for event listener
      .classed('inactive', true)
      .text('Household Income (Median)');

    // append y axis

    var healthcareYLabel = chartGroup
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - height / 2)
      .attr('value', 'healthcare') // value to grab for event listener
      .attr('dy', '4em')
      .classed('y-axis-text', true)
      .classed('active', true)
      .text('Lacks Healthcare (%)');

    var smokesYLabel = chartGroup
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - height / 2)
      .attr('value', 'smokes') // value to grab for event listener
      .attr('dy', '2.5em')
      .classed('y-axis-text', true)
      .classed('inactive', true)
      .text('Smokes (%)');

    var obesityYLabel = chartGroup
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - height / 2)
      .attr('value', 'obesity') // value to grab for event listener
      .attr('dy', '1em')
      .classed('y-axis-text', true)
      .classed('inactive', true)
      .text('Obese (%)');

    // updateToolTip function above csv import
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

    // x axis labels event listener
    labelsGroup.selectAll('text').on('click', function () {
      // get value of selection
      var value = d3.select(this).attr('value');
      if (value !== chosenXAxis) {
        // replaces chosenXAxis with value
        chosenXAxis = value;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(data, chosenXAxis);

        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis === 'poverty') {
          povertyLabel.classed('active', true).classed('inactive', false);
          ageLabel.classed('active', false).classed('inactive', true);
          incomeLabel.classed('active', false).classed('inactive', true);
        } else if (chosenXAxis == 'age') {
          ageLabel.classed('active', true).classed('inactive', false);
          povertyLabel.classed('active', false).classed('inactive', true);
          incomeLabel.classed('active', false).classed('inactive', true);
        } else {
          incomeLabel.classed('active', true).classed('inactive', false);
          povertyLabel.classed('active', false).classed('inactive', true);
          ageLabel.classed('active', false).classed('inactive', true);
        }
      }
    });

    // y axis labels event listener
    chartGroup.selectAll('.y-axis-text').on('click', function () {
      // get value of selection
      var value = d3.select(this).attr('value');
      if (value !== chosenYAxis) {
        // replaces chosenXAxis with value
        chosenYAxis = value;

        console.log(chosenYAxis);

        // functions here found above csv import
        // updates x scale for new data
        yLinearScale = yScale(data, chosenYAxis);

        // updates x axis with transition
        yAxis = renderYAxes(yLinearScale, yAxis);

        // updates circles with new x values
        circlesGroup = renderYCircles(circlesGroup, yLinearScale, chosenYAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenYAxis === 'healthcare') {
          healthcareYLabel.classed('active', true).classed('inactive', false);
          smokesYLabel.classed('active', false).classed('inactive', true);
          obesityYLabel.classed('active', false).classed('inactive', true);
        } else if (chosenYAxis == 'smokes') {
          smokesYLabel.classed('active', true).classed('inactive', false);
          healthcareYLabel.classed('active', false).classed('inactive', true);
          obesityYLabel.classed('active', false).classed('inactive', true);
        } else {
          obesityYLabel.classed('active', true).classed('inactive', false);
          healthcareYLabel.classed('active', false).classed('inactive', true);
          smokesYLabel.classed('active', false).classed('inactive', true);
        }
      }
    });
  })
  .catch(function (error) {
    console.log(error);
  });
