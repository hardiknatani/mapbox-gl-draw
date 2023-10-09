import hat from 'hat';
import * as Constants from '../constants';
import { sector } from '@turf/turf';

export function createSector(center, radius, bearing1, bearing2, properties = {}) {
  if (!(radius > 0)) {
    throw new Error('Radius has to be greater then 0');
  }

  const s = sector(center, radius, bearing1, bearing2, {
    steps: properties[Constants.properties.STEPS] || 64,
    units: properties[Constants.properties.UNITS] || "kilometers",
    properties: {
      ...properties,
      [Constants.properties.RADIUS]: radius,
      [Constants.properties.CENTER]: center,
      [Constants.properties.BEARING1]: bearing1,
      [Constants.properties.BEARING2]: bearing2,
    }
  });

  return {
    id: hat(),
    type: Constants.geojsonTypes.FEATURE,
    properties: s.properties,
    geometry: s.geometry,
  };
}

export function updateSector (center, radius, bearing1, bearing2, feature) {
  if (!(radius > 0)) {
    throw new Error('Radius has to be greater then 0');
  }

  const s = sector(center, radius, bearing1, bearing2, {
    steps: feature.properties.steps || 64,
    utils: feature.properties.utils || "kilometers",
    properties: {
      ...feature.properties,
      [Constants.properties.RADIUS]: radius,
      [Constants.properties.CENTER]: center,
      [Constants.properties.BEARING1]: bearing1,
      [Constants.properties.BEARING2]: bearing2,
    }
  });
  return {
    id: feature.id,
    type: Constants.geojsonTypes.FEATURE,
    properties: s.properties,
    geometry: s.geometry,
  };
}

export function isSector(geojson) {
  return geojson.properties.featureType === 'sector';
}

export function getSectorCenter(geojson) {
  if (!isSector(geojson)) {
    throw new Error('GeoJSON is not a sector');
  }

  return geojson.properties[Constants.properties.CENTER];
}

export function setCircleCenter(geojson, center) {
  if (!isSector(geojson)) {
    throw new Error('GeoJSON is not a sector');
  }
  geojson.properties.center = center;
}

export function getSectorRadius(geojson) {
  if (!isSector(geojson)) {
    throw new Error('GeoJSON is not a sector');
  }

  return geojson.properties[Constants.properties.RADIUS];
}

export function setSectorRadius(geojson, radius) {
  if (!isSector(geojson)) {
    throw new Error('GeoJSON is not a sector');
  }

  geojson.properties[Constants.properties.RADIUS] = radius;
}
