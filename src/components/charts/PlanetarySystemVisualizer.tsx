import React, { useState, useMemo } from 'react';
import { Orbit, Sun, Sparkles, Sliders, ShieldCheck, AlertTriangle } from 'lucide-react';
import { DataSourceBadge } from '../common/DataQualityBadge';

export const PlanetarySystemVisualizer: React.FC = () => {
  const [orbitalRadiusAU, setOrbitalRadiusAU] = useState<number>(0.114); // 0.02 to 0.8 AU
  const [hostTeff, setHostTeff] = useState<number>(5780); // K (Solar)
  const [hostRadiusSolar, setHostRadiusSolar] = useState<number>(1.02);
  const [planetRadiusEarth, setPlanetRadiusEarth] = useState<number>(2.31);

  // Compute incident flux: S/S_earth = (R*/R_sun)^2 * (Teff/5778)^4 / (a_AU)^2
  const incidentFlux = useMemo(() => {
    const termR = Math.pow(hostRadiusSolar, 2);
    const termT = Math.pow(hostTeff / 5778, 4);
    const termA = Math.pow(orbitalRadiusAU, 2);
    return Math.round((termR * termT) / (termA || 0.001));
  }, [hostRadiusSolar, hostTeff, orbitalRadiusAU]);

  // Compute equilibrium temperature (assuming Bond albedo = 0.3)
  const teq = useMemo(() => {
    const rawT = hostTeff * Math.sqrt((hostRadiusSolar * 0.00465) / (2 * orbitalRadiusAU)) * Math.pow(1 - 0.3, 0.25);
    return Math.round(rawT);
  }, [hostTeff, hostRadiusSolar, orbitalRadiusAU]);

  // Fluid Roche limit for standard rocky/gas planet: d_Roche ~ 2.44 * R* * (rho_*/rho_p)^(1/3) ~ 0.005 AU
  const rocheLimitAU = 0.006;
  const isRocheUnstable = orbitalRadiusAU < rocheLimitAU;

  // Orbital Period via Kepler's 3rd Law: P = a^(3/2) * 365.25 days (assuming 1 M_sun)
  const periodDays = useMemo(() => {
    return parseFloat((Math.pow(orbitalRadiusAU, 1.5) * 365.25).toFixed(2));
  }, [orbitalRadiusAU]);

  return (
    <div className="bg-space-900/90 dark:bg-space-950/90 border border-space-700/80 rounded-xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-md space-y-6">
      {/* Reticle */}
      <div className="absolute inset-0 bg-celestial-grid opacity-20 pointer-events-none" />

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-space-700/60 pb-4 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
              <Orbit className="w-3.5 h-3.5 text-amber-400" />
              PILLAR 3: PHYSICAL PLAUSIBILITY &middot; ORBITAL DYNAMICS
            </span>
            <DataSourceBadge source="SYNTHETIC DEMO" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white font-mono mt-1">
            Host Star &amp; Planetary System Architecture
          </h3>
          <p className="text-xs sm:text-sm text-space-300 font-sans mt-1">
            Adjust the orbital separation to examine incident stellar radiation, planetary equilibrium temperature, and tidal stability.
          </p>
        </div>

        <div className="text-xs font-mono text-amber-300 bg-amber-950/60 px-3 py-1.5 rounded border border-amber-800 flex items-center gap-1.5">
          <Sun className="w-3.5 h-3.5" />
          <span>Host: G2V Solar Analog ({hostTeff} K)</span>
        </div>
      </div>

      {/* Main Grid: Orbit Visualizer + Parameter Sliders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
        {/* Orbital SVG Stage */}
        <div className="lg:col-span-7 bg-space-950 rounded-xl border border-space-800 p-5 flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden">
          <svg viewBox="0 0 360 260" className="w-full max-w-[360px] h-auto">
            <defs>
              <radialGradient id="systemStarGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="25%" stopColor="#fef08a" />
                <stop offset="65%" stopColor="#f59e0b" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Background Grid Reticle */}
            <circle cx="180" cy="130" r="115" fill="none" stroke="#1e293b" strokeDasharray="3,3" />
            <circle cx="180" cy="130" r="75" fill="none" stroke="#1e293b" strokeDasharray="2,2" />
            <line x1="20" y1="130" x2="340" y2="130" stroke="#1e293b" strokeWidth="0.8" />
            <line x1="180" y1="20" x2="180" y2="240" stroke="#1e293b" strokeWidth="0.8" />

            {/* Roche Limit Danger Zone */}
            <circle cx="180" cy="130" r="28" fill="rgba(244, 63, 94, 0.08)" stroke="#f43f5e" strokeWidth="1" strokeDasharray="3,3" />

            {/* Host Star */}
            <circle cx="180" cy="130" r="32" fill="url(#systemStarGlow)" />
            <circle cx="180" cy="130" r="14" fill="#ffffff" />
            <text x="180" y="133" textAnchor="middle" fill="#0f172a" fontSize="7" fontWeight="bold" fontFamily="monospace">
              1.0 R☉
            </text>

            {/* Dynamic Orbital Track based on slider */}
            {(() => {
              // Map 0.02 - 0.6 AU to 35px - 110px radius
              const orbitPx = 32 + (orbitalRadiusAU / 0.5) * 78;
              return (
                <g>
                  <circle
                    cx="180"
                    cy="130"
                    r={orbitPx}
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="1.5"
                    strokeDasharray="4,3"
                  />
                  {/* Candidate Planet */}
                  <circle
                    cx={180 + orbitPx}
                    cy="130"
                    r={Math.max(4, planetRadiusEarth * 2.2)}
                    fill="#38bdf8"
                    stroke="#ffffff"
                    strokeWidth="1"
                    className="stellar-glow-blue"
                  />
                  <text
                    x={180 + orbitPx}
                    y="112"
                    textAnchor="middle"
                    fill="#e0f2fe"
                    fontSize="8.5"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {planetRadiusEarth} R⊕
                  </text>
                  {/* Semi-major axis measurement arrow */}
                  <line x1="180" y1="130" x2={180 + orbitPx} y2="130" stroke="#38bdf8" strokeWidth="1" />
                </g>
              );
            })()}
          </svg>

          {/* Telemetry Annotation under Visual */}
          <div className="w-full flex items-center justify-between text-[11px] font-mono text-space-400 pt-2 border-t border-space-800">
            <span>Stellar Roche Boundary (0.006 AU)</span>
            <span className="text-sky-300 font-bold">Orbit: a = {orbitalRadiusAU.toFixed(3)} AU</span>
            <span>Habitable Zone Boundary (~0.95 AU)</span>
          </div>
        </div>

        {/* Right Controls & Computed Physics */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-space-850 p-4 rounded-xl border border-space-700 space-y-4 font-mono text-xs">
            <div className="space-y-1.5">
              <div className="flex justify-between text-space-300">
                <span>Semi-Major Axis (Orbital Distance):</span>
                <strong className="text-sky-400">{orbitalRadiusAU.toFixed(3)} AU</strong>
              </div>
              <input
                type="range"
                min="0.02"
                max="0.50"
                step="0.005"
                value={orbitalRadiusAU}
                onChange={(e) => setOrbitalRadiusAU(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-space-700 rounded-lg appearance-none cursor-pointer accent-sky-400"
              />
              <div className="flex justify-between text-[10px] text-space-500">
                <span>0.02 AU (Ultra-short)</span>
                <span>0.11 AU (Temperate)</span>
                <span>0.50 AU (Outer)</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-space-800">
              <div className="bg-space-950 p-2.5 rounded border border-space-800">
                <span className="text-[10px] text-space-400 uppercase">Equilibrium Temp</span>
                <div className="text-base font-bold text-white mt-0.5">{teq} K</div>
                <div className="text-[9.5px] text-space-500">Albedo A = 0.3</div>
              </div>

              <div className="bg-space-950 p-2.5 rounded border border-space-800">
                <span className="text-[10px] text-space-400 uppercase">Incident Radiation</span>
                <div className="text-base font-bold text-amber-300 mt-0.5">{incidentFlux} S⊕</div>
                <div className="text-[9.5px] text-space-500">Solar insolation</div>
              </div>

              <div className="bg-space-950 p-2.5 rounded border border-space-800">
                <span className="text-[10px] text-space-400 uppercase">Orbital Period (P)</span>
                <div className="text-base font-bold text-sky-300 mt-0.5">{periodDays} d</div>
                <div className="text-[9.5px] text-space-500">Keplerian orbit</div>
              </div>

              <div className="bg-space-950 p-2.5 rounded border border-space-800">
                <span className="text-[10px] text-space-400 uppercase">Roche Stability</span>
                <div className={`text-base font-bold mt-0.5 ${isRocheUnstable ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {isRocheUnstable ? 'Disrupted' : 'Stable'}
                </div>
                <div className="text-[9.5px] text-space-500">Tidal shear check</div>
              </div>
            </div>

            <div className="p-2.5 bg-space-950/80 rounded border border-space-800 text-[11px] font-sans text-space-300">
              <strong className="text-sky-300 font-mono">Plausibility Check: </strong>
              {teq > 1800
                ? 'Ultra-hot regime: Candidate subject to severe atmospheric thermal escape.'
                : teq > 800
                ? 'Hot Sub-Neptune / Jupiter regime: Consistent with irradiated gas envelope.'
                : 'Temperate regime: Stable gaseous / volatile-rich sub-Neptune envelope.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
