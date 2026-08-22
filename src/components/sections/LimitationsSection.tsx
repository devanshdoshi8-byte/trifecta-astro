import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, Layers, Scale, HelpCircle, FileText, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { ScientificNote } from '../common/ScientificNote';

export const LimitationsSection: React.FC = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const limitations = [
    {
      num: '01',
      title: 'Multi-Band Follow-up Data Are Not Universally Available',
      category: 'Observational Data Constraint',
      whyItMatters: 'The chromaticity module relies on ground-based multi-filter photometry (e.g. MuSCAT, LCOGT, ExoFOP). Because TESS observes in a single wide optical passband (600–1000 nm), candidates lacking ground color follow-up cannot undergo Pillar 1 testing.',
      consequence: 'Some newly alerted TOIs can only be evaluated using Morphology and Plausibility until ground observations are acquired.',
      futureDirection: 'Integrate automated archival queries to ZTF, Pan-STARRS, and scheduled Rubin Observatory alerts to maximize multi-color coverage.'
    },
    {
      num: '02',
      title: 'Transit Morphology Suffers From Physical Parameter Degeneracy',
      category: 'Astrophysical Degeneracy',
      whyItMatters: 'Light curve shape alone cannot unambiguously separate a small transiting planet from a grazing eclipsing binary. High impact parameters (b > 0.85), strong stellar limb darkening, low photometric SNR, and long cadence binning blur the boundary between U-shaped and V-shaped profiles.',
      consequence: 'Some grazing planetary systems could receive a "Review Required" flag, requiring reconnaissance spectroscopy for Doppler verification.',
      futureDirection: 'Incorporate stellar rotational modulation and photometric centroid offset vectors directly into the morphology likelihood estimator.'
    },
    {
      num: '03',
      title: 'Astrophysical Plausibility Is Probabilistic, Not Deterministic',
      category: 'Theoretical Modeling Boundary',
      whyItMatters: 'Nature produces extreme and unexpected physical configurations (e.g. ultra-hot Jupiters like KELT-9b, tidally disrupted bodies, ultra-low-density puffball planets). Rigid universal cutoffs would cause false negatives on frontier astrophysical discoveries.',
      consequence: 'Extrapolating planetary bounds requires continuous screening flags rather than hard disqualifications.',
      futureDirection: 'Implement empirical non-parametric mass-radius relation boundaries trained on confirmed exoplanet populations (Chen & Kipping 2017).'
    },
    {
      num: '04',
      title: 'Ground-Based Observations Contain Systematic Uncertainties',
      category: 'Atmospheric & Instrumental Noise',
      whyItMatters: 'Ground-based multi-color follow-up is subject to atmospheric differential extinction, fluctuating seeing, airmass color corrections, and telluric absorption lines. In poorly calibrated observations, these effects can simulate artificial chromatic depth offsets.',
      consequence: 'Photometric noise in ground observations could occasionally inflate the measured chromatic delta significance.',
      futureDirection: 'Enforce stringent Gaussian Process systematic detrending on ground light curves with minimum 3.0σ thresholds.'
    },
    {
      num: '05',
      title: 'Trifecta Does Not Confirm Planets (Screening vs Confirmation)',
      category: 'Scientific Scope & Boundary',
      whyItMatters: 'True exoplanet confirmation requires definitive mass measurement via high-precision radial velocity (PRV) spectroscopy or transmission spectroscopy, paired with high-contrast adaptive optics (AO) imaging to rule out visual companions.',
      consequence: 'Trifecta is strictly an interpretable candidate-screening and triage layer designed to optimize resource allocation, not a confirmation engine.',
      futureDirection: 'Establish direct API export pipelines to TFOP Working Groups to queue prioritized targets for Keck, VLT, and ESPRESSO PRV runs.'
    },
    {
      num: '06',
      title: 'Established Validation Tools Remain Essential',
      category: 'Ecosystem Coexistence',
      whyItMatters: 'Tools like TRICERATOPS, TRICERATOPS+, VESPA, and DAVE provide comprehensive Bayesian false-positive probability (FPP) modeling based on galactic stellar population synthesis.',
      consequence: 'Trifecta serves as a rapid, transparent physical screening filter that can precede or accompany Bayesian statistical modeling.',
      futureDirection: 'Develop a unified wrapper that passes Trifecta diagnostic priors directly into TRICERATOPS Bayesian MCMC samplers.'
    }
  ];

  return (
    <section id="limitations" className="py-16 bg-space-950 text-white border-b border-space-800 transition-colors relative overflow-hidden">
      {/* Background Reticle */}
      <div className="absolute inset-0 bg-celestial-grid opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-400">
            SECTION 07: SCIENTIFIC REALISM &amp; METHODOLOGICAL BOUNDARIES
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
            Scientific Limitations &amp; Future Research
          </h2>
          <p className="text-sm sm:text-base text-space-300 leading-relaxed font-serif">
            Authentic scientific inquiry acknowledges the boundaries of its methodology. A transparent discussion of limitations is essential for reproducible research and peer evaluation.
          </p>
        </div>

        {/* 6 Limitations Expandable Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {limitations.map((lim, idx) => {
            const isExpanded = expandedIndex === idx;
            return (
              <div
                key={lim.num}
                className={`border rounded-xl transition-all overflow-hidden ${
                  isExpanded
                    ? 'bg-space-900 border-space-700 shadow-xl'
                    : 'bg-space-900/50 border-space-800 hover:border-space-700'
                }`}
              >
                <div
                  onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                  className="p-4 cursor-pointer flex items-start justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-sky-400">LIMITATION {lim.num}</span>
                      <span className="text-[9.5px] font-mono bg-space-950 text-space-300 border border-space-800 px-1.5 py-0.2 rounded">
                        {lim.category}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-white font-mono">
                      {lim.title}
                    </h4>
                  </div>

                  <button className="text-space-400 hover:text-white pt-1">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {/* Expanded Deep Dive Details */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 border-t border-space-800 space-y-2.5 text-xs font-sans animate-fadeIn">
                    <div>
                      <strong className="font-mono text-[10px] uppercase text-space-400 block">Why It Matters:</strong>
                      <p className="text-space-200 leading-relaxed font-sans">{lim.whyItMatters}</p>
                    </div>

                    <div className="p-2.5 bg-amber-950/30 rounded border border-amber-900/60">
                      <strong className="font-mono text-[10px] uppercase text-amber-300 block">Scientific Consequence:</strong>
                      <p className="text-amber-200 text-[11.5px] font-sans">{lim.consequence}</p>
                    </div>

                    <div className="p-2.5 bg-sky-950/30 rounded border border-sky-900/60">
                      <strong className="font-mono text-[10px] uppercase text-sky-300 block">How Future Research Addresses This:</strong>
                      <p className="text-sky-200 text-[11.5px] font-sans">{lim.futureDirection}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* WHAT TRIFECTA DOES NOT DO — SCIENTIFIC BOUNDARIES */}
        <div className="bg-space-900 border border-rose-500/30 rounded-xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-rose-300">
              WHAT TRIFECTA DOES NOT DO &middot; SCIENTIFIC BOUNDARIES
            </h3>
          </div>

          <p className="text-xs sm:text-sm text-space-200 leading-relaxed font-sans">
            To preserve absolute scientific integrity and avoid exaggerated claims, the boundaries of this research prototype are explicitly defined:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs font-mono pt-1">
            <div className="p-3 rounded-lg bg-space-950 border border-space-800 space-y-1">
              <span className="text-rose-400 font-bold block text-[11px] uppercase">&times; DOES NOT DISCOVER</span>
              <p className="text-space-300 text-[11.5px] font-sans leading-relaxed">
                Does not attempt to discover every exoplanet across blind survey catalogs.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-space-950 border border-space-800 space-y-1">
              <span className="text-rose-400 font-bold block text-[11px] uppercase">&times; DOES NOT PROVE</span>
              <p className="text-space-300 text-[11.5px] font-sans leading-relaxed">
                Does not claim to definitively prove a candidate is a confirmed planet.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-space-950 border border-space-800 space-y-1">
              <span className="text-rose-400 font-bold block text-[11px] uppercase">&times; DOES NOT REPLACE</span>
              <p className="text-space-300 text-[11.5px] font-sans leading-relaxed">
                Does not replace professional PRV spectroscopy or statistical validation suites (TRICERATOPS).
              </p>
            </div>

            <div className="p-3 rounded-lg bg-space-950 border border-space-800 space-y-1">
              <span className="text-rose-400 font-bold block text-[11px] uppercase">&times; DOES NOT GUARANTEE</span>
              <p className="text-space-300 text-[11.5px] font-sans leading-relaxed">
                Does not guarantee the complete absence of subtle or exotic false positives.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-space-950 border border-space-800 space-y-1">
              <span className="text-rose-400 font-bold block text-[11px] uppercase">&times; DOES NOT FABRICATE</span>
              <p className="text-space-300 text-[11.5px] font-sans leading-relaxed">
                Does not create multi-wavelength information from single-band TESS data.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-space-950 border border-space-800 space-y-1">
              <span className="text-rose-400 font-bold block text-[11px] uppercase">&times; DOES NOT REJECT EXTREMES</span>
              <p className="text-space-300 text-[11.5px] font-sans leading-relaxed">
                Does not treat unusual or extreme planets (e.g. ultra-hot Jupiters) as automatically impossible.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-space-950 border border-space-800 text-xs text-space-300 font-sans leading-relaxed">
            <strong className="text-white font-mono uppercase text-[10.5px] tracking-wider block mb-0.5">
              INSTEAD:
            </strong>
            &ldquo;Trifecta is a prototype computational screening and evidence-synthesis framework intended to help prioritize and interpret candidate signals.&rdquo;
          </div>
        </div>

        <ScientificNote
          variant="methodology"
          title="Science Fair & Judge Evaluation Note"
          technicalDetail="Scientific rigor at IRIS and ISEF is assessed by the candidate's understanding of methodological boundaries. Identifying where a computational algorithm encounters degeneracies demonstrates high scientific maturity."
        >
          At IRIS and Regeneron ISEF, scientific maturity is demonstrated by a deep understanding of methodological vulnerabilities and boundary conditions. Demonstrating where a computational astrophysics algorithm cannot be applied is as valuable as demonstrating where it can.
        </ScientificNote>
      </div>
    </section>
  );
};
