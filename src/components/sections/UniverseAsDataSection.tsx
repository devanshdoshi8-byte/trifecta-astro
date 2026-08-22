import React, { useState } from 'react';
import { Sparkles, Activity, Layers, Orbit, Palette, ArrowRight, Play, CheckCircle2 } from 'lucide-react';

export const UniverseAsDataSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      id: 'star',
      number: '01',
      title: 'The Host Star',
      metric: 'Luminosity L* & Stellar Limb Darkening',
      description: 'A distant star continuously emits photons across the electromagnetic spectrum. Its radiant surface exhibits limb-darkened intensity I(μ).',
      visualType: 'star',
      tag: 'Astrophysical Emitter'
    },
    {
      id: 'transit',
      number: '02',
      title: 'The Transit Obstruction',
      metric: 'Geometric Fractional Area (Rp / R*)²',
      description: 'An exoplanet or companion crosses the line of sight, blocking a tiny fraction of emitted starlight (typically 0.01% to 1.5%).',
      visualType: 'transit',
      tag: 'Occultation Event'
    },
    {
      id: 'photometry',
      number: '03',
      title: 'Time-Series Photometry',
      metric: 'Normalized Flux F(t) / F₀',
      description: 'Telescope sensors integrate photon counts into cadence measurements, converting a physical celestial eclipse into digitized time series.',
      visualType: 'photometry',
      tag: 'Measurement Cadence'
    },
    {
      id: 'lightcurve',
      number: '04',
      title: 'The Light Curve Dip',
      metric: 'Periodic Dip (Period P, Depth δ, Duration T₁₄)',
      description: 'Phase-folding thousands of observations reveals the characteristic transit profile and marks a candidate signal (TOI).',
      visualType: 'lightcurve',
      tag: 'Signal Identification'
    },
    {
      id: 'trifecta',
      number: '05',
      title: 'Trifecta Screening Engine',
      metric: 'Chromaticity + Morphology + Plausibility',
      description: 'Rather than treating the light curve as an arbitrary numerical vector, Trifecta applies three physically motivated screening lenses.',
      visualType: 'trifecta',
      tag: 'Multi-Lens Evidence Fusion'
    },
    {
      id: 'evidence',
      number: '06',
      title: 'Scientific Evidence',
      metric: 'Transparent Reasoned Assessment',
      description: 'Every candidate is triaged with transparent diagnostic reasoning: Pristine for PRV, Review Required, or Chromatic/Geometric False Positive.',
      visualType: 'evidence',
      tag: 'Interpretable Decision'
    }
  ];

  return (
    <div className="bg-space-950 border-y border-space-800 py-16 relative overflow-hidden">
      {/* Background Celestial Coordinate Grid */}
      <div className="absolute inset-0 bg-celestial-grid opacity-20 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-sky-500/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        {/* Section Manifesto Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-sky-400">
            THE PHILOSOPHY OF OBSERVATIONAL ASTROPHYSICS
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-serif leading-tight">
            "We do not directly see an exoplanet. <br />
            <span className="text-sky-300 font-sans font-bold text-xl sm:text-3xl">
              We see the change it causes in starlight."
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-space-300 font-sans max-w-2xl mx-auto">
            Follow the chain of observational evidence: from a distant star’s radiant flux to an interpretable multi-diagnostic candidate assessment.
          </p>
        </div>

        {/* Step Progression Ribbon */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {steps.map((step, idx) => {
            const isCurrent = activeStep === idx;
            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(idx)}
                className={`p-3 rounded-lg border text-left transition-all relative ${
                  isCurrent
                    ? 'bg-space-900 border-sky-500/80 shadow-lg shadow-sky-950/50 ring-1 ring-sky-500/40'
                    : 'bg-space-900/40 border-space-800 text-space-400 hover:bg-space-900/80 hover:text-space-200'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className={isCurrent ? 'text-sky-400 font-bold' : 'text-space-500'}>{step.number}</span>
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                    isCurrent ? 'bg-sky-950 text-sky-300 border border-sky-800' : 'bg-space-800 text-space-400'
                  }`}>
                    {step.tag.split(' ')[0]}
                  </span>
                </div>
                <div className={`text-xs font-semibold mt-1 line-clamp-1 ${isCurrent ? 'text-white' : 'text-space-300'}`}>
                  {step.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Stage Detailed Inspection Stage */}
        <div className="bg-space-900/90 border border-space-800 rounded-xl p-6 sm:p-8 backdrop-blur-md grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Visual Metaphor */}
          <div className="lg:col-span-6 bg-space-950 rounded-xl border border-space-800 p-6 flex flex-col items-center justify-center min-h-[280px] relative overflow-hidden">
            {activeStep === 0 && (
              <div className="relative flex flex-col items-center justify-center animate-fadeIn">
                <div className="w-32 h-32 rounded-full bg-radial from-amber-100 via-amber-400 to-amber-600 stellar-glow-gold flex items-center justify-center relative">
                  <div className="absolute inset-0 rounded-full animate-pulse-subtle bg-amber-300/20" />
                </div>
                <div className="text-center mt-4 font-mono text-xs text-amber-200">
                  <span>Host Star Continuum &middot; Teff = 5,780 K</span>
                </div>
              </div>
            )}

            {activeStep === 1 && (
              <div className="relative flex flex-col items-center justify-center animate-fadeIn">
                <div className="w-32 h-32 rounded-full bg-radial from-amber-100 via-amber-400 to-amber-600 stellar-glow-gold flex items-center justify-center relative overflow-hidden">
                  {/* Transiting Silhouette Chord */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-space-950 border border-white/40 shadow-inner" />
                </div>
                <div className="text-center mt-4 font-mono text-xs text-sky-300">
                  <span>Geometric Occultation: &delta; = (Rp / R*)² &approx; 0.85%</span>
                </div>
              </div>
            )}

            {activeStep === 2 && (
              <div className="w-full space-y-2 font-mono text-xs text-space-300 animate-fadeIn">
                <div className="flex justify-between text-[11px] text-sky-400 font-bold border-b border-space-800 pb-1">
                  <span>PHOTON COUNT CADENCE (2-min / 20-sec)</span>
                  <span>CALIBRATED FLUX</span>
                </div>
                <div className="space-y-1 text-[11px]">
                  <div className="flex justify-between py-1 bg-space-900/80 px-2 rounded">
                    <span>BJD 2459142.1023</span>
                    <span className="text-white">1.00014 ± 0.00012</span>
                  </div>
                  <div className="flex justify-between py-1 bg-space-900/80 px-2 rounded">
                    <span>BJD 2459142.1037</span>
                    <span className="text-white">0.99988 ± 0.00012</span>
                  </div>
                  <div className="flex justify-between py-1 bg-sky-950/60 text-sky-200 px-2 rounded border border-sky-800/40">
                    <span>BJD 2459142.1051 (Transit Ingress)</span>
                    <span className="font-bold">0.99150 ± 0.00012 (-0.85%)</span>
                  </div>
                  <div className="flex justify-between py-1 bg-space-900/80 px-2 rounded">
                    <span>BJD 2459142.1065</span>
                    <span className="text-white">0.99162 ± 0.00012</span>
                  </div>
                </div>
              </div>
            )}

            {activeStep === 3 && (
              <div className="w-full space-y-2 animate-fadeIn">
                <div className="text-[10px] font-mono text-space-400 text-center uppercase tracking-wider">
                  Phase-Folded Photometric Light Curve
                </div>
                <svg viewBox="0 0 300 120" className="w-full h-auto">
                  <path
                    d="M 20,40 L 90,40 Q 110,40 120,80 L 180,80 Q 190,40 210,40 L 280,40"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2.5"
                  />
                  <circle cx="150" cy="80" r="4" fill="#fde047" />
                  <text x="150" y="105" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="monospace">
                    Transit Depth δ = 0.85%
                  </text>
                </svg>
              </div>
            )}

            {activeStep === 4 && (
              <div className="w-full grid grid-cols-3 gap-2 text-center font-mono text-[11px] animate-fadeIn">
                <div className="p-3 bg-blue-950/60 border border-blue-800/80 rounded-lg text-blue-200">
                  <Palette className="w-5 h-5 mx-auto mb-1 text-sky-400" />
                  <div className="font-bold">1. Chromaticity</div>
                  <div className="text-[9px] text-space-400 mt-1">Multi-band Δδ</div>
                </div>
                <div className="p-3 bg-emerald-950/60 border border-emerald-800/80 rounded-lg text-emerald-200">
                  <Activity className="w-5 h-5 mx-auto mb-1 text-emerald-400" />
                  <div className="font-bold">2. Morphology</div>
                  <div className="text-[9px] text-space-400 mt-1">T₁₄, T₁₂, Shape</div>
                </div>
                <div className="p-3 bg-amber-950/60 border border-amber-800/80 rounded-lg text-amber-200">
                  <Orbit className="w-5 h-5 mx-auto mb-1 text-amber-400" />
                  <div className="font-bold">3. Plausibility</div>
                  <div className="text-[9px] text-space-400 mt-1">Rp, Teq, Density</div>
                </div>
              </div>
            )}

            {activeStep === 5 && (
              <div className="w-full p-4 bg-space-900 border border-space-800 rounded-lg space-y-2 font-mono text-xs animate-fadeIn">
                <div className="flex items-center justify-between text-emerald-400 font-bold pb-2 border-b border-space-800">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    TRIFECTA SYNTHESIS
                  </span>
                  <span>LOW CONCERN</span>
                </div>
                <p className="text-[11px] font-sans text-space-200 leading-relaxed">
                  Achromatic optical depths (0.16σ), transit-like flat bottom, and physically plausible 2.31 R⊕ radius converge on a high-confidence planetary candidate.
                </p>
              </div>
            )}
          </div>

          {/* Right Narrative Description */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-sky-400 bg-sky-950 px-2 py-0.5 rounded border border-sky-800">
                Step {steps[activeStep].number} of 06
              </span>
              <span className="text-xs font-mono text-space-400">{steps[activeStep].tag}</span>
            </div>

            <h3 className="text-2xl font-bold text-white font-mono">
              {steps[activeStep].title}
            </h3>

            <div className="text-xs font-mono text-sky-300 bg-space-800/80 px-3 py-1.5 rounded border border-space-700">
              {steps[activeStep].metric}
            </div>

            <p className="text-sm text-space-200 leading-relaxed font-sans">
              {steps[activeStep].description}
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setActiveStep((prev) => (prev + 1) % steps.length)}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded transition-colors"
              >
                <span>{activeStep === steps.length - 1 ? 'Replay Sequence' : 'Next Step in Chain'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
