import React, { useState } from 'react';
import { Palette, Activity, Orbit, Sparkles, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

interface EvidenceConstellationProps {
  activePillar?: 'chromaticity' | 'morphology' | 'plausibility' | 'all';
  onSelectPillar?: (pillar: 'chromaticity' | 'morphology' | 'plausibility') => void;
}

export const EvidenceConstellation: React.FC<EvidenceConstellationProps> = ({
  activePillar = 'chromaticity',
  onSelectPillar
}) => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const active = hoveredNode || activePillar;

  return (
    <div className="bg-space-900/90 dark:bg-space-950/90 border border-space-700/80 rounded-xl p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-md space-y-6">
      {/* Background Celestial Reticle */}
      <div className="absolute inset-0 bg-celestial-grid opacity-25 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-sky-500/5 blur-[90px] pointer-events-none rounded-full" />

      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2 relative z-10">
        <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-sky-400 flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-sky-400" />
          EVIDENCE CONSTELLATION &middot; MULTI-LENS FUSION
        </span>
        <h3 className="text-xl sm:text-2xl font-bold text-white font-mono">
          Three Physical Lenses &middot; One Unified Assessment
        </h3>
        <p className="text-xs sm:text-sm text-space-300 font-sans">
          Select an evidence star in the constellation to illuminate its diagnostic telemetry and mathematical screening logic.
        </p>
      </div>

      {/* Interactive Constellation SVG & Floating Nodes */}
      <div className="relative max-w-2xl mx-auto py-8 min-h-[380px] flex items-center justify-center">
        {/* Constellation SVG Lines & Stars */}
        <svg viewBox="0 0 500 360" className="w-full h-auto">
          <defs>
            {/* Gradients */}
            <radialGradient id="centralNodeGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#0284c7" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#030712" stopOpacity="0" />
            </radialGradient>

            <linearGradient id="lineGradBlue" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.3" />
            </linearGradient>

            <linearGradient id="lineGradGreen" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34d399" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0.3" />
            </linearGradient>

            <linearGradient id="lineGradAmber" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#d97706" stopOpacity="0.3" />
            </linearGradient>
          </defs>

          {/* Background Celestial Constellation Geometry Ring */}
          <circle cx="250" cy="180" r="140" fill="none" stroke="#1e293b" strokeDasharray="4,4" strokeWidth="1" />
          <circle cx="250" cy="180" r="80" fill="none" stroke="#1e293b" strokeDasharray="2,2" strokeWidth="0.8" />

          {/* Constellation Boundary Lines (Triangle) */}
          <polygon
            points="250,40 90,300 410,300"
            fill="rgba(6, 11, 24, 0.4)"
            stroke="#334155"
            strokeWidth="1.5"
            strokeDasharray="4,3"
          />

          {/* Active Illumination Connecting Rays to Center */}
          <line
            x1="250"
            y1="40"
            x2="250"
            y2="180"
            stroke={active === 'chromaticity' || active === 'all' ? '#38bdf8' : '#334155'}
            strokeWidth={active === 'chromaticity' ? '2.5' : '1.2'}
            strokeDasharray={active === 'chromaticity' ? 'none' : '3,3'}
            className="transition-all duration-300"
          />

          <line
            x1="90"
            y1="300"
            x2="250"
            y2="180"
            stroke={active === 'morphology' || active === 'all' ? '#34d399' : '#334155'}
            strokeWidth={active === 'morphology' ? '2.5' : '1.2'}
            strokeDasharray={active === 'morphology' ? 'none' : '3,3'}
            className="transition-all duration-300"
          />

          <line
            x1="410"
            y1="300"
            x2="250"
            y2="180"
            stroke={active === 'plausibility' || active === 'all' ? '#fbbf24' : '#334155'}
            strokeWidth={active === 'plausibility' ? '2.5' : '1.2'}
            strokeDasharray={active === 'plausibility' ? 'none' : '3,3'}
            className="transition-all duration-300"
          />

          {/* Central Focal Node: Candidate Assessment */}
          <circle cx="250" cy="180" r="45" fill="url(#centralNodeGlow)" />
          <circle cx="250" cy="180" r="28" fill="#060b18" stroke="#38bdf8" strokeWidth="2" />
          <circle cx="250" cy="180" r="6" fill="#38bdf8" className="animate-ping" opacity="0.4" />
          <text x="250" y="176" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold" fontFamily="monospace">
            TRIFECTA
          </text>
          <text x="250" y="188" textAnchor="middle" fill="#94a3b8" fontSize="7.5" fontFamily="monospace">
            EVIDENCE FUSION
          </text>
        </svg>

        {/* Top Constellation Star Node: Chromaticity */}
        <div
          onClick={() => onSelectPillar?.('chromaticity')}
          onMouseEnter={() => setHoveredNode('chromaticity')}
          onMouseLeave={() => setHoveredNode(null)}
          className={`absolute top-0 left-1/2 -translate-x-1/2 w-52 p-3 rounded-xl border cursor-pointer transition-all ${
            active === 'chromaticity'
              ? 'bg-space-900 border-sky-400 shadow-xl shadow-sky-950/80 ring-1 ring-sky-400/50 scale-105'
              : 'bg-space-900/60 border-space-700/80 hover:border-sky-500/60 opacity-80'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-sky-400 font-mono text-[11px] font-bold uppercase">
              <Palette className="w-3.5 h-3.5" />
              <span>1. Chromaticity</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
          </div>
          <div className="text-xs font-semibold text-white mt-1">Wavelength Invariance</div>
          <div className="text-[10.5px] text-space-300 font-mono mt-0.5">
            &Delta;&delta; = &delta;<sub>blue</sub> - &delta;<sub>red</sub> &middot; Blended BEB test
          </div>
        </div>

        {/* Bottom Left Constellation Star Node: Morphology */}
        <div
          onClick={() => onSelectPillar?.('morphology')}
          onMouseEnter={() => setHoveredNode('morphology')}
          onMouseLeave={() => setHoveredNode(null)}
          className={`absolute bottom-0 left-2 w-52 p-3 rounded-xl border cursor-pointer transition-all ${
            active === 'morphology'
              ? 'bg-space-900 border-emerald-400 shadow-xl shadow-emerald-950/80 ring-1 ring-emerald-400/50 scale-105'
              : 'bg-space-900/60 border-space-700/80 hover:border-emerald-500/60 opacity-80'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px] font-bold uppercase">
              <Activity className="w-3.5 h-3.5" />
              <span>2. Morphology</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <div className="text-xs font-semibold text-white mt-1">Geometric Transit Profile</div>
          <div className="text-[10.5px] text-space-300 font-mono mt-0.5">
            T₁₄, T₁₂, Limb darkening, Grazing b
          </div>
        </div>

        {/* Bottom Right Constellation Star Node: Plausibility */}
        <div
          onClick={() => onSelectPillar?.('plausibility')}
          onMouseEnter={() => setHoveredNode('plausibility')}
          onMouseLeave={() => setHoveredNode(null)}
          className={`absolute bottom-0 right-2 w-52 p-3 rounded-xl border cursor-pointer transition-all ${
            active === 'plausibility'
              ? 'bg-space-900 border-amber-400 shadow-xl shadow-amber-950/80 ring-1 ring-amber-400/50 scale-105'
              : 'bg-space-900/60 border-space-700/80 hover:border-amber-500/60 opacity-80'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-amber-400 font-mono text-[11px] font-bold uppercase">
              <Orbit className="w-3.5 h-3.5" />
              <span>3. Plausibility</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          </div>
          <div className="text-xs font-semibold text-white mt-1">Host &amp; Orbital Context</div>
          <div className="text-[10.5px] text-space-300 font-mono mt-0.5">
            Rp bounds, Roche limit, Teq, &rho;*
          </div>
        </div>
      </div>

      {/* Constellation Live Diagnostic Telemetry Footer */}
      <div className="p-3 bg-space-950 rounded-lg border border-space-800 text-xs font-mono flex flex-wrap items-center justify-between gap-3 text-space-300">
        <div className="flex items-center gap-2">
          <span className="text-sky-400 font-bold uppercase">TRIFECTA STATUS:</span>
          <span>3 of 3 Independent Diagnostic Channels Active</span>
        </div>
        <div className="text-space-400 text-[11px]">
          Click any diagnostic node above to inspect mathematical criteria
        </div>
      </div>
    </div>
  );
};
