export function isRectangle(geojson) {
  return geojson.properties.featureType === 'rectangle';
}
