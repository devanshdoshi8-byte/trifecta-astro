import React, { useState } from 'react';
import {
  X,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Orbit,
  Activity,
  Layers,
  HelpCircle,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Search,
  Scale
} from 'lucide-react';
import { LightCurvePlot } from '../charts/LightCurvePlot';
import { generateSyntheticLightCurve } from '../../utils/physicsEngine';

interface GuidedDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuidedDemoModal: React.FC<GuidedDemoModalProps> = ({ isOpen, onClose }) => {
  const [stepIndex, setStepIndex] = useState<number>(0);

  if (!isOpen) return null;

  const demoTess = generateSyntheticLightCurve(0.85, 2.8, 0.22, 0.035, 80, 'TESS (broad)', 0.15);
  const demoBlue = generateSyntheticLightCurve(0.85, 2.8, 0.22, 0.045, 60, 'g-band (blue)', 0.15);
  const demoRed = generateSyntheticLightCurve(0.84, 2.8, 0.22, 0.045, 60, 'z-band (red)', 0.15);

  const demoSteps = [
    {
      stepNum: '01 / 08',
      badge: 'THE CORE CHALLENGE',
      title: 'WHAT IS THE PROBLEM?',
      content: "NASA's TESS telescope searches for planets by detecting tiny changes in a star's brightness. However, TESS observes relatively large areas of sky, so light from nearby stars can become blended together. Sometimes an eclipsing binary system can therefore produce a signal that resembles a planetary transit, leading to false-positive or ambiguous planet-like signals.",
      callout: 'In wide-field surveys with 21"/pixel resolution, a transit dip alone is not yet proof of a planet.',
      showMultiBand: false
    },
    {
      stepNum: '02 / 08',
      badge: 'THE FRAMEWORK',
      title: 'WHAT DOES TRIFECTA DO?',
      content: 'Trifecta is a computational framework designed to examine suspicious or ambiguous transit-like signals using multiple independent physical diagnostics. Instead of relying on a black-box score, it runs three complementary physical checks, accounts for data quality and stellar neighbors, and produces an explainable candidate assessment.',
      callout: 'Goal: Transform raw photometric detections into transparent, reproducible astrophysical assessments.',
      showMultiBand: false
    },
    {
      stepNum: '03 / 08',
      badge: 'CHECK 1',
      title: 'CHECK 1 — MORPHOLOGY',
      content: 'We examine the shape and structure of the brightness dip. Planetary transits and stellar eclipses can produce different light-curve morphologies, although shape alone is not definitive. We fit a Mandel & Agol (2002) quadratic limb-darkened occultation profile to measure depth, duration, ingress steepness, and symmetry.',
      callout: 'Flat-bottomed U-shapes suggest complete disk occultation; V-shapes suggest grazing binaries or background blends.',
      showMultiBand: false
    },
    {
      stepNum: '04 / 08',
      badge: 'CHECK 2',
      title: 'CHECK 2 — CHROMATICITY',
      content: 'TESS itself uses a broad optical band (600–1000 nm), so true multi-wavelength comparison requires additional observations. When suitable ground-based multi-band follow-up data (e.g., g, r, i, z filters) are available, Trifecta compares transit depths at different wavelengths. An opaque planet produces achromatic depths, whereas blended stars of differing temperatures cause wavelength-dependent depths.',
      callout: 'Honest Science: Single-band TESS data is marked as UNAVAILABLE until multi-band follow-up is uploaded.',
      showMultiBand: true
    },
    {
      stepNum: '05 / 08',
      badge: 'CHECK 3',
      title: 'CHECK 3 — PHYSICAL PLAUSIBILITY',
      content: 'The framework checks whether the proposed planetary scenario is physically reasonable based on the available stellar and orbital parameters. We derive Keplerian orbital semi-major axis (a), equilibrium temperature (Teq), incident flux, and companion radius (Rp). The engine flags extreme physical environments without automatically rejecting unusual planets.',
      callout: 'Evaluates fluid Roche disruption limits, stellar density consistency, and atmospheric survival boundaries.',
      showMultiBand: true
    },
    {
      stepNum: '06 / 08',
      badge: 'SYNTHESIS LAYER',
      title: 'EVIDENCE SYNTHESIS',
      content: 'The three checks are not treated as three independent "votes" or combined into an arbitrary percentage probability. Instead, their evidence is combined with data quality metrics (baseline RMS), Gaia DR3 neighbor blending context, and NASA Exoplanet Archive catalog designations to formulate an explainable overall assessment.',
      callout: 'Evidence for and against the planetary hypothesis is compiled with explicit reasoning.',
      showMultiBand: true
    },
    {
      stepNum: '07 / 08',
      badge: 'EXPLAINABILITY',
      title: 'WHAT DOES THE RESULT MEAN?',
      content: 'Trifecta does NOT claim to magically prove whether something is a planet or declare "100% CONFIRMED". Instead, it identifies evidence that can support one of five scientifically calibrated states: (1) NO STRONG FALSE-POSITIVE INDICATOR DETECTED, (2) REVIEW RECOMMENDED, (3) POTENTIAL FALSE-POSITIVE SIGNATURE, (4) KNOWN CONFIRMED PLANET, or (5) INSUFFICIENT DATA.',
      callout: 'Every result preserves provenance: download timestamps, algorithm settings, and data archive citations.',
      showMultiBand: true
    },
    {
      stepNum: '08 / 08',
      badge: 'PURPOSE & IMPACT',
      title: 'WHY DOES THIS MATTER?',
      content: 'Tens of thousands of candidate transit signals are detected across current and upcoming astronomical surveys. By providing systematic, reproducible, transparent, and scalable physics-informed screening, Trifecta helps astronomers prioritize valuable follow-up telescope time on the most promising genuine exoplanet candidates.',
      callout: 'You are now ready to explore candidates or run live analyses on any real star or TOI!',
      showMultiBand: true
    }
  ];

  const current = demoSteps[stepIndex];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-space-950/85 backdrop-blur-md flex items-center justify-center p-4 font-sans">
      <div className="bg-space-900 border border-space-700 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-white">
        {/* Top Header */}
        <div className="bg-space-950 text-white p-4 flex items-center justify-between border-b border-space-800 font-mono">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
              UNDERSTAND TRIFECTA &middot; 60-90 SECOND GUIDED TOUR
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-space-400 hover:text-white rounded hover:bg-space-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {/* Stage Progress Pills */}
          <div className="flex items-center justify-between gap-1 pb-1 border-b border-space-800">
            {demoSteps.map((step, idx) => (
              <button
                key={idx}
                onClick={() => setStepIndex(idx)}
                className={`h-1.5 flex-1 rounded-full transition-all cursor-pointer ${
                  idx === stepIndex
                    ? 'bg-amber-400'
                    : idx < stepIndex
                    ? 'bg-sky-500'
                    : 'bg-space-800'
                }`}
                title={`Step ${idx + 1}: ${step.title}`}
              />
            ))}
          </div>

          {/* Title & Badge */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 font-mono">
              <span className="text-[11px] text-amber-400 font-bold tracking-wider">
                STEP {current.stepNum}
              </span>
              <span className="text-space-600">&bull;</span>
              <span className="text-[11px] uppercase font-bold text-sky-300 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-800">
                {current.badge}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-mono text-white tracking-tight">
              {current.title}
            </h3>
          </div>

          {/* Core Content */}
          <p className="text-sm text-space-200 leading-relaxed font-sans">
            {current.content}
          </p>

          {/* Visual Canvas */}
          <div className="bg-space-950 border border-space-800 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-space-400 pb-1 border-b border-space-800">
              <span className="flex items-center gap-1.5 text-white font-medium">
                <Activity className="w-3.5 h-3.5 text-sky-400" />
                <span>Synthetic Diagnostic Profile &middot; {current.badge}</span>
              </span>
              <span className="text-amber-300 font-bold">SIMULATED DEMO DATA</span>
            </div>

            <div className="h-36 sm:h-44 w-full">
              <LightCurvePlot
                tessPoints={demoTess}
                bluePoints={current.showMultiBand ? demoBlue : undefined}
                redPoints={current.showMultiBand ? demoRed : undefined}
                title=""
                transitDepthPercent={0.85}
                totalDurationHours={2.8}
                height={160}
              />
            </div>
          </div>

          {/* Callout Box */}
          <div className="p-3.5 rounded-xl bg-space-950 border border-amber-500/30 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-space-200 font-sans leading-relaxed">
              <strong className="text-amber-300 font-mono block mb-0.5 uppercase tracking-wide text-[11px]">
                Key Takeaway:
              </strong>
              {current.callout}
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="p-4 bg-space-950 border-t border-space-800 flex items-center justify-between font-mono">
          <button
            onClick={() => setStepIndex(prev => Math.max(0, prev - 1))}
            disabled={stepIndex === 0}
            className="px-3.5 py-1.5 text-xs text-space-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5 rounded bg-space-900 border border-space-800 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <span className="text-xs text-space-400">
            {stepIndex + 1} of {demoSteps.length}
          </span>

          {stepIndex < demoSteps.length - 1 ? (
            <button
              onClick={() => setStepIndex(prev => Math.min(demoSteps.length - 1, prev + 1))}
              className="px-4 py-1.5 text-xs font-bold text-space-950 bg-amber-400 hover:bg-amber-300 rounded flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Next Step</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-bold text-space-950 bg-emerald-400 hover:bg-emerald-300 rounded flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Finish Tour & Explore</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
