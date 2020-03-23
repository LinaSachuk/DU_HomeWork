// from data.js
var tableData = data;
// console.log(data)

// YOUR CODE HERE!
var dates = data.map(item => item.datetime);
// console.log(dates.length);
//  we have 111 items in the array

// console.log(`from ${dates[0]} to ${dates[110]}`);
// from 1/1/2010 to 1/13/2010
var tbody = d3.select("tbody");
d3.select('table').attr("class", 'table table-striped');

var button = d3.select('#filter-btn');


//filter parameter
var search = d3.selectAll('.search');
console.log(search);



search.on("click", function() {

    var searchParam = d3.select(this).text()

    console.log(searchParam);
    document.getElementById("datetime").value = "";
    document.getElementById("datetime").placeholder = searchParam;
    d3.select("#searchText").text(`Enter a ${searchParam}`);

});




button.on("click", function() {

    // Select the input element and get the raw HTML node
    var inputElement = d3.select("#datetime");

    // Get the value property of the input element
    var inputValue = inputElement.property("value");

    console.log(inputValue);


    if (dates.indexOf(inputValue) === -1) {
        // push here because a value of -1 means it's not in the array
        console.log('I am not here!')
        document.getElementById("datetime").value = "";
        document.getElementById("datetime").placeholder = "Try another date ... from 1/1/2010 to 1/13/2010 ";
    };

    var filteredData = tableData.filter(item => item.datetime === inputValue);

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
        var cell = row.append("td").style('color', "red");
        cell.text('No Data Found!');
    }

});