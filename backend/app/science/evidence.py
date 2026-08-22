from typing import List, Tuple
from ..schemas.results import (
    OverallAssessmentState,
    DiagnosticCategory,
    MorphologyDiagnostic,
    ChromaticityDiagnostic,
    PlausibilityDiagnostic,
    NeighborAnalysis,
    DataQualityReport,
    EvidenceItem
)

def synthesize_trifecta_evidence(
    morphology: MorphologyDiagnostic,
    chromaticity: ChromaticityDiagnostic,
    plausibility: PlausibilityDiagnostic,
    neighbor_analysis: NeighborAnalysis,
    data_quality: DataQualityReport,
    is_confirmed: bool = False
) -> Tuple[OverallAssessmentState, str, str, str, List[EvidenceItem], List[EvidenceItem], List[str]]:
    """
    Synthesizes the Trifecta Diagnostic Evidence into an explainable assessment.
    Never outputs fake '100% planet' scores.
    """
    evidence_for: List[EvidenceItem] = []
    evidence_against: List[EvidenceItem] = []
    limitations: List[str] = []

    # 1. Morphology Evidence
    if morphology.status == DiagnosticCategory.LOW_CONCERN:
        evidence_for.append(EvidenceItem(
            type="supporting",
            pillar="morphology",
            summary="U-Shaped Transit Profile",
            detail=f"Flat bottom with limb darkening (depth {morphology.measured_depth_percent}%, duration {morphology.total_duration_hours}h) matches planetary occultation."
        ))
    else:
        evidence_against.append(EvidenceItem(
            type="caution",
            pillar="morphology",
            summary="V-Shaped Grazing / Asymmetric Geometry",
            detail=f"Impact parameter b = {morphology.fitted_impact_parameter_b} indicates grazing contact geometry. Review for grazing binary."
        ))

    # 2. Chromaticity Evidence
    if chromaticity.is_available:
        if chromaticity.status == DiagnosticCategory.LOW_CONCERN:
            evidence_for.append(EvidenceItem(
                type="supporting",
                pillar="chromaticity",
                summary="Achromatic Multi-Band Depth",
                detail=f"Delta D = {chromaticity.delta_depth_percent}% ({chromaticity.delta_sigma} sigma) confirms consistent optical depth."
            ))
        else:
            evidence_against.append(EvidenceItem(
                type="caution",
                pillar="chromaticity",
                summary="Color-Dependent Transit Depth",
                detail=f"Depth variation across {chromaticity.blue_band_name} and {chromaticity.red_band_name} ({chromaticity.delta_sigma} sigma) suggests potential blend."
            ))
    else:
        limitations.append("Multi-band chromaticity unavailable from single TESS broadband passband.")

    # 3. Plausibility Evidence
    if plausibility.status == DiagnosticCategory.LOW_CONCERN:
        evidence_for.append(EvidenceItem(
            type="supporting",
            pillar="plausibility",
            summary="Physical Orbit & Size Plausibility",
            detail=f"Inferred radius Rp = {plausibility.inferred_radius_earth} R_Earth at a = {plausibility.semi_major_axis_au} AU is dynamically stable."
        ))
    elif plausibility.status == DiagnosticCategory.FALSE_POSITIVE_SIGNATURE:
        evidence_against.append(EvidenceItem(
            type="caution",
            pillar="plausibility",
            summary="Unphysical Companion Radius",
            detail=f"Inferred radius Rp = {plausibility.inferred_radius_jupiter} R_Jup exceeds maximum physical planetary radius."
        ))
    else:
        for flag in plausibility.extreme_flags:
            evidence_against.append(EvidenceItem(
                type="caution",
                pillar="plausibility",
                summary="Extreme Physical Regime",
                detail=flag
            ))

    # 4. Neighbor Context
    if neighbor_analysis.aperture_contaminants_count > 0:
        evidence_against.append(EvidenceItem(
            type="caution",
            pillar="neighbors",
            summary="Nearby Gaia Sources Inside Aperture",
            detail=f"{neighbor_analysis.aperture_contaminants_count} source(s) within 42\" aperture (dilution factor D = {neighbor_analysis.total_dilution_factor*100:.1f}%)."
        ))
    else:
        evidence_for.append(EvidenceItem(
            type="supporting",
            pillar="neighbors",
            summary="Isolated Target Aperture",
            detail="No bright Gaia DR3 contaminants detected within TESS 42\" aperture mask."
        ))

    # Overall State Determination
    if is_confirmed:
        overall_state = OverallAssessmentState.KNOWN_CONFIRMED_PLANET
        headline = "Known Confirmed Exoplanet in Public Archive"
        reasoning = "Target matches a confirmed exoplanet entry in the NASA Exoplanet Archive (pscomppars). Multi-diagnostic profile corroborates unblended planetary transit."
        followup = "High-precision transmission spectroscopy (JWST/HST) or atmospheric characterization."
    elif len(evidence_against) >= 2 or plausibility.status == DiagnosticCategory.FALSE_POSITIVE_SIGNATURE:
        overall_state = OverallAssessmentState.POTENTIAL_FALSE_POSITIVE
        headline = "Potential False-Positive Signature Detected"
        reasoning = "One or more core diagnostic pillars reveal significant anomalies (e.g. unphysical radius, high aperture dilution, or V-shaped grazing profile). Alternative astrophysical blend scenarios warrant rigorous testing."
        followup = "High-resolution adaptive optics (AO) imaging to rule out bound eclipsing binaries, or multi-band ground follow-up."
    elif len(evidence_against) == 1:
        overall_state = OverallAssessmentState.REVIEW_RECOMMENDED
        headline = "Review Recommended — Target Requires Detailed Inspection"
        reasoning = "Primary transit profile is consistent with planetary geometry, but secondary indicators (e.g. nearby Gaia source or extreme insolation) warrant inspection."
        followup = "Multi-band photometric follow-up (MuSCAT/LCOGT) and radial velocity mass measurement."
    else:
        overall_state = OverallAssessmentState.NO_STRONG_FALSE_POSITIVE
        headline = "No Strong False-Positive Indicator Detected"
        reasoning = "The available photometric time series and spatial cross-match show clean U-shaped morphology, physical stability, and no significant aperture contamination. Planetary hypothesis remains supported."
        followup = "Queue for high-precision radial velocity spectroscopy (ESPRESSO/HARPS) to measure companion mass."

    if data_quality.quality_flagged_count > data_quality.original_points_count * 0.15:
        limitations.append("High fraction of quality-flagged cadence observations removed.")

    return overall_state, headline, reasoning, followup, evidence_for, evidence_against, limitations
