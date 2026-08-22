import React, { useState } from 'react';
import { Palette, Activity, CheckCircle2, AlertTriangle, Sparkles, Sliders } from 'lucide-react';
import { DataSourceBadge } from '../common/DataQualityBadge';

export const WavelengthSpectrumVisualizer: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<'achromatic_planet' | 'chromatic_beb' | 'grazing'>('achromatic_planet');

  const presets = {
    achromatic_planet: {
      title: 'Achromatic Transit (Opaque Planetary Candidate)',
      blueDepth: 0.82,
      blueErr: 0.04,
      redDepth: 0.78,
      redErr: 0.04,
      deltaDepth: 0.04,
      sigma: 0.71,
      verdict: 'No strong chromaticity detected (Consistent with opaque exoplanet)',
      statusColor: 'text-emerald-400 bg-emerald-950/60 border-emerald-800',
      isPass: true
    },
    chromatic_beb: {
      title: 'Chromatic Discrepancy (Blended Eclipsing Binary)',
      blueDepth: 1.42,
      blueErr: 0.06,
      redDepth: 0.86,
      redErr: 0.05,
      deltaDepth: 0.56,
      sigma: 7.18,
      verdict: 'Severe chromaticity detected (7.18σ) — Unmasks blended companion star',
      statusColor: 'text-rose-400 bg-rose-950/60 border-rose-800',
      isPass: false
    },
    grazing: {
      title: 'Equal-Temperature Grazing Binary',
      blueDepth: 3.12,
      blueErr: 0.11,
      redDepth: 3.08,
      redErr: 0.12,
      deltaDepth: 0.04,
      sigma: 0.25,
      verdict: 'Achromatic (Twin stars with identical Teff) — Requires morphology check',
      statusColor: 'text-amber-400 bg-amber-950/60 border-amber-800',
      isPass: true
    }
  };

  const current = presets[selectedPreset];

  return (
    <div className="bg-space-900/90 dark:bg-space-950/90 border border-space-700/80 rounded-xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-md space-y-6">
      {/* Background Reticle */}
      <div className="absolute inset-0 bg-celestial-grid opacity-20 pointer-events-none" />

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-space-700/60 pb-4 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-sky-400 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-sky-400" />
              <span className="font-mono text-xs font-bold text-sky-400 uppercase">Interactive Spectrum Comparator</span>
            </span>
            <DataSourceBadge source="SIMULATED DATA" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white font-mono mt-1">
            Wavelength-Dependent Transit Depth Diagnostics
          </h3>
          <p className="text-xs sm:text-sm text-space-300 font-sans mt-1">
            Compare simultaneously measured transit depths in shorter (blue / g-band) versus longer (red / z-band) optical passbands.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-1 bg-space-850 p-1 rounded-lg border border-space-700 font-mono text-xs">
          <button
            onClick={() => setSelectedPreset('achromatic_planet')}
            className={`px-3 py-1.5 rounded transition-all ${
              selectedPreset === 'achromatic_planet'
                ? 'bg-sky-500 text-space-950 font-bold shadow-xs'
                : 'text-space-300 hover:text-white hover:bg-space-800'
            }`}
          >
            Planet (Achromatic)
          </button>
          <button
            onClick={() => setSelectedPreset('chromatic_beb')}
            className={`px-3 py-1.5 rounded transition-all ${
              selectedPreset === 'chromatic_beb'
                ? 'bg-sky-500 text-space-950 font-bold shadow-xs'
                : 'text-space-300 hover:text-white hover:bg-space-800'
            }`}
          >
            Blended BEB (Chromatic)
          </button>
          <button
            onClick={() => setSelectedPreset('grazing')}
            className={`px-3 py-1.5 rounded transition-all ${
              selectedPreset === 'grazing'
                ? 'bg-sky-500 text-space-950 font-bold shadow-xs'
                : 'text-space-300 hover:text-white hover:bg-space-800'
            }`}
          >
            Twin Binary
          </button>
        </div>
      </div>

      {/* Optical Spectrum Continuum Ribbon */}
      <div className="space-y-2 relative z-10">
        <div className="flex items-center justify-between text-[11px] font-mono text-space-400">
          <span>SHORTER WAVELENGTH (ULTRAVIOLET / BLUE)</span>
          <span className="text-sky-300 font-bold">OPTICAL PHOTOMETRIC CONTINUUM (400 – 900 nm)</span>
          <span>LONGER WAVELENGTH (RED / NEAR-INFRARED)</span>
        </div>

        {/* Continuous Rainbow Spectrum Bar with Filter Banners */}
        <div className="relative h-12 rounded-lg overflow-hidden border border-space-700 shadow-inner">
          <div
            className="w-full h-full"
            style={{
              background:
                'linear-gradient(to right, #3b82f6 0%, #06b6d4 25%, #22c55e 45%, #eab308 65%, #f97316 80%, #ef4444 100%)',
              opacity: 0.85
            }}
          />

          {/* Filter 1: Blue Sloan g' Band Window */}
          <div className="absolute top-0 bottom-0 left-[8%] w-[22%] bg-blue-950/75 border-x-2 border-sky-300 flex items-center justify-center text-white font-mono text-[10.5px] font-bold shadow-md">
            <span>Sloan g' (~475 nm)</span>
          </div>

          {/* Filter 2: TESS Broad Band Window */}
          <div className="absolute top-0 bottom-0 left-[35%] w-[45%] bg-space-950/50 border-x border-dashed border-white/50 flex items-center justify-center text-white/90 font-mono text-[10px]">
            <span>TESS Optical Passband (600–1000 nm)</span>
          </div>

          {/* Filter 3: Red Pan-STARRS z' Band Window */}
          <div className="absolute top-0 bottom-0 left-[75%] w-[20%] bg-red-950/75 border-x-2 border-rose-300 flex items-center justify-center text-white font-mono text-[10.5px] font-bold shadow-md">
            <span>Pan-STARRS z' (~850 nm)</span>
          </div>
        </div>

        {/* Wavelength Ticks */}
        <div className="flex justify-between text-[10px] font-mono text-space-500 px-1">
          <span>400 nm</span>
          <span>500 nm</span>
          <span>600 nm</span>
          <span>700 nm</span>
          <span>800 nm</span>
          <span>900 nm</span>
        </div>
      </div>

      {/* Dual Channel Readout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
        {/* Blue Channel Card */}
        <div className="lg:col-span-4 bg-space-950 rounded-xl border border-sky-500/40 p-4 space-y-3 shadow-lg">
          <div className="flex items-center justify-between border-b border-space-800 pb-2">
            <span className="text-xs font-mono font-bold text-sky-400 uppercase">
              SHORTER WAVELENGTH CHANNEL
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800">
              Blue Band (g')
            </span>
          </div>
          <div className="text-center py-2">
            <div className="text-2xl font-bold font-mono text-white">
              {current.blueDepth.toFixed(2)}%
            </div>
            <div className="text-xs font-mono text-space-400 mt-0.5">
              Uncertainty: &plusmn;{current.blueErr.toFixed(2)}%
            </div>
          </div>
          <div className="text-[11px] font-sans text-space-300 leading-snug">
            Measured in high-energy optical bandpass where cooler blended companions have suppressed flux.
          </div>
        </div>

        {/* Center Delta & Significance Meter */}
        <div className="lg:col-span-4 bg-space-950 rounded-xl border border-space-700 p-4 space-y-3 text-center">
          <span className="text-xs font-mono font-bold text-space-400 uppercase">
            DEPTH DIFFERENCE (&Delta;&delta;)
          </span>
          <div className="py-2">
            <div className={`text-3xl font-bold font-mono ${current.isPass ? 'text-emerald-400' : 'text-rose-400'}`}>
              {current.deltaDepth > 0 ? `+${current.deltaDepth.toFixed(2)}%` : `${current.deltaDepth.toFixed(2)}%`}
            </div>
            <div className="text-xs font-mono text-space-300 mt-1 font-bold">
              Significance: {current.sigma.toFixed(2)}&sigma;
            </div>
          </div>
          <div className={`text-xs font-mono px-3 py-1.5 rounded border ${current.statusColor}`}>
            {current.verdict}
          </div>
        </div>

        {/* Red Channel Card */}
        <div className="lg:col-span-4 bg-space-950 rounded-xl border border-rose-500/40 p-4 space-y-3 shadow-lg">
          <div className="flex items-center justify-between border-b border-space-800 pb-2">
            <span className="text-xs font-mono font-bold text-rose-400 uppercase">
              LONGER WAVELENGTH CHANNEL
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
              Red Band (z')
            </span>
          </div>
          <div className="text-center py-2">
            <div className="text-2xl font-bold font-mono text-white">
              {current.redDepth.toFixed(2)}%
            </div>
            <div className="text-xs font-mono text-space-400 mt-0.5">
              Uncertainty: &plusmn;{current.redErr.toFixed(2)}%
            </div>
          </div>
          <div className="text-[11px] font-sans text-space-300 leading-snug">
            Measured in near-infrared passband where cooler background stars contribute higher fractional flux.
          </div>
        </div>
      </div>
    </div>
  );
};
