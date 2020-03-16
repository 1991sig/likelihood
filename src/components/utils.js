import { range } from "d3-array";

export const logLik = (y, mu, sigma2) => {
  const LL =
    -0.5 * Math.log(2 * Math.PI * sigma2) -
    Math.pow(y - mu, 2) / (2 * sigma2);
  return LL;
};

export const calcMean = d => d.reduce((a, b) => a + b, 0) / d.length;
export const calcSS = (d, mu) =>
  d.map(y => Math.pow(y - mu, 2)).reduce((a, b) => a + b, 0);

export const logLikSum = (d, mu, sigma2) => {
  const n = d.length;
  const SS = calcSS(d, mu);
  const LL =
    (-1 / 2) * n * Math.log(2 * Math.PI) -
    n * Math.log(Math.sqrt(sigma2)) -
    SS / (2 * sigma2);
  return LL;
};
export const estimatedLogLik = (n, mu, x, sigma2) => {
  return ((-1 / 2) * n * Math.pow(x - mu, 2)) / (sigma2);
};
export const genEstLogLikCurve = (n, muHat, sigma2, muMLE, sigma2MLE) => {
  const sigmaMLE = Math.sqrt(sigma2MLE);
  const xStart = muMLE - 5 * sigmaMLE;
  const xEnd = muMLE + 5 * sigmaMLE;
  const x = range(xStart, xEnd, Math.abs(xStart - xEnd) / 50);
  const y = x.map(x => estimatedLogLik(n, muHat, x, sigma2));

  const tmp = [];
  for (var i = 0; i < x.length; i++) {
    tmp.push([x[i], y[i]]);
  }
  var data = {
    data: tmp,
    x: x,
    y: y
  };
  return data;
};
// TODO
// xStart, sigma2, n, muHat and SS should be precomputed;
export const dMu = (n, mu, muHat, sigma2) => {
  return (1 / sigma2) * n * (muHat - mu);
};
export const d2Mu = (n, sigma2) => {
  return -n / (sigma2);
};
export const dSigma2 = (d, mu, sigma2) => {
  const n = d.length;
  return -n / (2 * sigma2) + calcSS(d, mu) / (2 * sigma2 * sigma2);
};
export const d2Sigma2 = (d, mu, sigma2) => {
  const n = d.length;
  return n*(1/(Math.pow(sigma2, 2)) - (calcSS(d, mu) / Math.pow(sigma2, 3)));
}

// Other
export const topTooltipPath = (width, height, offset, radius) => {
  // Function by Michael Rovinsky
  // https://medium.com/welldone-software/tooltips-using-svg-path-1bd69cc7becd
  const left = -width / 2;
  const right = width / 2;
  const top = -offset - height;
  const bottom = -offset;
  return `M 0,0 
      L ${-offset},${bottom} 
      H ${left + radius}
      Q ${left},${bottom} ${left},${bottom - radius}  
      V ${top + radius}   
      Q ${left},${top} ${left + radius},${top}
      H ${right - radius}
      Q ${right},${top} ${right},${top + radius}
      V ${bottom - radius}
      Q ${right},${bottom} ${right - radius},${bottom}
      H ${offset} 
      L 0,0 z`;
};

//
export const quadraticApprox = (t, step, ll, gradient, hessian) => {
  return ll + gradient*(t/step) + 0.5 * hessian * Math.pow(t/step, 2);
}

export const newtonStep = (
  y,
  muPrev,
  muHat,
  sigma2Prev,
  sigma2MLE
) => {
  const step = 1;
  const gradientMu = dMu(10, muPrev, muHat, sigma2Prev);
  const hessianMu = 10 / sigma2Prev;
  const gradientSigma2 = dSigma2(y, muPrev, sigma2Prev);
  const hessianSigma2 = -10 / (2 * sigma2Prev * sigma2Prev);
  const mu = muPrev + (step * gradientMu) / hessianMu;
  const sigma2 = sigma2Prev + (step * gradientSigma2) / -hessianSigma2;
  const points = {
    mu: mu,
    sigma2: sigma2
  };
  const TOOL = 0.0001;


  const convergence =
    Math.abs(sigma2 - sigma2MLE) < TOOL && Math.abs(mu - muHat) < TOOL;
  return { points: points, converged: convergence };
};