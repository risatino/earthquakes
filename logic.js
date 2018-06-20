var API_shakes = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
var API_plates = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

function markerSize(magnitude) {
    return magnitude * 3;
};

var earthshakes = new L.LayerGroup();

d3.json(API_shakes, function (geoJson) {
    L.geoJSON(geoJson.features, {
        pointToLayer: function (geoJsonPoint, latlng) {
            return L.circleMarker(latlng, { radius: markerSize(geoJsonPoint.properties.mag) });
        },

        style: function (geoJsonFeature) {
            return {
                fillColor: Color(geoJsonFeature.properties.mag),
                fillOpacity: 0.7,
                weight: 0.1,
                color: 'black'

            }
        },

        onEachFeature: function (feature, layer) {
            layer.bindPopup(
                "<h4 style='text-align:center;'>" + new Date(feature.properties.time) +
                "</h4> <hr> <h5 style='text-align:center;'>" + feature.properties.title + "</h5>");
        }
    }).addTo(earthshakes);
    createMap(earthshakes);
});

var plateBoundary = new L.LayerGroup();

d3.json(API_plates, function (geoJson) {
    L.geoJSON(geoJson.features, {
        style: function (geoJsonFeature) {
            return {
                weight: 1,
                color: '#f33'
            }
        },
    }).addTo(plateBoundary);
})


// function Color(magnitude) {
//     if (magnitude > 5) {
//         return 'black'
//     } else if (magnitude > 4) {
//         return 'darkslategray'
//     } else if (magnitude > 3) {
//         return 'dimgray'
//     } else if (magnitude > 2) {
//         return 'gray'
//     } else if (magnitude > 1) {
//         return 'darkgray'
//     } else {
//         return 'lightgray'
//     }
// };

// function getColor(d) {
//   return d > 5 ? '#F30' :
//   d > 4  ? '#F60' :
//   d > 3  ? '#F90' :
//   d > 2  ? '#FC0' :
//   d > 1   ? '#FF0' :
//             '#9F3';
// }

function Color(magnitude) {
    if (magnitude > 5) {
        return '#bd0026'
    } else if (magnitude > 4) {
        return '#f03b20'
    } else if (magnitude > 3) {
        return '#fd8d3c'
    } else if (magnitude > 2) {
        return '#feb24c'
    } else if (magnitude > 1) {
        return '#fed976'
    } else {
        return '#ffffb2'
    }
};

function createMap() {

    var satelliteMap = L.tileLayer('https://api.mapbox.com/styles/v1/risatino/cjhzo6sl13bja2ro95e7424g0/tiles/256/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.satellite',
        accessToken: 'pk.eyJ1IjoicmlzYXRpbm8iLCJhIjoiY2poOWlhdzg5MGNoMzM2bGo2djV1ZnozeCJ9.CSgfDRGfPVQJeQFeczwoxQ'
    });

    var streetMap = L.tileLayer('https://api.mapbox.com/styles/v1/risatino/cjh9u544b0d1p2rp56qkyxi05/tiles/256/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoicmlzYXRpbm8iLCJhIjoiY2poOWlhdzg5MGNoMzM2bGo2djV1ZnozeCJ9.CSgfDRGfPVQJeQFeczwoxQ'
    });

    var nightMap = L.tileLayer('https://api.mapbox.com/styles/v1/risatino/cjh9rgtdw0yo32sl61ivaelcp/tiles/256/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.night',
        accessToken: 'pk.eyJ1IjoicmlzYXRpbm8iLCJhIjoiY2poOWlhdzg5MGNoMzM2bGo2djV1ZnozeCJ9.CSgfDRGfPVQJeQFeczwoxQ'
    });

    var baseLayers = {
        "Satellite": satelliteMap,
        "Street": streetMap,
        "Night": nightMap
    };

    var overlays = {
        "Earthquakes": earthshakes,
        "Plate Boundaries": plateBoundary,
    };

    var mapme = L.map('mapme', {
        center: [37.794594, -25.506134],
        zoom: 2.5,
        layers: [streetMap, earthshakes, plateBoundary]
    });

    L.control.layers(baseLayers, overlays).addTo(mapme);

    var legend = L.control({ position: 'bottomleft' });

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            magnitude = [0, 1, 2, 3, 4, 5],
            labels = [];

        div.innerHTML += "<h4 style='margin:4px'>Magnitude</h4>"

        for (var i = 0; i < magnitude.length; i++) {
            div.innerHTML +=
                '<i style="background: ' + Color(magnitude[i] + 1) + '"></i> ' +
                magnitude[i] + (magnitude[i + 1] ? '&ndash;' + magnitude[i + 1] + '<br>' : '+');
        }

        return div;
    };
    legend.addTo(mapme);
}

createMap()
