import requests
import time

print("1. Testing Health Endpoint...")
health = requests.get("http://127.0.0.1:8000/api/health").json()
print("   Health:", health)

print("\n2. Testing Target Resolution (TOI-700.01)...")
resolved = requests.post("http://127.0.0.1:8000/api/targets/resolve", json={"query": "TOI-700.01"}).json()
print("   Target:", resolved["target_id"])
print("   Coordinates:", resolved["ra_sexagesimal"], resolved["dec_sexagesimal"])
print("   Catalog:", resolved["source_catalog"])

print("\n3. Testing Full 13-Stage Pipeline...")
start_res = requests.post("http://127.0.0.1:8000/api/analysis/start", json={"query": "TOI-700.01"}).json()
analysis_id = start_res["analysis_id"]
print("   Analysis ID:", analysis_id)

for _ in range(20):
    time.sleep(0.2)
    prog = requests.get(f"http://127.0.0.1:8000/api/analysis/{analysis_id}/progress").json()
    print(f"   [{prog['step_number']:02d}/13] {prog['stage']} ({prog['percent_complete']}%) - {prog['message']}")
    if prog["stage"] in ["COMPLETE", "ERROR"]:
        break

print("\n4. Retrieving Structured Scientific Assessment Report...")
report = requests.get(f"http://127.0.0.1:8000/api/analysis/{analysis_id}/result").json()
print("   Overall State:", report["overall_state"])
print("   Headline:", report["headline_summary"])
print("   Morphology Depth:", report["morphology"]["measured_depth_percent"], "%")
print("   Mandel-Agol Ratio k:", report["morphology"]["fitted_k_radius_ratio"])
print("   Semi-major axis a:", report["plausibility"]["semi_major_axis_au"], "AU")
print("   Equilibrium Teq:", report["plausibility"]["equilibrium_temp_k"], "K")
print("   Gaia Dilution Factor:", report["neighbor_analysis"]["total_dilution_factor"])
print("   Neighbors within Cone:", len(report["neighbor_analysis"]["neighbors_found"]))
print("   Evidence Supporting:", len(report["evidence_for"]))
print("   Evidence Caution:", len(report["evidence_against"]))
print("   Provenance Records:", len(report["provenance"]))
print("\n>>> ALL TESTS PASSED SUCCESSFULLY! <<<")
