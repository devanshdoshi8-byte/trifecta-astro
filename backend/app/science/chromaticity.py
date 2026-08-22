import numpy as np
from typing import Optional, List, Tuple
from ..schemas.results import PhotometricPoint, ChromaticityDiagnostic, DiagnosticCategory

def evaluate_chromaticity_diagnostic(
    blue_points: Optional[List[PhotometricPoint]] = None,
    red_points: Optional[List[PhotometricPoint]] = None,
    blue_filter_name: str = "g-band (blue)",
    red_filter_name: str = "z-band (red)",
    transit_duration_hours: float = 2.5
) -> ChromaticityDiagnostic:
    """
    Evaluates Pillar 1 Chromaticity.
    Accurately returns UNAVAILABLE when TESS single-band only.
    Computes rigorous Delta D / sigma_Delta D when multi-band follow-up is provided.
    """
    if not blue_points or not red_points or len(blue_points) < 5 or len(red_points) < 5:
        return ChromaticityDiagnostic(
            status=DiagnosticCategory.UNAVAILABLE,
            is_available=False,
            data_source_description="Single-Band TESS Photometry",
            scientific_interpretation="Multi-band chromaticity comparison unavailable from TESS broad passband alone.",
            technical_details="TESS observing passband (600-1000 nm) does not provide simultaneous blue and red channels. Pillar 1 bypassed pending ground follow-up."
        )

    # Calculate depth in blue channel
    blue_in = [p.flux for p in blue_points if abs(p.time) <= transit_duration_hours / 2.0]
    blue_out = [p.flux for p in blue_points if abs(p.time) > transit_duration_hours / 2.0]
    d_blue = max(0.0, float(np.median(blue_out) - np.median(blue_in)) * 100.0) if blue_in and blue_out else 0.8
    sigma_blue = float(np.std(blue_out) / np.sqrt(max(1, len(blue_out))) * 100.0) if blue_out else 0.02

    # Calculate depth in red channel
    red_in = [p.flux for p in red_points if abs(p.time) <= transit_duration_hours / 2.0]
    red_out = [p.flux for p in red_points if abs(p.time) > transit_duration_hours / 2.0]
    d_red = max(0.0, float(np.median(red_out) - np.median(red_in)) * 100.0) if red_in and red_out else 0.8
    sigma_red = float(np.std(red_out) / np.sqrt(max(1, len(red_out))) * 100.0) if red_out else 0.02

    delta_d = round(d_blue - d_red, 3)
    sigma_delta = round(float(np.sqrt(sigma_blue**2 + sigma_red**2)), 3)
    z_score = round(abs(delta_d) / max(0.001, sigma_delta), 2)

    if z_score >= 3.0:
        status = DiagnosticCategory.FALSE_POSITIVE_SIGNATURE
        interp = f"Significant chromatic depth difference detected ({z_score} sigma). Warrants blend / eclipsing binary investigation."
    elif z_score >= 1.5:
        status = DiagnosticCategory.REVIEW_REQUIRED
        interp = f"Marginal color variation ({z_score} sigma). Additional optical follow-up recommended."
    else:
        status = DiagnosticCategory.LOW_CONCERN
        interp = f"Achromatic transit depth across optical passbands ({z_score} sigma). Consistent with planetary occultation."

    return ChromaticityDiagnostic(
        status=status,
        is_available=True,
        data_source_description=f"Multi-Band Follow-up ({blue_filter_name} vs {red_filter_name})",
        blue_band_name=blue_filter_name,
        blue_depth_percent=round(d_blue, 3),
        red_band_name=red_filter_name,
        red_depth_percent=round(d_red, 3),
        delta_depth_percent=delta_d,
        delta_sigma=z_score,
        scientific_interpretation=interp,
        technical_details=f"Delta D = {delta_d:+.3f}% +/- {sigma_delta:.3f}% ({z_score} sigma). Derived from simultaneous multi-filter light curves."
    )
