// Store our API endpoint inside queryUrl
var queryUrl =
    'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

// Perform a GET request to the query URL
d3.json(queryUrl, function (data) {
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
    console.log('data.features:', data.features)
});

//color based on value
function getColor(d) {
    return d > 6 ? '#EE162D' :
        d > 5 ? '#F35B6C' :
            d > 4 ? '#F8A4AD' :
                d > 3 ? '#f3985b' :
                    d > 2 ? '#f3d65b' :
                        d > 1 ? '#cbf35b' :
                            '#6cf35b';
}


function createFeatures(earthquakeData) {

    function myStyle(f) {
        return {
            radius: f.properties.mag * 6,
            color: "black",
            fillColor: getColor(f.properties.mag),
            fillOpacity: 0.6,
            weight: 0.5,
            opacity: 1
        }
    };


    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function (feature, latlng) {

            return L.circleMarker(latlng, myStyle(feature));
        },
        // Define a function we want to run once for each feature in the features array
        // Give each feature a popup describing the place, time and mag of the earthquake
        onEachFeature: function (feature, layer) {
            layer.bindPopup(
                '<h3>' +
                feature.properties.place +
                '</h3><hr><p>' +
                new Date(feature.properties.time) +
                '</p><hr><p>Magnitude: ' + feature.properties.mag + '</p>');
        }
    });
    console.log('earthquakes:', earthquakes);

    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
}


function createMap(earthquakes) {


    var greymap =
        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}',
            {
                attribution:
                    'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                maxZoom: 18,
                id: 'mapbox.light',
                accessToken: API_KEY,
            })


    // Define a baseMaps object to hold our base layers
    var baseMaps = {
        'Map': greymap
    };

    // Create overlay object to hold our overlay layer
    var overlayMaps = {
        Earthquakes: earthquakes,
    };

    // Create our map, giving it the greymap and earthquakes layers to display on load
    var myMap = L.map('map', {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [greymap, earthquakes],
    });

    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    // L.control
    //     .layers(baseMaps, overlayMaps, {
    //         collapsed: false,
    //     })
    //     .addTo(myMap);




    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 1, 2, 3, 4, 5],
            labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(myMap);


}


