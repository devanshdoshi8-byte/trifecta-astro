import React from 'react';
import { InteractiveProblemComparator } from '../charts/InteractiveProblemComparator';
import { TransitGeometryVisualizer } from '../charts/TransitGeometryVisualizer';
import { TelescopeViewInteractive } from './TelescopeViewInteractive';
import { ScientificNote } from '../common/ScientificNote';
import { AlertTriangle, Layers, Telescope, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';

export const ProblemSection: React.FC = () => {
  return (
    <section id="problem" className="py-16 bg-space-950 text-white border-b border-space-800 transition-colors relative overflow-hidden">
      {/* Background Reticle */}
      <div className="absolute inset-0 bg-celestial-grid opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        {/* Section Title */}
        <div className="max-w-3xl space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-400">
            SECTION 01: SCIENTIFIC MOTIVATION &amp; COMPLICATION
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
            A Dip Is Not a Planet.
          </h2>
          <p className="text-sm sm:text-base text-space-300 leading-relaxed font-serif">
            A periodic decrease in stellar brightness is a signal. But in wide-field photometric surveys, the exact same dip amplitude can arise from multiple fundamentally distinct astrophysical phenomena.
          </p>
        </div>

        {/* Central Bold Statement Banner */}
        <div className="bg-space-900/90 text-white rounded-xl p-6 sm:p-8 text-center space-y-2 shadow-2xl border border-space-700/80 backdrop-blur-md">
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-sky-400">
            THE CENTRAL RESEARCH CHALLENGE
          </span>
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold font-serif text-white">
            "The challenge is not detecting the dip. The challenge is interpreting the dip correctly."
          </h3>
          <p className="text-xs sm:text-sm text-space-300 max-w-2xl mx-auto pt-1 font-sans">
            How can we identify which candidate signals deserve high confidence for intensive follow-up and which require further astrophysical scrutiny?
          </p>
        </div>

        {/* Interactive "Look Through the Telescope" Metaphor (Directive 10 & 35) */}
        <TelescopeViewInteractive />

        {/* Interactive Multi-Hypothesis Resolver */}
        <InteractiveProblemComparator />

        {/* Interactive Transit Geometry Comparator */}
        <TransitGeometryVisualizer />

        {/* Scientific Nuance & Research Bottleneck */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="bg-space-900/80 border border-space-800 rounded-lg p-5 space-y-3">
            <h4 className="text-sm font-bold font-mono text-white uppercase">
              Morphology Is A Diagnostic, Not An Absolute Rule
            </h4>
            <p className="text-xs text-space-300 leading-relaxed font-sans">
              It is a common misconception to assume "U-shaped = planet" and "V-shaped = eclipsing binary." In reality, grazing planetary transits, strong stellar limb darkening, long exposure smearing, low signal-to-noise, and instrumental systematics cause significant parameter overlap.
            </p>
            <ScientificNote
              variant="caveat"
              title="Morphological Degeneracy"
              technicalDetail="An exoplanet transiting with impact parameter b = (a/R*) * cos(i) > 0.85 only partially occults the stellar disk. The resulting light curve exhibits a continuous V-shape with no flat floor, identical to a grazing binary eclipse. Morphology alone is mathematically degenerate."
            >
              Transit morphology provides a diagnostic signal, not an absolute classification rule. A candidate with a V-shaped transit may simply have a high orbital impact parameter (b &gt; 0.8) rather than a stellar companion.
            </ScientificNote>
          </div>

          <div className="bg-space-900/80 border border-space-800 rounded-lg p-5 space-y-3">
            <h4 className="text-sm font-bold font-mono text-white uppercase">
              The Follow-up Prioritization Bottleneck
            </h4>
            <p className="text-xs text-space-300 leading-relaxed font-sans">
              Large survey missions generate thousands of candidate signals (over 7,000 TOIs to date). Automated validation pipelines (such as SPOC, TRICERATOPS, and DAVE) perform vital heavy lifting, but ambiguous candidates still require valuable ground-based telescope time.
            </p>
            <div className="bg-space-950 p-3.5 rounded border border-space-800 text-xs text-space-200 font-mono space-y-1.5">
              <div className="text-space-400 font-bold uppercase text-[10.5px]">Prioritization Objective:</div>
              <div>&bull; Screen out obvious chromatic and unphysical false positives early</div>
              <div>&bull; Flag ambiguous geometric candidates for reconnaissance spectroscopy</div>
              <div>&bull; Prioritize pristine candidates for high-precision radial velocity (PRV)</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
