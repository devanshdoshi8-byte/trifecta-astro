from typing import List
from ..schemas.results import PlausibilityDiagnostic, DiagnosticCategory
from ..utils.units import (
    calculate_semi_major_axis_au,
    calculate_equilibrium_temp_k,
    calculate_incident_flux_earth,
    calculate_candidate_radius,
    calculate_stellar_density
)

def evaluate_plausibility_diagnostic(
    orbital_period_days: float,
    transit_depth_percent: float,
    stellar_teff_k: float = 5780.0,
    stellar_radius_solar: float = 1.0,
    stellar_mass_solar: float = 1.0
) -> PlausibilityDiagnostic:
    """
    Evaluates Pillar 3 Physical Plausibility.
    Derived quantities using Keplerian mechanics and radiative equilibrium.
    """
    semi_major_axis = calculate_semi_major_axis_au(orbital_period_days, stellar_mass_solar)
    r_earth, r_jup = calculate_candidate_radius(transit_depth_percent, stellar_radius_solar)
    teq = calculate_equilibrium_temp_k(stellar_teff_k, stellar_radius_solar, semi_major_axis)
    s_inc = calculate_incident_flux_earth(stellar_teff_k, stellar_radius_solar, semi_major_axis)
    density = calculate_stellar_density(stellar_mass_solar, stellar_radius_solar)

    extreme_flags: List[str] = []
    
    if r_jup > 2.2:
        extreme_flags.append("Inferred radius exceeds physical planetary limit (Rp > 2.2 R_Jup)")
    if teq > 2500:
        extreme_flags.append("Extreme irradiation regime (Teq > 2500 K)")
    if orbital_period_days < 0.5:
        extreme_flags.append("Ultra-short orbital period regime (P < 0.5 days)")
    if semi_major_axis < 0.005:
        extreme_flags.append("Proximity to Roche fluid disruption boundary")

    if r_jup > 2.2:
        status = DiagnosticCategory.FALSE_POSITIVE_SIGNATURE
        interp = f"Inferred companion radius Rp = {r_jup} R_Jup exceeds electron-degeneracy limit for planets. Consistent with stellar binary."
    elif len(extreme_flags) > 0:
        status = DiagnosticCategory.REVIEW_REQUIRED
        interp = f"Inferred parameters occupy an extreme physical regime ({', '.join(extreme_flags)}). Requires careful physical context."
    else:
        status = DiagnosticCategory.LOW_CONCERN
        interp = f"Inferred candidate radius Rp = {r_earth} R_Earth is physically plausible for a planetary companion orbiting a {stellar_radius_solar} R_Sun host."

    return PlausibilityDiagnostic(
        status=status,
        orbital_period_days=round(orbital_period_days, 4),
        semi_major_axis_au=semi_major_axis,
        inferred_radius_earth=r_earth,
        inferred_radius_jupiter=r_jup,
        incident_flux_earth=s_inc,
        equilibrium_temp_k=teq,
        stellar_density_gcm3=density,
        extreme_flags=extreme_flags,
        scientific_interpretation=interp,
        technical_details=f"Keplerian semi-major axis a = {semi_major_axis} AU, incident flux S = {s_inc} S_Earth, equilibrium Teq = {teq} K (assuming Bond albedo = 0.3)."
    )
