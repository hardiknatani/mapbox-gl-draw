const PlotUtils = {};

PlotUtils.Constants = {
  TWO_PI: Math.PI * 2,
  HALF_PI: Math.PI / 2,
  FITTING_COUNT: 100,
  ZERO_TOLERANCE: 0.0001
};


PlotUtils.wgsToMercator = function (point) {
  const wgsLon = point[0];
  const wgsLat = point[1];
  const x = wgsLon * 20037508.34 / 180;
  let y = Math.log(Math.tan((90 + wgsLat) * Math.PI / 360)) / (Math.PI / 180);
  y = y * 20037508.34 / 180;
  return [x, y];
};

PlotUtils.mercatorToWGS = function (point) {
  const mercatorLon = point[0];
  const mercatorLat = point[1];
  const x = mercatorLon / 20037508.34 * 180;
  let y = mercatorLat / 20037508.34 * 180;
  y = 180 / Math.PI * (2 * Math.atan(Math.exp(y * Math.PI / 180)) - Math.PI / 2);
  return [x, y];
};

PlotUtils.distance = function (pnt1, pnt2) {
  const p = Math.pow((pnt1[0] - pnt2[0]), 2) + Math.pow((pnt1[1] - pnt2[1]), 2);
  return Math.sqrt(p);
};

PlotUtils.wholeDistance = function (points) {
  let distance = 0;
  for (let i = 0; i < points.length - 1; i++)
    distance += PlotUtils.distance(points[i], points[i + 1]);
  return distance;
};

PlotUtils.getBaseLength = function (points) {
  return Math.pow(PlotUtils.wholeDistance(points), 0.99);
  //return PlotUtils.wholeDistance(points);
};

PlotUtils.mid = function (pnt1, pnt2) {
  return [(pnt1[0] + pnt2[0]) / 2, (pnt1[1] + pnt2[1]) / 2];
};

PlotUtils.getCircleCenterOfThreePoints = function (pnt1, pnt2, pnt3) {
  const pntA = [(pnt1[0] + pnt2[0]) / 2, (pnt1[1] + pnt2[1]) / 2];
  const pntB = [pntA[0] - pnt1[1] + pnt2[1], pntA[1] + pnt1[0] - pnt2[0]];
  const pntC = [(pnt1[0] + pnt3[0]) / 2, (pnt1[1] + pnt3[1]) / 2];
  const pntD = [pntC[0] - pnt1[1] + pnt3[1], pntC[1] + pnt1[0] - pnt3[0]];
  return PlotUtils.getIntersectPoint(pntA, pntB, pntC, pntD);
};

PlotUtils.getIntersectPoint = function (pntA, pntB, pntC, pntD) {
  if (pntA[1] === pntB[1]) {
    const f = (pntD[0] - pntC[0]) / (pntD[1] - pntC[1]);
    const x = f * (pntA[1] - pntC[1]) + pntC[0];
    const y = pntA[1];
    return [x, y];
  }
  if (pntC[1] === pntD[1]) {
    const e = (pntB[0] - pntA[0]) / (pntB[1] - pntA[1]);
    const x = e * (pntC[1] - pntA[1]) + pntA[0];
    const y = pntC[1];
    return [x, y];
  }
  const e = (pntB[0] - pntA[0]) / (pntB[1] - pntA[1]);
  const f = (pntD[0] - pntC[0]) / (pntD[1] - pntC[1]);
  const y = (e * pntA[1] - pntA[0] - f * pntC[1] + pntC[0]) / (e - f);
  const x = e * y - e * pntA[1] + pntA[0];
  return [x, y];
};

PlotUtils.getAzimuth = function (startPnt, endPnt) {
  let azimuth;
  const angle = Math.asin(Math.abs(endPnt[1] - startPnt[1]) / PlotUtils.distance(startPnt, endPnt));
  if (endPnt[1] >= startPnt[1] && endPnt[0] >= startPnt[0])
    azimuth = angle + Math.PI;
  else if (endPnt[1] >= startPnt[1] && endPnt[0] < startPnt[0])
    azimuth = this.Constants.TWO_PI - angle;
  else if (endPnt[1] < startPnt[1] && endPnt[0] < startPnt[0])
    azimuth = angle;
  else if (endPnt[1] < startPnt[1] && endPnt[0] >= startPnt[0])
    azimuth = Math.PI - angle;
  return azimuth;
};

PlotUtils.getAngleOfThreePoints = function (pntA, pntB, pntC) {
  const angle = PlotUtils.getAzimuth(pntB, pntA) - PlotUtils.getAzimuth(pntB, pntC);
  return (angle < 0 ? angle + this.Constants.TWO_PI : angle);
};

PlotUtils.isClockWise = function (pnt1, pnt2, pnt3) {
  return ((pnt3[1] - pnt1[1]) * (pnt2[0] - pnt1[0]) > (pnt2[1] - pnt1[1]) * (pnt3[0] - pnt1[0]));
};

PlotUtils.getPointOnLine = function (t, startPnt, endPnt) {
  const x = startPnt[0] + (t * (endPnt[0] - startPnt[0]));
  const y = startPnt[1] + (t * (endPnt[1] - startPnt[1]));
  return [x, y];
};

PlotUtils.getCubicValue = function (t, startPnt, cPnt1, cPnt2, endPnt) {
  t = Math.max(Math.min(t, 1), 0);
  const tp = 1 - t;
  const t2 = t * t;
  const t3 = t2 * t;
  const tp2 = tp * tp;
  const tp3 = tp2 * tp;
  const x = (tp3 * startPnt[0]) + (3 * tp2 * t * cPnt1[0]) + (3 * tp * t2 * cPnt2[0]) + (t3 * endPnt[0]);
  const y = (tp3 * startPnt[1]) + (3 * tp2 * t * cPnt1[1]) + (3 * tp * t2 * cPnt2[1]) + (t3 * endPnt[1]);
  return [x, y];
};

PlotUtils.getThirdPoint = function (startPnt, endPnt, angle, distance, clockWise) {
  const azimuth = PlotUtils.getAzimuth(startPnt, endPnt);
  const alpha = clockWise ? azimuth + angle : azimuth - angle;
  const dx = distance * Math.cos(alpha);
  const dy = distance * Math.sin(alpha);
  return [endPnt[0] + dx, endPnt[1] + dy];
};

PlotUtils.getArcPoints = function (center, radius, startAngle, endAngle) {
  let x, y;
  const pnts = [];
  let angleDiff = endAngle - startAngle;
  angleDiff = angleDiff < 0 ? angleDiff + this.Constants.TWO_PI : angleDiff;
  for (let i = 0; i <= this.Constants.FITTING_COUNT; i++) {
    const angle = startAngle + angleDiff * i / this.Constants.FITTING_COUNT;
    x = center[0] + radius * Math.cos(angle);
    y = center[1] + radius * Math.sin(angle);
    // pnts.push([x, y]);
    pnts.push([PlotUtils.mercatorToWGS([x, y])[0], PlotUtils.mercatorToWGS([x, y])[1]]);

  }
  return pnts;
};

PlotUtils.getBisectorNormals = function (t, pnt1, pnt2, pnt3) {
  const normal = PlotUtils.getNormal(pnt1, pnt2, pnt3);
  const dist = Math.sqrt(normal[0] * normal[0] + normal[1] * normal[1]);
  const uX = normal[0] / dist;
  const uY = normal[1] / dist;
  const d1 = PlotUtils.distance(pnt1, pnt2);
  const d2 = PlotUtils.distance(pnt2, pnt3);
  let bisectorNormalRight, bisectorNormalLeft;
  if (dist > this.Constants.ZERO_TOLERANCE) {
    if (PlotUtils.isClockWise(pnt1, pnt2, pnt3)) {
      let dt = t * d1;
      let x = pnt2[0] - dt * uY;
      let y = pnt2[1] + dt * uX;
      bisectorNormalRight = [x, y];
      dt = t * d2;
      x = pnt2[0] + dt * uY;
      y = pnt2[1] - dt * uX;
      bisectorNormalLeft = [x, y];
    } else {
      let dt = t * d1;
      let x = pnt2[0] + dt * uY;
      let y = pnt2[1] - dt * uX;
      bisectorNormalRight = [x, y];
      dt = t * d2;
      x = pnt2[0] - dt * uY;
      y = pnt2[1] + dt * uX;
      bisectorNormalLeft = [x, y];
    }
  } else {
    let x = pnt2[0] + t * (pnt1[0] - pnt2[0]);
    let y = pnt2[1] + t * (pnt1[1] - pnt2[1]);
    bisectorNormalRight = [x, y];
    x = pnt2[0] + t * (pnt3[0] - pnt2[0]);
    y = pnt2[1] + t * (pnt3[1] - pnt2[1]);
    bisectorNormalLeft = [x, y];
  }
  return [bisectorNormalRight, bisectorNormalLeft];
};

PlotUtils.getNormal = function (pnt1, pnt2, pnt3) {
  let dX1 = pnt1[0] - pnt2[0];
  let dY1 = pnt1[1] - pnt2[1];
  const d1 = Math.sqrt(dX1 * dX1 + dY1 * dY1);
  dX1 /= d1;
  dY1 /= d1;

  let dX2 = pnt3[0] - pnt2[0];
  let dY2 = pnt3[1] - pnt2[1];
  const d2 = Math.sqrt(dX2 * dX2 + dY2 * dY2);
  dX2 /= d2;
  dY2 /= d2;

  const uX = dX1 + dX2;
  const uY = dY1 + dY2;
  return [uX, uY];
};

PlotUtils.getCurvePoints = function (t, controlPoints) {
  const leftControl = PlotUtils.getLeftMostControlPoint(t, controlPoints);
  let normals = [leftControl];
  for (let i = 0; i < controlPoints.length - 2; i++) {
    const pnt1 = controlPoints[i];
    const pnt2 = controlPoints[i + 1];
    const pnt3 = controlPoints[i + 2];
    const normalPoints = PlotUtils.getBisectorNormals(t, pnt1, pnt2, pnt3);
    normals = normals.concat(normalPoints);
  }
  const rightControl = PlotUtils.getRightMostControlPoint(t, controlPoints);
  normals.push(rightControl);
  const points = [];
  for (let i = 0; i < controlPoints.length - 1; i++) {
    const pnt1 = controlPoints[i];
    const pnt2 = controlPoints[i + 1];
    points.push(pnt1);
    for (let t = 0; t < this.Constants.FITTING_COUNT; t++) {
      const pnt = PlotUtils.getCubicValue(t / this.Constants.FITTING_COUNT, pnt1, normals[i * 2], normals[i * 2 + 1], pnt2);
      points.push(pnt);
    }
    points.push(pnt2);
  }
  return points;
};

PlotUtils.getLeftMostControlPoint = function (t, controlPoints) {
  const pnt1 = controlPoints[0];
  const pnt2 = controlPoints[1];
  const pnt3 = controlPoints[2];
  const pnts = PlotUtils.getBisectorNormals(0, pnt1, pnt2, pnt3);
  const normalRight = pnts[0];
  const normal = PlotUtils.getNormal(pnt1, pnt2, pnt3);
  const dist = Math.sqrt(normal[0] * normal[0] + normal[1] * normal[1]);
  let controlX, controlY;
  if (dist > this.Constants.ZERO_TOLERANCE) {
    const mid = PlotUtils.mid(pnt1, pnt2);
    const pX = pnt1[0] - mid[0];
    const pY = pnt1[1] - mid[1];

    const d1 = PlotUtils.distance(pnt1, pnt2);
    // normal at midpoint
    const n = 2.0 / d1;
    const nX = -n * pY;
    const nY = n * pX;

    // upper triangle of symmetric transform matrix
    const a11 = nX * nX - nY * nY;
    const a12 = 2 * nX * nY;
    const a22 = nY * nY - nX * nX;

    const dX = normalRight[0] - mid[0];
    const dY = normalRight[1] - mid[1];

    // coordinates of reflected vector
    controlX = mid[0] + a11 * dX + a12 * dY;
    controlY = mid[1] + a12 * dX + a22 * dY;
  } else {
    controlX = pnt1[0] + t * (pnt2[0] - pnt1[0]);
    controlY = pnt1[1] + t * (pnt2[1] - pnt1[1]);
  }
  return [controlX, controlY];
};

PlotUtils.getRightMostControlPoint = function (t, controlPoints) {
  const count = controlPoints.length;
  const pnt1 = controlPoints[count - 3];
  const pnt2 = controlPoints[count - 2];
  const pnt3 = controlPoints[count - 1];
  const pnts = PlotUtils.getBisectorNormals(0, pnt1, pnt2, pnt3);
  const normalLeft = pnts[1];
  const normal = PlotUtils.getNormal(pnt1, pnt2, pnt3);
  const dist = Math.sqrt(normal[0] * normal[0] + normal[1] * normal[1]);
  let controlX, controlY;
  if (dist > this.Constants.ZERO_TOLERANCE) {
    const mid = PlotUtils.mid(pnt2, pnt3);
    const pX = pnt3[0] - mid[0];
    const pY = pnt3[1] - mid[1];

    const d1 = PlotUtils.distance(pnt2, pnt3);
    // normal at midpoint
    const n = 2.0 / d1;
    const nX = -n * pY;
    const nY = n * pX;

    // upper triangle of symmetric transform matrix
    const a11 = nX * nX - nY * nY;
    const a12 = 2 * nX * nY;
    const a22 = nY * nY - nX * nX;

    const dX = normalLeft[0] - mid[0];
    const dY = normalLeft[1] - mid[1];

    // coordinates of reflected vector
    controlX = mid[0] + a11 * dX + a12 * dY;
    controlY = mid[1] + a12 * dX + a22 * dY;
  } else {
    controlX = pnt3[0] + t * (pnt2[0] - pnt3[0]);
    controlY = pnt3[1] + t * (pnt2[1] - pnt3[1]);
  }
  return [controlX, controlY];
};

PlotUtils.getBezierPoints = function (points) {
  if (points.length <= 2)
    return points;

  const bezierPoints = [];
  const n = points.length - 1;
  for (let t = 0; t <= 1; t += 0.01) {
    let x = 0, y = 0;
    for (let index = 0; index <= n; index++) {
      const factor = PlotUtils.getBinomialFactor(n, index);
      const a = Math.pow(t, index);
      const b = Math.pow((1 - t), (n - index));
      x += factor * a * b * points[index][0];
      y += factor * a * b * points[index][1];
    }
    bezierPoints.push([x, y]);
  }
  bezierPoints.push(points[n]);
  return bezierPoints;
};

PlotUtils.getBinomialFactor = function (n, index) {
  return PlotUtils.getFactorial(n) / (PlotUtils.getFactorial(index) * PlotUtils.getFactorial(n - index));
};

PlotUtils.getFactorial = function (n) {
  if (n <= 1)
    return 1;
  if (n === 2)
    return 2;
  if (n === 3)
    return 6;
  if (n === 4)
    return 24;
  if (n === 5)
    return 120;
  let result = 1;
  for (let i = 1; i <= n; i++)
    result *= i;
  return result;
};

PlotUtils.getQBSplinePoints = function (points) {
  if (points.length <= 2)
    return points;

  const n = 2;

  const bSplinePoints = [];
  const m = points.length - n - 1;
  bSplinePoints.push(points[0]);
  for (let i = 0; i <= m; i++) {
    for (let t = 0; t <= 1; t += 0.05) {
      let x = 0;
      let y = 0;
      for (let k = 0; k <= n; k++) {
        const factor = PlotUtils.getQuadricBSplineFactor(k, t);
        x += factor * points[i + k][0];
        y += factor * points[i + k][1];
      }
      bSplinePoints.push([x, y]);
    }
  }
  bSplinePoints.push(points[points.length - 1]);
  return bSplinePoints;
};

PlotUtils.getQuadricBSplineFactor = function (k, t) {
  if (k === 0)
    return Math.pow(t - 1, 2) / 2;
  if (k === 1)
    return (-2 * Math.pow(t, 2) + 2 * t + 1) / 2;
  if (k === 2)
    return Math.pow(t, 2) / 2;
  return 0;
};
export default PlotUtils;
