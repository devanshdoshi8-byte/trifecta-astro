import math

# Astronomical & Physical Constants (SI)
G_GRAV = 6.67430e-11 # m^3 kg^-1 s^-2
M_SUN_KG = 1.98847e30 # kg
R_SUN_M = 6.957e8 # m
R_EARTH_M = 6.371e6 # m
R_JUP_M = 7.1492e7 # m
AU_M = 1.495978707e11 # m
SEC_PER_DAY = 86400.0

def degrees_to_sexagesimal_ra(ra_deg: float) -> str:
    norm = ((ra_deg % 360.0) + 360.0) % 360.0
    hours_dec = norm / 15.0
    h = int(hours_dec)
    m_dec = (hours_dec - h) * 60.0
    m = int(m_dec)
    s = (m_dec - m) * 60.0
    return f"{h:02d}:{m:02d}:{s:05.2f}"

def degrees_to_sexagesimal_dec(dec_deg: float) -> str:
    sign = "+" if dec_deg >= 0 else "-"
    abs_d = abs(dec_deg)
    d = int(abs_d)
    m_dec = (abs_d - d) * 60.0
    m = int(m_dec)
    s = (m_dec - m) * 60.0
    return f"{sign}{d:02d}:{m:02d}:{s:04.1f}"

def calculate_semi_major_axis_au(period_days: float, stellar_mass_solar: float = 1.0) -> float:
    """
    Kepler's Third Law: a^3 = (G * M_star * P^2) / (4 * pi^2)
    """
    if period_days <= 0 or stellar_mass_solar <= 0:
        return 0.05
    p_sec = period_days * SEC_PER_DAY
    m_kg = stellar_mass_solar * M_SUN_KG
    a_cubed = (G_GRAV * m_kg * p_sec**2) / (4.0 * math.pi**2)
    a_m = a_cubed**(1.0 / 3.0)
    return round(a_m / AU_M, 4)

def calculate_equilibrium_temp_k(
    stellar_teff_k: float,
    stellar_radius_solar: float,
    semi_major_axis_au: float,
    albedo: float = 0.3,
    redistribution_factor: float = 1.0
) -> int:
    """
    T_eq = T_eff * sqrt(R_star / (2 * a)) * (1 - A)^(1/4)
    Assumes homogeneous heat redistribution and Bond albedo = 0.3
    """
    if semi_major_axis_au <= 0 or stellar_teff_k <= 0 or stellar_radius_solar <= 0:
        return 300
    r_star_au = (stellar_radius_solar * R_SUN_M) / AU_M
    temp = stellar_teff_k * math.sqrt(r_star_au / (2.0 * semi_major_axis_au)) * ((1.0 - albedo)**0.25) * redistribution_factor
    return int(round(temp))

def calculate_incident_flux_earth(
    stellar_teff_k: float,
    stellar_radius_solar: float,
    semi_major_axis_au: float
) -> float:
    """
    S / S_Earth = (R_star / R_sun)^2 * (T_star / T_sun)^4 / (a / 1 AU)^2
    """
    if semi_major_axis_au <= 0:
        return 1.0
    t_ratio = stellar_teff_k / 5778.0
    s_inc = (stellar_radius_solar**2) * (t_ratio**4) / (semi_major_axis_au**2)
    return round(s_inc, 2)

def calculate_candidate_radius(
    transit_depth_percent: float,
    stellar_radius_solar: float
) -> tuple[float, float]:
    """
    Rp / R_star = sqrt(depth)
    Returns (r_earth, r_jupiter)
    """
    if transit_depth_percent <= 0:
        return (1.0, 0.09)
    k = math.sqrt(transit_depth_percent / 100.0)
    r_star_m = stellar_radius_solar * R_SUN_M
    rp_m = k * r_star_m
    r_earth = round(rp_m / R_EARTH_M, 2)
    r_jupiter = round(rp_m / R_JUP_M, 3)
    return (r_earth, r_jupiter)

def calculate_stellar_density(stellar_mass_solar: float, stellar_radius_solar: float) -> float:
    """
    rho_* = M_* / (4/3 * pi * R_*^3) in g/cm^3
    """
    if stellar_mass_solar <= 0 or stellar_radius_solar <= 0:
        return 1.41 # Sun density
    m_g = stellar_mass_solar * 1.98847e33
    r_cm = stellar_radius_solar * 6.957e10
    vol_cm3 = (4.0 / 3.0) * math.pi * (r_cm**3)
    return round(m_g / vol_cm3, 2)
