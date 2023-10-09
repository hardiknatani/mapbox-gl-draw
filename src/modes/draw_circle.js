// import * as CommonSelectors from "../lib/common_selectors";
// import * as Constants from '../constants';
// import { createCircle, getCircleCenter } from '../util/circleGeojson';
// import { distance, initialBearing } from '../util/geodesy';
// import createGeodesicGeojson from '../util/createGeodesicGeojson';
// import dragPan from '../util/dragPan';
// import doubleClickZoom from '../lib/double_click_zoom';

// const DrawCircle = {};

// DrawCircle.onSetup = function(properties) {
//   this.clearSelectedFeatures();
//   doubleClickZoom.disable(this);
//   dragPan.disable(this);
//   this.updateUIClasses({ mouse: Constants.cursors.ADD });
//   this.setActionableState(); // default actionable state is false for all actions
//   return {
//     properties,
//   };
// };

// DrawCircle.onMouseDown = DrawCircle.onTouchStart = function(state, e) {
//   if (state.circle) {
//     this.deleteFeature([state.circle.id], { silent: true });
//   };
//   const center = [e.lngLat.lng, e.lngLat.lat];
//   const circle = this.newFeature(createCircle(center, Number.EPSILON, {
//     ...state.properties,
//     featureType: 'circle'
//   }));
//   this.addFeature(circle);
//   state.circle = circle;
// };

// DrawCircle.onDrag = DrawCircle.onTouchMove = function(state, e) {
//   if (state.circle) {
//     const geojson = state.circle.toGeoJSON();
//     const center = getCircleCenter(geojson);
//     const handle = [e.lngLat.lng, e.lngLat.lat];
//     const radius = distance(center, handle);
//     const handleBearing = initialBearing(center, handle);
//     state.circle.properties[Constants.properties.RADIUS] = radius;
//     state.circle.properties[Constants.properties.BEARING] = handleBearing;
//     state.circle.changed();
//   }
// };

// DrawCircle.onMouseUp = DrawCircle.onTouchEnd = function(state) {
//   const radius = state.circle.properties[Constants.properties.RADIUS]
//   if (!radius || radius === Number.EPSILON) return;
//   this.map.fire(Constants.events.CREATE, { features: [state.circle.toGeoJSON()] });
//   return this.changeMode(Constants.modes.SIMPLE_SELECT, { featureIds: [state.circle.id] });
// };

// DrawCircle.onKeyUp = function(state, e) {
//   if (CommonSelectors.isEscapeKey(e)) {
//     if (state.circle) {
//       this.deleteFeature([state.circle.id], { silent: true });
//     }
//     this.changeMode(Constants.modes.SIMPLE_SELECT);
//   } else if (CommonSelectors.isEnterKey(e)) {
//     this.changeMode(Constants.modes.SIMPLE_SELECT, { featureIds: [state.circle.id] });
//   }
// };

// DrawCircle.onStop = function(state) {
//   const radius = state.circle.properties[Constants.properties.RADIUS]
//   if (!radius || radius === Number.EPSILON) {
//     this.deleteFeature([state.circle.id], { silent: true });
//   }
//   this.updateUIClasses({ mouse: Constants.cursors.NONE });
//   doubleClickZoom.enable(this);
//   dragPan.enable(this);
//   this.activateUIButton();
// };

// DrawCircle.toDisplayFeatures = function(state, geojson, display) {
//   if (state.circle) {
//     const isActivePolygon = geojson.properties.id === state.circle.id;
//     geojson.properties.active = (isActivePolygon) ? Constants.activeStates.ACTIVE : Constants.activeStates.INACTIVE;
//   }

//   const displayGeodesic = (geojson) => {
//     const geodesicGeojson = createGeodesicGeojson(geojson, { ctx: this._ctx });
//     geodesicGeojson.forEach(display);
//   };

//   displayGeodesic(geojson);
// };

// export default DrawCircle;



import * as CommonSelectors from "../lib/common_selectors";
import * as Constants from '../constants';
import dragPan from '../util/dragPan';
import doubleClickZoom from '../lib/double_click_zoom';
import DrawPolygon from "./draw_polygon";
import circle from '@turf/circle';
import distance from '@turf/distance';
import * as  turfHelpers from '@turf/helpers'

const DragCircleMode = {...DrawPolygon};

DragCircleMode.onSetup = function(opts) {
  const polygon = this.newFeature({
    type:Constants.geojsonTypes.FEATURE,
    properties: {
      isCircle: true,
      center: []
    },
    geometry: {
      type: Constants.geojsonTypes.POLYGON,
      coordinates: [[]]
    }
  });

  this.addFeature(polygon);

  this.clearSelectedFeatures();
 doubleClickZoom.disable(this);
  dragPan.disable(this);
  this.updateUIClasses({ mouse: Constants.cursors.ADD });
  this.activateUIButton(Constants.types.POLYGON);
  this.setActionableState({
    trash: true
  });

  return {
    polygon,
    currentVertexPosition: 0
  };
};

DragCircleMode.onMouseDown = DragCircleMode.onTouchStart = function (state, e) {
  const currentCenter = state.polygon.properties.center;
  if (currentCenter.length === 0) {
    state.polygon.properties.center = [e.lngLat.lng, e.lngLat.lat];
  }
};

DragCircleMode.onDrag = DragCircleMode.onMouseMove = function (state, e) {
  const center = state.polygon.properties.center;
  if (center.length > 0) {
    const distanceInKm = distance(
      turfHelpers.point(center),
      turfHelpers.point([e.lngLat.lng, e.lngLat.lat]),
      { units : 'kilometers'});
    const circleFeature = circle(center, distanceInKm);
    state.polygon.incomingCoords(circleFeature.geometry.coordinates);
    state.polygon.properties.radiusInKm = distanceInKm;
  }
};

DragCircleMode.onMouseUp = DragCircleMode.onTouchEnd = function (state, e) {
 dragPan.enable(this);
  return this.changeMode(Constants.modes.SIMPLE_SELECT, { featureIds: [state.polygon.id] });
};

DragCircleMode.onClick = DragCircleMode.onTap = function (state, e) {
  // don't draw the circle if its a tap or click event
  state.polygon.properties.center = [];
};

DragCircleMode.toDisplayFeatures = function(state, geojson, display) {
  const isActivePolygon = geojson.properties.id === state.polygon.id;
  geojson.properties.active = (isActivePolygon) ? Constants.activeStates.ACTIVE : Constants.activeStates.INACTIVE;
  return display(geojson);
};

export default DragCircleMode;