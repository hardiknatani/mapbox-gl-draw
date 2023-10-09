import arc from 'arc';
import * as Constants from '../constants';

function coordinatesEqual(x, y) {
  return x[0] === y[0] && x[1] === y[1];
}

function coordinatePairs(array) {
  return array.slice(0, -1)
    .map((value, index) => [value, array[index + 1]])
    .filter(pair => !coordinatesEqual(pair[0], pair[1]));
}

function createGeodesicLine(coordinates, steps = 32) {
  const segments = coordinatePairs(coordinates);

  const geodesicSegments = segments.map((segment) => {
    const greatCircle = new arc.GreatCircle(
      { x: segment[0][0], y: segment[0][1] },
      { x: segment[1][0], y: segment[1][1] }
    );
    // eslint-disable-next-line new-cap
    return greatCircle.Arc(steps, { offset: 90 }).json();
  });

  // arc.js returns the line crossing antimeridian split into two MultiLineString segments
  // (the first going towards to antimeridian, the second going away from antimeridian, both in range -180..180 longitude)
  // fix Mapbox rendering by merging them together, adding 360 to longitudes on the right side
  let worldOffset = 0;
  const geodesicCoordinates = geodesicSegments.map((geodesicSegment) => {
    if (geodesicSegment.geometry.type === Constants.geojsonTypes.MULTI_LINE_STRING) {
      const prevWorldOffset = worldOffset;
      const nextWorldOffset = worldOffset + (geodesicSegment.geometry.coordinates[0][0][0] > geodesicSegment.geometry.coordinates[1][0][0] ? 1 : -1);
      const geodesicCoordinates = [
        ...geodesicSegment.geometry.coordinates[0].map(x => [x[0] + prevWorldOffset * 360, x[1]]),
        ...geodesicSegment.geometry.coordinates[1].map(x => [x[0] + nextWorldOffset * 360, x[1]])
      ];
      worldOffset = nextWorldOffset;
      return geodesicCoordinates;
    } else {
      const geodesicCoordinates = geodesicSegment.geometry.coordinates.map(x => [x[0] + worldOffset * 360, x[1]]);
      return geodesicCoordinates;
    }
  }).flat();

  return geodesicCoordinates.filter((coord, index) => index === geodesicCoordinates.length - 1 || !coordinatesEqual(coord, geodesicCoordinates[index + 1]));
}

export default createGeodesicLine;
