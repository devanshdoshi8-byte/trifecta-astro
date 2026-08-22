import React, { useState } from 'react';
import { Orbit, AlertTriangle, CheckCircle, ShieldAlert, Sparkles } from 'lucide-react';

export const TransitGeometryVisualizer: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<'planet' | 'blended' | 'grazing' | 'eb'>('planet');

  const scenarios = {
    planet: {
      title: 'Genuine Planetary Transit',
      subtitle: 'Single host star + small opaque planet (Central transit b ≈ 0.2)',
      lightCurveShape: 'Flat-bottom with limb-darkening rounding',
      chromaticity: 'Achromatic (depth blue ≈ depth red)',
      depth: '0.82%',
      impactParam: 0.2,
      planetRadiusPx: 14,
      planetColor: '#030712',
      companionType: 'Transiting Exoplanet',
      interpretation: 'Produces approximately wavelength-independent shallow dip with symmetric ingress/egress.',
      badge: 'Genuine Candidate Profile',
      badgeColor: 'bg-emerald-950/80 text-emerald-300 border-emerald-800',
      icon: <CheckCircle className="w-4 h-4 text-emerald-400" />
    },
    blended: {
      title: 'Blended Eclipsing Binary (BEB)',
      subtitle: 'Target star + unresolved background binary inside aperture',
      lightCurveShape: 'Deceptively shallow due to flux dilution',
      chromaticity: 'Chromatic (blue depth ≠ red depth by 4–8σ)',
      depth: '1.42% (blue) vs 0.86% (red)',
      impactParam: 0.2,
      planetRadiusPx: 20,
      planetColor: '#f87171',
      companionType: 'Eclipsing Stellar Companion + Blended Background',
      interpretation: 'Color-dependent flux dilution creates noticeable chromatic depth differences between passbands.',
      badge: 'Chromatic False-Positive',
      badgeColor: 'bg-rose-950/80 text-rose-300 border-rose-800',
      icon: <ShieldAlert className="w-4 h-4 text-rose-400" />
    },
    grazing: {
      title: 'Grazing Binary / High Impact Parameter',
      subtitle: 'Stellar eclipse where only stellar limbs overlap (b > 0.85)',
      lightCurveShape: 'Continuous V-shape (ingress & egress take ~100% of duration)',
      chromaticity: 'Achromatic or weakly chromatic depending on spectral types',
      depth: '3.10%',
      impactParam: 0.88,
      planetRadiusPx: 26,
      planetColor: '#ea580c',
      companionType: 'Grazing Stellar Eclipse',
      interpretation: 'Lack of flat floor and high ingress/egress ratio indicates high impact parameter grazing geometry.',
      badge: 'Morphological Review Flag',
      badgeColor: 'bg-amber-950/80 text-amber-300 border-amber-800',
      icon: <AlertTriangle className="w-4 h-4 text-amber-400" />
    },
    eb: {
      title: 'Equal-Mass Eclipsing Binary',
      subtitle: 'Two comparable stars eclipsing each other directly',
      lightCurveShape: 'Deep U- or V-shape with alternating primary/secondary depths',
      chromaticity: 'Achromatic if identical temperatures; chromatic if unequal',
      depth: '25.0% - 50.0%',
      impactParam: 0.1,
      planetRadiusPx: 38,
      planetColor: '#64748b',
      companionType: 'Stellar Companion (Eclipsing Binary)',
      interpretation: 'Excessive depth immediately flags astrophysical binary without requiring complex statistical modeling.',
      badge: 'Astrophysical Companion',
      badgeColor: 'bg-space-850 text-space-300 border-space-700',
      icon: <ShieldAlert className="w-4 h-4 text-space-400" />
    }
  };

  const current = scenarios[selectedScenario];

  return (
    <div className="bg-space-900/90 dark:bg-space-950/90 border border-space-700/80 rounded-xl p-5 sm:p-6 shadow-2xl space-y-4 text-white relative overflow-hidden backdrop-blur-md">
      {/* Background Reticle */}
      <div className="absolute inset-0 bg-celestial-grid opacity-20 pointer-events-none" />

      {/* Selector Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-space-700/60 pb-3 relative z-10">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
            <Orbit className="w-3.5 h-3.5" />
            ASTRONOMICAL PHENOMENOLOGY COMPARISON
          </span>
          <h4 className="text-base sm:text-lg font-bold text-white font-mono mt-0.5">
            Physical Origin vs Photometric Manifestation
          </h4>
        </div>
        <div className="flex items-center gap-1.5 bg-space-850 p-1 rounded-md border border-space-700 text-xs font-mono">
          <button
            onClick={() => setSelectedScenario('planet')}
            className={`px-2.5 py-1 rounded font-medium transition-all ${
              selectedScenario === 'planet' ? 'bg-sky-500 text-space-950 font-bold shadow-xs' : 'text-space-300 hover:text-white'
            }`}
          >
            Planet Transit
          </button>
          <button
            onClick={() => setSelectedScenario('blended')}
            className={`px-2.5 py-1 rounded font-medium transition-all ${
              selectedScenario === 'blended' ? 'bg-sky-500 text-space-950 font-bold shadow-xs' : 'text-space-300 hover:text-white'
            }`}
          >
            Blended BEB
          </button>
          <button
            onClick={() => setSelectedScenario('grazing')}
            className={`px-2.5 py-1 rounded font-medium transition-all ${
              selectedScenario === 'grazing' ? 'bg-sky-500 text-space-950 font-bold shadow-xs' : 'text-space-300 hover:text-white'
            }`}
          >
            Grazing Binary
          </button>
          <button
            onClick={() => setSelectedScenario('eb')}
            className={`px-2.5 py-1 rounded font-medium transition-all ${
              selectedScenario === 'eb' ? 'bg-sky-500 text-space-950 font-bold shadow-xs' : 'text-space-300 hover:text-white'
            }`}
          >
            Deep Binary
          </button>
        </div>
      </div>

      {/* Main interactive visual grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center relative z-10">
        {/* Stellar Disk Cross Section SVG */}
        <div className="lg:col-span-6 bg-space-950 rounded-lg p-4 relative overflow-hidden border border-space-800 flex flex-col items-center justify-center min-h-[260px]">
          <div className="absolute top-2.5 left-3 text-[10px] font-mono text-space-400 uppercase tracking-wider flex items-center gap-1.5">
            <Orbit className="w-3.5 h-3.5 text-amber-400" />
            <span>Projected Stellar Transit Plane (R* = 1.0)</span>
          </div>

          <svg viewBox="0 0 320 200" className="w-full max-w-[280px] h-auto">
            <defs>
              {/* Radial gradient for realistic stellar limb darkening */}
              <radialGradient id="starLimbDarkening" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fffbeb" />
                <stop offset="65%" stopColor="#fde047" />
                <stop offset="90%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#ca8a04" />
              </radialGradient>
            </defs>

            {/* Background Aperture Grid */}
            <circle cx="160" cy="100" r="95" fill="none" stroke="#1e293b" strokeDasharray="3,3" />

            {/* Host Star Disk */}
            <circle cx="160" cy="100" r="70" fill="url(#starLimbDarkening)" />

            {/* Impact Parameter Chord line */}
            {(() => {
              const chordY = 100 + current.impactParam * 70 * (current.impactParam > 0.5 ? 0.95 : 0.6);
              return (
                <g>
                  {/* Orbit Track Line */}
                  <line
                    x1="40"
                    y1={chordY}
                    x2="280"
                    y2={chordY}
                    stroke="#38bdf8"
                    strokeWidth="1.5"
                    strokeDasharray="4,3"
                    opacity="0.7"
                  />
                  {/* Transiting Disc at Mid-Transit */}
                  <circle
                    cx="160"
                    cy={chordY}
                    r={current.planetRadiusPx}
                    fill={current.planetColor}
                    stroke="#ffffff"
                    strokeWidth="1"
                  />
                  {/* Transit Shadow / Ghost points */}
                  <circle cx="95" cy={chordY} r={current.planetRadiusPx * 0.7} fill={current.planetColor} opacity="0.3" />
                  <circle cx="225" cy={chordY} r={current.planetRadiusPx * 0.7} fill={current.planetColor} opacity="0.3" />

                  {/* Impact parameter annotation */}
                  <line x1="160" y1="100" x2="160" y2={chordY} stroke="#38bdf8" strokeWidth="1" />
                  <text x="165" y={100 + (chordY - 100) / 2} fill="#38bdf8" fontSize="8" fontFamily="monospace">
                    b = {current.impactParam.toFixed(2)}
                  </text>
                </g>
              );
            })()}
          </svg>

          <div className="w-full flex items-center justify-between text-[11px] font-mono text-space-400 mt-2 px-2 border-t border-space-800/80 pt-1">
            <span>Ingress (T₁₂)</span>
            <span className="text-amber-300">Center (t₀, &delta;={current.depth})</span>
            <span>Egress (T₃₄)</span>
          </div>
        </div>

        {/* Diagnostic Assessment Panel for Scenario */}
        <div className="lg:col-span-6 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between gap-2">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded border ${current.badgeColor}`}>
              {current.icon}
              <span>{current.badge}</span>
            </span>
            <span className="text-xs font-mono text-space-400">
              Impact Param: b &approx; {current.impactParam.toFixed(2)}
            </span>
          </div>

          <h3 className="text-base font-bold text-white font-mono">
            {current.title}
          </h3>
          <p className="text-xs text-space-300 leading-relaxed font-sans">
            {current.subtitle}
          </p>

          <div className="bg-space-950 rounded-md p-3 border border-space-800 text-xs font-mono space-y-2">
            <div className="flex justify-between border-b border-space-800 pb-1.5">
              <span className="text-space-400">Transit Morphology:</span>
              <span className="text-white font-semibold">{current.lightCurveShape}</span>
            </div>
            <div className="flex justify-between border-b border-space-800 pb-1.5">
              <span className="text-space-400">Chromatic Consistency:</span>
              <span className={selectedScenario === 'blended' ? 'text-rose-400 font-bold' : 'text-white font-semibold'}>
                {current.chromaticity}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-space-400">Physical Inferred Body:</span>
              <span className="text-space-200 font-medium">{current.companionType}</span>
            </div>
          </div>

          <div className="text-xs text-space-200 bg-sky-950/40 p-2.5 rounded border border-sky-900/60 font-sans">
            <span className="font-semibold text-sky-300 font-mono">Physical Mechanism: </span>
            {current.interpretation}
          </div>
        </div>
      </div>
    </div>
  );
};
