export function isLayLine(geojson) {
  return geojson.properties.featureType === 'layLine';
}
