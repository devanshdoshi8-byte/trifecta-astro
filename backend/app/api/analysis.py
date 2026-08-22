import uuid
import json
import asyncio
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, BackgroundTasks
from fastapi.responses import StreamingResponse
from typing import Dict, Any, Optional

from ..schemas.target import TargetInput, ResolvedTarget, TargetType
from ..schemas.analysis import AnalysisProgressEvent, PipelineStage, AnalysisConfig
from ..schemas.results import TrifectaAssessmentReport, ProvenanceRecord
from ..services.target_resolver import resolve_target
from ..services.mast_service import fetch_tess_lightcurve
from ..services.gaia_service import query_gaia_neighbors
from ..services.image_service import get_target_images
from ..science.preprocessing import preprocess_lightcurve
from ..science.transit_search import phase_fold_lightcurve, run_box_least_squares_search
from ..science.morphology import analyze_transit_morphology
from ..science.chromaticity import evaluate_chromaticity_diagnostic
from ..science.plausibility import evaluate_plausibility_diagnostic
from ..science.evidence import synthesize_trifecta_evidence
from ..db.database import save_analysis_record, get_cached_item, set_cached_item

router = APIRouter(prefix="/analysis", tags=["Analysis"])

# In-memory progress tracking for real-time streaming
ACTIVE_ANALYSES_PROGRESS: Dict[str, AnalysisProgressEvent] = {}
ANALYSIS_RESULTS_STORE: Dict[str, TrifectaAssessmentReport] = {}

async def run_full_pipeline(
    analysis_id: str,
    query: str,
    requested_sector: Optional[int] = None,
    config: Optional[AnalysisConfig] = None
):
    cfg = config or AnalysisConfig()
    provenance_log = []

    def update_progress(stage: PipelineStage, step: int, message: str, preview: Optional[Dict[str, Any]] = None):
        pct = int((step / 13.0) * 100)
        event = AnalysisProgressEvent(
            analysis_id=analysis_id,
            target_id=query,
            stage=stage,
            step_number=step,
            message=message,
            percent_complete=pct,
            data_preview=preview
        )
        ACTIVE_ANALYSES_PROGRESS[analysis_id] = event

    try:
        # Step 1: Resolving Target
        update_progress(PipelineStage.RESOLVING_TARGET, 1, f"Resolving canonical target identifier for '{query}'...")
        await asyncio.sleep(0.1)
        target = resolve_target(query, requested_sector)
        provenance_log.append(ProvenanceRecord(
            source_archive=target.source_catalog,
            product_identifier=f"Target: {target.target_id} (TIC {target.tic_id})",
            access_timestamp_utc=datetime.now(timezone.utc).isoformat(),
            processing_steps=["Canonical name cross-match", "Coordinate resolution"]
        ))

        # Step 2: Catalog Information
        update_progress(PipelineStage.RETRIEVING_CATALOG, 2, f"Retrieved metadata from {target.source_catalog} (Teff = {target.host_teff_k} K, R* = {target.host_radius_solar} R_Sun)", {"target": target.model_dump()})
        await asyncio.sleep(0.1)

        # Step 3: Searching TESS Observations
        sector = requested_sector or (target.available_sectors[0] if target.available_sectors else 14)
        update_progress(PipelineStage.SEARCHING_TESS, 3, f"Querying MAST for TESS Sector {sector} observations...")
        await asyncio.sleep(0.1)

        # Step 4: Downloading Light Curve
        update_progress(PipelineStage.DOWNLOADING_LIGHTCURVE, 4, f"Ingesting calibrated SPOC light curve products for Sector {sector}...")
        raw_lc = fetch_tess_lightcurve(target, sector)
        provenance_log.append(ProvenanceRecord(
            source_archive="MAST (Mikulski Archive for Space Telescopes)",
            product_identifier=f"TESS SPOC Sector {sector} 2-min Cadence",
            access_timestamp_utc=datetime.now(timezone.utc).isoformat(),
            processing_steps=["Downloaded calibrated PDCSAP_FLUX time-series"]
        ))
        await asyncio.sleep(0.1)

        # Step 5: Quality Control
        update_progress(PipelineStage.QUALITY_CONTROL, 5, f"Executing 3.5-sigma outlier rejection and TESS quality flag screening...")
        raw_lc, detrended_lc, dq_report = preprocess_lightcurve(raw_lc, cfg.detrending_window_hours, cfg.sigma_clip_threshold)
        await asyncio.sleep(0.1)

        # Step 6: Detrending & Normalization
        update_progress(PipelineStage.DETRENDING, 6, f"Applied Savitzky-Golay baseline detrending (Window = {cfg.detrending_window_hours}h). Baseline RMS = {dq_report.baseline_flatness_rms_ppm} ppm")
        await asyncio.sleep(0.1)

        # Step 7: Transit Characterization
        period = target.known_period_days
        if not period or target.target_type == TargetType.UNKNOWN_TARGET:
            update_progress(PipelineStage.TRANSIT_CHARACTERIZATION, 7, "Running Box Least Squares (BLS) periodogram search...")
            best_p, best_d, best_dur, bls_pwr = run_box_least_squares_search(detrended_lc, cfg.bls_min_period_days, cfg.bls_max_period_days)
            period = best_p
            epoch = detrended_lc[0].time
        else:
            epoch = target.known_epoch_btjd or 1700.0

        phased_lc = phase_fold_lightcurve(detrended_lc, period, epoch)
        update_progress(PipelineStage.TRANSIT_CHARACTERIZATION, 7, f"Phase-folded on orbital period P = {period:.4f} days.")
        await asyncio.sleep(0.1)

        # Step 8: Chromaticity Check
        update_progress(PipelineStage.CHROMATICITY_CHECK, 8, "Evaluating multi-band chromaticity (TESS single-band check)...")
        chrom_diag = evaluate_chromaticity_diagnostic()
        await asyncio.sleep(0.1)

        # Step 9: Morphology Analysis
        update_progress(PipelineStage.MORPHOLOGY_ANALYSIS, 9, "Fitting Mandel & Agol (2002) non-linear quadratic limb-darkening model...")
        morph_diag, model_fit_pts = analyze_transit_morphology(phased_lc, period)
        await asyncio.sleep(0.1)

        # Step 10: Astrophysical Plausibility
        update_progress(PipelineStage.ASTROPHYSICAL_PLAUSIBILITY, 10, "Deriving Keplerian orbital separation, equilibrium Teq, and incident flux...")
        plaus_diag = evaluate_plausibility_diagnostic(
            orbital_period_days=period,
            transit_depth_percent=morph_diag.measured_depth_percent,
            stellar_teff_k=target.host_teff_k or 5780.0,
            stellar_radius_solar=target.host_radius_solar or 1.0,
            stellar_mass_solar=target.host_mass_solar or 1.0
        )
        await asyncio.sleep(0.1)

        # Step 11: Nearby-Source Analysis
        update_progress(PipelineStage.NEARBY_SOURCE_ANALYSIS, 11, f"Executing Gaia DR3 cone search ({cfg.gaia_cone_radius_arcsec}\" radius)...")
        neighbor_analysis = query_gaia_neighbors(target.ra_deg, target.dec_deg, cfg.gaia_cone_radius_arcsec, target.t_mag)
        provenance_log.append(ProvenanceRecord(
            source_archive="ESA Gaia DR3 Catalog TAP Service",
            product_identifier=f"Gaia DR3 Spatial Cross-match ({cfg.gaia_cone_radius_arcsec} arcsec radius)",
            access_timestamp_utc=datetime.now(timezone.utc).isoformat(),
            processing_steps=["Cone search", "Aperture dilution factor calculation"]
        ))
        await asyncio.sleep(0.1)

        # Step 12: Evidence Synthesis
        update_progress(PipelineStage.EVIDENCE_SYNTHESIS, 12, "Synthesizing multi-diagnostic evidence matrix...")
        is_confirmed = target.target_type == TargetType.CONFIRMED_PLANET
        overall_state, headline, reasoning, followup, ev_for, ev_against, limitations = synthesize_trifecta_evidence(
            morph_diag, chrom_diag, plaus_diag, neighbor_analysis, dq_report, is_confirmed
        )
        await asyncio.sleep(0.1)

        # Step 13: Generating Report
        update_progress(PipelineStage.GENERATING_REPORT, 13, "Compiling explainable scientific candidate report...")
        images = get_target_images(target.ra_deg, target.dec_deg)

        final_report = TrifectaAssessmentReport(
            analysis_id=analysis_id,
            timestamp_utc=datetime.now(timezone.utc).isoformat(),
            target=target,
            tess_sector_used=sector,
            data_quality=dq_report,
            raw_lightcurve=raw_lc,
            detrended_lightcurve=detrended_lc,
            phase_folded_lightcurve=phased_lc,
            model_fit_curve=model_fit_pts,
            morphology=morph_diag,
            chromaticity=chrom_diag,
            plausibility=plaus_diag,
            neighbor_analysis=neighbor_analysis,
            images=images,
            evidence_for=ev_for,
            evidence_against=ev_against,
            overall_state=overall_state,
            headline_summary=headline,
            detailed_reasoning=reasoning,
            recommended_followup=followup,
            scientific_limitations=limitations,
            provenance=provenance_log
        )

        ANALYSIS_RESULTS_STORE[analysis_id] = final_report
        save_analysis_record(analysis_id, target.target_id, "COMPLETE", sector, final_report.model_dump())
        update_progress(PipelineStage.COMPLETE, 13, "Analysis completed successfully.", {"headline": headline})

    except Exception as e:
        print(f"[Analysis Error] {e}")
        update_progress(PipelineStage.ERROR, 13, f"Analysis encountered error: {str(e)}")

@router.post("/start")
def start_analysis(input_data: TargetInput, background_tasks: BackgroundTasks):
    """
    Launches an asynchronous scientific analysis pipeline for the target.
    """
    analysis_id = str(uuid.uuid4())
    background_tasks.add_task(run_full_pipeline, analysis_id, input_data.query, input_data.requested_sector)
    return {"analysis_id": analysis_id, "status": "STARTED", "target_query": input_data.query}

@router.get("/{analysis_id}/progress")
def get_analysis_progress(analysis_id: str):
    """
    Returns current analysis progress step and status.
    """
    if analysis_id in ACTIVE_ANALYSES_PROGRESS:
        return ACTIVE_ANALYSES_PROGRESS[analysis_id]
    raise HTTPException(status_code=404, detail="Analysis ID not found or expired.")

@router.get("/{analysis_id}/stream")
async def stream_analysis_progress(analysis_id: str):
    """
    Server-Sent Events (SSE) streaming endpoint for live progress updates.
    """
    async def event_generator():
        while True:
            if analysis_id in ACTIVE_ANALYSES_PROGRESS:
                event = ACTIVE_ANALYSES_PROGRESS[analysis_id]
                yield f"data: {json.dumps(event.model_dump())}\n\n"
                if event.stage in [PipelineStage.COMPLETE, PipelineStage.ERROR]:
                    break
            await asyncio.sleep(0.3)

    return StreamingResponse(event_generator(), media_type="text/event-stream")

@router.get("/{analysis_id}/result", response_model=TrifectaAssessmentReport)
def get_analysis_result(analysis_id: str):
    """
    Returns the complete structured scientific assessment report.
    """
    if analysis_id in ANALYSIS_RESULTS_STORE:
        return ANALYSIS_RESULTS_STORE[analysis_id]
    raise HTTPException(status_code=404, detail="Analysis result not ready or not found.")
