// Physics calculations, phase folding, and light curve modeling functions

import { LightCurvePoint } from '../types/astrophysics';

/**
 * Computes semi-major axis in Astronomical Units (AU) using Kepler's Third Law
 * a = (M_star * (P / 365.25)^2)^(1/3)
 */
export function calculateSemiMajorAxisAU(periodDays: number, massSolar: number): number {
  if (periodDays <= 0 || massSolar <= 0) return 0.05;
  const periodYears = periodDays / 365.25;
  return parseFloat(Math.cbrt(massSolar * Math.pow(periodYears, 2)).toFixed(4));
}

/**
 * Computes estimated planetary equilibrium temperature in Kelvin
 * Teq = T_star * sqrt(R_star / (2 * a)) * (1 - A_B)^(1/4)
 */
export function calculateEquilibriumTempK(
  teffHost: number,
  rStarSolar: number,
  semiMajorAxisAU: number,
  bondAlbedo: number = 0.3
): number {
  if (semiMajorAxisAU <= 0 || rStarSolar <= 0 || teffHost <= 0) return 300;
  const AU_TO_RSUN = 215.032;
  const aInRsun = semiMajorAxisAU * AU_TO_RSUN;
  const albedoFactor = Math.pow(1 - bondAlbedo, 0.25);
  const geometricFactor = Math.sqrt(rStarSolar / (2 * aInRsun));
  return Math.round(teffHost * geometricFactor * albedoFactor);
}

/**
 * Computes incident stellar flux relative to Earth (S_Earth = 1)
 */
export function calculateIncidentFluxEarth(
  teffHost: number,
  rStarSolar: number,
  semiMajorAxisAU: number
): number {
  if (semiMajorAxisAU <= 0) return 1;
  const T_SUN = 5778;
  const tempRatio = teffHost / T_SUN;
  return parseFloat(((Math.pow(rStarSolar, 2) / Math.pow(semiMajorAxisAU, 2)) * Math.pow(tempRatio, 4)).toFixed(1));
}

/**
 * Computes inferred planetary radius from transit depth
 * Rp = R_star * sqrt(delta)
 */
export function calculateCandidateRadius(
  transitDepthPercent: number,
  rStarSolar: number
): { rEarth: number; rJupiter: number } {
  const depthFraction = Math.max(0, transitDepthPercent / 100);
  const rpRstarRatio = Math.sqrt(depthFraction);
  const rpInSolarRadii = rpRstarRatio * rStarSolar;
  const rEarth = parseFloat((rpInSolarRadii * 109.2).toFixed(2));
  const rJupiter = parseFloat((rEarth / 11.209).toFixed(3));
  return { rEarth, rJupiter };
}

/**
 * Computes stellar density in g/cm^3
 */
export function calculateStellarDensity(massSolar: number, radiusSolar: number): number {
  if (radiusSolar <= 0) return 1.41;
  const solarDensity = 1.408; // g/cm^3
  return parseFloat((solarDensity * (massSolar / Math.pow(radiusSolar, 3))).toFixed(2));
}

/**
 * Chromatic significance statistical test
 */
export function computeChromaticSignificance(
  blueDepthPercent: number,
  blueErrPercent: number,
  redDepthPercent: number,
  redErrPercent: number
): {
  deltaDepth: number;
  deltaDepthErr: number;
  significanceSigma: number;
  verdict: 'Consistent with approximately achromatic transit' | 'Chromaticity detected — investigate blended-source hypothesis' | 'Inconclusive / Marginal';
} {
  const delta = blueDepthPercent - redDepthPercent;
  const pooledErr = Math.sqrt(Math.pow(blueErrPercent, 2) + Math.pow(redErrPercent, 2));
  const sigma = pooledErr > 0 ? Math.abs(delta) / pooledErr : 0;

  let verdict: 'Consistent with approximately achromatic transit' | 'Chromaticity detected — investigate blended-source hypothesis' | 'Inconclusive / Marginal';
  if (sigma >= 3.0) {
    verdict = 'Chromaticity detected — investigate blended-source hypothesis';
  } else if (sigma <= 1.5) {
    verdict = 'Consistent with approximately achromatic transit';
  } else {
    verdict = 'Inconclusive / Marginal';
  }

  return {
    deltaDepth: parseFloat(delta.toFixed(3)),
    deltaDepthErr: parseFloat(pooledErr.toFixed(3)),
    significanceSigma: parseFloat(sigma.toFixed(2)),
    verdict
  };
}

/**
 * Simplified analytical transit model with quadratic limb darkening (Mandel & Agol 2002 approximation)
 */
export function evaluateTransitModel(
  timeHours: number,
  depthPercent: number,
  durationHours: number,
  ingressHours: number,
  impactParameter: number = 0.2
): number {
  const absT = Math.abs(timeHours);
  const halfDuration = durationHours / 2;
  const halfFlat = Math.max(0, halfDuration - ingressHours);

  // Out of transit
  if (absT >= halfDuration) {
    return 1.0;
  }

  const depthFraction = depthPercent / 100;

  // Fully in-transit flat bottom (with limb darkening effect)
  if (absT <= halfFlat) {
    const normDist = absT / (halfFlat || 0.01);
    const limbDarkeningEffect = 1.0 - 0.15 * Math.pow(normDist, 2) * (1 - Math.min(0.9, impactParameter));
    return 1.0 - depthFraction * limbDarkeningEffect;
  }

  // Ingress / Egress transition zone
  const progressInIngress = (halfDuration - absT) / (ingressHours || 0.01);
  const smoothFactor = Math.sin((progressInIngress * Math.PI) / 2);
  return 1.0 - depthFraction * Math.max(0, Math.min(1, smoothFactor));
}

/**
 * Generates synthetic light curve points with photometric noise and residuals
 */
export function generateSyntheticLightCurve(
  depthPercent: number,
  durationHours: number,
  ingressHours: number,
  noiseStdDevPercent: number = 0.04,
  pointCount: number = 85,
  filterName: 'TESS (broad)' | 'g-band (blue)' | 'z-band (red)' = 'TESS (broad)',
  impactParameter: number = 0.2
): LightCurvePoint[] {
  const points: LightCurvePoint[] = [];
  const timeSpan = durationHours * 1.6;
  const dt = (2 * timeSpan) / pointCount;

  let seed = filterName === 'g-band (blue)' ? 1337 : filterName === 'z-band (red)' ? 4242 : 9999;
  const pseudoRandom = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  const gaussianNoise = (std: number) => {
    const u1 = Math.max(1e-6, pseudoRandom());
    const u2 = pseudoRandom();
    return Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2) * std;
  };

  for (let i = 0; i <= pointCount; i++) {
    const time = parseFloat((-timeSpan + i * dt).toFixed(3));
    const model = evaluateTransitModel(time, depthPercent, durationHours, ingressHours, impactParameter);
    const noise = gaussianNoise(noiseStdDevPercent / 100);
    const flux = parseFloat((model + noise).toFixed(6));
    const fluxErr = parseFloat((noiseStdDevPercent / 100).toFixed(6));

    points.push({
      time,
      rawTime: 2459000.0 + 10.0 + time / 24.0,
      flux,
      fluxErr,
      modelFlux: parseFloat(model.toFixed(6)),
      residual: parseFloat((flux - model).toFixed(6)),
      filter: filterName
    });
  }

  return points;
}

/**
 * Generates multi-sector raw unfolded time series (with multiple transits over ~27 days)
 */
export function generateRawUnfoldedLightCurve(
  periodDays: number,
  depthPercent: number,
  durationHours: number,
  ingressHours: number,
  totalDays: number = 27.4,
  cadenceMinutes: number = 30
): LightCurvePoint[] {
  const points: LightCurvePoint[] = [];
  const dtDays = cadenceMinutes / (24 * 60);
  const totalPoints = Math.floor(totalDays / dtDays);
  const t0 = 2459000.0 + 3.2; // First transit epoch

  let seed = 7777;
  const pseudoRandom = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  const gaussianNoise = (std: number) => {
    const u1 = Math.max(1e-6, pseudoRandom());
    const u2 = pseudoRandom();
    return Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2) * std;
  };

  for (let i = 0; i < totalPoints; i++) {
    const bjd = 2459000.0 + i * dtDays;
    // Calculate phase relative to period
    const phaseDays = ((bjd - t0) % periodDays + periodDays) % periodDays;
    const timeFromTransitHours = (phaseDays > periodDays / 2 ? phaseDays - periodDays : phaseDays) * 24;

    const model = evaluateTransitModel(timeFromTransitHours, depthPercent, durationHours, ingressHours, 0.2);
    // Baseline stellar variability + noise
    const stellarVariability = 0.0003 * Math.sin((2 * Math.PI * bjd) / 8.5);
    const noise = gaussianNoise(0.00045);
    const flux = parseFloat((model + stellarVariability + noise).toFixed(6));

    points.push({
      time: parseFloat(timeFromTransitHours.toFixed(3)),
      rawTime: parseFloat(bjd.toFixed(4)),
      flux,
      fluxErr: 0.00045,
      modelFlux: parseFloat(model.toFixed(6)),
      residual: parseFloat((flux - model).toFixed(6)),
      filter: 'TESS (broad)'
    });
  }

  return points;
}

/**
 * Phase-folds a raw time series given an arbitrary period and epoch
 */
export function phaseFoldTimeSeries(
  points: LightCurvePoint[],
  periodDays: number,
  epochBjd: number
): LightCurvePoint[] {
  if (!points.length || periodDays <= 0) return points;

  return points.map(p => {
    const rawT = p.rawTime ?? (2459000.0 + p.time / 24.0);
    const phaseDays = ((rawT - epochBjd) % periodDays + periodDays) % periodDays;
    const timeHours = (phaseDays > periodDays / 2 ? phaseDays - periodDays : phaseDays) * 24;

    return {
      ...p,
      time: parseFloat(timeHours.toFixed(4))
    };
  }).sort((a, b) => a.time - b.time);
}

/**
 * Bins light curve points into equal time intervals to reduce high-frequency noise
 */
export function binLightCurve(
  points: LightCurvePoint[],
  binSizeHours: number = 0.1
): LightCurvePoint[] {
  if (points.length <= 1 || binSizeHours <= 0) return points;

  const sorted = [...points].sort((a, b) => a.time - b.time);
  const binned: LightCurvePoint[] = [];

  let currentBin: LightCurvePoint[] = [];
  let binStartTime = sorted[0].time;

  for (const p of sorted) {
    if (p.time - binStartTime <= binSizeHours) {
      currentBin.push(p);
    } else {
      if (currentBin.length > 0) {
        const meanTime = currentBin.reduce((acc, pt) => acc + pt.time, 0) / currentBin.length;
        const meanFlux = currentBin.reduce((acc, pt) => acc + pt.flux, 0) / currentBin.length;
        const meanModel = currentBin[0].modelFlux !== undefined
          ? currentBin.reduce((acc, pt) => acc + (pt.modelFlux || 1), 0) / currentBin.length
          : undefined;
        const pooledErr = Math.sqrt(currentBin.reduce((acc, pt) => acc + Math.pow(pt.fluxErr, 2), 0)) / currentBin.length;

        binned.push({
          time: parseFloat(meanTime.toFixed(4)),
          flux: parseFloat(meanFlux.toFixed(6)),
          fluxErr: parseFloat(pooledErr.toFixed(6)),
          modelFlux: meanModel ? parseFloat(meanModel.toFixed(6)) : undefined,
          residual: meanModel ? parseFloat((meanFlux - meanModel).toFixed(6)) : undefined,
          filter: currentBin[0].filter
        });
      }
      currentBin = [p];
      binStartTime = p.time;
    }
  }

  return binned;
}
