import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { generateSyntheticLightCurve } from '../../utils/physicsEngine';
import { LightCurvePlot } from '../charts/LightCurvePlot';
import { DataSourceBadge } from '../common/DataQualityBadge';
import {
  ArrowRight,
  BookOpen,
  Sparkles,
  CheckCircle2,
  Sliders,
  Layers,
  Activity,
  Orbit,
  Telescope,
  Radio
} from 'lucide-react';

interface HeroSectionProps {
  onExploreClick: () => void;
  onMethodClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onExploreClick, onMethodClick }) => {
  const { openGuidedDemo, isJudgeMode } = useTheme();

  // Transit Animation Progress for Hero Star & Synced Light Curve (0 to 100%)
  const [transitProgress, setTransitProgress] = useState<number>(35);
  const [isAutoOrbit, setIsAutoOrbit] = useState<boolean>(true);

  useEffect(() => {
    if (!isAutoOrbit) return;
    const interval = setInterval(() => {
      setTransitProgress((prev) => (prev >= 100 ? 0 : prev + 0.5));
    }, 50);
    return () => clearInterval(interval);
  }, [isAutoOrbit]);

  // Generate hero demonstration light curves
  const heroTessLC = React.useMemo(() => {
    return generateSyntheticLightCurve(0.82, 2.8, 0.24, 0.035, 85, 'TESS (broad)', 0.15);
  }, []);

  const heroBlueLC = React.useMemo(() => {
    return generateSyntheticLightCurve(0.82, 2.8, 0.24, 0.045, 60, 'g-band (blue)', 0.15);
  }, []);

  const heroRedLC = React.useMemo(() => {
    return generateSyntheticLightCurve(0.81, 2.8, 0.24, 0.045, 60, 'z-band (red)', 0.15);
  }, []);

  // Compute current normalized flux based on transit progress (0-100%)
  // Transit occurs between 20% and 80%
  const currentTransitFlux = React.useMemo(() => {
    if (transitProgress < 20 || transitProgress > 80) return 1.0;
    // Ingress 20-30%, Flat bottom 30-70%, Egress 70-80%
    if (transitProgress >= 30 && transitProgress <= 70) return 0.9918;
    if (transitProgress < 30) {
      const frac = (transitProgress - 20) / 10;
      return 1.0 - frac * 0.0082;
    }
    const frac = (80 - transitProgress) / 10;
    return 1.0 - frac * 0.0082;
  }, [transitProgress]);

  return (
    <section id="hero" className="relative pt-8 pb-20 overflow-hidden bg-space-950 text-white border-b border-space-800 transition-colors">
      {/* Background Reticle & Diffuse Cosmic Glow */}
      <div className="absolute inset-0 bg-celestial-grid opacity-30 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-cosmic-glow-top pointer-events-none" />
      <div className="absolute top-1/4 right-10 w-96 h-96 bg-nebula-cyan pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-nebula-indigo pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Top Status Telemetry Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-space-800/80 pb-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-semibold uppercase tracking-wider bg-space-900 text-sky-300 border border-space-700 rounded-md shadow-xs">
              <Radio className="w-3 h-3 text-sky-400 animate-pulse" />
              TESS &middot; EXOPLANET VALIDATION &middot; COMPUTATIONAL ASTROPHYSICS
            </span>
            <span className="hidden xl:inline text-[11px] font-mono text-space-400">
              SPOC calibrated time-series generated from archive parameters; raw FITS upload supported.
            </span>
            <DataSourceBadge source="DEMO DATA — NOT AN OBSERVATIONAL RESULT" />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={openGuidedDemo}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-semibold text-amber-300 bg-amber-950/60 border border-amber-800/80 rounded-md hover:bg-amber-900/60 transition-colors shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Launch 2-Min Guided Tour</span>
            </button>
          </div>
        </div>

        {/* Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Core Research Story & Space-Inspired Typography */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-sky-400">
                <span className="w-2 h-2 rounded-full bg-sky-400" />
                TRIFECTA FRAMEWORK
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white font-mono leading-tight">
                A transit is a signal. <br />
                <span className="font-serif italic font-normal text-sky-200">
                  Its origin is the question.
                </span>
              </h1>
            </div>

            <p className="text-sm sm:text-base text-space-300 leading-relaxed font-sans max-w-2xl">
              An interpretable computational framework exploring <strong>chromaticity</strong>, <strong>transit morphology</strong>, and <strong>astrophysical plausibility</strong> in TESS exoplanet candidates.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={openGuidedDemo}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-mono font-bold text-space-950 bg-amber-400 hover:bg-amber-300 rounded-md shadow-lg shadow-amber-950/50 transition-all cursor-pointer"
                title="60-90 second guided scientific walkthrough"
              >
                <Sparkles className="w-4 h-4 text-space-950" />
                <span>START HERE (60s Tour)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreClick}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-mono font-semibold text-space-950 bg-sky-400 hover:bg-sky-300 rounded-md shadow-lg shadow-sky-950/50 transition-all cursor-pointer"
              >
                <Activity className="w-4 h-4 text-space-950" />
                <span>Candidate Workstation</span>
              </button>

              <button
                onClick={onMethodClick}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-mono font-medium text-space-200 bg-space-900 hover:bg-space-850 border border-space-700 rounded-md transition-colors cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-space-400" />
                <span>Research Methodology</span>
              </button>
            </div>

            {/* Scientific Trust Badges */}
            <div className="pt-4 flex flex-wrap items-center gap-4 text-xs font-mono text-space-400 border-t border-space-800">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Transparent Screening Layer</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                <span>Physics-Informed Screening</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Every Flag Has a Reason</span>
              </div>
            </div>
          </div>

          {/* Right Column: Distant Star Transit & Synchronized Light Curve */}
          <div className="lg:col-span-5 space-y-3">
            {/* Visual Deep-Space Transit Canvas */}
            <div className="bg-space-950 rounded-xl border border-space-800 p-4 shadow-2xl space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between text-[10.5px] font-mono text-space-300 pb-2 border-b border-space-800">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                  <span className="font-bold text-white uppercase">ASTRONOMICAL EVENT &rarr; LIGHT CURVE</span>
                </div>
                <span className="text-space-400">TOI-1233.01 (Live Transit)</span>
              </div>

              {/* Distant Star Transit Scene SVG */}
              <div className="relative w-full aspect-2/1 bg-space-950 rounded-lg overflow-hidden border border-space-850 flex items-center justify-center">
                <svg viewBox="0 0 360 180" className="w-full h-full">
                  <defs>
                    {/* Radial Star Gradient with Limb Darkening */}
                    <radialGradient id="heroStarGradient" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#ffffff" />
                      <stop offset="25%" stopColor="#fef3c7" />
                      <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.9" />
                      <stop offset="90%" stopColor="#d97706" stopOpacity="0.95" />
                      <stop offset="100%" stopColor="#78350f" />
                    </radialGradient>

                    {/* Corona Glow */}
                    <radialGradient id="heroCoronaGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.35" />
                      <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.1" />
                      <stop offset="100%" stopColor="#030712" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  {/* Celestial Coordinates Reticle */}
                  <circle cx="180" cy="90" r="85" fill="none" stroke="#1e293b" strokeDasharray="3,3" />
                  <circle cx="180" cy="90" r="60" fill="none" stroke="#1e293b" strokeDasharray="2,2" />
                  <line x1="20" y1="90" x2="340" y2="90" stroke="#1e293b" strokeWidth="0.8" />

                  {/* Distant Star Corona & Disk */}
                  <circle cx="180" cy="90" r="75" fill="url(#heroCoronaGlow)" />
                  <circle cx="180" cy="90" r="48" fill="url(#heroStarGradient)" />

                  {/* Transiting Planet Chord Path */}
                  <line x1="60" y1="90" x2="300" y2="90" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4,3" opacity="0.5" />

                  {/* Transiting Exoplanet Silhouette moving in real time */}
                  {(() => {
                    // Map progress 0-100% to x = 50px to 310px
                    const planetX = 50 + (transitProgress / 100) * 260;
                    return (
                      <g>
                        <circle
                          cx={planetX}
                          cy="90"
                          r="6.5"
                          fill="#030712"
                          stroke="#ffffff"
                          strokeWidth="1"
                          className="transition-all"
                        />
                        {/* Transit Chord Projection Line */}
                        <line x1={planetX} y1="96" x2={planetX} y2="175" stroke="#38bdf8" strokeWidth="0.8" strokeDasharray="2,2" opacity="0.7" />
                      </g>
                    );
                  })()}
                </svg>

                {/* Instantaneous Flux Overlay Badge */}
                <div className="absolute top-2 right-2 bg-space-900/90 border border-space-700 px-2.5 py-1 rounded text-[10px] font-mono text-space-300">
                  Relative Flux: <strong className="text-sky-300">{currentTransitFlux.toFixed(5)}</strong>
                </div>

                {/* Transit Phase Label */}
                <div className="absolute bottom-2 left-2 text-[10px] font-mono text-space-400">
                  {transitProgress < 20 || transitProgress > 80
                    ? 'Out-of-Transit Baseline'
                    : transitProgress >= 30 && transitProgress <= 70
                    ? 'Mid-Transit (Maximum Depth δ = 0.82%)'
                    : 'Ingress / Egress Transition'}
                </div>
              </div>

              {/* Synchronized Live Light Curve Below */}
              <LightCurvePlot
                tessPoints={heroTessLC}
                bluePoints={heroBlueLC}
                redPoints={heroRedLC}
                title="Observed Relative Flux (Phase Folded)"
                transitDepthPercent={0.82}
                totalDurationHours={2.8}
                ingressDurationMin={14}
                showResiduals={true}
                height={220}
              />
            </div>
          </div>
        </div>

        {/* TRIFECTA IN 30 SECONDS & RESEARCHER'S NOTE */}
        <div className="pt-6 border-t border-space-800 space-y-4">
          {/* Trifecta In 30 Seconds Card */}
          <div className="bg-space-900 border border-sky-500/40 rounded-xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2 max-w-3xl">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <h3 className="font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-300">
                    TRIFECTA IN 30 SECONDS
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-space-200 leading-relaxed font-sans">
                  TESS can sometimes produce planet-like signals from blended stars and eclipsing binaries. Trifecta examines these signals using three complementary checks:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 font-mono text-xs">
                  <div className="p-2.5 rounded-lg bg-space-950 border border-space-800">
                    <strong className="text-white block text-[11px] uppercase mb-0.5">01 &mdash; SHAPE</strong>
                    <span className="text-space-400 text-[11px]">Does the brightness-change pattern look consistent with a transit?</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-space-950 border border-space-800">
                    <strong className="text-white block text-[11px] uppercase mb-0.5">02 &mdash; COLOUR</strong>
                    <span className="text-space-400 text-[11px]">When multi-wavelength data exist, does the signal behave consistently across wavelengths?</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-space-950 border border-space-800">
                    <strong className="text-white block text-[11px] uppercase mb-0.5">03 &mdash; PHYSICS</strong>
                    <span className="text-space-400 text-[11px]">Does the proposed planetary interpretation make physical sense?</span>
                  </div>
                </div>
                <p className="text-[11.5px] text-space-400 font-sans italic pt-1">
                  The result is an evidence-based assessment rather than a single yes/no rule.
                </p>
              </div>

              <div className="shrink-0 flex flex-col items-start md:items-end gap-2">
                <button
                  onClick={onMethodClick}
                  className="px-4 py-2 bg-sky-400 hover:bg-sky-300 text-space-950 font-mono font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <span>EXPLORE THE SCIENCE</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Researcher's Note */}
          <div className="p-4 rounded-xl bg-space-950/80 border border-space-800 flex items-start gap-3 text-xs text-space-300">
            <BookOpen className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5 font-sans leading-relaxed">
              <strong className="text-white font-mono uppercase text-[10.5px] tracking-wider block">
                RESEARCHER&apos;S NOTE
              </strong>
              <span>
                &ldquo;Trifecta is a prototype research framework. Its purpose is not to replace established astronomical validation pipelines, but to explore whether multiple transparent physical diagnostics can be combined into a practical screening workflow.&rdquo;
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
