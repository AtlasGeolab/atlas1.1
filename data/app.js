// Basemaps
const providers = {
  osm: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'© OpenStreetMap'}),
  carto_dark: L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',{attribution:'© CARTO'}),
  carto_pos: L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',{attribution:'© CARTO'})
};

const map = L.map('map');
providers.osm.addTo(map);
map.setView([20, 0], 2);

let overlayLayer = null;

function loadOverlay(url){
  if(overlayLayer){ map.removeLayer(overlayLayer); overlayLayer = null; }
  if(!url) return;

  fetch(url).then(r=>r.json()).then(geo=>{
    overlayLayer = L.geoJSON(geo, {
      style: f => ({color:'#4cc9f0', weight:1.4, fillColor:'#4cc9f0', fillOpacity:0.25}),
      pointToLayer: (f, latlng) => L.circleMarker(latlng, {radius:6, color:'#4cc9f0', fillColor:'#4cc9f0', fillOpacity:0.85})
    }).addTo(map);
    try { map.fitBounds(overlayLayer.getBounds(), {padding:[20,20]}); } catch (e) {}
    setOpacity(parseFloat(document.getElementById('opacity').value||0.8));
  });
}

function setOpacity(v){
  if(overlayLayer){
    overlayLayer.setStyle?.({opacity:v, fillOpacity:Math.max(.1, v*0.6)});
    overlayLayer.eachLayer?.(l=>{
      if(l.setStyle) l.setStyle({opacity:v, fillOpacity:Math.max(.2, v)});
    });
  }
}

document.getElementById('basemapSelect').addEventListener('change', (e)=>{
  const sel = e.target.value;
  Object.values(providers).forEach(l=> map.removeLayer(l));
  (providers[sel]||providers.osm).addTo(map);
});

document.getElementById('overlaySelect').addEventListener('change',(e)=> loadOverlay(e.target.value));
document.getElementById('opacity').addEventListener('input',(e)=> setOpacity(parseFloat(e.target.value)));
