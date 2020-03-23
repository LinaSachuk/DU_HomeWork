// from data.js
var tableData = data;
// console.log(data)

// YOUR CODE HERE!
var dates = data.map(item => item.datetime);
var cities = data.map(item => item.city);
var states = data.map(item => item.state);
var countries = data.map(item => item.country);
var shape = data.map(item => item.shape);

console.log(dates);
//  we have 111 items in the array

// console.log(`from ${dates[0]} to ${dates[110]}`);
// from 1/1/2010 to 1/13/2010
var tbody = d3.select("tbody");
d3.select('table').attr("class", 'table table-striped');

var button = d3.select('#filter-btn');


//filter parameter
var search = d3.selectAll('.search');
// console.log(search);

var searchParam = '';

search.on("click", function() {

    searchParam = d3.select(this).text()

    console.log(searchParam);
    document.getElementById("datetime").value = "";
    document.getElementById("datetime").placeholder = searchParam;
    d3.select("#searchText").text(`Enter a ${searchParam}`);
    return searchParam;
});


button.on("click", function() {
    // console.log(`test ${searchParam}`)
    // Select the input element and get the raw HTML node
    var inputElement = d3.select("#datetime");
    // Get the value property of the input element
    var inputValue = inputElement.property("value");
    inputValue = inputValue.toLowerCase();
    console.log(inputValue);
    // console.log(`me ${dates.indexOf(inputValue)}`);


    // ||cities.indexOf(inputValue) === -1 || states.indexOf(inputValue) === -1 || countries.indexOf(inputValue) === -1 || shape.indexOf(inputValue) === -1

    if (dates.indexOf(inputValue) === -1 && cities.indexOf(inputValue) === -1 && states.indexOf(inputValue) === -1 && countries.indexOf(inputValue) === -1 && shape.indexOf(inputValue) === -1) {
        // push here because a value of -1 means it's not in the array
        console.log('I am not here!')
        document.getElementById("datetime").value = "";
        document.getElementById("datetime").placeholder = "Try again. ";
    };

    var filteredData = tableData.filter(item => item[searchParam] === inputValue);

    console.log(filteredData);


    if (filteredData.length > 0) {
        // clean table cells
        var table = d3.select("table");
        var rows = table.selectAll("tbody tr");
        var cells = rows.selectAll('td');
        cells.remove();
        // getting a new data
        filteredData.forEach((item) => {
            var row = tbody.append("tr");
            Object.entries(item).forEach(([key, value]) => {
                var cell = row.append("td");
                cell.text(value);
            });
        });

    } else {
        // if there is no data, remove a table cells with old data and give a message to the user
        var table = d3.select("table");
        var rows = table.selectAll("tbody tr");
        var cells = rows.selectAll('td');
        cells.remove();
        var row = tbody.append("tr");
        var cell = row.append("td").style('color', "orange");
        cell.text(`No Data Found for this ${searchParam}!`).style("font-size", "24px");
    }

});