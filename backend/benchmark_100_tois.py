import requests
import json
import urllib.parse
import math
import numpy as np
from typing import List, Dict, Any

NASA_TAP_URL = "https://exoplanetarchive.ipac.caltech.edu/TAP/sync"

def run_tap_query(query: str) -> List[Dict[str, Any]]:
    encoded = urllib.parse.quote(query)
    url = f"{NASA_TAP_URL}?query={encoded}&format=json"
    headers = {"User-Agent": "TrifectaBenchmark/1.0"}
    resp = requests.get(url, headers=headers, timeout=20)
    if resp.status_code == 200:
        return resp.json()
    raise RuntimeError(f"TAP query failed with status {resp.status_code}: {resp.text[:200]}")

def get_100_benchmark_tois():
    print("[1/4] Fetching 50 Confirmed TOIs from NASA Exoplanet Archive...")
    query_confirmed = """
    SELECT top 50 toi, tid, toidisplay, tfopwg_disp, ra, dec, pl_orbper, pl_trandep, pl_trandurh, pl_rade, st_teff, st_rad, st_tmag
    FROM toi
    WHERE (tfopwg_disp = 'KP' OR tfopwg_disp = 'CP')
      AND pl_orbper IS NOT NULL
      AND pl_trandep IS NOT NULL
      AND pl_trandurh IS NOT NULL
      AND st_teff IS NOT NULL
      AND st_rad IS NOT NULL
    ORDER BY toi ASC
    """
    confirmed = run_tap_query(query_confirmed)
    print(f"Retrieved {len(confirmed)} confirmed TOIs from NASA Archive.")

    print("[2/4] Fetching 50 False Positive TOIs from NASA Exoplanet Archive...")
    query_fp = """
    SELECT top 50 toi, tid, toidisplay, tfopwg_disp, ra, dec, pl_orbper, pl_trandep, pl_trandurh, pl_rade, st_teff, st_rad, st_tmag
    FROM toi
    WHERE tfopwg_disp = 'FP'
      AND pl_orbper IS NOT NULL
      AND pl_trandep IS NOT NULL
      AND pl_trandurh IS NOT NULL
      AND st_teff IS NOT NULL
      AND st_rad IS NOT NULL
    ORDER BY toi ASC
    """
    false_positives = run_tap_query(query_fp)
    print(f"Retrieved {len(false_positives)} false-positive TOIs from NASA Archive.")
    
    return confirmed, false_positives

def screen_target(toi_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Runs the exact Trifecta screening physics logic on a candidate.
    """
    toi_num = toi_data['toi']
    toi_id = f"TOI-{toi_num}"
    tic_id = str(toi_data['tid'])
    period = float(toi_data['pl_orbper'])
    depth_val = float(toi_data['pl_trandep'])
    # pl_trandep in TOI table is in parts-per-million (ppm)
    depth_pct = round(depth_val / 10000.0, 4) if depth_val > 10.0 else round(depth_val, 4)
    duration_hours = float(toi_data['pl_trandurh'])
    teff = float(toi_data['st_teff'])
    r_star = float(toi_data['st_rad'])
    
    # Standard stellar mass estimation from radius & teff (or solar approx)
    m_star = round((r_star**3) * ((teff / 5778.0)**(-2.0)), 2) if r_star < 3.0 else 1.0
    m_star = max(0.2, min(3.0, m_star))
    
    ground_truth = toi_data['tfopwg_disp'] # KP/CP vs FP

    # 1. Keplerian Semi-Major Axis: a = (M_* * (P/365.25)^2)^(1/3) AU
    semi_major_axis = round((m_star * (period / 365.25)**2)**(1/3), 4)
    
    # 2. Inferred Companion Radius (R_earth & R_jupiter): Rp = R_* * sqrt(depth)
    r_earth = round(r_star * math.sqrt(max(0.000001, depth_pct / 100.0)) * 109.1, 2)
    r_jup = round(r_earth / 11.2, 2)

    # 3. Equilibrium Temperature: Teq = Teff * sqrt(R_* / 2a) * (1-0.3)^0.25
    r_star_au = r_star * 0.00465
    teq = round(teff * math.sqrt(r_star_au / (2.0 * max(0.001, semi_major_axis))) * (0.7)**0.25)

    # 4. Ingress / Total duration ratio proxy (estimating impact parameter from duration vs Keplerian velocity)
    # v_orb in R_star / hour = 2 * pi * (a / R_star) / (24 * P)
    a_rstar = (semi_major_axis * 215.0) / r_star if r_star > 0 else 10.0
    v_orb = (2.0 * math.pi * a_rstar) / (period * 24.0) if period > 0 else 1.0
    max_dur = (2.0 / v_orb) if v_orb > 0 else duration_hours
    duration_ratio = min(1.0, duration_hours / max(0.1, max_dur))
    impact_b = round(math.sqrt(max(0.0, 1.0 - (duration_ratio**2))), 2) if duration_ratio <= 1.0 else 0.2

    # Trifecta Diagnostics
    flags = []
    
    # Check A: Physical Radius Limit (Rp > 2.2 R_Jup is physical degenerate limit for planets)
    if r_jup > 2.2:
        flags.append("UNPHYSICAL_RADIUS_EB")
        
    # Check B: Grazing Geometry (b > 0.88 with V-shaped duration ratio)
    if impact_b > 0.88:
        flags.append("GRAZING_V_SHAPE")

    # Check C: Deep Eclipse / Stellar Binary Depth (>3.0%)
    if depth_pct > 3.0:
        flags.append("DEEP_STELLAR_ECLIPSE")

    # Check D: Extreme Physical Regime (Teq > 3200K or P < 0.25d)
    if teq > 3200 or period < 0.25:
        flags.append("EXTREME_REGIME")

    # Final Classification
    if len(flags) == 0:
        predicted_state = "PASS_PLANET_CANDIDATE"
    elif "UNPHYSICAL_RADIUS_EB" in flags or "DEEP_STELLAR_ECLIPSE" in flags:
        predicted_state = "FALSE_POSITIVE_SIGNATURE"
    else:
        predicted_state = "REVIEW_REQUIRED_GRAZING"

    is_ground_truth_planet = ground_truth in ['KP', 'CP', 'CONFIRMED']
    is_predicted_planet = predicted_state == "PASS_PLANET_CANDIDATE"

    return {
        "toi": toi_id,
        "tic": tic_id,
        "period_days": round(period, 4),
        "depth_pct": round(depth_pct, 4),
        "duration_hours": round(duration_hours, 2),
        "teff_k": teff,
        "r_star_solar": r_star,
        "m_star_solar": m_star,
        "semi_major_au": semi_major_axis,
        "r_earth": r_earth,
        "r_jup": r_jup,
        "teq_k": teq,
        "impact_b": impact_b,
        "flags": flags,
        "ground_truth": ground_truth,
        "predicted_state": predicted_state,
        "is_ground_truth_planet": is_ground_truth_planet,
        "is_predicted_planet": is_predicted_planet
    }

def main():
    confirmed, false_positives = get_100_benchmark_tois()
    
    results = []
    print("[3/4] Running 100-TOI Screening Simulation...")
    for target in confirmed:
        res = screen_target(target)
        results.append(res)
        
    for target in false_positives:
        res = screen_target(target)
        results.append(res)

    print("[4/4] Computing Confusion Matrix & Evaluation Statistics...")
    
    TP = sum(1 for r in results if r["is_ground_truth_planet"] and r["is_predicted_planet"])
    FN = sum(1 for r in results if r["is_ground_truth_planet"] and not r["is_predicted_planet"])
    TN = sum(1 for r in results if not r["is_ground_truth_planet"] and not r["is_predicted_planet"])
    FP = sum(1 for r in results if not r["is_ground_truth_planet"] and r["is_predicted_planet"])

    total = len(results)
    accuracy = (TP + TN) / total
    sensitivity = TP / (TP + FN) if (TP + FN) > 0 else 0
    specificity = TN / (TN + FP) if (TN + FP) > 0 else 0
    precision = TP / (TP + FP) if (TP + FP) > 0 else 0
    npv = TN / (TN + FN) if (TN + FN) > 0 else 0
    f1_score = 2 * (precision * sensitivity) / (precision + sensitivity) if (precision + sensitivity) > 0 else 0

    metrics = {
        "dataset_size": total,
        "confirmed_count": len(confirmed),
        "false_positive_count": len(false_positives),
        "TP": TP,
        "FP": FP,
        "TN": TN,
        "FN": FN,
        "accuracy_pct": round(accuracy * 100, 2),
        "sensitivity_recall_pct": round(sensitivity * 100, 2),
        "specificity_pct": round(specificity * 100, 2),
        "precision_ppv_pct": round(precision * 100, 2),
        "npv_pct": round(npv * 100, 2),
        "f1_score": round(f1_score, 4)
    }

    print("\n" + "="*60)
    print("      TRIFECTA 100-TOI EXPERIMENTAL BENCHMARK REPORT      ")
    print("="*60)
    print(f"Total Evaluated TOIs: {total} (50 Confirmed, 50 False Positives)")
    print(f"True Positives  (TP) : {TP:2d}  |  False Positives (FP) : {FP:2d}")
    print(f"False Negatives (FN) : {FN:2d}  |  True Negatives  (TN) : {TN:2d}")
    print("-" * 60)
    print(f"Accuracy                 : {metrics['accuracy_pct']}%")
    print(f"Sensitivity (TPR/Recall) : {metrics['sensitivity_recall_pct']}%")
    print(f"Specificity (TNR)        : {metrics['specificity_pct']}%")
    print(f"Precision (PPV)          : {metrics['precision_ppv_pct']}%")
    print(f"Negative Predictive (NPV): {metrics['npv_pct']}%")
    print(f"F1-Score                 : {metrics['f1_score']}")
    print("="*60)

    output_data = {
        "metrics": metrics,
        "results": results
    }
    
    with open("backend/data/benchmark_100_results.json", "w") as f:
        json.dump(output_data, f, indent=2)

    with open("src/data/benchmark100Results.json", "w") as f:
        json.dump(output_data, f, indent=2)
        
    print("\nSaved benchmark results to backend/data/benchmark_100_results.json and src/data/benchmark100Results.json")

if __name__ == "__main__":
    main()
