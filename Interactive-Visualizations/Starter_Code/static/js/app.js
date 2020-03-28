function optionChanged() {
    // Prevent the page from refreshing

    // Select the input value from the form
    var filter_id = d3.select('#selDataset').property('value');
    console.log('filter_id:', filter_id);

    // clear the input value
    myPlot(filter_id);
    // Build the plot with the new stock
}

// Use d3.json() to fetch data from JSON file
// Incoming data is internally referred to as data
function myPlot(fid = '940') {
    d3.json('samples.json').then(data => {
        console.log('data:', data);

        var ids = data.samples.map(d => d.id);
        console.log('ids:', ids);

        // Add ids to dropdown menu
        for (var i = 0; i < ids.length; i++) {
            selectBox = d3.select('#selDataset');
            selectBox.append('option').text(ids[i]);
        }

        // filter sample values by id
        var sample = data.samples.filter(i => i.id.toString() === fid)[0];
        console.log(sample);

        var id = sample.id;
        console.log('id:', id);

        var washFrequency = data.metadata.filter(i => i.id.toString() === fid)[0]
            .wfreq;
        console.log('washFrequency:', washFrequency);

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

        // Create a bubble chart that displays each sample.
        // Use otu_ids for the x values.
        // Use sample_values for the y values.
        // Use sample_values for the marker size.
        // Use otu_ids for the marker colors.
        // Use otu_labels for the text values.

        var traceB = {
            x: otu_ids,
            y: sample_values,
            mode: 'markers',
            marker: {
                size: sample_values,
                color: otu_ids
            },
            text: otu_labels
        };

        // set the layout for the bubble plot
        var layoutB = {
            title: ` Bubble chart for each sample`,
            xaxis: { title: 'OTU ID' },
            yaxis: { title: 'Sample Values' },
            height: 600,
            width: 1000
        };

        // creating data variable
        var dataB = [traceB];

        // create the bubble plot
        Plotly.newPlot('bubble', dataB, layoutB);

        // the Gauge Chart
        // part of data to input
        var traceGauge = {
            type: 'pie',
            mode: 'gauge+number',
            showlegend: false,
            hole: 0.3,
            rotation: 90,
            values: [
                81 / 9,
                81 / 9,
                81 / 9,
                81 / 9,
                81 / 9,
                81 / 9,
                81 / 9,
                81 / 9,
                81 / 9,
                81
            ],
            text: ['0-1', '1-2', '2-3', '3-4', '4-5', '5-6', '6-7', '7-8', '8-9'],
            direction: 'clockwise',
            textinfo: 'text',
            textposition: 'inside',
            marker: {
                colors: [
                    '#F8F3EB',
                    '#F4F1E4',
                    '#E9E7C8',
                    '#D5E599',
                    '#B6CD8F',
                    '#8AC085',
                    '#88BB8D',
                    '#83B588',
                    '#83B588',
                    'white'
                ],
                labels: ['0-1', '1-2', '2-3', '3-4', '4-5', '5-6', '6-7', '7-8', '8-9'],
                hoverinfo: 'label'
            }
        };

        // needle

        var degrees = 90,
            radius = 0.5;
        var radians = (degrees * Math.PI) / 180;
        var x = -1 * radius * Math.cos(radians) * 2;
        var y = radius * Math.sin(radians);

        var gaugeLayout = {
            width: 500,
            height: 500,
            shapes: [{
                type: 'line',
                x0: 0.5,
                y0: 0.5,
                x1: 0.6,
                y1: 0.6,
                line: {
                    color: 'black',
                    width: 3
                }
            }],
            title: `Belly Button Washing Frequency for Subject ${id}`,
            xaxis: { visible: false, range: [-1, 1] },
            yaxis: { visible: false, range: [-1, 1] }
        };

        var dataGauge = [traceGauge];

        Plotly.newPlot('gauge', dataGauge, gaugeLayout);
    });
}

myPlot();