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
 
// Data for to draw line
const linegeojson = {
      'type': 'Feature',
      'properties': {},
      'geometry': {
          'type': 'LineString',
          'coordinates': [
              uluruGeojson.geometry.coordinates,
              uluruGeojson.geometry.coordinates
          ]
      }
};

function updateMarker() {
  // Redraw the line, get the new distance, and update the results
  
  //Redraw line
  const markerLngLat = marker.getLngLat();
  linegeojson.geometry.coordinates.pop();
  linegeojson.geometry.coordinates.push(Object.values(markerLngLat));
  map.getSource('line').setData(linegeojson);

  //update distance
  const distanceTo = markerLngLat.distanceTo(uluruLngLat);
  const results = document.getElementById('results');
  const distanceStr = `${Math.round(distanceTo/1000).toLocaleString("en-US")}km`
  document.getElementById('distance').innerHTML = distanceStr;
  if (results.style.display === "none") results.style.display = "block";
}

// Handlers

map.on('load', () => {
    map.addSource('line', {
        'type': 'geojson',
        'data': linegeojson
    });
    map.addLayer({
        'id': 'line',
        'type': 'line',
        'source': 'line',
        'layout': {
            'line-join': 'round',
            'line-cap': 'round'
        },
        'paint': {
            'line-color': '#888',
            'line-width': 8
        }
    });
});

marker.on('drag', updateMarker);

marker.on('dragend', updateMarker);

map.on('click', (e) => {
  marker.setLngLat(e.lngLat);
  updateMarker();
});

const geocoder = new MapboxGeocoder({
  // Initialize the geocoder
  accessToken: mapboxgl.accessToken,
  mapboxgl: mapboxgl,
  marker: false,
  placeholder: 'Search here',
  proximity: {
    longitude: uluruLngLat.lng,
    latitude: uluruLngLat.lat
  }
});

map.addControl(geocoder, 'top-right');

geocoder.on('result', ({ result }) => {
    marker.setLngLat(result.center);
    updateMarker();
});