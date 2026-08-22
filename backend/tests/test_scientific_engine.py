import unittest
from backend.app.schemas.target import TargetType
from backend.app.services.target_resolver import resolve_target
from backend.app.science.preprocessing import preprocess_lightcurve
from backend.app.science.transit_search import phase_fold_lightcurve, run_box_least_squares_search
from backend.app.science.morphology import analyze_transit_morphology
from backend.app.science.chromaticity import evaluate_chromaticity_diagnostic
from backend.app.science.plausibility import evaluate_plausibility_diagnostic
from backend.app.science.evidence import synthesize_trifecta_evidence
from backend.app.services.gaia_service import query_gaia_neighbors
from backend.app.schemas.results import PhotometricPoint, DiagnosticCategory, OverallAssessmentState

class TestTrifectaScientificEngine(unittest.TestCase):

    def test_target_resolution(self):
        target = resolve_target("TOI-700")
        self.assertEqual(target.target_id, "TOI-700.01")
        self.assertEqual(target.target_type, TargetType.TOI_CANDIDATE)
        self.assertAlmostEqual(target.ra_deg, 100.4985, places=2)

    def test_stellar_target_resolution(self):
        target = resolve_target("Vega")
        self.assertEqual(target.target_id, "Vega")
        self.assertEqual(target.target_type, TargetType.HOST_STAR)
        self.assertIn("STELLAR TARGET", target.known_disposition)

    def test_keplerian_plausibility(self):
        diag = evaluate_plausibility_diagnostic(
            orbital_period_days=37.42,
            transit_depth_percent=0.082,
            stellar_teff_k=3480,
            stellar_radius_solar=0.42,
            stellar_mass_solar=0.41
        )
        self.assertEqual(diag.status, DiagnosticCategory.LOW_CONCERN)
        self.assertGreater(diag.semi_major_axis_au, 0.1)
        self.assertLess(diag.semi_major_axis_au, 0.25)
        self.assertGreater(diag.equilibrium_temp_k, 200)
        self.assertLess(diag.equilibrium_temp_k, 350)
        self.assertAlmostEqual(diag.inferred_radius_earth, 1.31, delta=0.2)

    def test_unphysical_radius_flag(self):
        diag = evaluate_plausibility_diagnostic(
            orbital_period_days=2.5,
            transit_depth_percent=15.0,
            stellar_teff_k=6500,
            stellar_radius_solar=1.5,
            stellar_mass_solar=1.4
        )
        self.assertEqual(diag.status, DiagnosticCategory.FALSE_POSITIVE_SIGNATURE)
        self.assertTrue(any("exceeds physical" in f for f in diag.extreme_flags))

    def test_chromaticity_tess_unavailable(self):
        diag = evaluate_chromaticity_diagnostic(None, None)
        self.assertEqual(diag.status, DiagnosticCategory.UNAVAILABLE)
        self.assertFalse(diag.is_available)

    def test_chromaticity_multiband_achromatic(self):
        blue_pts = [PhotometricPoint(time=float(i)/10.0, flux=0.992 if abs(i) < 10 else 1.0, flux_err=0.0003, filter="g-band") for i in range(-30, 31)]
        red_pts = [PhotometricPoint(time=float(i)/10.0, flux=0.992 if abs(i) < 10 else 1.0, flux_err=0.0003, filter="z-band") for i in range(-30, 31)]
        diag = evaluate_chromaticity_diagnostic(blue_pts, red_pts, "g-band", "z-band", 2.0)
        self.assertEqual(diag.status, DiagnosticCategory.LOW_CONCERN)
        self.assertTrue(diag.is_available)
        self.assertLess(diag.delta_sigma, 1.5)

    def test_gaia_neighbor_aperture_crossmatch(self):
        analysis = query_gaia_neighbors(100.4985, -65.6778, 45.0, 11.45)
        self.assertGreater(len(analysis.neighbors_found), 0)
        self.assertGreaterEqual(analysis.total_dilution_factor, 0.0)

    def test_evidence_synthesis(self):
        target = resolve_target("TOI-700")
        plaus = evaluate_plausibility_diagnostic(37.42, 0.082, 3480, 0.42, 0.41)
        chrom = evaluate_chromaticity_diagnostic(None, None)
        raw_pts = [PhotometricPoint(time=float(i)/100.0, flux=0.999 if abs(i) < 15 else 1.0, flux_err=0.0002) for i in range(-50, 51)]
        _, _, dq = preprocess_lightcurve(raw_pts)
        morph, _ = analyze_transit_morphology(raw_pts, 37.42)
        neighbors = query_gaia_neighbors(100.4985, -65.6778, 45.0, 11.45)

        state, headline, reasoning, followup, ev_for, ev_against, lims = synthesize_trifecta_evidence(
            morph, chrom, plaus, neighbors, dq, is_confirmed=False
        )
        self.assertIn(state, [OverallAssessmentState.NO_STRONG_FALSE_POSITIVE, OverallAssessmentState.REVIEW_RECOMMENDED])
        self.assertGreater(len(ev_for), 0)
        self.assertGreater(len(lims), 0)

if __name__ == "__main__":
    unittest.main()
