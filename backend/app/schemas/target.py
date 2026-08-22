from enum import Enum
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class TargetType(str, Enum):
    TIC_ID = "TIC_ID"
    TOI_CANDIDATE = "TOI_CANDIDATE"
    CONFIRMED_PLANET = "CONFIRMED_PLANET"
    HOST_STAR = "HOST_STAR"
    COORDINATES = "COORDINATES"
    UNKNOWN_TARGET = "UNKNOWN_TARGET"

class TargetInput(BaseModel):
    query: str = Field(..., description="Target identifier (e.g. TOI-700, TIC 150428135, Vega, Kepler-186f)")
    requested_sector: Optional[int] = Field(None, description="Optional specific TESS sector to analyze")

class ResolvedTarget(BaseModel):
    target_id: str
    target_type: TargetType
    tic_id: Optional[str] = None
    toi_id: Optional[str] = None
    planet_name: Optional[str] = None
    host_name: str
    ra_deg: float
    dec_deg: float
    ra_sexagesimal: str
    dec_sexagesimal: str
    t_mag: float
    gaia_g_mag: Optional[float] = None
    host_teff_k: Optional[float] = None
    host_radius_solar: Optional[float] = None
    host_mass_solar: Optional[float] = None
    host_spectral_type: Optional[str] = None
    known_period_days: Optional[float] = None
    known_depth_percent: Optional[float] = None
    known_duration_hours: Optional[float] = None
    known_epoch_btjd: Optional[float] = None
    known_disposition: Optional[str] = None
    source_catalog: str
    available_sectors: List[int] = Field(default_factory=list)
