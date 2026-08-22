import React, { useState } from 'react';
import {
  Palette,
  Activity,
  Orbit,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Sliders
} from 'lucide-react';
import { LightCurvePlot } from './LightCurvePlot';
import { generateSyntheticLightCurve } from '../../utils/physicsEngine';
import { ScientificNote } from '../common/ScientificNote';

export const InteractiveProblemComparator: React.FC = () => {
  // Evidence injection toggles
  const [hasChromaticity, setHasChromaticity] = useState<boolean>(false);
  const [hasMorphology, setHasMorphology] = useState<boolean>(false);
  const [hasPlausibility, setHasPlausibility] = useState<boolean>(false);

  // Selected hypothesis tab for detailed inspection
  const [activeHypothesis, setActiveHypothesis] = useState<'planet' | 'beb' | 'grazing'>('planet');

  const handleReset = () => {
    setHasChromaticity(false);
    setHasMorphology(false);
    setHasPlausibility(false);
  };

  const handleAddAll = () => {
    setHasChromaticity(true);
    setHasMorphology(true);
    setHasPlausibility(true);
  };

  // Generate synthetic curves for the 3 competing scenarios
  const planetTessLC = React.useMemo(() => generateSyntheticLightCurve(0.85, 2.8, 0.22, 0.035, 80, 'TESS (broad)', 0.15), []);
  const planetBlueLC = React.useMemo(() => generateSyntheticLightCurve(0.85, 2.8, 0.22, 0.045, 60, 'g-band (blue)', 0.15), []);
  const planetRedLC = React.useMemo(() => generateSyntheticLightCurve(0.84, 2.8, 0.22, 0.045, 60, 'z-band (red)', 0.15), []);

  const bebTessLC = React.useMemo(() => generateSyntheticLightCurve(0.85, 2.8, 0.25, 0.035, 80, 'TESS (broad)', 0.2), []);
  const bebBlueLC = React.useMemo(() => generateSyntheticLightCurve(1.28, 2.8, 0.25, 0.055, 60, 'g-band (blue)', 0.2), []);
  const bebRedLC = React.useMemo(() => generateSyntheticLightCurve(0.68, 2.8, 0.25, 0.050, 60, 'z-band (red)', 0.2), []);

  const grazingTessLC = React.useMemo(() => generateSyntheticLightCurve(0.85, 1.2, 0.50, 0.035, 80, 'TESS (broad)', 0.88), []);
  const grazingBlueLC = React.useMemo(() => generateSyntheticLightCurve(0.85, 1.2, 0.50, 0.055, 60, 'g-band (blue)', 0.88), []);
  const grazingRedLC = React.useMemo(() => generateSyntheticLightCurve(0.84, 1.2, 0.50, 0.055, 60, 'z-band (red)', 0.88), []);

  // Compute confidence / plausibility state depending on evidence active
  const hypothesisStates = {
    planet: {
      name: 'Hypothesis A: Genuine Planetary Transit',
      type: 'Sub-Neptune around Solar Host',
      initialLikelihood: 33,
      currentStatus: hasChromaticity && hasMorphology && hasPlausibility
        ? 'High Confidence Planetary Candidate'
        : hasChromaticity || hasMorphology || hasPlausibility
        ? 'Consistent with Available Evidence'
        : 'Ambiguous Initial Dip',
      statusColor: hasChromaticity && hasMorphology && hasPlausibility
        ? 'text-emerald-300 bg-emerald-950/60 border-emerald-800'
        : 'text-space-300 bg-space-850 border-space-700',
      chromaticOutcome: hasChromaticity ? 'Achromatic (Δδ = 0.01%, 0.16σ) — Matches planet expectation' : 'Not Tested',
      morphologyOutcome: hasMorphology ? 'Limb-darkened flat floor (T12 = 14m, symmetric) — Transit-like' : 'Not Tested',
      plausibilityOutcome: hasPlausibility ? 'Inferred Rp = 2.3 R⊕, Teq = 540K — Standard sub-Neptune regime' : 'Not Tested',
      verdict: hasChromaticity && hasMorphology && hasPlausibility
        ? 'All three independent physical lenses corroborate the planetary hypothesis.'
        : 'Requires additional evidence to rule out blended contamination and grazing configurations.',
      tessLC: planetTessLC,
      blueLC: hasChromaticity ? planetBlueLC : undefined,
      redLC: hasChromaticity ? planetRedLC : undefined
    },
    beb: {
      name: 'Hypothesis B: Blended Eclipsing Binary (BEB)',
      type: 'Unresolved Cooler Binary Companion in Aperture',
      initialLikelihood: 33,
      currentStatus: hasChromaticity
        ? 'Strongly Favored False-Positive Mechanism'
        : hasMorphology
        ? 'Plausible (Broadband shape mimics planet)'
        : 'Ambiguous Initial Dip',
      statusColor: hasChromaticity
        ? 'text-rose-300 bg-rose-950/60 border-rose-800'
        : 'text-space-300 bg-space-850 border-space-700',
      chromaticOutcome: hasChromaticity ? 'Severe chromaticity (g=1.28%, z=0.68%, 6.8σ) — Unmasks blended companion' : 'Not Tested',
      morphologyOutcome: hasMorphology ? 'Broadband TESS curve appears superficially transit-like due to flux dilution' : 'Not Tested',
      plausibilityOutcome: hasPlausibility ? 'Individual host parameters appear normal; false positive unmasked by color' : 'Not Tested',
      verdict: hasChromaticity
        ? 'Multi-band follow-up reveals severe chromatic flux dilution, disproving the opaque single-planet scenario.'
        : 'In single-band TESS data, spatial blending dilutes binary eclipses into shallow deceptive dips.',
      tessLC: bebTessLC,
      blueLC: hasChromaticity ? bebBlueLC : undefined,
      redLC: hasChromaticity ? bebRedLC : undefined
    },
    grazing: {
      name: 'Hypothesis C: Grazing Stellar Binary',
      type: 'High Impact Parameter Stellar Eclipse (b > 0.85)',
      initialLikelihood: 34,
      currentStatus: hasMorphology
        ? 'Identified via Ingress/Egress Ratio'
        : hasChromaticity
        ? 'Plausible (Equal spectral types yield achromatic V-shape)'
        : 'Ambiguous Initial Dip',
      statusColor: hasMorphology
        ? 'text-amber-300 bg-amber-950/60 border-amber-800'
        : 'text-space-300 bg-space-850 border-space-700',
      chromaticOutcome: hasChromaticity ? 'Achromatic (Twin stars have equal temperature) — Color test alone passes' : 'Not Tested',
      morphologyOutcome: hasMorphology ? 'V-shaped profile (Ingress ratio 0.48, no flat floor) — Flags grazing geometry' : 'Not Tested',
      plausibilityOutcome: hasPlausibility ? 'Photometric stellar density diverges from host catalog (>2x discrepancy)' : 'Not Tested',
      verdict: hasMorphology
        ? 'V-shaped transit geometry and excessive ingress ratio identify high impact parameter eclipse.'
        : 'Without geometric morphology analysis, grazing eclipses can mimic shallow planetary transits.',
      tessLC: grazingTessLC,
      blueLC: hasChromaticity ? grazingBlueLC : undefined,
      redLC: hasChromaticity ? grazingRedLC : undefined
    }
  };

  const current = hypothesisStates[activeHypothesis];

  return (
    <div className="bg-space-900/90 dark:bg-space-950/90 border border-space-700/80 rounded-xl p-6 shadow-2xl space-y-6 relative overflow-hidden backdrop-blur-md">
      {/* Background Reticle */}
      <div className="absolute inset-0 bg-celestial-grid opacity-20 pointer-events-none" />

      {/* Interactive Controls Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-space-700/60 pb-4 relative z-10">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5" />
            INTERACTIVE MULTI-HYPOTHESIS RESOLVER
          </span>
          <h3 className="text-xl font-bold text-white font-mono mt-1">
            One Signal &middot; Three Hypotheses &middot; Progressive Evidence
          </h3>
          <p className="text-xs text-space-300 mt-1 max-w-2xl font-sans">
            See how an initial ambiguous transit dip (&delta; &approx; 0.85%) is progressively resolved by injecting independent physical diagnostics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAddAll}
            className="px-3 py-1.5 text-xs font-mono font-medium text-sky-300 bg-sky-950/80 border border-sky-800 rounded hover:bg-sky-900/80 transition-colors"
          >
            Inject All Evidence
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-mono font-medium text-space-300 bg-space-850 border border-space-700 rounded hover:bg-space-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Ambiguous</span>
          </button>
        </div>
      </div>

      {/* Evidence Injection Bar */}
      <div className="bg-space-950 p-3.5 rounded-lg border border-space-800 flex flex-wrap items-center justify-between gap-3 relative z-10">
        <div className="text-xs font-mono text-space-300 font-semibold uppercase">
          Inject Physical Evidence:
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setHasChromaticity(prev => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded border transition-all ${
              hasChromaticity
                ? 'bg-sky-500 text-space-950 border-sky-400 font-bold shadow-xs'
                : 'bg-space-900 text-space-300 border-space-700 hover:border-sky-400'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>{hasChromaticity ? '✓ Chromaticity Added' : '+ Add Chromaticity Data'}</span>
          </button>

          <button
            onClick={() => setHasMorphology(prev => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded border transition-all ${
              hasMorphology
                ? 'bg-emerald-500 text-space-950 border-emerald-400 font-bold shadow-xs'
                : 'bg-space-900 text-space-300 border-space-700 hover:border-emerald-400'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>{hasMorphology ? '✓ Morphology Inspected' : '+ Inspect Morphology'}</span>
          </button>

          <button
            onClick={() => setHasPlausibility(prev => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded border transition-all ${
              hasPlausibility
                ? 'bg-amber-500 text-space-950 border-amber-400 font-bold shadow-xs'
                : 'bg-space-900 text-space-300 border-space-700 hover:border-amber-400'
            }`}
          >
            <Orbit className="w-3.5 h-3.5" />
            <span>{hasPlausibility ? '✓ Plausibility Checked' : '+ Check Host & Orbit'}</span>
          </button>
        </div>
      </div>

      {/* 3 Hypotheses Tab Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 relative z-10">
        {(['planet', 'beb', 'grazing'] as const).map(key => {
          const hyp = hypothesisStates[key];
          const isSelected = activeHypothesis === key;
          return (
            <button
              key={key}
              onClick={() => setActiveHypothesis(key)}
              className={`p-3.5 rounded-lg border text-left transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-space-850 text-white border-sky-400 shadow-lg shadow-sky-950/60 ring-1 ring-sky-400/50'
                  : 'bg-space-900/50 text-space-200 border-space-800 hover:border-space-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold">{hyp.name.split(':')[0]}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${hyp.statusColor}`}>
                    {hyp.currentStatus.split(' ')[0]}
                  </span>
                </div>
                <div className={`text-xs font-semibold mt-1 leading-snug ${isSelected ? 'text-white' : 'text-space-200'}`}>
                  {hyp.name.split(':')[1]}
                </div>
              </div>
              <div className={`text-[11px] mt-2 font-mono ${isSelected ? 'text-sky-300' : 'text-space-400'}`}>
                {hyp.type}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Hypothesis Inspection Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start relative z-10">
        {/* Light Curve Canvas */}
        <div className="lg:col-span-7 space-y-2">
          <LightCurvePlot
            tessPoints={current.tessLC}
            bluePoints={current.blueLC}
            redPoints={current.redLC}
            title={`${current.name.split(':')[0]} Photometric Signature`}
            transitDepthPercent={0.85}
            totalDurationHours={2.8}
            ingressDurationMin={14}
            height={260}
          />
        </div>

        {/* Diagnostic Response Panel */}
        <div className="lg:col-span-5 space-y-3 font-mono text-xs">
          <div className="p-3.5 bg-space-950 rounded-lg border border-space-800 space-y-2.5">
            <div className="text-[10.5px] font-bold text-space-300 uppercase pb-1 border-b border-space-800 flex items-center justify-between">
              <span>Diagnostic Evidence State</span>
              <span className="font-normal text-space-400">
                {[hasChromaticity, hasMorphology, hasPlausibility].filter(Boolean).length}/3 Diagnostics Active
              </span>
            </div>

            {/* Diagnostic 1 Output */}
            <div className="space-y-0.5">
              <div className="text-[10px] text-sky-400 font-bold uppercase flex items-center gap-1">
                <Palette className="w-3 h-3" />
                <span>1. Chromaticity Module:</span>
              </div>
              <div className="text-[11px] text-space-200 font-sans pl-4">
                {current.chromaticOutcome}
              </div>
            </div>

            {/* Diagnostic 2 Output */}
            <div className="space-y-0.5">
              <div className="text-[10px] text-emerald-400 font-bold uppercase flex items-center gap-1">
                <Activity className="w-3 h-3" />
                <span>2. Morphology Module:</span>
              </div>
              <div className="text-[11px] text-space-200 font-sans pl-4">
                {current.morphologyOutcome}
              </div>
            </div>

            {/* Diagnostic 3 Output */}
            <div className="space-y-0.5">
              <div className="text-[10px] text-amber-400 font-bold uppercase flex items-center gap-1">
                <Orbit className="w-3 h-3" />
                <span>3. Physical Plausibility:</span>
              </div>
              <div className="text-[11px] text-space-200 font-sans pl-4">
                {current.plausibilityOutcome}
              </div>
            </div>
          </div>

          {/* Verdict Box */}
          <div className="p-3.5 bg-space-850 rounded-lg border border-space-700 space-y-1">
            <span className="text-[10px] font-bold text-space-400 uppercase">Scientific Interpretation:</span>
            <p className="text-xs text-white font-sans leading-relaxed">
              {current.verdict}
            </p>
          </div>
        </div>
      </div>

      <ScientificNote variant="methodology" title="Why Progressive Evidence Matters">
        A single broadband light curve is often mathematically degenerate between genuine planets and diluted binaries. By sequentially injecting multi-band depth comparisons and geometric parameters, the Trifecta Framework unmasks competing astrophysical explanations with explicit reasoning.
      </ScientificNote>
    </div>
  );
};
