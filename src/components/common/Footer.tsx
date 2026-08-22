import React from 'react';
import { Orbit, Sparkles, Compass, Radio, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-b from-space-950 via-[#020409] to-[#000000] text-space-400 border-t border-space-800/80 py-16 relative overflow-hidden font-mono text-xs">
      {/* Ultra-subtle sparse stars & celestial grid fading into deep void */}
      <div className="absolute inset-0 bg-celestial-grid opacity-10 pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-sky-500/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg border border-space-700 bg-space-900 flex items-center justify-center text-white">
                <svg viewBox="0 0 24 24" className="w-5 h-5">
                  <polygon points="12,4 5,18 19,18" fill="none" stroke="#38bdf8" strokeWidth="1.2" />
                  <circle cx="12" cy="4" r="1.8" fill="#38bdf8" />
                  <circle cx="5" cy="18" r="1.8" fill="#34d399" />
                  <circle cx="19" cy="18" r="1.8" fill="#fbbf24" />
                  <circle cx="12" cy="13.3" r="1.5" fill="#ffffff" />
                </svg>
              </div>
              <span className="font-bold text-sm text-white">
                TRIFECTA<span className="text-sky-400 font-sans font-light ml-1">FRAMEWORK</span>
              </span>
            </div>
            <p className="text-xs text-space-300 leading-relaxed font-sans max-w-sm">
              An interpretable, physics-informed candidate screening framework for TESS exoplanet candidates through chromaticity, transit morphology, and physical plausibility diagnostics.
            </p>
            <div className="text-[11px] text-space-500 pt-1">
              Mission Control &middot; Observational Astrophysics Prototype &middot; IRIS / ISEF Track
            </div>
          </div>

          {/* Scientific Framework Links */}
          <div className="md:col-span-3 space-y-2">
            <div className="text-xs font-bold text-white uppercase tracking-wider">
              Diagnostic Pillars
            </div>
            <ul className="space-y-1.5 text-xs text-space-300">
              <li>1. Chromaticity Invariance (&Delta;&delta;)</li>
              <li>2. Transit Morphology (T₁₄, T₁₂, b)</li>
              <li>3. Physical Plausibility (Rp, Teq, Roche)</li>
              <li>4. Multi-Sector SPOC Integration</li>
            </ul>
          </div>

          {/* Astrophysics Missions & Archives */}
          <div className="md:col-span-4 space-y-2">
            <div className="text-xs font-bold text-white uppercase tracking-wider">
              Astrophysical Context
            </div>
            <div className="p-3 bg-space-900/60 rounded-lg border border-space-800 space-y-1 text-[11px] text-space-300">
              <div className="text-sky-300 font-bold">NASA TESS Mission &middot; ExoFOP-TESS</div>
              <p className="font-sans leading-relaxed text-space-400">
                Screening candidates across MIT SPOC, TRICERATOPS, and DAVE pipelines with transparent reasoning.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Epilogue Transition back to Space */}
        <div className="pt-8 border-t border-space-900 flex flex-wrap items-center justify-between gap-4 text-[11px] text-space-500">
          <div>
            &copy; 2026 Trifecta Astrophysics Research Initiative. All synthetic data labeled for evaluation.
          </div>
          <div className="flex items-center gap-2 text-space-400">
            <span>Entering Quiet Astronomical Environment</span>
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
          </div>
        </div>
      </div>
    </footer>
  );
};
