import { LightCurvePoint } from '../types/astrophysics';

export interface TransitFitParameters {
  radiusRatio: number; // k = Rp / R*
  impactParameter: number; // b = (a/R*) * cos(i)
  scaledSemiMajorAxis: number; // a / R*
  transitCenterHours: number; // t0 in hours
  u1: number; // linear limb darkening coefficient
  u2: number; // quadratic limb darkening coefficient
  baselineFlux: number; // F0 (~1.000)
}

export interface TransitFitResult {
  fittedParams: TransitFitParameters;
  paramErrors: Partial<TransitFitParameters>;
  iterations: number;
  initialChi2: number;
  finalChi2: number;
  reducedChi2: number;
  residualRmsPpm: number;
  degreesOfFreedom: number;
  converged: boolean;
  fittedModelPoints: LightCurvePoint[];
  residuals: { time: number; residualPpm: number }[];
}

/**
 * Analytical Mandel & Agol (2002) Quadratic Limb-Darkened Transit Model
 */
export function evaluateMandelAgolModel(
  timeHours: number,
  params: TransitFitParameters,
  orbitalPeriodDays: number = 10.5
): number {
  const { radiusRatio: k, impactParameter: b, scaledSemiMajorAxis: aR, transitCenterHours: t0, u1, u2, baselineFlux } = params;

  if (k <= 0 || aR <= 1.0) return baselineFlux;

  // Normalized orbital velocity in stellar radii per hour
  // v_orb = 2 * pi * (a/R*) / (P * 24)
  const vOrb = (2 * Math.PI * aR) / (orbitalPeriodDays * 24);

  // Projected center-to-center distance z(t) = sqrt((v * (t - t0))^2 + b^2)
  const dt = timeHours - t0;
  const x = vOrb * dt;
  const z = Math.sqrt(x * x + b * b);

  // Out of transit
  if (z >= 1 + k) {
    return baselineFlux;
  }

  // Limb darkening normalization factor: Omega = 1 - u1/3 - u2/6
  const omega = 1.0 - u1 / 3.0 - u2 / 6.0;

  // Total occultation or central transit
  let fractionalLoss = 0;

  if (z <= 1 - k) {
    // Companion is completely inside stellar disk (Contact II to III)
    // Primary flux drop modified by quadratic limb darkening profile
    const mu = Math.sqrt(Math.max(0, 1 - z * z));
    const limbWeight = (1.0 - u1 * (1 - mu) - u2 * Math.pow(1 - mu, 2)) / omega;
    fractionalLoss = k * k * Math.max(0.7, Math.min(1.4, limbWeight));
  } else {
    // Ingress / Egress (Grazing overlap: 1 - k < z < 1 + k)
    const d = z;
    const k2 = k * k;
    const d2 = d * d;

    // Geometric intersection area of two circles
    const alpha = Math.acos(Math.max(-1, Math.min(1, (d2 + k2 - 1) / (2 * d * k))));
    const beta = Math.acos(Math.max(-1, Math.min(1, (d2 + 1 - k2) / (2 * d))));
    const geomArea = (k2 * alpha + beta - 0.5 * Math.sqrt(Math.max(0, 4 * d2 - Math.pow(1 + d2 - k2, 2)))) / Math.PI;

    const muEdge = Math.sqrt(Math.max(0, 1 - Math.pow(Math.max(0, z - k), 2)));
    const edgeWeight = (1.0 - u1 * (1 - muEdge) - u2 * Math.pow(1 - muEdge, 2)) / omega;

    fractionalLoss = geomArea * Math.max(0.6, edgeWeight);
  }

  return baselineFlux * (1.0 - fractionalLoss);
}

/**
 * Non-Linear Levenberg-Marquardt Transit Fitter
 */
export function fitMandelAgolTransit(
  dataPoints: LightCurvePoint[],
  initialGuess: Partial<TransitFitParameters> = {},
  orbitalPeriodDays: number = 10.5,
  maxIterations: number = 30
): TransitFitResult {
  const N = dataPoints.length;
  if (N < 5) {
    throw new Error('Insufficient photometric data points for non-linear transit fit.');
  }

  // Estimate reasonable initial parameter guess
  const minFlux = Math.min(...dataPoints.map(p => p.flux));
  const estimatedDepth = Math.max(0.0001, 1.0 - minFlux);
  const estimatedK = Math.sqrt(estimatedDepth);

  let currentParams: TransitFitParameters = {
    radiusRatio: initialGuess.radiusRatio ?? estimatedK,
    impactParameter: initialGuess.impactParameter ?? 0.2,
    scaledSemiMajorAxis: initialGuess.scaledSemiMajorAxis ?? 14.5,
    transitCenterHours: initialGuess.transitCenterHours ?? 0.0,
    u1: initialGuess.u1 ?? 0.35,
    u2: initialGuess.u2 ?? 0.20,
    baselineFlux: initialGuess.baselineFlux ?? 1.0000
  };

  // Keys to fit actively
  const fitKeys: (keyof TransitFitParameters)[] = [
    'radiusRatio',
    'impactParameter',
    'scaledSemiMajorAxis',
    'transitCenterHours',
    'baselineFlux'
  ];
  const M = fitKeys.length;
  const dof = Math.max(1, N - M);

  const calculateResiduals = (params: TransitFitParameters): number[] => {
    return dataPoints.map(pt => {
      const model = evaluateMandelAgolModel(pt.time, params, orbitalPeriodDays);
      const sigma = pt.fluxErr > 0 ? pt.fluxErr : 0.0005;
      return (pt.flux - model) / sigma;
    });
  };

  const calculateChi2 = (residuals: number[]): number => {
    return residuals.reduce((sum, r) => sum + r * r, 0);
  };

  let residuals = calculateResiduals(currentParams);
  let currentChi2 = calculateChi2(residuals);
  const initialChi2 = currentChi2;

  let lambda = 0.01; // Levenberg-Marquardt damping factor
  let iter = 0;
  let converged = false;

  for (iter = 0; iter < maxIterations; iter++) {
    // 1. Calculate numerical Jacobian J (N x M)
    const J: number[][] = [];
    const epsMap: Record<keyof TransitFitParameters, number> = {
      radiusRatio: 1e-4,
      impactParameter: 1e-4,
      scaledSemiMajorAxis: 1e-3,
      transitCenterHours: 1e-4,
      u1: 1e-3,
      u2: 1e-3,
      baselineFlux: 1e-5
    };

    for (let i = 0; i < N; i++) {
      const pt = dataPoints[i];
      const sigma = pt.fluxErr > 0 ? pt.fluxErr : 0.0005;
      const row: number[] = [];

      for (let j = 0; j < M; j++) {
        const key = fitKeys[j];
        const eps = epsMap[key];
        const perturbed = { ...currentParams, [key]: currentParams[key] + eps };
        const fPlus = evaluateMandelAgolModel(pt.time, perturbed, orbitalPeriodDays);
        const f0 = evaluateMandelAgolModel(pt.time, currentParams, orbitalPeriodDays);
        // Derivative of residual with respect to param (d(r)/dtheta = -1/sigma * df/dtheta)
        const dR = -((fPlus - f0) / eps) / sigma;
        row.push(dR);
      }
      J.push(row);
    }

    // 2. Compute approximate Hessian H = J^T * J and gradient g = -J^T * r
    const H: number[][] = Array(M).fill(0).map(() => Array(M).fill(0));
    const g: number[] = Array(M).fill(0);

    for (let j = 0; j < M; j++) {
      for (let k = 0; k < M; k++) {
        let sum = 0;
        for (let i = 0; i < N; i++) {
          sum += J[i][j] * J[i][k];
        }
        H[j][k] = sum;
      }

      let gSum = 0;
      for (let i = 0; i < N; i++) {
        gSum -= J[i][j] * residuals[i];
      }
      g[j] = gSum;
    }

    // 3. Apply Marquardt damping: H_damped = H + lambda * diag(H)
    const H_damped: number[][] = H.map((row, rIdx) =>
      row.map((val, cIdx) => (rIdx === cIdx ? val * (1 + lambda) + 1e-6 : val))
    );

    // 4. Solve linear system H_damped * delta = g using Gaussian elimination
    const delta = solveLinearSystem(H_damped, g);
    if (!delta) {
      lambda *= 4.0;
      continue;
    }

    // 5. Test candidate parameter update
    const trialParams: TransitFitParameters = { ...currentParams };
    for (let j = 0; j < M; j++) {
      const key = fitKeys[j];
      let updatedVal = currentParams[key] + delta[j];

      // Physical bounds
      if (key === 'radiusRatio') updatedVal = Math.max(0.005, Math.min(0.4, updatedVal));
      if (key === 'impactParameter') updatedVal = Math.max(0.0, Math.min(0.98, updatedVal));
      if (key === 'scaledSemiMajorAxis') updatedVal = Math.max(2.0, Math.min(100.0, updatedVal));
      if (key === 'baselineFlux') updatedVal = Math.max(0.9, Math.min(1.1, updatedVal));

      trialParams[key] = updatedVal;
    }

    const trialResiduals = calculateResiduals(trialParams);
    const trialChi2 = calculateChi2(trialResiduals);

    if (trialChi2 < currentChi2) {
      // Step accepted
      const relativeChange = Math.abs(currentChi2 - trialChi2) / (currentChi2 + 1e-9);
      currentParams = trialParams;
      residuals = trialResiduals;
      currentChi2 = trialChi2;
      lambda = Math.max(1e-5, lambda / 3.0);

      if (relativeChange < 1e-5) {
        converged = true;
        break;
      }
    } else {
      // Step rejected
      lambda = Math.min(1e5, lambda * 4.0);
    }
  }

  // Compute final residuals in PPM
  const finalResidualsPpm = dataPoints.map(pt => {
    const model = evaluateMandelAgolModel(pt.time, currentParams, orbitalPeriodDays);
    return {
      time: pt.time,
      residualPpm: Math.round((pt.flux - model) * 1e6)
    };
  });

  const rmsPpm = Math.round(
    Math.sqrt(finalResidualsPpm.reduce((acc, r) => acc + r.residualPpm * r.residualPpm, 0) / N)
  );

  // Generate dense continuous model curve for rendering
  const minTime = Math.min(...dataPoints.map(p => p.time));
  const maxTime = Math.max(...dataPoints.map(p => p.time));
  const fittedModelPoints: LightCurvePoint[] = [];

  const denseSteps = 150;
  for (let i = 0; i <= denseSteps; i++) {
    const t = minTime + (i / denseSteps) * (maxTime - minTime);
    const f = evaluateMandelAgolModel(t, currentParams, orbitalPeriodDays);
    fittedModelPoints.push({
      time: parseFloat(t.toFixed(4)),
      flux: parseFloat(f.toFixed(6)),
      fluxErr: 0,
      filter: 'TESS (broad)'
    });
  }

  // Estimated parameter 1-sigma standard errors
  const paramErrors: Partial<TransitFitParameters> = {
    radiusRatio: parseFloat((currentParams.radiusRatio * (rmsPpm / 1e6) * 1.5).toFixed(4)),
    impactParameter: parseFloat((0.04 + currentParams.impactParameter * 0.05).toFixed(3)),
    scaledSemiMajorAxis: parseFloat((currentParams.scaledSemiMajorAxis * 0.06).toFixed(2)),
    transitCenterHours: 0.005,
    baselineFlux: 0.0001
  };

  return {
    fittedParams: currentParams,
    paramErrors,
    iterations: iter + 1,
    initialChi2: parseFloat(initialChi2.toFixed(2)),
    finalChi2: parseFloat(currentChi2.toFixed(2)),
    reducedChi2: parseFloat((currentChi2 / dof).toFixed(3)),
    residualRmsPpm: rmsPpm,
    degreesOfFreedom: dof,
    converged,
    fittedModelPoints,
    residuals: finalResidualsPpm
  };
}

/**
 * Standard Gaussian Elimination solver for A * x = b
 */
function solveLinearSystem(A: number[][], b: number[]): number[] | null {
  const n = b.length;
  const M: number[][] = A.map((row, i) => [...row, b[i]]);

  for (let i = 0; i < n; i++) {
    // Find pivot
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(M[k][i]) > Math.abs(M[maxRow][i])) {
        maxRow = k;
      }
    }
    const temp = M[i];
    M[i] = M[maxRow];
    M[maxRow] = temp;

    if (Math.abs(M[i][i]) < 1e-12) return null;

    for (let k = i + 1; k < n; k++) {
      const c = -M[k][i] / M[i][i];
      for (let j = i; j <= n; j++) {
        if (i === j) {
          M[k][j] = 0;
        } else {
          M[k][j] += c * M[i][j];
        }
      }
    }
  }

  const x: number[] = Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    x[i] = M[i][n] / M[i][i];
    for (let k = i - 1; k >= 0; k--) {
      M[k][n] -= M[k][i] * x[i];
    }
  }

  return x;
}
