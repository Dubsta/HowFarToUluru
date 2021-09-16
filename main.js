/*
Start of custom scripts. mapbox-gl.js is already loaded from head.
The token.js script holds MY_TOKEN variable for api token.
*/

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
  new mapboxgl.Marker(el).setLngLat(uluruGeojson.geometry.coordinates).addTo(map);

// Zoom transtion on load
map.zoomTo(4, {
  duration: 4000,
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
.setLngLat(uluruGeojson.geometry.coordinates)
.addTo(map);
 
function updateMarker() {
    const lngLat = marker.getLngLat();
    console.log(lngLat);
}
 
marker.on('dragend', updateMarker);

map.on('click', (e) => {
  marker.setLngLat(e.lngLat);
  updateMarker();
});