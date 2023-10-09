import { sector } from "@turf/turf";

function createGeodesicSector(center, radius, bearing1, bearing2, options = {}) {
  return sector(center, radius, bearing1, bearing2, options).geometry.coordinates;
}

export default createGeodesicSector;
