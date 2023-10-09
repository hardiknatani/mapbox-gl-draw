import createGeodesicGeojson from "../util/createGeodesicGeojson";

const StaticGeodesic = {};

StaticGeodesic.onSetup = function() {
  this.setActionableState(); // default actionable state is false for all actions
  return {};
};

StaticGeodesic.toDisplayFeatures = function(state, geojson, display) {
  const displayGeodesic = (geojson) => {
    const geodesicGeojson = createGeodesicGeojson(geojson, { ctx: this._ctx });
    geodesicGeojson.forEach(display);
  };

  displayGeodesic(geojson);
};

export default StaticGeodesic;