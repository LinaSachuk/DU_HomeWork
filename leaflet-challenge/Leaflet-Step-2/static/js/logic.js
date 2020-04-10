// Store our API endpoint inside queryUrl
var queryUrl =
    'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

var platesUrl = 'https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json'

// Perform a GET request to the query URL
d3.json(queryUrl, function (data) {
    // Once we get a response, send the data.features object to the createFeatures function
    d3.json(platesUrl, function (platesData) {
        createFeatures(data.features, platesData.features);
        console.log('platesData.features:', platesData.features)
    })
    // console.log('data.features:', data.features)
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


function createFeatures(earthquakeData, platesData) {

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

    var plates = L.geoJSON(platesData, {

        onEachFeature: function (feature, layer) {
            layer.bindPopup(
                '<h3> PlateName: ' +
                feature.properties.PlateName +
                '</h3>');
        }
    });
    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes, plates);
}



function createMap(earthquakes, plates) {



    var Satelite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution:
            'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        maxZoom: 18,
        id: 'mapbox.streets',
    })


    var Greyscale =
        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}',
            {
                attribution:
                    'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                maxZoom: 18,
                id: 'mapbox.light',
                accessToken: API_KEY,
            })

    var Stamen_Terrain = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.{ext}', {
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        subdomains: 'abcd',
        minZoom: 0,
        maxZoom: 18,
        ext: 'png'
    });

    var Streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
        "access_token=pk.eyJ1IjoibWJlcmtvdzIwMTciLCJhIjoiY2pjc2F4NGRvMGM0ZjJxdDZ6djRlNTR6YSJ9.Oc2zQ8daxeQJBYht7nDUzQ");


    // Define a baseMaps object to hold our base layers
    var baseMaps = {
        'Satelite': Satelite,
        'Greyscale': Greyscale,
        'Terrain': Stamen_Terrain,
        'Streetmap': Streetmap

    };

    // Create overlay object to hold our overlay layer
    var overlayMaps = {
        Lines: plates,
        Earthquakes: earthquakes,
    };

    // Create our map, giving it the greymap and earthquakes layers to display on load
    var myMap = L.map('map', {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [Satelite, Greyscale, earthquakes],
    });

    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control
        .layers(baseMaps, overlayMaps, {
            collapsed: false,
        })
        .addTo(myMap);




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


