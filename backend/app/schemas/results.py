from enum import Enum
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from .target import ResolvedTarget

class DiagnosticCategory(str, Enum):
    LOW_CONCERN = "low_concern"
    REVIEW_REQUIRED = "review_required"
    FALSE_POSITIVE_SIGNATURE = "false_positive_signature"
    UNAVAILABLE = "unavailable"

class OverallAssessmentState(str, Enum):
    NO_STRONG_FALSE_POSITIVE = "NO STRONG FALSE-POSITIVE INDICATOR DETECTED"
    REVIEW_RECOMMENDED = "REVIEW RECOMMENDED"
    POTENTIAL_FALSE_POSITIVE = "POTENTIAL FALSE-POSITIVE SIGNATURE"
    INSUFFICIENT_DATA = "INSUFFICIENT DATA"
    KNOWN_CONFIRMED_PLANET = "KNOWN CONFIRMED PLANET"

class PhotometricPoint(BaseModel):
    time: float
    flux: float
    flux_err: float
    filter: str = "TESS (broad)"

class DataQualityReport(BaseModel):
    original_points_count: int
    quality_flagged_count: int
    outliers_rejected_count: int
    analyzed_points_count: int
    missing_data_level: str
    in_transit_coverage_percent: float
    baseline_flatness_rms_ppm: int
    signal_to_noise_ratio: float
    overall_quality: str

class MorphologyDiagnostic(BaseModel):
    status: DiagnosticCategory
    measured_depth_percent: float
    depth_err: float
    total_duration_hours: float
    ingress_duration_min: float
    egress_duration_min: float
    ingress_total_ratio: float
    symmetry_score: float
    shape_consistency: str
    residual_rms_ppm: int
    scientific_interpretation: str
    technical_details: str
    fitted_k_radius_ratio: float
    fitted_impact_parameter_b: float
    fitted_scaled_a_rstar: float

class ChromaticityDiagnostic(BaseModel):
    status: DiagnosticCategory
    is_available: bool
    data_source_description: str
    blue_band_name: Optional[str] = None
    blue_depth_percent: Optional[float] = None
    red_band_name: Optional[str] = None
    red_depth_percent: Optional[float] = None
    delta_depth_percent: Optional[float] = None
    delta_sigma: Optional[float] = None
    scientific_interpretation: str
    technical_details: str

class PlausibilityDiagnostic(BaseModel):
    status: DiagnosticCategory
    orbital_period_days: float
    semi_major_axis_au: float
    inferred_radius_earth: float
    inferred_radius_jupiter: float
    incident_flux_earth: float
    equilibrium_temp_k: int
    stellar_density_gcm3: float
    extreme_flags: List[str] = Field(default_factory=list)
    scientific_interpretation: str
    technical_details: str

class GaiaNeighbor(BaseModel):
    source_id: str
    ra_deg: float
    dec_deg: float
    separation_arcsec: float
    g_mag: float
    bp_mag: Optional[float] = None
    rp_mag: Optional[float] = None
    delta_mag: float
    is_aperture_contaminant: bool
    flux_fraction: float

class NeighborAnalysis(BaseModel):
    cone_radius_arcsec: float
    neighbors_found: List[GaiaNeighbor]
    aperture_contaminants_count: int
    total_dilution_factor: float
    contamination_risk: str
    scientific_interpretation: str

class EvidenceItem(BaseModel):
    type: str # 'supporting' | 'caution' | 'neutral'
    pillar: str # 'chromaticity' | 'morphology' | 'plausibility' | 'neighbors'
    summary: str
    detail: str

class ProvenanceRecord(BaseModel):
    source_archive: str
    product_identifier: str
    access_timestamp_utc: str
    processing_steps: List[str]
    software_version: str = "Trifecta-Core v0.1.0"

class ImageCutoutData(BaseModel):
    has_panstarrs_image: bool
    panstarrs_url: Optional[str] = None
    tesscut_url: Optional[str] = None
    skyview_fov_arcmin: float = 1.5

class TrifectaAssessmentReport(BaseModel):
    analysis_id: str
    timestamp_utc: str
    target: ResolvedTarget
    tess_sector_used: int
    data_quality: DataQualityReport
    raw_lightcurve: List[PhotometricPoint]
    detrended_lightcurve: List[PhotometricPoint]
    phase_folded_lightcurve: List[PhotometricPoint]
    model_fit_curve: List[PhotometricPoint]
    morphology: MorphologyDiagnostic
    chromaticity: ChromaticityDiagnostic
    plausibility: PlausibilityDiagnostic
    neighbor_analysis: NeighborAnalysis
    images: ImageCutoutData
    evidence_for: List[EvidenceItem]
    evidence_against: List[EvidenceItem]
    overall_state: OverallAssessmentState
    headline_summary: str
    detailed_reasoning: str
    recommended_followup: str
    scientific_limitations: List[str]
    provenance: List[ProvenanceRecord]
