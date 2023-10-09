import { distance as geodesyDistance, destinationPoint as geodesyDestinationPoint } from './spherical';

// radius used by mapbox-gl, see https://github.com/mapbox/mapbox-gl-js/blob/main/src/geo/lng_lat.js#L11
const DEFAULT_RADIUS = 6371.0088;

export function distance(start, destination) {
  return geodesyDistance(start, destination, DEFAULT_RADIUS);
}

export function destinationPoint(start, distance, bearing) {
  return geodesyDestinationPoint(start, distance, bearing, DEFAULT_RADIUS);
}

// export function initialBearing(start, destination){
//   return initialBearing(start, destination)
// }

// export function midpoint(start, destination){
//   return  midpoint(start, destination)
// }

export { initialBearing, midpoint } from './spherical';
