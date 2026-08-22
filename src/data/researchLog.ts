import { PipelineStepDetail } from '../types/astrophysics';

export interface ResearchLogEntry {
  id: string;
  date: string;
  category: 'Hypothesis' | 'Architecture' | 'Data Ingestion' | 'Diagnostic Testing' | 'Validation';
  title: string;
  summary: string;
  technicalDetails: string;
}

export const RESEARCH_LOG_ENTRIES: ResearchLogEntry[] = [
  {
    id: 'log-01',
    date: '2025-11-12',
    category: 'Hypothesis',
    title: 'Research Question & Hypothesis Formalized',
    summary: 'Framed primary objective to investigate whether combining chromaticity, morphology, and physical plausibility reduces ambiguous TOI false-positive candidate triage workloads.',
    technicalDetails: 'Defined null hypothesis: individual single-band morphology heuristics have false-positive alarm rates indistinguishable from random unblended triage without multi-color constraints.'
  },
  {
    id: 'log-02',
    date: '2025-12-04',
    category: 'Architecture',
    title: 'Multi-Band Ground Photometry Requirement Identified',
    summary: 'Clarified architectural boundary: TESS single broad optical passband (600–1000 nm) does not provide separate color channels. Multi-band module structured to ingest ExoFOP/MuSCAT follow-up.',
    technicalDetails: 'Established data availability fallback: candidates lacking ground multi-filter observations bypass Pillar 1 gracefully rather than generating ungrounded classifications.'
  },
  {
    id: 'log-03',
    date: '2026-01-18',
    category: 'Diagnostic Testing',
    title: 'Mandel-Agol Limb Darkening Transit Fitting Benchmark',
    summary: 'Implemented quadratic limb darkening transit profile fitting and tested against synthetic light curve injections with Gaussian photometric noise.',
    technicalDetails: 'Verified that for central transits (b < 0.3), limb darkening causes a curved floor that distinguishes complete occultation from grazing linear V-shapes.'
  },
  {
    id: 'log-04',
    date: '2026-02-09',
    category: 'Diagnostic Testing',
    title: 'Chromatic Significance Metric Refinement',
    summary: 'Adopted Welch pooled standard error formulation for chromatic delta significance testing (sigma = |Delta delta| / sqrt(sigma_b^2 + sigma_r^2)).',
    technicalDetails: 'Set 3.0-sigma threshold for flagging blended eclipsing binary contamination, avoiding false alarms on minor atmospheric Rayleigh scattering signals (10–100 ppm).'
  },
  {
    id: 'log-05',
    date: '2026-03-01',
    category: 'Validation',
    title: 'Ablation Study Architecture & Error Taxonomy Formulated',
    summary: 'Structured 7-configuration ablation test plan to evaluate individual and pairwise contributions of Chromaticity, Morphology, and Plausibility.',
    technicalDetails: 'Established error taxonomy categorizing failure modes: grazing parameter degeneracy, cool blended contaminants, and unconstrained stellar densities.'
  }
];

export const PIPELINE_STEPS_DETAILED: PipelineStepDetail[] = [
  {
    stepIndex: 1,
    id: 'raw_ingestion',
    name: 'Raw Photometry Ingestion',
    category: 'Ingestion',
    inputs: ['TESS SPOC 2-minute cadence FITS target pixel files', 'ExoFOP ground follow-up tables (g, r, i, z)'],
    operations: ['Parse FITS binary tables', 'Extract BJD timestamps, SAP & PDCSAP flux arrays', 'Coordinate cross-matching with TIC v8.2'],
    qualityControls: ['Header checksum verification', 'Timestamp monotonicity check', 'Pixel saturation flag screening'],
    outputs: ['Standardized multi-band time-series arrays', 'Target coordinate & magnitude dictionary'],
    scientificRationale: 'Wide-field astronomical surveys produce diverse photometric formats requiring standardized calibration before time-series processing.',
    limitations: 'Large pixel apertures (21"/px in TESS) mean background blending is inherent in raw aperture photometry.'
  },
  {
    stepIndex: 2,
    id: 'quality_control',
    name: 'Data Quality & Integrity Screening',
    category: 'Preprocessing',
    inputs: ['Calibrated flux arrays', 'Uncertainty vectors', 'TESS quality bitmask flags'],
    operations: ['3-sigma baseline outlier rejection', 'Gapped sector boundary masking', 'Calculation of photometric completeness & SNR'],
    qualityControls: ['Minimum 5.0 SNR threshold', 'Out-of-transit baseline duration >3x transit duration', 'Rejection of momentum dump anomalies'],
    outputs: ['Masked, clean time-series flux', 'Candidate Data Quality rating (Good / Limited / Insufficient)'],
    scientificRationale: 'Preventing observational and instrumental systematics from propagating into physical fitting parameters.',
    limitations: 'Severe stellar flare activity or spacecraft jitter can cause data loss requiring manual inspection.'
  },
  {
    stepIndex: 3,
    id: 'normalization_detrending',
    name: 'Normalization & Stellar Detrending',
    category: 'Preprocessing',
    inputs: ['Clean time series', 'Transit epoch (t0) and orbital period (P)'],
    operations: ['Mask in-transit points', 'Iterative spline / Gaussian Process baseline regression', 'Flux division to normalize out-of-transit median to 1.0000'],
    qualityControls: ['Ensure transit depth attenuation is <0.01%', 'Residual baseline flatness test (RMS < 300 ppm)'],
    outputs: ['Detrended, normalized flux time series'],
    scientificRationale: 'Eliminating rotational stellar spot modulation and instrumental temperature drifts while preserving transit profile depth.',
    limitations: 'Rapid stellar pulsations with periods comparable to transit duration can distort ingress/egress profiles.'
  },
  {
    stepIndex: 4,
    id: 'transit_characterization',
    name: 'Phase Folding & Ephemeris Stacking',
    category: 'Feature Extraction',
    inputs: ['Normalized flux', 'Orbital period P', 'Transit center t0'],
    operations: ['Modulo phase conversion: phi = ((t - t0) % P) / P', 'Time-to-center conversion: t_center = phi * P', 'Multi-transit stacking'],
    qualityControls: ['Ephemeris drift check (O-C timing residuals)', 'Phase coverage uniformity check'],
    outputs: ['Phased light curve array with folded transits centered at t = 0'],
    scientificRationale: 'Stretching signal-to-noise ratio by coherent stacking of repeated transit occurrences.',
    limitations: 'Transit Timing Variations (TTVs) caused by neighboring planets can blur stacked ingress contacts if not corrected.'
  },
  {
    stepIndex: 5,
    id: 'feature_extraction',
    name: 'Mandel-Agol Profile Fitting',
    category: 'Feature Extraction',
    inputs: ['Phased light curve points'],
    operations: ['Non-linear Levenberg-Marquardt & MCMC profile fitting', 'Extraction of depth delta, duration T14, ingress T12, egress T34', 'Residual Gaussianity test (Kolmogorov-Smirnov)'],
    qualityControls: ['Convergence criteria tolerance < 1e-6', 'Parameter covariance evaluation', 'Residual scatter inspection'],
    outputs: ['Fitted transit parameters with 1-sigma uncertainty intervals'],
    scientificRationale: 'Extracting physical geometric constraints (duration, ingress steepness, limb darkening) from time-series profile.',
    limitations: 'Limb darkening coefficients depend on host star surface gravity and temperature estimates from catalogs.'
  },
  {
    stepIndex: 6,
    id: 'pillar_chromaticity',
    name: 'Pillar 1: Chromaticity Module',
    category: 'Diagnostic',
    inputs: ['Short-wavelength depth (delta_blue)', 'Long-wavelength depth (delta_red)', 'Follow-up filter passbands'],
    operations: ['Calculate chromatic delta: Delta_delta = delta_blue - delta_red', 'Calculate significance: sigma = |Delta_delta| / sqrt(sigma_b^2 + sigma_r^2)', 'Achromatic consistency testing'],
    qualityControls: ['Check multi-band data availability (gracefully bypass if unavailable)', 'Check for differential atmospheric extinction artifacts'],
    outputs: ['Chromaticity diagnostic report & significance metric'],
    scientificRationale: 'A genuine opaque planetary transit is approximately achromatic to first order; blended background binaries exhibit color-dependent dilution.',
    limitations: 'Inactive on single-band TESS data; requires ground follow-up observations.'
  },
  {
    stepIndex: 7,
    id: 'pillar_morphology',
    name: 'Pillar 2: Morphology Module',
    category: 'Diagnostic',
    inputs: ['Total duration T14', 'Ingress duration T12', 'Fitted impact parameter b', 'Symmetry index'],
    operations: ['Evaluate ingress-to-total ratio: tau/T = (T12+T34)/2T14', 'Test for flat-bottom limb-darkened floor vs V-shaped profile', 'Inspect residual RMS'],
    qualityControls: ['Signal-to-noise check on ingress slopes', 'Impact parameter confidence interval verification'],
    outputs: ['Morphology classification (Transit-like / Grazing / Asymmetric)'],
    scientificRationale: 'Geometry of transit reflects disk occultation vs high impact grazing geometry.',
    limitations: 'Grazing planets and blended binaries can share overlapping V-shaped morphologies.'
  },
  {
    stepIndex: 8,
    id: 'pillar_plausibility',
    name: 'Pillar 3: Astrophysical Plausibility',
    category: 'Diagnostic',
    inputs: ['Host Teff, R*, M*', 'Orbital period P', 'Transit depth delta'],
    operations: ['Calculate semi-major axis a = (G M* P^2 / 4pi^2)^(1/3)', 'Inferred candidate radius Rp = R* sqrt(delta)', 'Equilibrium temp Teq & incident flux Sinc', 'Fluid Roche tidal limit calculation', 'Stellar density cross-check'],
    qualityControls: ['Catalog parameter uncertainty propagation', 'Roche stability margin evaluation'],
    outputs: ['Physical plausibility status & parameter anomaly flags'],
    scientificRationale: 'Screens for unphysical inferred radii (>2.0 RJup) and extreme orbital configurations without dogmatic universal rejection.',
    limitations: 'Extreme genuine planets (ultra-hot Jupiters) must be preserved as screening flags rather than hard disqualifications.'
  },
  {
    stepIndex: 9,
    id: 'evidence_fusion',
    name: 'Multi-Diagnostic Evidence Synthesis',
    category: 'Synthesis',
    inputs: ['Pillar 1, 2, 3 diagnostic vectors', 'Data Quality metrics', 'Evidence for and counter-evidence lists'],
    operations: ['Multi-risk matrix synthesis', 'Assign overall assessment (Low Concern / Review Required / Potential False-Positive / Insufficient Data)', 'Build structured textual justification for every flag'],
    qualityControls: ['Ensure every flag is paired with physical reasoning', 'Formulate targeted ground follow-up recommendations'],
    outputs: ['Synthesized candidate evidence model'],
    scientificRationale: 'Combining three complementary physical dimensions creates a stronger screening signal than any single diagnostic alone.',
    limitations: 'Screening triage model; does not provide a Bayesian joint probability distribution over galactic stellar models.'
  },
  {
    stepIndex: 10,
    id: 'candidate_assessment',
    name: 'Explainable Candidate Report & Prioritization',
    category: 'Synthesis',
    inputs: ['Synthesized evidence model', 'Candidate metadata'],
    operations: ['Generate transparent candidate assessment report', 'Prioritize candidate into validation follow-up queues', 'Export formatted report'],
    qualityControls: ['Human review checklist generation', 'Reproducibility verification'],
    outputs: ['Explainable Candidate Report', 'Targeted Follow-up Strategy'],
    scientificRationale: 'Accelerate science community follow-up by prioritizing high-confidence targets and unmasking false-positive configurations.',
    limitations: 'Final planet confirmation requires high-precision radial velocity mass measurement or transmission spectroscopy.'
  }
];
