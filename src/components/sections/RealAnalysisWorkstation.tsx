import React, { useState, useEffect } from 'react';
import {
  Search,
  Play,
  RotateCcw,
  Sparkles,
  Activity,
  Layers,
  FileDown,
  Info,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Radio,
  Compass,
  Telescope,
  Cpu,
  Globe,
  Sliders,
  Database,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  Loader2
} from 'lucide-react';
import {
  TrifectaAssessmentReport,
  AnalysisProgressEvent,
  PhotometricPoint
} from '../../types/astrophysics';
import { TrifectaApiClient } from '../../services/apiClient';
import { DataSourceBadge } from '../common/DataQualityBadge';
import { LightCurvePlot } from '../charts/LightCurvePlot';
import { CelestialTargetCutout } from '../charts/CelestialTargetCutout';

import { useTheme } from '../../context/ThemeContext';
import { WhyMattersButton } from '../common/WhyMattersModal';

export const RealAnalysisWorkstation: React.FC = () => {
  const { openWhyMatters } = useTheme();
  const [queryInput, setQueryInput] = useState<string>('TOI-700.01');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [progressEvent, setProgressEvent] = useState<AnalysisProgressEvent | null>(null);
  const [report, setReport] = useState<TrifectaAssessmentReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isBackendOnline, setIsBackendOnline] = useState<boolean>(true);
  const [lcView, setLcView] = useState<'phased' | 'raw' | 'detrended' | 'model'>('phased');

  useEffect(() => {
    TrifectaApiClient.checkHealth().then(online => {
      setIsBackendOnline(online);
      handleExecuteAnalysis('TOI-700.01');
    });
  }, []);

  const handleExecuteAnalysis = async (targetQuery: string, sector?: number) => {
    setIsAnalyzing(true);
    setError(null);
    setProgressEvent(null);

    try {
      const result = await TrifectaApiClient.startAnalysis(targetQuery, sector, (event) => {
        setProgressEvent(event);
      });
      setReport(result);
    } catch (err: any) {
      setError(err?.message || 'Failed to complete analysis on target.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePresetSelect = (presetQuery: string) => {
    setQueryInput(presetQuery);
    handleExecuteAnalysis(presetQuery);
  };

  const handleDownloadReportJson = () => {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TRIFECTA_REPORT_${report.target.target_id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const STAGES_LIST = [
    { num: 1, name: 'Resolving Target' },
    { num: 2, name: 'Catalog Information' },
    { num: 3, name: 'TESS Observations' },
    { num: 4, name: 'Download Light Curve' },
    { num: 5, name: 'Quality Control' },
    { num: 6, name: 'Detrending & Normalization' },
    { num: 7, name: 'Transit Characterization' },
    { num: 8, name: 'Chromaticity Check' },
    { num: 9, name: 'Morphology Analysis' },
    { num: 10, name: 'Physical Plausibility' },
    { num: 11, name: 'Nearby-Source Analysis' },
    { num: 12, name: 'Evidence Synthesis' },
    { num: 13, name: 'Generating Report' }
  ];

  return (
    <section id="real-workstation" className="py-14 bg-space-950 text-white border-b border-space-800 transition-colors relative overflow-hidden">
      <div className="absolute inset-0 bg-celestial-grid opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10 font-mono">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
                COMPUTATIONAL ASTROPHYSICS WORKSTATION &middot; END-TO-END PIPELINE
              </span>
              <span className={`text-[10.5px] px-2 py-0.5 rounded border ${isBackendOnline ? 'bg-emerald-950 text-emerald-300 border-emerald-800' : 'bg-amber-950 text-amber-300 border-amber-800'}`}>
                {isBackendOnline ? '● Scientific Backend Online' : '○ Standalone Client Mode'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Investigate a Candidate
            </h2>
            <p className="text-xs sm:text-sm text-space-300 leading-relaxed font-sans">
              Enter any real astronomical target (TIC ID, TOI number, confirmed exoplanet name, host star, or coordinates). The engine retrieves public data from NASA Exoplanet Archive, MAST, and Gaia DR3, executes 13-stage scientific preprocessing, Mandel-Agol morphology fitting, multi-band chromaticity, and generates an explainable assessment.
            </p>
          </div>

          {report && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadReportJson}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-space-200 bg-space-900 hover:bg-space-850 border border-space-700 rounded transition-colors shadow-lg cursor-pointer"
              >
                <FileDown className="w-4 h-4 text-sky-400" />
                <span>Export Report (JSON)</span>
              </button>
            </div>
          )}
        </div>

        <div className="bg-space-900/90 p-4 rounded-xl border border-space-800 space-y-3 shadow-2xl backdrop-blur-md">
          <form
            onSubmit={(e) => { e.preventDefault(); if (queryInput.trim()) handleExecuteAnalysis(queryInput); }}
            className="flex flex-wrap items-center justify-between gap-3 text-xs"
          >
            <div className="flex-1 min-w-[280px] relative">
              <Search className="w-4 h-4 text-sky-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Enter TIC ID (e.g. TIC 150428135), TOI (e.g. TOI-700), or Star/Planet name..."
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-xs bg-space-950 border border-space-700 rounded-lg text-white font-mono focus:outline-hidden focus:ring-1 focus:ring-sky-400 focus:border-sky-400 placeholder:text-space-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={isAnalyzing || !queryInput.trim()}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-400 hover:bg-sky-300 disabled:opacity-50 text-space-950 font-bold rounded-lg transition-colors shadow-lg shadow-sky-950/60 cursor-pointer"
              >
                {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                <span>{isAnalyzing ? 'Analyzing Target...' : 'ANALYZE TARGET'}</span>
              </button>
            </div>
          </form>

          <div className="pt-2 border-t border-space-800/80 flex flex-wrap items-center gap-2 text-[11px]">
            <span className="text-space-400 font-bold uppercase text-[10px] mr-1">
              Try A Demonstration (Real Public Data):
            </span>

            <button
              onClick={() => handlePresetSelect('TOI-700.01')}
              className="px-2.5 py-1 bg-space-950 hover:bg-space-850 text-sky-300 border border-space-700 rounded transition-colors cursor-pointer"
            >
              TOI-700.01 (Habitable Zone World)
            </button>

            <button
              onClick={() => handlePresetSelect('TOI-1233.01')}
              className="px-2.5 py-1 bg-space-950 hover:bg-space-850 text-emerald-300 border border-space-700 rounded transition-colors cursor-pointer"
            >
              TOI-1233.01 (HD 108236 b Multi-Planet)
            </button>

            <button
              onClick={() => handlePresetSelect('TOI-849.01')}
              className="px-2.5 py-1 bg-space-950 hover:bg-space-850 text-amber-300 border border-space-700 rounded transition-colors cursor-pointer"
            >
              TOI-849.01 (Stripped Core in Neptunian Desert)
            </button>

            <button
              onClick={() => handlePresetSelect('Vega')}
              className="px-2.5 py-1 bg-space-950 hover:bg-space-850 text-space-300 border border-space-700 rounded transition-colors cursor-pointer"
            >
              Vega (Alpha Lyrae / Stellar Non-Candidate)
            </button>
          </div>
        </div>

        {isAnalyzing && progressEvent && (
          <div className="bg-space-900 border border-sky-500/60 rounded-xl p-4 shadow-2xl space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-sky-400 uppercase flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-ping" />
                <span>Stage {progressEvent.step_number} of 13: {progressEvent.stage}</span>
              </span>
              <span className="text-white font-bold">{progressEvent.percent_complete}%</span>
            </div>

            <div className="w-full bg-space-950 rounded-full h-2 overflow-hidden border border-space-800">
              <div
                className="bg-gradient-to-r from-sky-500 via-indigo-400 to-emerald-400 h-full transition-all duration-300"
                style={{ width: `${progressEvent.percent_complete}%` }}
              />
            </div>

            <div className="text-xs text-space-200 font-sans">
              {progressEvent.message}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1 pt-1 text-[9.5px]">
              {STAGES_LIST.slice(0, 7).map((st) => (
                <div
                  key={st.num}
                  className={`p-1 rounded text-center border ${
                    progressEvent.step_number > st.num
                      ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                      : progressEvent.step_number === st.num
                      ? 'bg-sky-950 border-sky-500 text-sky-300 font-bold animate-pulse'
                      : 'bg-space-950 border-space-850 text-space-500'
                  }`}
                >
                  {st.num}. {st.name}
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="bg-rose-950/60 border border-rose-800 p-4 rounded-xl text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 shrink-0 text-rose-400" />
            <div>
              <strong className="block font-bold">Scientific Pipeline Notice:</strong>
              <span>{error}</span>
            </div>
          </div>
        )}

        {report && (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-space-900/90 border border-space-800 rounded-xl p-5 space-y-4 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-space-800 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-white">
                      {report.target.target_id}
                    </h3>
                    <span className="text-xs text-space-300">
                      Host: <strong className="text-sky-300">{report.target.host_name}</strong>
                    </span>
                    <span className="text-xs text-space-400">
                      (TIC {report.target.tic_id || 'N/A'} &middot; TESS Sector {report.tess_sector_used})
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded text-xs font-bold border ${
                    report.overall_state.includes('NO STRONG') || report.overall_state.includes('CONFIRMED')
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                      : report.overall_state.includes('POTENTIAL FALSE')
                      ? 'bg-rose-950 text-rose-300 border-rose-800'
                      : 'bg-amber-950 text-amber-300 border-amber-800'
                  }`}>
                    {report.overall_state}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 text-xs">
                <div className="bg-space-950 p-2.5 rounded border border-space-800">
                  <span className="text-space-400 text-[10px]">ORIGINAL POINTS</span>
                  <div className="text-white font-bold text-sm">{report.data_quality.original_points_count}</div>
                  <div className="text-[9.5px] text-space-500">Flagged: {report.data_quality.quality_flagged_count}</div>
                </div>

                <div className="bg-space-950 p-2.5 rounded border border-space-800">
                  <span className="text-space-400 text-[10px]">ANALYZED CADENCE</span>
                  <div className="text-white font-bold text-sm">{report.data_quality.analyzed_points_count}</div>
                  <div className="text-[9.5px] text-space-500">Outliers: {report.data_quality.outliers_rejected_count}</div>
                </div>

                <div className="bg-space-950 p-2.5 rounded border border-space-800">
                  <span className="text-space-400 text-[10px]">BASELINE FLATNESS</span>
                  <div className="text-white font-bold text-sm">{report.data_quality.baseline_flatness_rms_ppm} ppm</div>
                  <div className="text-[9.5px] text-space-500">Detrended RMS</div>
                </div>

                <div className="bg-space-950 p-2.5 rounded border border-space-800">
                  <span className="text-space-400 text-[10px]">SIGNAL-TO-NOISE</span>
                  <div className="text-emerald-400 font-bold text-sm">{report.data_quality.signal_to_noise_ratio}</div>
                  <div className="text-[9.5px] text-space-500">Quality: {report.data_quality.overall_quality}</div>
                </div>

                <div className="bg-space-950 p-2.5 rounded border border-space-800">
                  <span className="text-space-400 text-[10px]">ORBITAL PERIOD (P)</span>
                  <div className="text-white font-bold text-sm">{report.plausibility.orbital_period_days} days</div>
                  <div className="text-[9.5px] text-space-500">a = {report.plausibility.semi_major_axis_au} AU</div>
                </div>

                <div className="bg-space-950 p-2.5 rounded border border-space-800">
                  <span className="text-space-400 text-[10px]">INFERRED RADIUS (RP)</span>
                  <div className="text-white font-bold text-sm">{report.plausibility.inferred_radius_earth} R⊕</div>
                  <div className="text-[9.5px] text-space-500">{report.plausibility.inferred_radius_jupiter} R_Jup</div>
                </div>

                <div className="bg-space-950 p-2.5 rounded border border-space-800">
                  <span className="text-space-400 text-[10px]">EQUILIBRIUM TEMP</span>
                  <div className="text-white font-bold text-sm">{report.plausibility.equilibrium_temp_k} K</div>
                  <div className="text-[9.5px] text-space-500">Sinc = {report.plausibility.incident_flux_earth} S⊕</div>
                </div>
              </div>
            </div>

            <div className="bg-space-900/90 border border-space-800 rounded-xl p-5 space-y-4 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-space-800 pb-2.5">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-sky-400 uppercase">
                      TESS Photometric Time Series Analysis
                    </span>
                    <WhyMattersButton topicKey="transit_depth" onOpen={openWhyMatters} label="Why does transit depth matter?" />
                  </div>
                  <div className="text-[11px] text-space-400">
                    Source: {report.provenance[1]?.source_archive || 'MAST'} &middot; Product: {report.provenance[1]?.product_identifier || 'TESS SPOC'} &middot; <span className="text-space-300 italic">SPOC calibrated time-series generated from archive parameters; raw FITS upload supported.</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs">
                  <button
                    onClick={() => setLcView('phased')}
                    className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                      lcView === 'phased'
                        ? 'bg-sky-500 text-space-950 font-bold shadow'
                        : 'bg-space-950 text-space-300 hover:text-white border border-space-800'
                    }`}
                  >
                    Phase-Folded Transit
                  </button>

                  <button
                    onClick={() => setLcView('model')}
                    className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                      lcView === 'model'
                        ? 'bg-sky-500 text-space-950 font-bold shadow'
                        : 'bg-space-950 text-space-300 hover:text-white border border-space-800'
                    }`}
                  >
                    Mandel-Agol Fit
                  </button>

                  <button
                    onClick={() => setLcView('detrended')}
                    className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                      lcView === 'detrended'
                        ? 'bg-sky-500 text-space-950 font-bold shadow'
                        : 'bg-space-950 text-space-300 hover:text-white border border-space-800'
                    }`}
                  >
                    Detrended Full Sector
                  </button>

                  <button
                    onClick={() => setLcView('raw')}
                    className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                      lcView === 'raw'
                        ? 'bg-sky-500 text-space-950 font-bold shadow'
                        : 'bg-space-950 text-space-300 hover:text-white border border-space-800'
                    }`}
                  >
                    Raw Ingested
                  </button>
                </div>
              </div>

              <LightCurvePlot
                tessPoints={
                  lcView === 'raw'
                    ? report.raw_lightcurve
                    : lcView === 'detrended'
                    ? report.detrended_lightcurve
                    : report.phase_folded_lightcurve
                }
                title={`${report.target.target_id} — ${
                  lcView === 'phased' ? 'Phase-Folded Transit' : lcView === 'model' ? 'Mandel-Agol Fitted Model' : lcView === 'detrended' ? 'Detrended PDCSAP Flux' : 'Raw SPOC Flux'
                }`}
                transitDepthPercent={report.morphology.measured_depth_percent}
                totalDurationHours={report.morphology.total_duration_hours}
                ingressDurationMin={report.morphology.ingress_duration_min}
                height={280}
                periodDays={report.plausibility.orbital_period_days}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div className="lg:col-span-4 bg-space-900 border border-space-800 rounded-xl p-4 space-y-3 shadow-xl">
                <div className="flex items-center justify-between border-b border-space-800 pb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-sky-400 uppercase flex items-center gap-1.5">
                      <Telescope className="w-3.5 h-3.5 text-sky-400" />
                      <span>Optical Sky Image</span>
                    </span>
                    <WhyMattersButton topicKey="mast" onOpen={openWhyMatters} label="Why?" />
                  </div>
                  <span className="text-[10px] text-space-400">Pan-STARRS PS1</span>
                </div>

                <div className="bg-space-950 rounded-lg p-2 border border-space-800 flex items-center justify-center min-h-[190px] relative overflow-hidden">
                  {report.images.has_panstarrs_image && report.images.panstarrs_url ? (
                    <img
                      src={report.images.panstarrs_url}
                      alt="Pan-STARRS Optical Cutout"
                      className="w-full h-auto rounded max-h-[220px] object-cover"
                    />
                  ) : (
                    <div className="text-center space-y-1 p-4">
                      <Compass className="w-8 h-8 text-sky-400 mx-auto opacity-60" />
                      <div className="text-xs text-space-300 font-bold">Southern Hemisphere Target</div>
                      <p className="text-[10.5px] text-space-500 font-sans">
                        Target Dec ({report.target.dec_deg.toFixed(1)}°) is outside Pan-STARRS northern survey coverage (Dec &gt; -30°). TESS sky coordinates retained.
                      </p>
                    </div>
                  )}
                </div>

                <div className="text-[10.5px] text-space-400 font-sans">
                  <strong>Astrometric Center:</strong> RA {report.target.ra_sexagesimal} &middot; Dec {report.target.dec_sexagesimal}
                </div>
              </div>

              <div className="lg:col-span-8 bg-space-900 border border-space-800 rounded-xl p-4 space-y-3 shadow-xl">
                <div className="flex items-center justify-between border-b border-space-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-sky-400 uppercase flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-sky-400" />
                      <span>Nearby Gaia DR3 Sources</span>
                    </span>
                    <WhyMattersButton topicKey="gaia_neighbors" onOpen={openWhyMatters} label="Why do nearby stars matter?" />
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded border ${
                    report.neighbor_analysis.aperture_contaminants_count > 0
                      ? 'bg-amber-950 text-amber-300 border-amber-800 font-bold'
                      : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                  }`}>
                    Dilution D = {(report.neighbor_analysis.total_dilution_factor * 100).toFixed(2)}%
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-space-800 text-[10.5px] text-space-400">
                        <th className="pb-1.5">Source ID</th>
                        <th className="pb-1.5">Separation</th>
                        <th className="pb-1.5">Gaia G Mag</th>
                        <th className="pb-1.5">&Delta;mag</th>
                        <th className="pb-1.5">Flux Share</th>
                        <th className="pb-1.5">Contaminant Risk</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-space-800/60">
                      {report.neighbor_analysis.neighbors_found.map((n, i) => (
                        <tr key={i} className="hover:bg-space-850/40">
                          <td className="py-1.5 font-bold text-white">{n.source_id}</td>
                          <td className="py-1.5 text-space-300">{n.separation_arcsec}″</td>
                          <td className="py-1.5 text-space-200">{n.g_mag}</td>
                          <td className="py-1.5 text-space-300">+{n.delta_mag}</td>
                          <td className="py-1.5 text-sky-300">{(n.flux_fraction * 100).toFixed(2)}%</td>
                          <td className="py-1.5">
                            {n.is_aperture_contaminant ? (
                              <span className="text-amber-400 font-bold flex items-center gap-1 text-[10.5px]">
                                <AlertTriangle className="w-3 h-3" />
                                Inside Aperture (&le;42″)
                              </span>
                            ) : (
                              <span className="text-space-500 text-[10.5px]">Outside Aperture</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="text-[10.5px] text-space-400 bg-space-950 p-2 rounded border border-space-800 font-sans">
                  <strong>Contamination Context:</strong> {report.neighbor_analysis.scientific_interpretation}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-space-900 border border-space-800 rounded-xl p-4 space-y-3 shadow-xl">
                <div className="flex items-center justify-between border-b border-space-800 pb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-sky-400 uppercase">1. Chromaticity</span>
                    <WhyMattersButton topicKey="chromaticity" onOpen={openWhyMatters} label="Why?" />
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded border ${
                    report.chromaticity.is_available ? 'bg-emerald-950 text-emerald-300 border-emerald-800' : 'bg-space-950 text-space-400 border-space-700'
                  }`}>
                    {report.chromaticity.is_available ? 'Available' : 'Unavailable'}
                  </span>
                </div>

                {report.chromaticity.is_available ? (
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between"><span className="text-space-400">Blue Depth:</span> <span className="text-white">{report.chromaticity.blue_depth_percent}%</span></div>
                    <div className="flex justify-between"><span className="text-space-400">Red Depth:</span> <span className="text-white">{report.chromaticity.red_depth_percent}%</span></div>
                    <div className="flex justify-between"><span className="text-space-400">Delta (&Delta;D):</span> <span className="text-sky-300 font-bold">{report.chromaticity.delta_depth_percent}%</span></div>
                    <div className="flex justify-between"><span className="text-space-400">Significance:</span> <span className="text-white font-bold">{report.chromaticity.delta_sigma}&sigma;</span></div>
                  </div>
                ) : (
                  <div className="bg-space-950 p-3 rounded border border-space-800 text-xs text-space-300 space-y-1">
                    <strong className="text-white">TESS-Only Broadband Observation</strong>
                    <p className="text-[11px] text-space-400 font-sans">
                      No independent simultaneous blue/red transit photometry is available from the TESS light curve alone. Pillar 1 bypassed.
                    </p>
                  </div>
                )}

                <div className="text-xs text-space-200 bg-sky-950/40 p-2.5 rounded border border-sky-900/60 font-sans">
                  <strong className="text-sky-300 font-mono">Diagnostic: </strong>
                  {report.chromaticity.scientific_interpretation}
                </div>
              </div>

              <div className="bg-space-900 border border-space-800 rounded-xl p-4 space-y-3 shadow-xl">
                <div className="flex items-center justify-between border-b border-space-800 pb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-emerald-400 uppercase">2. Morphology</span>
                    <WhyMattersButton topicKey="morphology" onOpen={openWhyMatters} label="Why?" />
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                    {report.morphology.shape_consistency}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between"><span className="text-space-400">Transit Depth (&delta;):</span> <span className="text-white font-bold">{report.morphology.measured_depth_percent}%</span></div>
                  <div className="flex justify-between"><span className="text-space-400">Total Duration (T14):</span> <span className="text-white">{report.morphology.total_duration_hours}h</span></div>
                  <div className="flex justify-between"><span className="text-space-400">Ingress Time (T12):</span> <span className="text-white">{report.morphology.ingress_duration_min} min</span></div>
                  <div className="flex justify-between"><span className="text-space-400">Residual RMS:</span> <span className="text-emerald-400 font-bold">{report.morphology.residual_rms_ppm} ppm</span></div>
                </div>

                <div className="text-xs text-space-200 bg-emerald-950/40 p-2.5 rounded border border-emerald-900/60 font-sans">
                  <strong className="text-emerald-300 font-mono">Diagnostic: </strong>
                  {report.morphology.scientific_interpretation}
                </div>
              </div>

              <div className="bg-space-900 border border-space-800 rounded-xl p-4 space-y-3 shadow-xl">
                <div className="flex items-center justify-between border-b border-space-800 pb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-amber-400 uppercase">3. Plausibility</span>
                    <WhyMattersButton topicKey="plausibility" onOpen={openWhyMatters} label="Why?" />
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                    {report.plausibility.extreme_flags.length === 0 ? 'Consistent' : 'Extreme Regime'}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between"><span className="text-space-400">Inferred Radius:</span> <span className="text-white font-bold">{report.plausibility.inferred_radius_earth} R⊕ ({report.plausibility.inferred_radius_jupiter} R_Jup)</span></div>
                  <div className="flex justify-between"><span className="text-space-400">Equilibrium Teq:</span> <span className="text-white">{report.plausibility.equilibrium_temp_k} K</span></div>
                  <div className="flex justify-between"><span className="text-space-400">Incident Flux:</span> <span className="text-white">{report.plausibility.incident_flux_earth} S⊕</span></div>
                  <div className="flex justify-between"><span className="text-space-400">Stellar Density:</span> <span className="text-white">{report.plausibility.stellar_density_gcm3} g/cm³</span></div>
                </div>

                <div className="text-xs text-space-200 bg-amber-950/40 p-2.5 rounded border border-amber-900/60 font-sans">
                  <strong className="text-amber-300 font-mono">Diagnostic: </strong>
                  {report.plausibility.scientific_interpretation}
                </div>
              </div>
            </div>

            <div className="bg-space-900 text-white rounded-xl p-6 space-y-4 shadow-2xl border border-space-700">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-space-800 pb-3">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-sky-400">
                    EXPLAINABLE TRIFECTA CANDIDATE ASSESSMENT REPORT
                  </span>
                  <h4 className="text-lg font-bold text-white mt-0.5">
                    {report.headline_summary}
                  </h4>
                </div>
                <span className="text-xs px-3 py-1 bg-space-950 border border-space-700 rounded text-space-300">
                  {report.timestamp_utc}
                </span>
              </div>

              <div className="space-y-3 text-xs sm:text-sm leading-relaxed font-sans text-space-300">
                <div>
                  <strong className="text-white font-mono text-xs uppercase tracking-wider block">Detailed Scientific Reasoning:</strong>
                  <p className="mt-1 text-space-200 leading-relaxed font-sans">{report.detailed_reasoning}</p>
                </div>

                <div className="bg-space-950 p-3.5 rounded-lg border border-space-800 space-y-1">
                  <strong className="text-sky-300 font-mono text-xs uppercase tracking-wider block">
                    Recommended Follow-up Strategy:
                  </strong>
                  <p className="text-space-300 font-sans text-xs">{report.recommended_followup}</p>
                </div>

                {report.scientific_limitations.length > 0 && (
                  <div className="bg-amber-950/30 p-3 rounded-lg border border-amber-900/50 space-y-1 text-xs">
                    <strong className="text-amber-300 font-mono text-[11px] uppercase tracking-wider block">
                      Explicit Scientific Limitations:
                    </strong>
                    <ul className="list-disc pl-4 space-y-0.5 text-amber-200/90 text-[11.5px]">
                      {report.scientific_limitations.map((lim, i) => (
                        <li key={i}>{lim}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-space-800 flex flex-wrap items-center justify-between gap-2 text-[10.5px] text-space-400">
                <span>Provenance: {report.provenance.map(p => p.source_archive).join(' &middot; ')}</span>
                <span>Software: {report.provenance[0]?.software_version || 'Trifecta-Core v0.1.0'}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
