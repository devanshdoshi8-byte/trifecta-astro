import React, { useState, useMemo, useEffect } from 'react';
import { RESEARCH_CANDIDATES } from '../../data/mockCandidates';
import { CandidateAssessment, DiagnosticStatus, LiveQueryState } from '../../types/astrophysics';
import { LightCurvePlot } from '../charts/LightCurvePlot';
import { CelestialTargetCutout } from '../charts/CelestialTargetCutout';
import { NumericalTransitFitter } from '../charts/NumericalTransitFitter';
import { DiagnosticStatusBadge, DataSourceBadge, DataQualityBadge } from '../common/DataQualityBadge';
import { ScientificNote } from '../common/ScientificNote';
import { useTheme } from '../../context/ThemeContext';
import { AstronomyDataService } from '../../services/astronomyDataService';
import {
  Palette,
  Activity,
  Orbit,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  FileDown,
  Search,
  Filter,
  Play,
  Layers,
  ChevronRight,
  Sparkles,
  Database,
  Clock,
  Radio,
  Compass,
  Telescope,
  Globe,
  Loader2,
  Upload,
  Cpu
} from 'lucide-react';

export const CandidateExplorerSection: React.FC = () => {
  const {
    openReportModal,
    openCompareModal,
    openUploader,
    activeCandidateOverride,
    setActiveCandidateOverride
  } = useTheme();

  // Search & Filter states
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>('TOI-1233.01');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterMultiBand, setFilterMultiBand] = useState<boolean | null>(null);
  const [lightCurveViewMode, setLightCurveViewMode] = useState<'standard' | 'fitter'>('standard');

  // Live query state
  const [liveCandidate, setLiveCandidate] = useState<CandidateAssessment | null>(null);
  const [liveQueryState, setLiveQueryState] = useState<LiveQueryState>({
    isLoading: false,
    statusText: '',
    error: null,
    sourceUsed: 'LOCAL_EXOPLANET_REGISTRY'
  });

  // Analysis run animation state
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisStep, setAnalysisStep] = useState<string>('');

  // Filtered candidate list
  const filteredCandidates = useMemo(() => {
    return RESEARCH_CANDIDATES.filter(c => {
      const matchesSearch =
        c.candidateId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.hostStarName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.ticId.includes(searchQuery);

      const matchesStatus = filterStatus === 'all' || c.overallStatus === filterStatus;
      const matchesMB = filterMultiBand === null || c.chromaticity.hasMultiBandData === filterMultiBand;

      return matchesSearch && matchesStatus && matchesMB;
    });
  }, [searchQuery, filterStatus, filterMultiBand]);

  // Sync activeCandidateOverride if set from uploader
  useEffect(() => {
    if (activeCandidateOverride) {
      setLiveCandidate(activeCandidateOverride);
      setSelectedCandidateId(activeCandidateOverride.candidateId);
    }
  }, [activeCandidateOverride]);

  const candidate: CandidateAssessment =
    activeCandidateOverride ||
    liveCandidate ||
    RESEARCH_CANDIDATES.find(c => c.candidateId === selectedCandidateId) ||
    filteredCandidates[0] ||
    RESEARCH_CANDIDATES[0];

  const handleSelectPreset = (candidateId: string) => {
    setActiveCandidateOverride(null);
    setLiveCandidate(null);
    setSelectedCandidateId(candidateId);
  };

  const handleLiveQuerySubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setLiveQueryState({
      isLoading: true,
      statusText: `Connecting to Astronomical TAP Services for "${searchQuery.trim()}"...`,
      error: null,
      sourceUsed: 'LIVE_TAP_API'
    });

    try {
      const result = await AstronomyDataService.queryTargetCandidate(searchQuery, (step) => {
        setLiveQueryState(prev => ({ ...prev, statusText: step }));
      });

      setLiveCandidate(result.assessment);
      setSelectedCandidateId(result.assessment.candidateId);
      setLiveQueryState(result.state);
    } catch (err: any) {
      setLiveQueryState({
        isLoading: false,
        statusText: '',
        error: err?.message || 'Failed to query astronomical service',
        sourceUsed: 'LOCAL_EXOPLANET_REGISTRY'
      });
    }
  };

  const handleRunAnalysis = () => {
    setIsAnalyzing(true);
    const steps = [
      'Querying MAST archive for SPOC calibrated light curve...',
      'Running 3-sigma baseline outlier rejection & QC checks...',
      'Phase folding time series with period P = ' + candidate.plausibility.orbitalPeriodDays + 'd...',
      'Extracting Mandel-Agol quadratic limb-darkened profile...',
      candidate.chromaticity.hasMultiBandData
        ? 'Ingesting ground g-band & z-band photometry for chromatic delta test...'
        : 'Ground follow-up absent: Bypassing Pillar 1 (Data Availability Dependent)...',
      'Cross-matching Gaia DR3 spatial index within 42″ aperture mask...',
      'Evaluating physical plausibility, Teq, and stellar density...',
      'Synthesizing multi-diagnostic evidence & risk matrix...'
    ];

    let current = 0;
    setAnalysisStep(steps[0]);

    const interval = setInterval(() => {
      current++;
      if (current < steps.length) {
        setAnalysisStep(steps[current]);
      } else {
        clearInterval(interval);
        setIsAnalyzing(false);
      }
    }, 380);
  };

  return (
    <section id="candidate-explorer" className="py-16 bg-space-950 text-white border-b border-space-800 transition-colors relative overflow-hidden">
      {/* Background Reticle */}
      <div className="absolute inset-0 bg-celestial-grid opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
        {/* Header and Top Action Bar */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
                SECTION 04: OBSERVATION WORKSTATION &middot; MISSION CONTROL
              </span>
              <DataSourceBadge source={candidate.dataSource} />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              Candidate Analysis Workstation
            </h2>
            <p className="text-sm sm:text-base text-space-300 leading-relaxed font-serif">
              Inspect how the Trifecta screening engine evaluates exoplanet candidate profiles: genuine planetary candidate, blended eclipsing binary, grazing binary, unphysical companion, and data-limited cases.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 font-mono">
            <button
              onClick={openUploader}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-sky-300 bg-sky-950/80 hover:bg-sky-900/80 border border-sky-700 rounded transition-colors shadow-lg cursor-pointer"
            >
              <Upload className="w-4 h-4 text-sky-400" />
              <span>Upload Custom Data (CSV/FITS)</span>
            </button>

            <button
              onClick={openCompareModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-space-200 bg-space-900 hover:bg-space-850 border border-space-700 rounded transition-colors shadow-2xs cursor-pointer"
            >
              <Layers className="w-4 h-4 text-sky-400" />
              <span>Compare Matrix</span>
            </button>

            <button
              onClick={() => openReportModal(candidate)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-space-200 bg-space-900 hover:bg-space-850 border border-space-700 rounded transition-colors shadow-2xs cursor-pointer"
            >
              <FileDown className="w-4 h-4 text-space-400" />
              <span>Export Report</span>
            </button>

            <button
              onClick={handleRunAnalysis}
              disabled={isAnalyzing}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-space-950 bg-sky-400 hover:bg-sky-300 rounded transition-colors shadow-lg shadow-sky-950/50 disabled:opacity-50 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isAnalyzing ? 'Running Diagnostics...' : 'Run Trifecta Analysis'}</span>
            </button>
          </div>
        </div>

        {/* Live Analysis Progress Bar */}
        {isAnalyzing && (
          <div className="bg-space-900/90 text-white p-4 rounded-xl shadow-2xl border border-sky-500/50 space-y-2 animate-fadeIn font-mono text-xs backdrop-blur-md">
            <div className="flex items-center justify-between text-sky-400 font-bold uppercase tracking-wider text-[11px]">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-ping" />
                Executing Trifecta Diagnostic Pipeline
              </span>
              <span>Running Stage</span>
            </div>
            <div className="text-space-200 font-sans text-xs flex items-center gap-2">
              <span>{analysisStep}</span>
            </div>
          </div>
        )}

        {/* Live Search & NASA TAP Query Bar */}
        <div className="bg-space-900/90 p-4 rounded-xl border border-space-800 space-y-3 shadow-xl backdrop-blur-md">
          <form onSubmit={handleLiveQuerySubmit} className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex-1 min-w-[280px] relative">
              <Search className="w-4 h-4 text-sky-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Query any TOI or TIC ID (e.g. TOI-700, TOI-849, TOI-1233, TIC 150428135)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-space-950 border border-space-700 rounded-lg text-white font-mono focus:outline-hidden focus:ring-1 focus:ring-sky-400 focus:border-sky-400 placeholder:text-space-500"
              />
            </div>

            <div className="flex items-center gap-2 font-mono text-xs">
              <button
                type="submit"
                disabled={liveQueryState.isLoading || !searchQuery.trim()}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-space-950 font-bold rounded-lg transition-colors cursor-pointer"
              >
                {liveQueryState.isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Globe className="w-3.5 h-3.5" />}
                <span>{liveQueryState.isLoading ? 'Querying TAP...' : 'Query Live NASA Index'}</span>
              </button>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-space-950 border border-space-700 rounded-lg px-2.5 py-2 text-space-200"
              >
                <option value="all">All Assessments</option>
                <option value="low_concern">Low Concern</option>
                <option value="review_required">Review Required</option>
                <option value="false_positive_signature">False-Positive</option>
              </select>
            </div>
          </form>

          {/* Query State Feedback Bar */}
          {liveQueryState.statusText && (
            <div className="text-[11px] font-mono text-sky-300 flex items-center justify-between border-t border-space-800/80 pt-2">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {liveQueryState.statusText}
              </span>
              {liveQueryState.queryTimeMs && (
                <span className="text-space-500">Latency: {liveQueryState.queryTimeMs} ms</span>
              )}
            </div>
          )}
        </div>

        {/* Preset Candidate Selector Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {filteredCandidates.map((c) => {
            const isSelected = !liveCandidate && c.candidateId === selectedCandidateId;
            return (
              <button
                key={c.candidateId}
                onClick={() => handleSelectPreset(c.candidateId)}
                className={`p-3 rounded-lg border text-left transition-all flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-space-900 text-white border-sky-400 shadow-lg shadow-sky-950/60 ring-1 ring-sky-400/50'
                    : 'bg-space-900/40 text-space-200 border-space-800 hover:border-space-700 hover:bg-space-900/80'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs">{c.candidateId}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${
                      c.overallStatus === 'low_concern'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : c.overallStatus === 'false_positive_signature'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    }`}>
                      {c.overallStatus === 'low_concern' ? 'Low Concern' : c.overallStatus === 'false_positive_signature' ? 'False-Pos' : 'Review'}
                    </span>
                  </div>
                  <div className={`text-[11px] mt-1 line-clamp-1 ${isSelected ? 'text-space-200' : 'text-space-400'}`}>
                    {c.hostStarName}
                  </div>
                </div>
                <div className={`text-[10px] font-mono mt-2 flex items-center justify-between pt-1 border-t ${
                  isSelected ? 'border-space-800 text-sky-300' : 'border-space-800/60 text-space-500'
                }`}>
                  <span>P = {c.plausibility.orbitalPeriodDays}d</span>
                  <span>Rp = {c.plausibility.candidateRadiusEarth} R⊕</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Candidate Astronomical HUD Banner */}
        <div className="bg-space-900/80 border border-space-800 rounded-xl p-5 space-y-4 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-space-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold font-mono text-white">
                  {candidate.candidateId}
                </h3>
                <span className="text-xs font-mono text-space-300">
                  Host: <strong className="text-sky-300">{candidate.hostStarName}</strong>
                </span>
                <span className="text-xs font-mono text-space-400">
                  (TIC {candidate.ticId} &middot; Sectors: {candidate.tessSector.join(', ')})
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DataQualityBadge level={candidate.dataQuality.overallLevel} snr={candidate.dataQuality.signalToNoiseRatio} />
              <DiagnosticStatusBadge status={candidate.overallStatus} size="md" />
            </div>
          </div>

          {/* Astronomical Telemetry HUD Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs font-mono">
            <div className="bg-space-950 p-2.5 rounded border border-space-800">
              <span className="text-space-400 text-[10.5px]">HOST TEFF</span>
              <div className="text-white font-bold text-sm">{candidate.plausibility.hostStarTeftK} K</div>
              <div className="text-[10px] text-space-400">{candidate.plausibility.hostSpectralType}</div>
            </div>
            <div className="bg-space-950 p-2.5 rounded border border-space-800">
              <span className="text-space-400 text-[10.5px]">HOST RADIUS / MASS</span>
              <div className="text-white font-bold text-sm">{candidate.plausibility.hostStarRadiusSolar} R☉</div>
              <div className="text-[10px] text-space-400">{candidate.plausibility.hostStarMassSolar} M☉</div>
            </div>
            <div className="bg-space-950 p-2.5 rounded border border-space-800">
              <span className="text-space-400 text-[10.5px]">ORBITAL PERIOD (P)</span>
              <div className="text-white font-bold text-sm">{candidate.plausibility.orbitalPeriodDays} days</div>
              <div className="text-[10px] text-space-400">a = {candidate.plausibility.semiMajorAxisAU} AU</div>
            </div>
            <div className="bg-space-950 p-2.5 rounded border border-space-800">
              <span className="text-space-400 text-[10.5px]">INFERRED RADIUS (RP)</span>
              <div className="text-white font-bold text-sm">{candidate.plausibility.candidateRadiusEarth} R⊕</div>
              <div className="text-[10px] text-space-400">{candidate.plausibility.candidateRadiusJupiter} R_Jup</div>
            </div>
            <div className="bg-space-950 p-2.5 rounded border border-space-800">
              <span className="text-space-400 text-[10.5px]">EQUILIBRIUM TEMP</span>
              <div className="text-white font-bold text-sm">{candidate.plausibility.equilibriumTempK} K</div>
              <div className="text-[10px] text-space-400">Sinc = {candidate.plausibility.incidentFluxEarth} S⊕</div>
            </div>
            <div className="bg-space-950 p-2.5 rounded border border-space-800">
              <span className="text-space-400 text-[10.5px]">MULTI-BAND COVERAGE</span>
              <div className="text-white font-bold text-sm">
                {candidate.chromaticity.hasMultiBandData ? 'Available' : 'Pending'}
              </div>
              <div className="text-[10px] text-space-400">
                {candidate.chromaticity.hasMultiBandData ? candidate.chromaticity.filtersUsed[0].split(' ')[0] : 'Single TESS band'}
              </div>
            </div>
          </div>
        </div>

        {/* High-Precision Interactive Light Curve Canvas & Numerical Fitter */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-space-800 pb-2">
            <span className="text-xs font-mono font-bold text-sky-400 uppercase">
              Photometric Analysis View
            </span>
            <div className="flex items-center gap-1.5 font-mono text-xs">
              <button
                onClick={() => setLightCurveViewMode('standard')}
                className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                  lightCurveViewMode === 'standard'
                    ? 'bg-sky-500 text-space-950 font-bold shadow-md'
                    : 'bg-space-900 text-space-300 hover:text-white border border-space-700'
                }`}
              >
                Multi-Band Light Curve
              </button>
              <button
                onClick={() => setLightCurveViewMode('fitter')}
                className={`px-3 py-1 rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
                  lightCurveViewMode === 'fitter'
                    ? 'bg-sky-500 text-space-950 font-bold shadow-md'
                    : 'bg-space-900 text-space-300 hover:text-white border border-space-700'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>Numerical Mandel-Agol Fitter</span>
              </button>
            </div>
          </div>

          {lightCurveViewMode === 'standard' ? (
            <LightCurvePlot
              tessPoints={candidate.lightCurves.tessLightCurve}
              bluePoints={candidate.lightCurves.blueLightCurve}
              redPoints={candidate.lightCurves.redLightCurve}
              rawUnfoldedPoints={candidate.lightCurves.rawUnfoldedLightCurve}
              title={`${candidate.candidateId} Photometric Time Series`}
              transitDepthPercent={candidate.morphology.transitDepth}
              totalDurationHours={candidate.morphology.totalDurationHours}
              ingressDurationMin={candidate.morphology.ingressDurationMin}
              height={340}
              periodDays={candidate.plausibility.orbitalPeriodDays}
            />
          ) : (
            <NumericalTransitFitter
              dataPoints={candidate.lightCurves.tessLightCurve}
              orbitalPeriodDays={candidate.plausibility.orbitalPeriodDays}
              candidateTitle={`${candidate.candidateId} (TIC ${candidate.ticId}) Phase-Folded Data`}
            />
          )}
        </div>

        {/* "Where the Candidate Lives" / Target Index Field & Gaia DR3 Spatial Cross-Match */}
        <CelestialTargetCutout
          candidateId={candidate.candidateId}
          ticId={candidate.ticId}
          hostName={candidate.hostStarName}
          sector={candidate.tessSector}
          targetField={candidate.targetField}
        />

        {/* Three Diagnostic Deep Dive Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Diagnostic 1: Chromaticity */}
          <div className="bg-space-900 border border-space-800 rounded-lg p-4 space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-space-800 pb-2">
              <div className="flex items-center gap-1.5 text-sky-400 font-mono text-xs font-bold uppercase">
                <Palette className="w-3.5 h-3.5" />
                <span>1. Chromaticity</span>
              </div>
              <DiagnosticStatusBadge status={candidate.chromaticity.status} size="sm" showIcon={false} />
            </div>

            {candidate.chromaticity.hasMultiBandData ? (
              <div className="space-y-2 font-mono text-xs">
                <div className="flex justify-between py-0.5">
                  <span className="text-space-400">Blue-band Depth:</span>
                  <span className="font-semibold text-white">
                    {candidate.chromaticity.blueBandDepth.toFixed(2)}% ± {candidate.chromaticity.blueBandDepthErr.toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-space-400">Red-band Depth:</span>
                  <span className="font-semibold text-white">
                    {candidate.chromaticity.redBandDepth.toFixed(2)}% ± {candidate.chromaticity.redBandDepthErr.toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between py-0.5 border-t border-space-800 pt-1">
                  <span className="text-space-400">Delta (Δδ):</span>
                  <span className={`font-bold ${candidate.chromaticity.significanceSigma >= 3 ? 'text-rose-400' : 'text-white'}`}>
                    {candidate.chromaticity.deltaDepth > 0 ? `+${candidate.chromaticity.deltaDepth.toFixed(2)}%` : `${candidate.chromaticity.deltaDepth.toFixed(2)}%`}
                  </span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-space-400">Significance:</span>
                  <span className={`font-bold ${candidate.chromaticity.significanceSigma >= 3 ? 'text-rose-400' : 'text-white'}`}>
                    {candidate.chromaticity.significanceSigma.toFixed(2)}σ
                  </span>
                </div>
                <div className="text-[10.5px] text-space-400 pt-1 border-t border-space-800">
                  Filters: {candidate.chromaticity.filtersUsed.join(', ')}
                </div>
              </div>
            ) : (
              <div className="bg-space-950 p-3 rounded border border-space-800 text-xs text-space-300 space-y-1">
                <div className="font-semibold text-white">Ground Follow-up Unavailable</div>
                <p className="text-[11px] text-space-400">
                  TESS single optical bandpass does not provide color channels. Chromaticity module bypassed.
                </p>
              </div>
            )}

            <div className="text-xs text-space-200 bg-sky-950/40 p-2.5 rounded border border-sky-900/60 font-sans">
              <span className="font-semibold text-sky-300 font-mono">Diagnostic: </span>
              {candidate.chromaticity.scientificInterpretation}
            </div>
          </div>

          {/* Diagnostic 2: Morphology */}
          <div className="bg-space-900 border border-space-800 rounded-lg p-4 space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-space-800 pb-2">
              <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-xs font-bold uppercase">
                <Activity className="w-3.5 h-3.5" />
                <span>2. Morphology</span>
              </div>
              <DiagnosticStatusBadge status={candidate.morphology.status} size="sm" showIcon={false} />
            </div>

            <div className="space-y-2 font-mono text-xs">
              <div className="flex justify-between py-0.5">
                <span className="text-space-400">Transit Depth:</span>
                <span className="font-semibold text-white">
                  {candidate.morphology.transitDepth.toFixed(2)}% ± {candidate.morphology.transitDepthErr.toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-space-400">Duration (T14):</span>
                <span className="font-semibold text-white">{candidate.morphology.totalDurationHours.toFixed(2)} hours</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-space-400">Ingress (T12):</span>
                <span className="font-semibold text-white">{candidate.morphology.ingressDurationMin.toFixed(1)} min</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-space-400">Shape Class:</span>
                <span className={`font-semibold ${candidate.morphology.shapeConsistency.includes('V-shape') ? 'text-amber-400' : 'text-white'}`}>
                  {candidate.morphology.shapeConsistency}
                </span>
              </div>
              <div className="flex justify-between py-0.5 border-t border-space-800 pt-1">
                <span className="text-space-400">Residual RMS:</span>
                <span className="text-white font-semibold">{candidate.morphology.residualRmsPpm} ppm</span>
              </div>
            </div>

            <div className="text-xs text-space-200 bg-emerald-950/40 p-2.5 rounded border border-emerald-900/60 font-sans">
              <span className="font-semibold text-emerald-300 font-mono">Diagnostic: </span>
              {candidate.morphology.scientificInterpretation}
            </div>
          </div>

          {/* Diagnostic 3: Plausibility */}
          <div className="bg-space-900 border border-space-800 rounded-lg p-4 space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-space-800 pb-2">
              <div className="flex items-center gap-1.5 text-amber-400 font-mono text-xs font-bold uppercase">
                <Orbit className="w-3.5 h-3.5" />
                <span>3. Plausibility</span>
              </div>
              <DiagnosticStatusBadge status={candidate.plausibility.status} size="sm" showIcon={false} />
            </div>

            <div className="space-y-2 font-mono text-xs">
              <div className="flex justify-between py-0.5">
                <span className="text-space-400">Inferred Radius:</span>
                <span className={`font-bold ${candidate.plausibility.candidateRadiusJupiter > 2.0 ? 'text-rose-400' : 'text-white'}`}>
                  {candidate.plausibility.candidateRadiusEarth} R⊕ ({candidate.plausibility.candidateRadiusJupiter} R_Jup)
                </span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-space-400">Equilibrium Temp:</span>
                <span className="font-semibold text-white">{candidate.plausibility.equilibriumTempK} K</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-space-400">Incident Flux:</span>
                <span className="font-semibold text-white">{candidate.plausibility.incidentFluxEarth} S⊕</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-space-400">Stellar Density Match:</span>
                <span className="font-semibold text-white">{candidate.plausibility.photometricStellarDensityGcm3} g/cm³</span>
              </div>
              <div className="text-[10.5px] text-space-400 pt-1 border-t border-space-800">
                Flags: {candidate.plausibility.parameterSpaceFlags.length ? candidate.plausibility.parameterSpaceFlags.join('; ') : 'None'}
              </div>
            </div>

            <div className="text-xs text-space-200 bg-amber-950/40 p-2.5 rounded border border-amber-900/60 font-sans">
              <span className="font-semibold text-amber-300 font-mono">Diagnostic: </span>
              {candidate.plausibility.scientificInterpretation}
            </div>
          </div>
        </div>

        {/* Evidence For vs Evidence Requiring Caution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-emerald-950/20 border border-emerald-900/60 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-300">
                Evidence Supporting Planetary Hypothesis
              </span>
            </div>
            <ul className="space-y-2 text-xs text-space-200 font-sans">
              {candidate.evidenceFor.map((ev, i) => (
                <li key={i} className="flex items-start gap-2 bg-space-900/80 p-2.5 rounded border border-emerald-900/40">
                  <span className="text-emerald-400 font-bold font-mono">•</span>
                  <div>
                    <strong className="font-mono text-[11px] block text-white">{ev.summary}</strong>
                    <span className="text-space-300 text-[11px]">{ev.detail}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-amber-950/20 border border-amber-900/60 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-amber-300">
                Counter-Evidence &amp; Observations Requiring Caution
              </span>
            </div>
            <ul className="space-y-2 text-xs text-space-200 font-sans">
              {candidate.evidenceAgainst.map((ev, i) => (
                <li key={i} className="flex items-start gap-2 bg-space-900/80 p-2.5 rounded border border-amber-900/40">
                  <span className="text-amber-400 font-bold font-mono">•</span>
                  <div>
                    <strong className="font-mono text-[11px] block text-white">{ev.summary}</strong>
                    <span className="text-space-300 text-[11px]">{ev.detail}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Explainability & Reasoned Decision Box */}
        <div className="bg-space-900/90 text-white rounded-xl p-6 space-y-4 shadow-2xl border border-space-700/80">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-space-800 pb-3">
            <div>
              <span className="text-xs font-mono font-semibold uppercase tracking-widest text-sky-400">
                EXPLAINABLE DECISION SUMMARY &middot; EVERY FLAG HAS A REASON
              </span>
              <h4 className="text-lg font-bold text-white mt-0.5">
                {candidate.headlineSummary}
              </h4>
            </div>
            <DiagnosticStatusBadge status={candidate.overallStatus} size="lg" />
          </div>

          <div className="space-y-3 text-xs sm:text-sm leading-relaxed font-sans text-space-300">
            <div>
              <strong className="text-white font-mono text-xs uppercase tracking-wider">Why was this assessment generated?</strong>
              <p className="mt-1 text-space-200 leading-relaxed font-sans">{candidate.detailedReasoning}</p>
            </div>

            <div className="bg-space-950 p-3.5 rounded-lg border border-space-800 space-y-1">
              <strong className="text-sky-300 font-mono text-xs uppercase tracking-wider">
                Recommended Follow-up Strategy:
              </strong>
              <p className="text-space-300 font-sans text-xs">{candidate.recommendedFollowup}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
