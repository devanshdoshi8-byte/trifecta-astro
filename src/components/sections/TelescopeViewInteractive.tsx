import React, { useState } from 'react';
import { Telescope, Eye, Layers, Activity, AlertTriangle, CheckCircle2, Sparkles, Grid } from 'lucide-react';
import { generateSyntheticLightCurve } from '../../utils/physicsEngine';
import { LightCurvePlot } from '../charts/LightCurvePlot';

export const TelescopeViewInteractive: React.FC = () => {
  const [viewMode, setViewMode] = useState<'sky' | 'aperture' | 'lightcurve'>('aperture');
  const [apertureDilution, setApertureDilution] = useState<number>(0.65); // 65% flux from target, 35% contaminant

  // Synthetic light curves for comparison
  const trueBinaryLC = React.useMemo(() => {
    return generateSyntheticLightCurve(12.5, 2.8, 0.35, 0.04, 80, 'TESS (broad)', 0.2);
  }, []);

  const dilutedObservedLC = React.useMemo(() => {
    // Diluted depth: 12.5% * (1 - 0.65) / ... = ~0.85%
    return generateSyntheticLightCurve(0.85, 2.8, 0.35, 0.035, 80, 'TESS (broad)', 0.2);
  }, []);

  return (
    <div className="bg-space-900/90 dark:bg-space-950/90 border border-space-700/80 rounded-xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-md space-y-6">
      {/* Background Subtle Coordinate Grid */}
      <div className="absolute inset-0 bg-celestial-grid opacity-30 pointer-events-none" />

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-space-700/60 pb-4 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-sky-400 flex items-center gap-1.5">
              <Telescope className="w-3.5 h-3.5 text-sky-400" />
              INTERACTIVE METAPHOR &middot; WHAT THE TELESCOPE SEES
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950/80 text-sky-300 border border-sky-800/80">
              Survey Resolution Effect
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white font-mono mt-1">
            Through the Survey Aperture: The Origin of Ambiguity
          </h3>
          <p className="text-xs sm:text-sm text-space-300 max-w-3xl font-sans mt-1">
            Examine how wide-field survey pixels (TESS: 21″/pixel) blend starlight from multiple nearby sources into a single measured photometric aperture.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-space-850 p-1 rounded-lg border border-space-700 font-mono text-xs">
          <button
            onClick={() => setViewMode('sky')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all ${
              viewMode === 'sky'
                ? 'bg-sky-500 text-space-950 font-bold shadow-xs'
                : 'text-space-300 hover:text-white hover:bg-space-800'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>1. Sky View</span>
          </button>

          <button
            onClick={() => setViewMode('aperture')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all ${
              viewMode === 'aperture'
                ? 'bg-sky-500 text-space-950 font-bold shadow-xs'
                : 'text-space-300 hover:text-white hover:bg-space-800'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>2. TESS Aperture</span>
          </button>

          <button
            onClick={() => setViewMode('lightcurve')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all ${
              viewMode === 'lightcurve'
                ? 'bg-sky-500 text-space-950 font-bold shadow-xs'
                : 'text-space-300 hover:text-white hover:bg-space-800'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>3. Light Curve</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
        {/* Left Column: Visual Telescope Viewport */}
        <div className="lg:col-span-7 bg-space-950 rounded-xl border border-space-700/80 p-5 relative overflow-hidden min-h-[320px] flex flex-col items-center justify-center">
          {/* Viewport Top Label */}
          <div className="w-full flex items-center justify-between text-[11px] font-mono text-space-400 pb-2 border-b border-space-800 mb-2">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
              <span>FIELD CENTER: RA 19h 28m 38s &middot; DEC +42° 01′ 12″</span>
            </span>
            <span className="text-sky-300">
              {viewMode === 'sky'
                ? 'High-Resolution Ground/Gaia View (0.1″/px)'
                : viewMode === 'aperture'
                ? 'TESS Survey Pixel Mask (21″/px)'
                : 'Synthesized Photometric Light Curve'}
            </span>
          </div>

          {/* SVG Telescope Viewport */}
          {viewMode !== 'lightcurve' ? (
            <div className="relative w-full max-w-[420px] aspect-square flex items-center justify-center my-2">
              <svg viewBox="0 0 400 400" className="w-full h-full">
                <defs>
                  {/* Radial star glows */}
                  <radialGradient id="targetStarGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="25%" stopColor="#fef08a" />
                    <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
                  </radialGradient>

                  <radialGradient id="contaminantStarGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="30%" stopColor="#93c5fd" />
                    <stop offset="70%" stopColor="#3b82f6" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0" />
                  </radialGradient>

                  <radialGradient id="faintStarGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="80%" stopColor="#e2e8f0" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#64748b" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Celestial coordinate reticle lines */}
                <circle cx="200" cy="200" r="180" fill="#02050f" stroke="#1e293b" strokeWidth="1.5" />
                <circle cx="200" cy="200" r="120" fill="none" stroke="#1e293b" strokeDasharray="3,3" />
                <circle cx="200" cy="200" r="60" fill="none" stroke="#1e293b" strokeDasharray="2,2" />
                <line x1="20" y1="200" x2="380" y2="200" stroke="#1e293b" strokeWidth="0.8" />
                <line x1="200" y1="20" x2="200" y2="380" stroke="#1e293b" strokeWidth="0.8" />

                {/* Background faint stars */}
                <circle cx="85" cy="90" r="1.5" fill="#cbd5e1" opacity="0.6" />
                <circle cx="310" cy="75" r="2.2" fill="#cbd5e1" opacity="0.7" />
                <circle cx="330" cy="280" r="1.2" fill="#cbd5e1" opacity="0.5" />
                <circle cx="70" cy="305" r="2.0" fill="#fef08a" opacity="0.6" />
                <circle cx="120" cy="240" r="1.8" fill="#93c5fd" opacity="0.6" />
                <circle cx="270" cy="140" r="1.4" fill="#cbd5e1" opacity="0.5" />

                {/* TESS Survey Pixel Grid Overlay (when in aperture mode) */}
                {viewMode === 'aperture' && (
                  <g className="animate-fadeIn">
                    {/* 3x3 TESS Pixel Aperture Mask (21 arcsec per pixel = 80px) */}
                    {[-1, 0, 1].map((row) =>
                      [-1, 0, 1].map((col) => (
                        <rect
                          key={`pix-${row}-${col}`}
                          x={200 + col * 70 - 35}
                          y={200 + row * 70 - 35}
                          width="70"
                          height="70"
                          fill={row === 0 && col === 0 ? 'rgba(56, 189, 248, 0.14)' : 'rgba(30, 41, 59, 0.3)'}
                          stroke={row === 0 && col === 0 ? '#38bdf8' : '#334155'}
                          strokeWidth={row === 0 && col === 0 ? '1.8' : '1'}
                          strokeDasharray={row === 0 && col === 0 ? 'none' : '3,3'}
                        />
                      ))
                    )}
                    {/* Aperture Photometry Target Mask Label */}
                    <text x="200" y="115" textAnchor="middle" fill="#38bdf8" fontSize="9" fontFamily="monospace" fontWeight="bold">
                      TESS PHOTOMETRIC APERTURE (21″/pix)
                    </text>
                    {/* Photometric Blending Flux Flow Indicator */}
                    <line x1="240" y1="210" x2="215" y2="202" stroke="#f87171" strokeWidth="1.2" strokeDasharray="2,2" />
                    <text x="260" y="222" fill="#f87171" fontSize="8" fontFamily="monospace">
                      Contaminant Light Inflow
                    </text>
                  </g>
                )}

                {/* Target Host Star (Center) */}
                <circle cx="200" cy="200" r="36" fill="url(#targetStarGlow)" />
                <circle cx="200" cy="200" r="10" fill="#ffffff" />
                <text x="200" y="245" textAnchor="middle" fill="#fde047" fontSize="9.5" fontFamily="monospace" fontWeight="bold">
                  Target Host Star (V = 11.2)
                </text>

                {/* Contaminant Background Binary Companion (Offset 14 arcsec = 45px) */}
                <circle cx="245" cy="210" r="18" fill="url(#contaminantStarGlow)" />
                <circle cx="245" cy="210" r="5" fill="#ffffff" />
                {/* Transiting Eclipsing Companion on the Contaminant Star */}
                <circle cx="250" cy="210" r="2.8" fill="#0f172a" stroke="#ffffff" strokeWidth="0.8" />
                <text x="260" y="195" fill="#60a5fa" fontSize="8.5" fontFamily="monospace" fontWeight="bold">
                  Background Binary (ΔG = +3.4, sep = 14″)
                </text>
              </svg>
            </div>
          ) : (
            /* Light Curve Visual Comparison */
            <div className="w-full space-y-3 my-2 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <div className="text-[10.5px] font-mono text-rose-400 font-semibold flex items-center justify-between">
                    <span>1. True Background Binary Eclipse</span>
                    <span className="text-space-400">Deep (δ = 12.5%)</span>
                  </div>
                  <LightCurvePlot
                    tessPoints={trueBinaryLC}
                    title="Isolated Contaminant Light Curve"
                    transitDepthPercent={12.5}
                    height={180}
                  />
                </div>

                <div className="space-y-1">
                  <div className="text-[10.5px] font-mono text-amber-300 font-semibold flex items-center justify-between">
                    <span>2. Blended Diluted TESS Light Curve</span>
                    <span className="text-space-400">Deceptively Shallow (δ = 0.85%)</span>
                  </div>
                  <LightCurvePlot
                    tessPoints={dilutedObservedLC}
                    title="TESS Aperture Summed Photometry"
                    transitDepthPercent={0.85}
                    height={180}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Bottom Telemetry Bar */}
          <div className="w-full grid grid-cols-3 gap-2 pt-2 border-t border-space-800 text-[10.5px] font-mono text-space-300">
            <div>
              <span className="text-space-500 block text-[9.5px]">TESS PIXEL SCALE:</span>
              <strong className="text-white">21.0 arcsec / pixel</strong>
            </div>
            <div>
              <span className="text-space-500 block text-[9.5px]">SPATIAL CONTAMINATION:</span>
              <strong className="text-amber-300">Unresolved inside mask</strong>
            </div>
            <div>
              <span className="text-space-500 block text-[9.5px]">APPARENT DEPTH:</span>
              <strong className="text-sky-300">Diluted to 0.85% (Planet-like)</strong>
            </div>
          </div>
        </div>

        {/* Right Column: Physical Explanation & Core Lesson */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-space-850/80 border border-space-700/80 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2 text-sky-400 font-mono text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-sky-400" />
              <span>Why High Resolution Matters</span>
            </div>

            <p className="text-xs text-space-200 leading-relaxed font-sans">
              At survey-telescope resolution (21 arcseconds per pixel), nearby sources contribute significant flux to the measured aperture.
            </p>

            <div className="bg-space-950 p-3 rounded border border-space-800 space-y-1.5 font-mono text-xs">
              <div className="text-space-400 text-[10px] uppercase font-bold">The Dilution Equation:</div>
              <div className="text-sky-300 text-[11px] font-mono py-1 px-2 bg-space-900 rounded border border-space-700">
                &delta;<sub>observed</sub> = &delta;<sub>true</sub> &times; [ F<sub>contam</sub> / (F<sub>target</sub> + F<sub>contam</sub>) ]
              </div>
              <p className="text-[10.5px] text-space-400 leading-tight pt-1 font-sans">
                A 50% deep stellar eclipse on a faint background star diluted by a bright target produces a shallow 0.5% dip that perfectly mimics an Earth- or Neptune-sized planet.
              </p>
            </div>

            {/* Scientific Action Guidance */}
            <div className="pt-2 border-t border-space-800 space-y-2">
              <div className="text-[11px] font-mono font-bold text-white uppercase">
                Trifecta’s 3-Layer Solution:
              </div>
              <ul className="space-y-1.5 text-xs text-space-300">
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                  <span><strong>Multi-Band Ground Photometry:</strong> Color differences unmask differing stellar temperatures.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Geometric Ingress Timing:</strong> Detects grazing binary configurations.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Host Stellar Density Check:</strong> Identifies density contradictions with host catalog.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
