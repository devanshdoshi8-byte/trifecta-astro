from enum import Enum
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class PipelineStage(str, Enum):
    RESOLVING_TARGET = "01_RESOLVING_TARGET"
    RETRIEVING_CATALOG = "02_RETRIEVING_CATALOG"
    SEARCHING_TESS = "03_SEARCHING_TESS"
    DOWNLOADING_LIGHTCURVE = "04_DOWNLOADING_LIGHTCURVE"
    QUALITY_CONTROL = "05_QUALITY_CONTROL"
    DETRENDING = "06_DETRENDING"
    TRANSIT_CHARACTERIZATION = "07_TRANSIT_CHARACTERIZATION"
    CHROMATICITY_CHECK = "08_CHROMATICITY_CHECK"
    MORPHOLOGY_ANALYSIS = "09_MORPHOLOGY_ANALYSIS"
    ASTROPHYSICAL_PLAUSIBILITY = "10_ASTROPHYSICAL_PLAUSIBILITY"
    NEARBY_SOURCE_ANALYSIS = "11_NEARBY_SOURCE_ANALYSIS"
    EVIDENCE_SYNTHESIS = "12_EVIDENCE_SYNTHESIS"
    GENERATING_REPORT = "13_GENERATING_REPORT"
    COMPLETE = "COMPLETE"
    ERROR = "ERROR"

class AnalysisProgressEvent(BaseModel):
    analysis_id: str
    target_id: str
    stage: PipelineStage
    step_number: int
    total_steps: int = 13
    message: str
    percent_complete: int
    data_preview: Optional[Dict[str, Any]] = None

class AnalysisConfig(BaseModel):
    detrending_window_hours: float = 12.0
    sigma_clip_threshold: float = 3.5
    bls_min_period_days: float = 0.5
    bls_max_period_days: float = 30.0
    gaia_cone_radius_arcsec: float = 45.0
    tess_aperture_radius_arcsec: float = 42.0
