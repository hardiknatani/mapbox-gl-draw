// import * as CommonSelectors from "../lib/common_selectors";
// import * as Constants from "../constants";
// import doubleClickZoom from '../lib/double_click_zoom';
// import dragPan from "../util/dragPan";
// import createGeodesicGeojson from "../util/createGeodesicGeojson";

// const DrawRectangle = {};

// DrawRectangle.onSetup = function (properties = {}) {
//   this.clearSelectedFeatures();
//   doubleClickZoom.disable(this);
//   dragPan.disable(this);
//   this.updateUIClasses({ mouse: Constants.cursors.ADD });
//   this.setActionableState(); // default actionable state is false for all actions
//   return {
//     properties
//   };
// };

// DrawRectangle.onMouseDown = DrawRectangle.onTouchStart = function(state, e) {
//   e.originalEvent.preventDefault();
//   e.originalEvent.stopPropagation();
//   const point = [e.lngLat.lng, e.lngLat.lat];
//   const rectangle = this.newFeature({
//     type: Constants.geojsonTypes.FEATURE,
//     geometry: {
//       type: Constants.geojsonTypes.POLYGON,
//       coordinates: [
//         [
//           point,
//           point,
//           point,
//           point,
//           point,
//         ]
//       ]
//     },
//     properties: {
//       ...state.properties,
//       featureType: "rectangle",
//       [Constants.properties.POINT1]: point
//     }
//   });
//   this.addFeature(rectangle);
//   state.rectangle = rectangle;
// };

// DrawRectangle.onDrag = DrawRectangle.onTouchMove = function(state, e) {
//   e.originalEvent.preventDefault();
//   e.originalEvent.stopPropagation();
//   if (state.rectangle) {
//     const p1 = state.rectangle.properties[Constants.properties.POINT1];
//     const p2 = [e.lngLat.lng, e.lngLat.lat];
//     state.rectangle.properties[Constants.properties.POINT2] = p2;
//     state.rectangle.coordinates = [
//       [p1, [p1[0], p2[1]], p2, [p2[0], p1[1]], p1]
//     ];
//     state.rectangle.changed();
//   }
// };

// DrawRectangle.onMouseUp = DrawRectangle.onTouchEnd = function(state, e) {
//   e.originalEvent.preventDefault();
//   e.originalEvent.stopPropagation();
//   this.map.fire(Constants.events.CREATE, { features: [state.rectangle.toGeoJSON()] });
//   return this.changeMode(Constants.modes.SIMPLE_SELECT, { featureIds: [state.rectangle.id] });
// };

// DrawRectangle.onKeyUp = function(state, e) {
//   if (CommonSelectors.isEscapeKey(e)) {
//     if (state.rectangle) {
//       this.deleteFeature([state.rectangle.id], { silent: true });
//     }
//     this.changeMode(Constants.modes.SIMPLE_SELECT);
//   } else if (CommonSelectors.isEnterKey(e)) {
//     this.changeMode(Constants.modes.SIMPLE_SELECT, { featureIds: [state.rectangle.id] });
//   }
// };

// DrawRectangle.onStop = function() {
//   this.updateUIClasses({ mouse: Constants.cursors.NONE });
//   doubleClickZoom.enable(this);
//   dragPan.enable(this);
//   this.activateUIButton();
// };

// DrawRectangle.toDisplayFeatures = function(state, geojson, display) {
//   if (state.rectangle) {
//     const isActivePolygon = geojson.properties.id === state.rectangle.id;
//     geojson.properties.active = (isActivePolygon) ? Constants.activeStates.ACTIVE : Constants.activeStates.INACTIVE;
//   }

//   const displayGeodesic = (geojson) => {
//     const geodesicGeojson = createGeodesicGeojson(geojson, { ctx: this._ctx });
//     geodesicGeojson.forEach(display);
//   };

//   displayGeodesic(geojson);
// };

// export default DrawRectangle;

import { enableZoom, disableZoom } from '../util/zoom';

const DrawRectangleDrag = {
  onSetup() {
    const rectangle = this.newFeature(createRectangle());
    this.addFeature(rectangle);

    this.clearSelectedFeatures();

    // UI Tweaks
    this.updateUIClasses({ mouse: 'add' });
    this.setActionableState({ trash: true });
    disableZoom(this);

    return { rectangle };
  },

  onMouseDown(state, event) {
    event.preventDefault();

    const startPoint = [event.lngLat.lng, event.lngLat.lat];
    state.startPoint = startPoint;

    // Starting point - minX,minY
    state.rectangle.updateCoordinate(
      '0.0',
      state.startPoint[0],
      state.startPoint[1]
    );
  },

  onDrag(state, event) {
    if (!state.startPoint) {
      return;
    }

    // Upper right vertex - maxX, minY
    state.rectangle.updateCoordinate(
      '0.1',
      event.lngLat.lng,
      state.startPoint[1]
    );

    // Lower right vertex - maxX, maxY
    state.rectangle.updateCoordinate(
      '0.2',
      event.lngLat.lng,
      event.lngLat.lat
    );

    // Lower left vertex - minX, maxY
    state.rectangle.updateCoordinate(
      '0.3',
      state.startPoint[0],
      event.lngLat.lat
    );

    // Starting point again
    state.rectangle.updateCoordinate(
      '0.4',
      state.startPoint[0],
      state.startPoint[1]
    );
  },

  onMouseUp(state, event) {
    state.endPoint = [event.lngLat.lng, event.lngLat.lat];

    this.updateUIClasses({ mouse: 'pointer' });
    this.changeMode('simple_select', { featuresId: state.rectangle.id });
  },

  onStop(state) {
    enableZoom(this);
    this.updateUIClasses({ mouse: 'none' });

    if (!this.getFeature(state.rectangle.id)) {
      return;
    }

    // Remove latest coordinate
    state.rectangle.removeCoordinate('0.4');

    if (state.rectangle.isValid()) {
      this.map.fire('draw.create', {
        features: [state.rectangle.toGeoJSON()]
      });
      return;
    }

    this.deleteFeature([state.rectangle.id], { silent: true });
    this.changeMode('simple_select', {}, { silent: true });
  },

  onTrash(state) {
    this.deleteFeature([state.rectangle.id], { silent: true });
    this.changeMode('simple_select');
  },

  toDisplayFeatures(state, geojson, display) {
    const isActivePolygon = geojson.properties.id === state.rectangle.id;
    geojson.properties.active = isActivePolygon.toString();

    if (!isActivePolygon) {
      display(geojson);
      return;
    }

    if (!state.startPoint) {
      return;
    }

    display(geojson);
  },
};

function createRectangle() {
  return {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: [[]]
    }
  };
}

export default DrawRectangleDrag;