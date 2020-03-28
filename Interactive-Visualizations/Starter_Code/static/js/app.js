/**
 * Helper function to select data
 * Returns an array of values
 * @param {array} rows
 * @param {integer} index
 * index 0 - id
 * index 1 - otu_ids
 * index 2 - sample_values
 * index 3 - otu_labels
 */
function unpack(rows, index) {
    return rows.map(function(row) {
        return row[index];
    });
}

// Submit Button handler
function handleSubmit() {
    // Prevent the page from refreshing
    d3.event.preventDefault();

    // Select the input value from the form
    var stock = d3.select('#selDataset').node().value;
    console.log(stock);

    // clear the input value
    d3.select('#stockInput').node().value = '';

    // Build the plot with the new stock
    buildPlot(stock);
}

// Use d3.json() to fetch data from JSON file
// Incoming data is internally referred to as data
function myPlot() {
    d3.json('samples.json').then(data => {
        console.log('data:', data);

        var ids = data.samples.map(d => d.id);
        console.log('ids:', ids);

        // filter sample values by id
        var sample = data.samples.filter(s => s.id.toString() === '940')[0];
        console.log(sample);

        var id = sample.id;
        console.log('id:', id);
        // var otu_ids = sample.otu_ids;
        // console.log('otu_ids:', otu_ids);

        // top 10 OTUs found in that individual
        // getting sample_values as the values for the bar chart.
        var sample_values = sample.sample_values.slice(0, 10).reverse();
        console.log('sample_values:', sample_values);

        // getting otu_ids as the labels for the bar chart.
        var otu_ids = sample.otu_ids.slice(0, 10).reverse();
        console.log('otu_ids:', otu_ids);

        // getting otu_labels as the hovertext for the chart.
        var otu_labels = otu_ids.map(d => 'OTU ' + d);
        console.log('otu_labels:', otu_labels);

        var trace1 = {
            x: sample_values,
            y: otu_labels,
            text: otu_ids,
            type: 'bar',
            orientation: 'h'
        };

        // data
        var chartData = [trace1];

        // Apply the group bar mode to the layout
        var layout = {
            title: `Top 10 OTUs found in Subject ${id}`,
            xaxis: { title: 'Sample Values' },
            yaxis: { title: 'OTU ids' },
            margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 100
            }
        };

        // Render the plot to the div tag with id "plot"
        Plotly.newPlot('bar', chartData, layout);
    });
}

myPlot();