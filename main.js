/*
Start of custom scripts. mapbox-gl.js is already loaded from head.
The token.js script holds MY_TOKEN variable for api token.
*/

// Hide the results at start. Setting the css to 'display = none;' stops the script from working.
document.getElementById('results').style.display = 'none';

// draw map
mapboxgl.accessToken = MY_TOKEN;
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/dubsta/cktl07s468nuf17liru96hy1p',
  center: [131.040, -25.354], // starting position [lng, lat]
  zoom: 12.58 // starting zoom
});


// Uluru data
const uluruGeojson = {
  type: 'Feature',
  geometry: {type: 'Point', coordinates: [131.036, -25.344]},
  properties: {name: "Uluru"}
};

// add Uluru marker to map
const el = document.createElement('div');
el.className = 'uluru';
const uluruLngLat = new mapboxgl.LngLat(...uluruGeojson.geometry.coordinates);
new mapboxgl.Marker(el).setLngLat(uluruLngLat).addTo(map);

// Zoom transtion on load
map.zoomTo(4, {
  duration: 3500,
  offset: [-40, -30]
});

// Add controls
const controls = new mapboxgl.NavigationControl({
  showCompass: true,
  showZoom: true,
  visualizePitch: true
})
map.addControl(controls, "bottom-right");

// Add marker
const marker = new mapboxgl.Marker({
    draggable: true,
    color: 'grey'
})
.setLngLat(uluruLngLat)
.addTo(map);
 

function updateMarker() {
  // Get the new distance and update the results
  const markerLngLat = marker.getLngLat();
  const distanceTo = markerLngLat.distanceTo(uluruLngLat);
  const results = document.getElementById('results');
  const distanceStr = `${Math.round(distanceTo/1000).toLocaleString("en-US")}km`
  document.getElementById('distance').innerHTML = distanceStr;
  //const description = document.getElementById('description');
  if (results.style.display === "none") results.style.display = "block";
}

// Handlers
marker.on('dragend', updateMarker);

map.on('click', (e) => {
  marker.setLngLat(e.lngLat);
  updateMarker();
});


// Draw a line between Uluru and user marker

// GeoJSON object to hold our measurement features

// const geojson = {
// 'type': 'FeatureCollection',
// 'features': []
};
 
// Used to draw a line between points
const linestring = {
  'type': 'Feature',
  'geometry': {
    'type': 'LineString',
    'coordinates': []
  }
};
 
// map.on('load', () => {
//   map.addSource('geojson', {
//     'type': 'geojson',
//     'data': geojson
//});
 
// Add styles to the map
map.addLayer({
  id: 'measure-line',
  type: 'line',
  source: 'geojson',
  layout: {
    'line-cap': 'round',
    'line-join': 'round'
  },
  paint: {
    'line-color': '#000',
    'line-width': 2.5
    //'line-dasharray': 1;
  },
  filter: ['in', '$type', 'LineString']
});
 
map.on('click', (e) => {
  const features = map.queryRenderedFeatures(e.point, {
    layers: ['measure-points']
});
 
// Remove the linestring from the group
// so we can redraw it based on the points collection.
if (geojson.features.length > 1) geojson.features.pop();
 
// Clear the distance container to populate it with a new value.
distanceContainer.innerHTML = '';
 
// If a feature was clicked, remove it from the map.
if (features.length) {
const id = features[0].properties.id;
geojson.features = geojson.features.filter(
(point) => point.properties.id !== id
);
} else {
const point = {
'type': 'Feature',
'geometry': {
'type': 'Point',
'coordinates': [e.lngLat.lng, e.lngLat.lat]
},
'properties': {
'id': String(new Date().getTime())
}
};
 
geojson.features.push(point);
}
 
if (geojson.features.length > 1) {
linestring.geometry.coordinates = geojson.features.map(
(point) => point.geometry.coordinates
);
 
geojson.features.push(linestring);
 
// Populate the distanceContainer with total distance
const value = document.createElement('pre');
const distance = turf.length(linestring);
value.textContent = `Total distance: ${distance.toLocaleString()}km`;
distanceContainer.appendChild(value);
}
 
map.getSource('geojson').setData(geojson);
});
});
 
map.on('mousemove', (e) => {
const features = map.queryRenderedFeatures(e.point, {
layers: ['measure-points']
});
// Change the cursor to a pointer when hovering over a point on the map.
// Otherwise cursor is a crosshair.
map.getCanvas().style.cursor = features.length
? 'pointer'
: 'crosshair';
});