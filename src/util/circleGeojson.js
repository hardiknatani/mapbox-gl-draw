import hat from 'hat';
import * as Constants from '../constants';
import { circle } from '@turf/turf';

export function createCircle(center, radius, properties = {}) {
  if (!(radius > 0)) {
    throw new Error('Radius has to be greater then 0');
  }

  console.log(radius)
  const c = circle(center, radius, {
    steps: properties.steps || 64,
    utils: properties.utils || "kilometers",
    properties: {
      [Constants.properties.RADIUS]: radius,
      [Constants.properties.CENTER]: center,
      ...properties
    }
  });

  return {
    id: hat(),
    type: Constants.geojsonTypes.FEATURE,
    properties: c.properties,
    geometry: c.geometry,
  };
}

export function isCircle(geojson) {
  return geojson.properties.featureType === 'circle';
}

export function getCircleCenter(geojson) {
  if (!isCircle(geojson)) {
    throw new Error('GeoJSON is not a circle');
  }

  return geojson.properties[Constants.properties.CENTER];
}

export function setCircleCenter(geojson, center) {
  if (!isCircle(geojson)) {
    throw new Error('GeoJSON is not a circle');
  }
  geojson.properties.center = center;
}

export function getCircleRadius(geojson) {
  if (!isCircle(geojson)) {
    throw new Error('GeoJSON is not a circle');
  }

  return geojson.properties[Constants.properties.RADIUS];
}

export function setCircleRadius(geojson, radius) {
  if (!isCircle(geojson)) {
    throw new Error('GeoJSON is not a circle');
  }

  geojson.properties[Constants.properties.RADIUS] = radius;
}
