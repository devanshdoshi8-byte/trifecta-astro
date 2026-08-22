import React from 'react';
import { Orbit, ArrowRight, BookOpen, Sliders, Activity, Sparkles, Layers } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface CtaSectionProps {
  onOpenExplorer: () => void;
  onOpenSandbox: () => void;
  onOpenMethod: () => void;
}

export const CtaSection: React.FC<CtaSectionProps> = ({
  onOpenExplorer,
  onOpenSandbox,
  onOpenMethod
}) => {
  const { openGuidedDemo, openCompareModal } = useTheme();

  return (
    <section className="py-20 bg-space-950 text-white relative overflow-hidden border-t border-space-800 transition-colors">
      {/* Background Reticle */}
      <div className="absolute inset-0 bg-celestial-grid opacity-20 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-sky-500/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 text-xs font-mono font-semibold uppercase tracking-wider bg-space-900 text-sky-400 border border-space-700 rounded-full shadow-lg">
          <Orbit className="w-3.5 h-3.5" />
          <span>Three Physical Signals &middot; One Transparent Decision Layer</span>
        </div>

        <div className="space-y-4">
          <blockquote className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif max-w-3xl mx-auto leading-tight text-white">
            "A transit is a signal. <br className="hidden sm:inline" />
            <span className="text-sky-200">The research challenge is determining what produced it."</span>
          </blockquote>

          <p className="text-xs sm:text-sm text-space-300 max-w-2xl mx-auto leading-relaxed font-sans">
            Trifecta does not attempt to invent a new telescope or replace established exoplanet validation systems. Instead, it explores whether three complementary evidence sources can be organized into a transparent screening workflow in which every candidate assessment is accompanied by physical reasoning.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2 font-mono">
          <button
            onClick={onOpenExplorer}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-space-950 bg-sky-400 hover:bg-sky-300 rounded-md shadow-lg shadow-sky-950/50 transition-colors cursor-pointer"
          >
            <Activity className="w-4 h-4 text-space-950" />
            <span>Open Candidate Workstation</span>
          </button>

          <button
            onClick={openGuidedDemo}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-amber-300 bg-amber-950/60 hover:bg-amber-900/60 border border-amber-800 rounded-md transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>2-Minute Guided Tour</span>
          </button>

          <button
            onClick={onOpenSandbox}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-space-900 hover:bg-space-850 border border-space-700 rounded-md transition-colors cursor-pointer"
          >
            <Sliders className="w-4 h-4 text-sky-400" />
            <span>Interactive Sandbox</span>
          </button>

          <button
            onClick={onOpenMethod}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-space-300 hover:text-white transition-colors cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>Methodology</span>
          </button>
        </div>

        <div className="pt-6 text-[11px] font-mono text-space-500 uppercase tracking-widest">
          TRIFECTA FRAMEWORK &middot; Computational Astrophysics Research Prototype
        </div>
      </div>
    </section>
  );
};
