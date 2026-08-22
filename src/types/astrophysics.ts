// Types for Astrophysical Data, Evidence Modeling, and Trifecta Screening Framework

export type DiagnosticStatus = 'low_concern' | 'review_required' | 'false_positive_signature' | 'insufficient_data' | 'unavailable';

export type DataSourceType = 'OBSERVATIONAL DATA' | 'SIMULATED DATA' | 'SYNTHETIC DEMO' | 'DEMO DATA — NOT AN OBSERVATIONAL RESULT' | 'PUBLIC ARCHIVE' | 'FOLLOW-UP OBSERVATION';

export type DataQualityLevel = 'EXCELLENT' | 'GOOD' | 'MODERATE' | 'LIMITED' | 'INSUFFICIENT';

export interface LightCurvePoint {
  time: number; // Time in hours from transit center or BJD
  rawTime?: number; // Unfolded BJD timestamp
  flux: number; // Normalized flux (e.g. 1.0000)
  fluxErr: number;
  modelFlux?: number;
  residual?: number;
  filter?: 'TESS (broad)' | 'g-band (blue)' | 'z-band (red)' | 'r-band' | 'i-band' | string;
}

export type PhotometricPoint = LightCurvePoint;

export interface CandidateDataQuality {
  overallLevel: DataQualityLevel;
  signalToNoiseRatio: number;
  photometricCompleteness: number; // %
  baselineFlatnessRmsPpm: number;
  inTransitCoverage: number; // %
  hasGroundMultiBand: boolean;
  multiBandFilters: string[];
  flags: string[];
}

export interface ChromaticityDiagnostic {
  status: DiagnosticStatus;
  is_available?: boolean;
  blueBandDepth: number; // %
  blueBandDepthErr: number;
  redBandDepth: number; // %
  redBandDepthErr: number;
  deltaDepth: number; // blue - red in %
  deltaDepthErr: number;
  significanceSigma: number; // e.g. 0.16 sigma vs 7.2 sigma
  hasMultiBandData: boolean;
  missingDataReason?: string;
  filtersUsed: string[];
  scientificInterpretation: string;
  technicalDetails: string;
  notes?: string;
}

export interface MorphologyDiagnostic {
  status: DiagnosticStatus;
  transitDepth: number; // %
  transitDepthErr: number;
  totalDurationHours: number; // T14 in hours
  ingressDurationMin: number; // T12 in minutes
  egressDurationMin: number; // T34 in minutes
  ingressTotalRatio: number; // (T12 + T34) / 2T14
  symmetryScore: number; // 0 to 1
  shapeConsistency: string;
  residualRmsPpm: number;
  signalToNoiseRatio: number;
  scientificInterpretation: string;
  technicalDetails: string;
  notes?: string;
  fitted_k_radius_ratio?: number;
  fitted_impact_parameter_b?: number;
  fitted_scaled_a_rstar?: number;
}

export interface PlausibilityDiagnostic {
  status: DiagnosticStatus;
  hostStarTeftK: number; // Effective temperature in K
  hostStarRadiusSolar: number; // R_sun
  hostStarMassSolar: number; // M_sun
  hostSpectralType: string;
  orbitalPeriodDays: number;
  semiMajorAxisAU: number;
  candidateRadiusEarth: number; // R_earth
  candidateRadiusJupiter: number; // R_jup
  incidentFluxEarth: number; // S_inc (Earth = 1)
  equilibriumTempK: number; // T_eq assuming albedo
  rocheLimitAU: number;
  stellarDensityGcm3: number;
  photometricStellarDensityGcm3: number;
  parameterSpaceFlags: string[];
  scientificInterpretation: string;
  technicalDetails: string;
  notes?: string;
}

export interface EvidenceItem {
  type: 'supporting' | 'caution' | 'neutral' | string;
  pillar: 'chromaticity' | 'morphology' | 'plausibility' | 'neighbors' | 'data_quality' | string;
  summary: string;
  detail: string;
}

export interface GaiaNeighborSource {
  sourceId: string;
  ra: number;
  dec: number;
  separationArcsec: number;
  photGMeanMag: number;
  photBpMeanMag?: number;
  photRpMeanMag?: number;
  deltaMag: number; // difference in magnitude relative to target star
  isContaminantRisk: boolean; // separation <= 42" and deltaMag <= 4.5
  relativeFluxFraction: number; // estimated dilution contribution
}

export interface TargetIndexField {
  ticId: string;
  targetName: string;
  ra: number;
  dec: number;
  raSexagesimal: string;
  decSexagesimal: string;
  tMag: number;
  gaiaMag: number;
  tessApertureRadiusArcsec: number;
  neighbors: GaiaNeighborSource[];
  totalDilutionFactor: number; // D = sum(F_contam)/(F_target + sum(F_contam))
  centroidOffsetRisk: boolean;
  apertureContaminantsCount: number;
}

export interface LiveQueryState {
  isLoading: boolean;
  statusText: string;
  error: string | null;
  sourceUsed: 'LIVE_TAP_API' | 'LOCAL_EXOPLANET_REGISTRY' | 'SIMULATED';
  queryTimeMs?: number;
}

export interface CandidateAssessment {
  candidateId: string;
  hostStarName: string;
  ticId: string;
  tessSector: number[];
  dataSource: DataSourceType;
  overallStatus: DiagnosticStatus;
  headlineSummary: string;
  detailedReasoning: string;
  recommendedFollowup: string;
  dataQuality: CandidateDataQuality;
  chromaticity: ChromaticityDiagnostic;
  morphology: MorphologyDiagnostic;
  plausibility: PlausibilityDiagnostic;
  evidenceFor: EvidenceItem[];
  evidenceAgainst: EvidenceItem[];
  targetField?: TargetIndexField;
  lightCurves: {
    tessLightCurve: LightCurvePoint[];
    blueLightCurve?: LightCurvePoint[];
    redLightCurve?: LightCurvePoint[];
    rawUnfoldedLightCurve?: LightCurvePoint[];
  };
}

export interface ResolvedTarget {
  target_id: string;
  target_type: string;
  tic_id?: string;
  toi_id?: string;
  planet_name?: string;
  host_name: string;
  ra_deg: number;
  dec_deg: number;
  ra_sexagesimal: string;
  dec_sexagesimal: string;
  t_mag: number;
  gaia_g_mag?: number;
  host_teff_k?: number;
  host_radius_solar?: number;
  host_mass_solar?: number;
  host_spectral_type?: string;
  known_period_days?: number;
  known_depth_percent?: number;
  known_duration_hours?: number;
  known_epoch_btjd?: number;
  known_disposition?: string;
  source_catalog: string;
  available_sectors: number[];
}

export interface AnalysisProgressEvent {
  analysis_id: string;
  target_id: string;
  stage: string;
  step_number: number;
  total_steps: number;
  message: string;
  percent_complete: number;
  data_preview?: any;
}

export interface DataQualityReport {
  original_points_count: number;
  quality_flagged_count: number;
  outliers_rejected_count: number;
  analyzed_points_count: number;
  missing_data_level: string;
  in_transit_coverage_percent: number;
  baseline_flatness_rms_ppm: number;
  signal_to_noise_ratio: number;
  overall_quality: string;
}

export interface GaiaNeighbor {
  source_id: string;
  ra_deg: number;
  dec_deg: number;
  separation_arcsec: number;
  g_mag: number;
  bp_mag?: number;
  rp_mag?: number;
  delta_mag: number;
  is_aperture_contaminant: boolean;
  flux_fraction: number;
}

export interface NeighborAnalysis {
  cone_radius_arcsec: number;
  neighbors_found: GaiaNeighbor[];
  aperture_contaminants_count: number;
  total_dilution_factor: number;
  contamination_risk: string;
  scientific_interpretation: string;
}

export interface ProvenanceRecord {
  source_archive: string;
  product_identifier: string;
  access_timestamp_utc: string;
  processing_steps: string[];
  software_version: string;
}

export interface ImageCutoutData {
  has_panstarrs_image: boolean;
  panstarrs_url?: string;
  tesscut_url?: string;
  skyview_fov_arcmin: number;
}

export interface TrifectaAssessmentReport {
  analysis_id: string;
  timestamp_utc: string;
  target: ResolvedTarget;
  tess_sector_used: number;
  data_quality: DataQualityReport;
  raw_lightcurve: LightCurvePoint[];
  detrended_lightcurve: LightCurvePoint[];
  phase_folded_lightcurve: LightCurvePoint[];
  model_fit_curve: LightCurvePoint[];
  morphology: {
    status: DiagnosticStatus;
    measured_depth_percent: number;
    depth_err: number;
    total_duration_hours: number;
    ingress_duration_min: number;
    egress_duration_min: number;
    ingress_total_ratio: number;
    symmetry_score: number;
    shape_consistency: string;
    residual_rms_ppm: number;
    scientific_interpretation: string;
    technical_details: string;
    fitted_k_radius_ratio: number;
    fitted_impact_parameter_b: number;
    fitted_scaled_a_rstar: number;
  };
  chromaticity: {
    status: DiagnosticStatus;
    is_available: boolean;
    data_source_description: string;
    blue_band_name?: string;
    blue_depth_percent?: number;
    red_band_name?: string;
    red_depth_percent?: number;
    delta_depth_percent?: number;
    delta_sigma?: number;
    scientific_interpretation: string;
    technical_details: string;
  };
  plausibility: {
    status: DiagnosticStatus;
    orbital_period_days: number;
    semi_major_axis_au: number;
    inferred_radius_earth: number;
    inferred_radius_jupiter: number;
    incident_flux_earth: number;
    equilibrium_temp_k: number;
    stellar_density_gcm3: number;
    extreme_flags: string[];
    scientific_interpretation: string;
    technical_details: string;
  };
  neighbor_analysis: NeighborAnalysis;
  images: ImageCutoutData;
  evidence_for: EvidenceItem[];
  evidence_against: EvidenceItem[];
  overall_state: string;
  headline_summary: string;
  detailed_reasoning: string;
  recommended_followup: string;
  scientific_limitations: string[];
  provenance: ProvenanceRecord[];
}

export interface ScientificReference {
  id: string;
  authors: string;
  year: number;
  title: string;
  journal: string;
  doi?: string;
  relevance: string;
  category: 'Validation Pipelines' | 'TESS Mission' | 'Photometry & Follow-up' | 'Transit Physics';
}

export interface GlossaryTerm {
  term: string;
  definition: string;
  relevanceToTrifecta: string;
  formula?: string;
}

export interface PipelineStepDetail {
  stepIndex: number;
  id: string;
  name: string;
  category: 'Ingestion' | 'Preprocessing' | 'Feature Extraction' | 'Diagnostic' | 'Synthesis';
  inputs: string[];
  operations: string[];
  qualityControls: string[];
  outputs: string[];
  scientificRationale: string;
  limitations: string;
}

export interface ExistingMethodComparison {
  name: string;
  citation: string;
  primaryEvidence: string;
  statisticalApproach: string;
  multiBandCapability: string;
  interpretabilityScore: 'High (Explicit Reasoning)' | 'Moderate (Bayesian Probabilities)' | 'Low (Black-box classification)';
  computationalCost: 'Low (Seconds)' | 'Moderate (Minutes)' | 'High (MCMC Population Sampling)';
  roleInEcosystem: string;
}
