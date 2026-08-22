import React, { useState, useMemo } from 'react';
import {
  calculateSemiMajorAxisAU,
  calculateEquilibriumTempK,
  calculateIncidentFluxEarth,
  calculateCandidateRadius,
  computeChromaticSignificance,
  generateSyntheticLightCurve
} from '../../utils/physicsEngine';
import { LightCurvePlot } from '../charts/LightCurvePlot';
import { DiagnosticStatusBadge, DataSourceBadge } from '../common/DataQualityBadge';
import { ScientificNote } from '../common/ScientificNote';
import { Sliders, RotateCcw, Activity, Palette, Orbit, Sparkles } from 'lucide-react';

export const SyntheticSandbox: React.FC = () => {
  // Configurable physical parameters
  const [teffHost, setTeffHost] = useState<number>(5780);
  const [rStar, setRStar] = useState<number>(1.0);
  const [mStar, setMStar] = useState<number>(1.0);
  const [transitDepthBase, setTransitDepthBase] = useState<number>(0.85); // %
  const [chromaticDelta, setChromaticDelta] = useState<number>(0.0); // % blue - red
  const [photometricNoise, setPhotometricNoise] = useState<number>(0.04); // %
  const [periodDays, setPeriodDays] = useState<number>(10.5);
  const [impactParam, setImpactParam] = useState<number>(0.2);

  const handleReset = () => {
    setTeffHost(5780);
    setRStar(1.0);
    setMStar(1.0);
    setTransitDepthBase(0.85);
    setChromaticDelta(0.0);
    setPhotometricNoise(0.04);
    setPeriodDays(10.5);
    setImpactParam(0.2);
  };

  const applyPreset = (type: 'solar_earth' | 'hot_jupiter' | 'blended_beb' | 'grazing_binary' | 'unphysical_radius') => {
    if (type === 'solar_earth') {
      setTeffHost(5780);
      setRStar(1.0);
      setMStar(1.0);
      setTransitDepthBase(0.82);
      setChromaticDelta(0.0);
      setPhotometricNoise(0.035);
      setPeriodDays(14.0);
      setImpactParam(0.15);
    } else if (type === 'hot_jupiter') {
      setTeffHost(6100);
      setRStar(1.2);
      setMStar(1.15);
      setTransitDepthBase(1.10);
      setChromaticDelta(0.02);
      setPhotometricNoise(0.04);
      setPeriodDays(3.2);
      setImpactParam(0.25);
    } else if (type === 'blended_beb') {
      setTeffHost(6200);
      setRStar(1.25);
      setMStar(1.2);
      setTransitDepthBase(1.15);
      setChromaticDelta(0.55);
      setPhotometricNoise(0.05);
      setPeriodDays(4.8);
      setImpactParam(0.2);
    } else if (type === 'grazing_binary') {
      setTeffHost(4800);
      setRStar(0.78);
      setMStar(0.8);
      setTransitDepthBase(2.8);
      setChromaticDelta(0.03);
      setPhotometricNoise(0.06);
      setPeriodDays(2.2);
      setImpactParam(0.89);
    } else if (type === 'unphysical_radius') {
      setTeffHost(3400);
      setRStar(0.35);
      setMStar(0.32);
      setTransitDepthBase(5.5);
      setChromaticDelta(0.04);
      setPhotometricNoise(0.08);
      setPeriodDays(0.9);
      setImpactParam(0.1);
    }
  };

  const semiMajorAxis = useMemo(() => calculateSemiMajorAxisAU(periodDays, mStar), [periodDays, mStar]);
  const equilibriumTemp = useMemo(() => calculateEquilibriumTempK(teffHost, rStar, semiMajorAxis), [teffHost, rStar, semiMajorAxis]);
  const incidentFlux = useMemo(() => calculateIncidentFluxEarth(teffHost, rStar, semiMajorAxis), [teffHost, rStar, semiMajorAxis]);
  const candidateRadius = useMemo(() => calculateCandidateRadius(transitDepthBase, rStar), [transitDepthBase, rStar]);

  const totalDurationHours = useMemo(() => {
    const k = Math.sqrt(transitDepthBase / 100);
    const radTerm = Math.max(0.05, Math.pow(1 + k, 2) - Math.pow(impactParam, 2));
    const rawDur = (periodDays * 24 / Math.PI) * ((rStar * 0.00465) / (semiMajorAxis || 0.05)) * Math.sqrt(radTerm);
    return Math.max(0.8, Math.min(8.0, parseFloat(rawDur.toFixed(2))));
  }, [periodDays, rStar, semiMajorAxis, transitDepthBase, impactParam]);

  const ingressDurationMin = useMemo(() => {
    const k = Math.sqrt(transitDepthBase / 100);
    const ingressRatio = impactParam > 0.7 ? 0.45 : Math.max(0.08, k * 1.5);
    return Math.max(8, Math.min(90, Math.round(totalDurationHours * 60 * ingressRatio)));
  }, [totalDurationHours, transitDepthBase, impactParam]);

  const blueDepth = Math.max(0.01, transitDepthBase + chromaticDelta / 2);
  const redDepth = Math.max(0.01, transitDepthBase - chromaticDelta / 2);
  const chromaticStats = useMemo(() => {
    return computeChromaticSignificance(blueDepth, photometricNoise, redDepth, photometricNoise);
  }, [blueDepth, redDepth, photometricNoise]);

  const liveTessLC = useMemo(() => {
    return generateSyntheticLightCurve(
      transitDepthBase,
      totalDurationHours,
      ingressDurationMin / 60,
      photometricNoise,
      85,
      'TESS (broad)',
      impactParam
    );
  }, [transitDepthBase, totalDurationHours, ingressDurationMin, photometricNoise, impactParam]);

  const liveBlueLC = useMemo(() => {
    return generateSyntheticLightCurve(
      blueDepth,
      totalDurationHours,
      ingressDurationMin / 60,
      photometricNoise * 1.1,
      65,
      'g-band (blue)',
      impactParam
    );
  }, [blueDepth, totalDurationHours, ingressDurationMin, photometricNoise, impactParam]);

  const liveRedLC = useMemo(() => {
    return generateSyntheticLightCurve(
      redDepth,
      totalDurationHours,
      ingressDurationMin / 60,
      photometricNoise * 1.1,
      65,
      'z-band (red)',
      impactParam
    );
  }, [redDepth, totalDurationHours, ingressDurationMin, photometricNoise, impactParam]);

  const evaluation = useMemo(() => {
    const flags: string[] = [];

    let chromStatus: 'low_concern' | 'review_required' | 'false_positive_signature' = 'low_concern';
    if (chromaticStats.significanceSigma >= 3.0) {
      chromStatus = 'false_positive_signature';
      flags.push(`Chromaticity flag: ${chromaticStats.significanceSigma.toFixed(1)}σ depth difference detected between bands.`);
    } else if (chromaticStats.significanceSigma >= 1.8) {
      chromStatus = 'review_required';
      flags.push(`Chromaticity note: Marginal color depth difference (${chromaticStats.significanceSigma.toFixed(1)}σ).`);
    }

    let morphStatus: 'low_concern' | 'review_required' | 'false_positive_signature' = 'low_concern';
    if (impactParam >= 0.8) {
      morphStatus = 'review_required';
      flags.push(`Morphology flag: High impact parameter (b = ${impactParam.toFixed(2)}) produces grazing V-shape.`);
    }

    let plausStatus: 'low_concern' | 'review_required' | 'false_positive_signature' = 'low_concern';
    if (candidateRadius.rJupiter > 2.5) {
      plausStatus = 'false_positive_signature';
      flags.push(`Plausibility flag: Inferred radius (${candidateRadius.rJupiter} R_Jup) exceeds maximum physical planet limit (~1.5 R_Jup).`);
    } else if (candidateRadius.rJupiter > 1.8) {
      plausStatus = 'review_required';
      flags.push(`Plausibility note: Inferred radius (${candidateRadius.rJupiter} R_Jup) is in the brown dwarf / inflated gas giant regime.`);
    }

    let overallStatus: 'low_concern' | 'review_required' | 'false_positive_signature' = 'low_concern';
    if (chromStatus === 'false_positive_signature' || plausStatus === 'false_positive_signature') {
      overallStatus = 'false_positive_signature';
    } else if (chromStatus === 'review_required' || morphStatus === 'review_required' || plausStatus === 'review_required') {
      overallStatus = 'review_required';
    }

    return {
      chromStatus,
      morphStatus,
      plausStatus,
      overallStatus,
      flags
    };
  }, [chromaticStats, impactParam, candidateRadius]);

  return (
    <div className="bg-space-900/90 dark:bg-space-950/90 border border-space-700/80 rounded-xl p-6 shadow-2xl space-y-6 text-white relative overflow-hidden backdrop-blur-md">
      {/* Reticle */}
      <div className="absolute inset-0 bg-celestial-grid opacity-20 pointer-events-none" />

      {/* Header and Sandbox Warning */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-space-700/60 pb-4 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5 text-sky-400" />
              INTERACTIVE ASTROPHYSICAL SANDBOX
            </span>
            <DataSourceBadge source="SYNTHETIC DEMO" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white font-mono mt-1">
            "What If?" Physical Parameter Explorer
          </h3>
          <p className="text-xs sm:text-sm text-space-300 mt-1 max-w-2xl font-sans">
            Manipulate host star properties, transit geometry, chromatic differences, and noise levels to see how Trifecta’s three diagnostic lenses compute evidence in real time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium text-space-300 bg-space-850 border border-space-700 rounded hover:bg-space-800 transition-colors shadow-2xs cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Baseline</span>
          </button>
        </div>
      </div>

      {/* Preset Quick Buttons */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-mono relative z-10">
        <span className="text-[11px] text-space-400 font-semibold uppercase">Load Scenario:</span>
        <button
          onClick={() => applyPreset('solar_earth')}
          className="px-2.5 py-1 bg-space-850 hover:bg-space-800 border border-space-700 rounded text-space-200 transition-colors cursor-pointer"
        >
          Solar-Analog Sub-Neptune
        </button>
        <button
          onClick={() => applyPreset('blended_beb')}
          className="px-2.5 py-1 bg-rose-950/40 hover:bg-rose-900/40 border border-rose-800 text-rose-300 rounded transition-colors cursor-pointer"
        >
          Blended Binary (Δδ = 0.55%)
        </button>
        <button
          onClick={() => applyPreset('grazing_binary')}
          className="px-2.5 py-1 bg-amber-950/40 hover:bg-amber-900/40 border border-amber-800 text-amber-300 rounded transition-colors cursor-pointer"
        >
          Grazing Binary (b = 0.89)
        </button>
        <button
          onClick={() => applyPreset('unphysical_radius')}
          className="px-2.5 py-1 bg-space-850 hover:bg-space-800 border border-space-700 rounded text-space-200 transition-colors cursor-pointer"
        >
          Unphysical Companion (Rp &gt; 3 RJ)
        </button>
      </div>

      {/* Main Sandbox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        {/* Sliders Column */}
        <div className="lg:col-span-5 bg-space-950 border border-space-800 rounded-lg p-4 space-y-4 font-mono">
          <div className="text-xs font-bold uppercase text-sky-400 pb-2 border-b border-space-800">
            Astrophysical &amp; Observational Controls
          </div>

          {/* 1. Host Star Teff */}
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-space-400">Host Star Teff:</span>
              <span className="font-semibold text-white">{teffHost} K</span>
            </div>
            <input
              type="range"
              min="2800"
              max="8000"
              step="50"
              value={teffHost}
              onChange={(e) => setTeffHost(Number(e.target.value))}
              className="w-full h-1.5 bg-space-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
            />
          </div>

          {/* 2. Host Star Radius */}
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-space-400">Host Star Radius (R☉):</span>
              <span className="font-semibold text-white">{rStar.toFixed(2)} R☉</span>
            </div>
            <input
              type="range"
              min="0.3"
              max="2.2"
              step="0.05"
              value={rStar}
              onChange={(e) => setRStar(Number(e.target.value))}
              className="w-full h-1.5 bg-space-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
            />
          </div>

          {/* 3. Base Transit Depth */}
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-space-400">Transit Depth (δ_base):</span>
              <span className="font-semibold text-white">{transitDepthBase.toFixed(2)}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="6.0"
              step="0.05"
              value={transitDepthBase}
              onChange={(e) => setTransitDepthBase(Number(e.target.value))}
              className="w-full h-1.5 bg-space-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
            />
          </div>

          {/* 4. Chromatic Delta */}
          <div className="space-y-1 text-xs bg-sky-950/30 p-2 rounded border border-sky-900/60">
            <div className="flex justify-between">
              <span className="text-sky-300 font-medium">Chromatic Delta (Δδ):</span>
              <span className={Math.abs(chromaticDelta) > 0.2 ? 'font-bold text-rose-400' : 'font-semibold text-sky-200'}>
                {chromaticDelta > 0 ? `+${chromaticDelta.toFixed(2)}%` : `${chromaticDelta.toFixed(2)}%`}
              </span>
            </div>
            <input
              type="range"
              min="-1.0"
              max="1.2"
              step="0.02"
              value={chromaticDelta}
              onChange={(e) => setChromaticDelta(Number(e.target.value))}
              className="w-full h-1.5 bg-space-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
            />
            <div className="flex justify-between text-[10.5px] text-space-400 pt-1">
              <span>Blue: {blueDepth.toFixed(2)}%</span>
              <span>Red: {redDepth.toFixed(2)}%</span>
            </div>
          </div>

          {/* 5. Impact Parameter (b) */}
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-space-400">Impact Parameter (b):</span>
              <span className={impactParam > 0.8 ? 'font-bold text-amber-400' : 'font-semibold text-white'}>
                {impactParam.toFixed(2)} {impactParam > 0.8 ? '(Grazing)' : '(Central)'}
              </span>
            </div>
            <input
              type="range"
              min="0.0"
              max="0.95"
              step="0.02"
              value={impactParam}
              onChange={(e) => setImpactParam(Number(e.target.value))}
              className="w-full h-1.5 bg-space-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
            />
          </div>

          {/* 6. Orbital Period */}
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-space-400">Orbital Period (P):</span>
              <span className="font-semibold text-white">{periodDays.toFixed(1)} days</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="40.0"
              step="0.5"
              value={periodDays}
              onChange={(e) => setPeriodDays(Number(e.target.value))}
              className="w-full h-1.5 bg-space-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
            />
          </div>

          {/* 7. Photometric Noise */}
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-space-400">Photometric Noise (σ_phot):</span>
              <span className="font-semibold text-white">{(photometricNoise * 100).toFixed(0)} ppm</span>
            </div>
            <input
              type="range"
              min="0.01"
              max="0.12"
              step="0.005"
              value={photometricNoise}
              onChange={(e) => setPhotometricNoise(Number(e.target.value))}
              className="w-full h-1.5 bg-space-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
            />
          </div>
        </div>

        {/* Live Visualization Column */}
        <div className="lg:col-span-7 space-y-4">
          <LightCurvePlot
            tessPoints={liveTessLC}
            bluePoints={liveBlueLC}
            redPoints={liveRedLC}
            title="Synthetic Phased Light Curve"
            transitDepthPercent={transitDepthBase}
            totalDurationHours={totalDurationHours}
            ingressDurationMin={ingressDurationMin}
            height={260}
          />

          {/* Computed Physical Parameters Card */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-space-950 border border-space-800 rounded-lg p-3 text-xs font-mono">
            <div className="p-2 bg-space-900 rounded border border-space-800">
              <div className="text-[10px] text-space-400">Inferred Radius (Rp)</div>
              <div className="text-white font-bold text-sm mt-0.5">{candidateRadius.rEarth} R⊕</div>
              <div className="text-[10px] text-space-400">({candidateRadius.rJupiter} R_Jup)</div>
            </div>
            <div className="p-2 bg-space-900 rounded border border-space-800">
              <div className="text-[10px] text-space-400">Semi-Major Axis (a)</div>
              <div className="text-white font-bold text-sm mt-0.5">{semiMajorAxis.toFixed(3)} AU</div>
              <div className="text-[10px] text-space-400">P = {periodDays.toFixed(1)} d</div>
            </div>
            <div className="p-2 bg-space-900 rounded border border-space-800">
              <div className="text-[10px] text-space-400">Equilibrium Temp (Teq)</div>
              <div className="text-white font-bold text-sm mt-0.5">{equilibriumTemp} K</div>
              <div className="text-[10px] text-space-400">Albedo = 0.3</div>
            </div>
            <div className="p-2 bg-space-900 rounded border border-space-800">
              <div className="text-[10px] text-space-400">Chromatic Diff (Δδ)</div>
              <div className={`font-bold text-sm mt-0.5 ${chromaticStats.significanceSigma >= 3 ? 'text-rose-400' : 'text-white'}`}>
                {chromaticStats.significanceSigma.toFixed(1)}σ
              </div>
              <div className="text-[10px] text-space-400">Δδ = {chromaticStats.deltaDepth}%</div>
            </div>
          </div>

          {/* Live Reactive Assessment Summary */}
          <div className="bg-space-950 border border-space-800 rounded-lg p-4 space-y-3 font-mono">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-space-800 pb-2">
              <div className="text-xs font-bold uppercase text-sky-400">
                Live Trifecta Diagnostic Assessment
              </div>
              <DiagnosticStatusBadge status={evaluation.overallStatus} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div className="p-2.5 rounded border border-space-800 bg-space-900">
                <div className="text-[10.5px] text-sky-400 font-bold flex items-center gap-1">
                  <Palette className="w-3 h-3 text-sky-400" />
                  <span>1. Chromaticity</span>
                </div>
                <div className="text-white font-semibold mt-1">
                  {chromaticStats.significanceSigma >= 3 ? 'Anomaly (>3σ)' : 'Achromatic (Pass)'}
                </div>
              </div>

              <div className="p-2.5 rounded border border-space-800 bg-space-900">
                <div className="text-[10.5px] text-emerald-400 font-bold flex items-center gap-1">
                  <Activity className="w-3 h-3 text-emerald-400" />
                  <span>2. Morphology</span>
                </div>
                <div className="text-white font-semibold mt-1">
                  {impactParam > 0.8 ? 'Grazing / V-shape' : 'Transit-like (Pass)'}
                </div>
              </div>

              <div className="p-2.5 rounded border border-space-800 bg-space-900">
                <div className="text-[10.5px] text-amber-400 font-bold flex items-center gap-1">
                  <Orbit className="w-3 h-3 text-amber-400" />
                  <span>3. Plausibility</span>
                </div>
                <div className="text-white font-semibold mt-1">
                  {candidateRadius.rJupiter > 2.0 ? 'Unphysical Radius' : 'Consistent (Pass)'}
                </div>
              </div>
            </div>

            {/* Generated Explanation */}
            <div className="text-xs text-space-200 bg-space-900 p-3 rounded border border-space-800 space-y-1">
              <div className="font-semibold text-white">Explainable Decision Trace:</div>
              {evaluation.flags.length > 0 ? (
                <ul className="list-disc list-inside space-y-0.5 text-space-300 font-sans">
                  {evaluation.flags.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              ) : (
                <div className="text-emerald-400 font-sans">
                  All three independent physical diagnostics are consistent with a genuine planetary candidate. Prioritize for high-resolution radial velocity confirmation.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ScientificNote variant="caveat" title="Synthetic Model Notice">
        This interactive simulator uses an analytical transit model with quadratic limb darkening (Mandel &amp; Agol 2002) and Gaussian photometric noise to illustrate the framework's mathematical behavior. It is designed for interactive exploration and does not represent an observational claim.
      </ScientificNote>
    </div>
  );
};
