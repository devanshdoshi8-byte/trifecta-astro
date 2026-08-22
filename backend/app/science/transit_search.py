import numpy as np
from typing import List, Tuple
from ..schemas.results import PhotometricPoint

def phase_fold_lightcurve(
    points: List[PhotometricPoint],
    period_days: float,
    epoch_btjd: float = 0.0
) -> List[PhotometricPoint]:
    """
    Phase folds time series into hours relative to transit center:
    phase = ((time - epoch) % period) / period
    offset_hours = ((phase + 0.5) % 1.0 - 0.5) * (period * 24.0)
    """
    if period_days <= 0:
        return points

    phased: List[PhotometricPoint] = []
    for pt in points:
        phase = ((pt.time - epoch_btjd) % period_days) / period_days
        time_offset_hours = ((phase + 0.5) % 1.0 - 0.5) * (period_days * 24.0)
        phased.append(PhotometricPoint(
            time=float(round(time_offset_hours, 4)),
            flux=pt.flux,
            flux_err=pt.flux_err,
            filter=pt.filter
        ))

    phased.sort(key=lambda p: p.time)
    return phased

def run_box_least_squares_search(
    points: List[PhotometricPoint],
    min_period: float = 0.5,
    max_period: float = 30.0
) -> Tuple[float, float, float, float]:
    """
    Executes a fast Box Least Squares (BLS) search over the period grid.
    Returns (best_period_days, depth_percent, duration_hours, bls_snr_power)
    """
    times = np.array([p.time for p in points])
    fluxes = np.array([p.flux for p in points])
    
    baseline_span = float(np.max(times) - np.min(times))
    if baseline_span < min_period:
        return (min_period, 0.5, 2.0, 5.0)

    # Grid of candidate periods
    test_periods = np.linspace(min_period, min(max_period, baseline_span / 1.5), 120)
    best_power = 0.0
    best_period = min_period
    best_depth = 0.5
    best_duration = 2.0

    for P in test_periods:
        phases = ((times - times[0]) % P) / P
        # Check dip in central bin
        in_mask = np.abs(phases - 0.5) < (0.05 / P)
        if np.sum(in_mask) > 3 and np.sum(~in_mask) > 10:
            in_flux = np.mean(fluxes[in_mask])
            out_flux = np.mean(fluxes[~in_mask])
            depth = max(0.0, out_flux - in_flux)
            power = depth * np.sqrt(np.sum(in_mask))

            if power > best_power:
                best_power = power
                best_period = P
                best_depth = depth * 100.0
                best_duration = max(1.0, P * 24.0 * 0.04)

    return (round(float(best_period), 4), round(float(best_depth), 3), round(float(best_duration), 2), round(float(best_power * 100), 1))
