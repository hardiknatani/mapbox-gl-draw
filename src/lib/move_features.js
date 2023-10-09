import constrainFeatureMovement from './constrain_feature_movement';
import * as Constants from '../constants';
import { isCircle } from '../util/circleGeojson';
import { isSector } from '../util/sectorGeojson';
import { isRectangle } from '../util/rectangleGeojson';
import { isLayLine } from '../util/layLineGeojson';

export default function(features, delta) {
  const constrainedDelta = constrainFeatureMovement(features.map(feature => feature.toGeoJSON()), delta);

  features.forEach((feature) => {
    const currentCoordinates = feature.getCoordinates();

    const moveCoordinate = (coord) => {
      const point = {
        lng: coord[0] + constrainedDelta.lng,
        lat: coord[1] + constrainedDelta.lat
      };
      return [point.lng, point.lat];
    };
    const moveRing = ring => ring.map(coord => moveCoordinate(coord));
    const moveMultiPolygon = multi => multi.map(ring => moveRing(ring));

    let nextCoordinates;
    if (feature.type === Constants.geojsonTypes.POINT) {
      nextCoordinates = moveCoordinate(currentCoordinates);
    } else if (feature.type === Constants.geojsonTypes.LINE_STRING || feature.type === Constants.geojsonTypes.MULTI_POINT) {
      nextCoordinates = currentCoordinates.map(moveCoordinate);
    } else if (feature.type === Constants.geojsonTypes.POLYGON || feature.type === Constants.geojsonTypes.MULTI_LINE_STRING) {
      if (isCircle(feature.toGeoJSON()) || isSector(feature.toGeoJSON()) || isLayLine(feature.toGeoJSON())) {
        const geojson = feature.toGeoJSON();
        const c = moveCoordinate(geojson.properties[Constants.properties.CENTER]);
        feature.properties[Constants.properties.CENTER] = c;
      }
      if (isRectangle(feature.toGeoJSON())) {
        const geojson = feature.toGeoJSON();
        const p1 = moveCoordinate(geojson.properties[Constants.properties.POINT1]);
        const p2 = moveCoordinate(geojson.properties[Constants.properties.POINT2]);
        feature.properties[Constants.properties.POINT1] = p1;
        feature.properties[Constants.properties.POINT2] = p2;
      }
      nextCoordinates = currentCoordinates.map(moveRing);
    } else if (feature.type === Constants.geojsonTypes.MULTI_POLYGON) {
      nextCoordinates = currentCoordinates.map(moveMultiPolygon);
    }
    feature.incomingCoords(nextCoordinates);
  });
}
