// Creating map object
var myMap = L.map("map", {
  center: [34.052235, -118.243683],
  zoom: 4,
});

// Adding tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);


// Grabbing the geojson data from the site
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";


// Grabbing our GeoJSON data
d3.json(link).then(function(data) {

  function mapStyle(feature){
    return {
      opacity: 1,
      fillOpacity: 0.6,
      radius: mapRadius(feature.properties.mag),
      fillColor: mapColor(feature.geometry.coordinates[2]),
      color: "#000000",
      stroke: true,
      weight: 0.5
    };
  }


  // Function that will determine the color of a circle based on the depth criteria
function mapColor(depth)  {
  switch (true) {
    case depth > 90:
      return "#ea2c2c";
    case depth > 70:
      return "#ff8c00";
    case depth > 50:
      return "#ff981a";
    case depth > 30:
      return "#ffd500";
    case depth > 10:
      return "#d4e6a2";
    default:
      return "#90EE90";
  }
}

// Function for the Magnitude
function mapRadius(mag){
  if(mag === 0){
    return 1;
  }
  return mag * 4;
}

  // Creating a geoJSON layer with the retrieved data
  L.geoJson(data, {
    pointToLayer: function(feature, latlng){
      return L.circleMarker(latlng);
    },

    // Referencing the styling
    style: mapStyle, 
    
    onEachFeature: function(feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);

    }
  }).addTo(myMap);


    // Adding the legend
    var legend = L.control({position: "bottomright"});
    legend.onAdd = function() {
      var div = L.DomUtil.create("div", "legend"),
      depth = [-10, 10, 30, 50, 70, 90];
      
    for (var i =0; i < depth.length; i++) {
      div.innerHTML += 
      '<i style="background:' + mapColor(depth[i] + 1) + '"></i> ' +
          depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
        }
      return div;
    };
    legend.addTo(myMap);
  });

