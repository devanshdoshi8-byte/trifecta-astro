import React, { useState } from 'react';
import { RESEARCH_LOG_ENTRIES } from '../../data/researchLog';
import { ResearchLogEntry } from '../../data/researchLog';
import {
  HelpCircle,
  Network,
  Cpu,
  CheckCircle2,
  Clock,
  CircleDot,
  Compass,
  ArrowDown,
  ExternalLink,
  Code2,
  Terminal,
  Database,
  Calendar,
  Layers,
  FileText
} from 'lucide-react';
import { ScientificNote } from '../common/ScientificNote';

export const ResearchMethodSection: React.FC = () => {
  const [selectedLogId, setSelectedLogId] = useState<string>('log-01');

  const projectTimeline = [
    { num: 'Phase 1', label: 'Literature Review & Theoretical Background', status: 'done' },
    { num: 'Phase 2', label: 'Framework & Diagnostic Architecture Design', status: 'done' },
    { num: 'Phase 3', label: 'Interactive Research Prototype & Workstation', status: 'done' },
    { num: 'Phase 4', label: 'MAST / ExoFOP Automated Ingestion Pipeline', status: 'in_progress' },
    { num: 'Phase 5', label: 'Mandel-Agol MCMC Fit Parameter Tuning', status: 'in_progress' },
    { num: 'Phase 6', label: 'Experimental TOI Catalog Benchmarking', status: 'planned' },
    { num: 'Phase 7', label: 'Ablation & Error Taxonomy Quantification', status: 'planned' },
    { num: 'Phase 8', label: 'Final Research Paper & Reproducibility Suite', status: 'planned' }
  ];

  const currentLog = RESEARCH_LOG_ENTRIES.find(l => l.id === selectedLogId) || RESEARCH_LOG_ENTRIES[0];

  return (
    <section id="research-context" className="py-16 bg-space-950 text-white border-b border-space-800 transition-colors relative overflow-hidden">
      {/* Background Reticle */}
      <div className="absolute inset-0 bg-celestial-grid opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        {/* Section Title */}
        <div className="max-w-3xl space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-400">
            SECTION 08: RESEARCH METHODOLOGY &amp; PROGRESS
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
            Research Foundation &amp; Development Log
          </h2>
          <p className="text-sm sm:text-base text-space-300 leading-relaxed font-serif">
            A comprehensive overview of the research formulation, hypothesis testing structure, progression milestones, and chronological research log.
          </p>
        </div>

        {/* The Core Research Question */}
        <div className="bg-space-900/90 border border-space-700/80 rounded-xl p-6 sm:p-8 space-y-4 shadow-2xl backdrop-blur-md">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-sky-400" />
            <span className="text-xs font-mono font-bold uppercase text-white tracking-wider">
              Primary Research Question
            </span>
          </div>

          <blockquote className="border-l-4 border-sky-400 pl-4 py-1 text-white font-serif text-lg sm:text-xl font-medium leading-relaxed">
            "Can a combination of interpretable, physics-informed diagnostics reduce the number of ambiguous TESS transit candidates requiring further investigation while preserving genuine planetary candidates?"
          </blockquote>

          <div className="pt-2 text-xs text-space-300 font-sans space-y-1">
            <strong className="text-white font-mono text-xs uppercase">Supporting Research Inquiry:</strong>
            <p>
              How effective are chromaticity, transit morphology, and astrophysical plausibility as complementary screening signals when applied to TESS Objects of Interest (TOIs) and available follow-up observations?
            </p>
          </div>
        </div>

        {/* WHY A TRIFECTA? — COMPLEMENTARY EVIDENCE PANEL */}
        <div className="bg-space-900 border border-sky-500/30 rounded-xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" />
            <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-amber-300">
              WHY A TRIFECTA? &middot; THE CASE FOR COMPLEMENTARY EVIDENCE
            </h3>
          </div>

          <p className="text-xs sm:text-sm text-space-200 leading-relaxed font-sans">
            &ldquo;No single diagnostic is sufficient for every false-positive scenario.&rdquo;
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono pt-1">
            <div className="p-3.5 rounded-lg bg-space-950 border border-space-800 space-y-1">
              <strong className="text-white block text-xs uppercase text-sky-400">SHAPE (Morphology)</strong>
              <p className="text-space-300 text-[11.5px] font-sans leading-relaxed">
                Provides morphological evidence distinguishing flat-bottomed central transits from V-shaped grazing binaries.
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-space-950 border border-space-800 space-y-1">
              <strong className="text-white block text-xs uppercase text-amber-400">COLOUR (Chromaticity)</strong>
              <p className="text-space-300 text-[11.5px] font-sans leading-relaxed">
                Provides independent wavelength evidence when multi-band ground follow-up data exist, exposing temperature-contrasted blending.
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-space-950 border border-space-800 space-y-1">
              <strong className="text-white block text-xs uppercase text-emerald-400">PHYSICS (Plausibility)</strong>
              <p className="text-space-300 text-[11.5px] font-sans leading-relaxed">
                Tests whether a proposed planetary scenario is physically plausible against Keplerian mechanics, Roche limits, and stellar density.
              </p>
            </div>
          </div>

          <p className="text-xs text-space-400 font-sans leading-relaxed border-t border-space-800/80 pt-3">
            Nearby-source information (Gaia DR3) and data quality metrics provide additional context. Therefore, the framework is intentionally designed around <strong>complementary evidence rather than a single rigid rule</strong>. Trifecta does not claim that three checks guarantee a planet.
          </p>
        </div>

        {/* Research Progression Timeline & Computational Stack */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Milestone Tracker */}
          <div className="lg:col-span-6 bg-space-900 border border-space-800 rounded-xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-space-800 pb-2">
              <span className="font-mono text-xs font-bold text-white uppercase">
                Research Progression (8 Phases)
              </span>
              <span className="text-[10.5px] font-mono text-space-400">Milestone Status</span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              {projectTimeline.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 py-1">
                  {item.status === 'done' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : item.status === 'in_progress' ? (
                    <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 animate-spin" />
                  ) : (
                    <CircleDot className="w-4 h-4 text-space-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="text-[10px] uppercase font-bold text-space-500 mr-2">{item.num}</span>
                    <span className={item.status === 'done' ? 'text-space-200 font-medium' : item.status === 'in_progress' ? 'text-white font-bold' : 'text-space-500'}>
                      {item.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Computational Architecture */}
          <div className="lg:col-span-6 bg-space-900 border border-space-800 rounded-xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-space-800 pb-2">
              <span className="font-mono text-xs font-bold text-white uppercase flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-sky-400" />
                <span>Computational Architecture</span>
              </span>
              <span className="text-[10.5px] font-mono text-space-400">Modular Stack</span>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="p-3 bg-space-950 rounded border border-space-800 space-y-1">
                <div className="font-bold text-white text-[11px] flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-sky-400" />
                  <span>Python Scientific Core (Future API Integration)</span>
                </div>
                <p className="text-space-300 text-[11px] font-sans">
                  Lightkurve, Astropy, BATMAN/Mandel-Agol transit modeling, SciPy non-linear optimization, and statistical uncertainty propagation.
                </p>
              </div>

              <div className="p-3 bg-space-950 rounded border border-space-800 space-y-1">
                <div className="font-bold text-white text-[11px] flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Data Ingestion &amp; Archive Access</span>
                </div>
                <p className="text-space-300 text-[11px] font-sans">
                  MAST (Mikulski Archive for Space Telescopes) queries, ExoFOP-TESS follow-up tables, Gaia DR3 astrometric cross-matching.
                </p>
              </div>

              <div className="p-3 bg-space-950 rounded border border-space-800 space-y-1">
                <div className="font-bold text-white text-[11px] flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  <span>Interactive Research Interface</span>
                </div>
                <p className="text-space-300 text-[11px] font-sans">
                  React 19, TypeScript, responsive SVG vector photometric plotting, and modular data contract service abstractions.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Chronological Research Log */}
        <div className="bg-space-900/90 border border-space-800 rounded-xl p-6 space-y-5 shadow-2xl backdrop-blur-md">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-space-800 pb-3">
            <div>
              <span className="font-mono text-xs font-bold text-white uppercase flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-sky-400" />
                <span>Chronological Research Log</span>
              </span>
              <p className="text-xs text-space-300 mt-0.5 font-sans">
                Key scientific iterations, data requirement discoveries, and architectural milestones during project development.
              </p>
            </div>
            <span className="text-[10.5px] font-mono text-space-400">5 Milestone Entries</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
            {/* Log Date Selector list */}
            <div className="md:col-span-5 space-y-2">
              {RESEARCH_LOG_ENTRIES.map(log => {
                const isSelected = selectedLogId === log.id;
                return (
                  <button
                    key={log.id}
                    onClick={() => setSelectedLogId(log.id)}
                    className={`w-full p-3 rounded-lg border text-left transition-all ${
                      isSelected
                        ? 'bg-space-850 text-white border-sky-400 shadow-md ring-1 ring-sky-400/50'
                        : 'bg-space-950 text-space-300 border-space-800 hover:border-space-700'
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono text-[10.5px]">
                      <span className={isSelected ? 'text-sky-300' : 'text-space-400'}>{log.date}</span>
                      <span className="uppercase opacity-75">{log.category}</span>
                    </div>
                    <div className="text-xs font-bold mt-1 leading-snug">
                      {log.title}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Log Inspector Detail */}
            <div className="md:col-span-7 bg-space-950 p-5 rounded-xl border border-space-800 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-space-800 pb-2">
                <span className="text-[11px] font-bold text-sky-400">{currentLog.date}</span>
                <span className="text-[10px] bg-space-900 text-space-300 px-2 py-0.5 rounded border border-space-800 uppercase">
                  {currentLog.category}
                </span>
              </div>

              <h4 className="text-sm font-bold text-white font-sans">
                {currentLog.title}
              </h4>

              <p className="text-xs text-space-200 font-sans leading-relaxed">
                {currentLog.summary}
              </p>

              <div className="p-3 bg-space-900 rounded border border-space-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-space-400 block">
                  Technical Decision Note:
                </span>
                <p className="text-[11px] text-space-200 font-sans">
                  {currentLog.technicalDetails}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* LEAST-SQUARES VS. MCMC METHODOLOGICAL NOTE */}
        <div className="bg-space-900 border border-sky-500/40 rounded-xl p-6 sm:p-8 space-y-5 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-space-800 pb-3">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-sky-400" />
              <h3 className="font-mono text-sm sm:text-base font-bold uppercase tracking-wider text-white">
                METHODOLOGY NOTE &middot; LEAST-SQUARES (LEVENBERG-MARQUARDT) VS. MCMC
              </h3>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-700">
              NUMERICAL OPTIMIZATION ARCHITECTURE
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs font-sans">
            <div className="lg:col-span-6 space-y-3">
              <h4 className="font-mono text-xs font-bold text-sky-300 uppercase">
                1. Why Least-Squares for Rapid Screening Triage?
              </h4>
              <p className="text-space-200 leading-relaxed">
                Trifecta employs the <strong>Levenberg-Marquardt damped least-squares algorithm</strong> (via SciPy <code className="text-sky-300">curve_fit</code> and client-side numerical solvers) to fit the analytical Mandel &amp; Agol (2002) transit model:
              </p>
              <div className="p-3 bg-space-950 rounded-lg border border-space-800 font-mono text-[11px] text-space-300">
                {'$$\\chi^2(k, b, a/R_*, t_0) = \\sum_{i=1}^{N} \\frac{(f_i - f_{\\text{model}}(t_i))^2}{\\sigma_i^2}$$'}
              </div>
              <ul className="space-y-1.5 text-space-300">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">&bull;</span>
                  <span><strong>Sub-second Deterministic Convergence:</strong> Optimizes in &lt;50 ms, enabling instantaneous interactive analysis across hundreds of candidates in the web workstation.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">&bull;</span>
                  <span><strong>Local Covariance Uncertainties:</strong> Computes the inverse Hessian covariance matrix {'$\\Sigma = (J^T W J)^{-1}$'} to extract formal parameter error bars without intensive compute overhead.</span>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-6 space-y-3">
              <h4 className="font-mono text-xs font-bold text-amber-300 uppercase">
                2. Methodological Trade-off &amp; Future MCMC Integration
              </h4>
              <p className="text-space-200 leading-relaxed">
                While least-squares provides exceptional speed for rapid triage, it assumes symmetric, locally Gaussian likelihood surfaces around the global minimum:
              </p>
              <ul className="space-y-1.5 text-space-300">
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">&bull;</span>
                  <span><strong>Parameter Degeneracies:</strong> In low-SNR or grazing ($b &gt; 0.85$) regimes, degeneracies between impact parameter $b$ and limb darkening can cause asymmetric or bimodal posteriors.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sky-400 font-bold">&bull;</span>
                  <span><strong>Phase 5 Roadmap (MCMC Sampling):</strong> Candidates prioritized by Trifecta&apos;s initial triage will be queued for Affine-Invariant Markov Chain Monte Carlo (MCMC via <code className="text-sky-300">emcee</code> / <code className="text-sky-300">PyMC</code>) with 10,000+ posterior samples for high-precision joint parameter posteriors.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Comparison Matrix Table */}
          <div className="overflow-x-auto border-t border-space-800 pt-4">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="border-b border-space-800 text-[10.5px] text-space-400 bg-space-950">
                  <th className="p-2">Dimension</th>
                  <th className="p-2 text-sky-400">Levenberg-Marquardt Least-Squares (Current)</th>
                  <th className="p-2 text-amber-300">Markov Chain Monte Carlo (Phase 5 Roadmap)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-space-800/60">
                <tr className="hover:bg-space-850/40">
                  <td className="p-2 font-bold text-white">Execution Time</td>
                  <td className="p-2 text-emerald-300">&lt; 0.05 seconds (Sub-second)</td>
                  <td className="p-2 text-amber-300">2 &ndash; 15 minutes per candidate</td>
                </tr>
                <tr className="hover:bg-space-850/40">
                  <td className="p-2 font-bold text-white">Execution Environment</td>
                  <td className="p-2 text-space-300">Client-side Browser (TypeScript) + FastAPI (SciPy)</td>
                  <td className="p-2 text-space-300">Asynchronous Python Worker / Compute Node</td>
                </tr>
                <tr className="hover:bg-space-850/40">
                  <td className="p-2 font-bold text-white">Primary Output</td>
                  <td className="p-2 text-space-300">Best-fit parameter vector + covariance errors</td>
                  <td className="p-2 text-space-300">Full multi-dimensional posterior PDFs + Corner plots</td>
                </tr>
                <tr className="hover:bg-space-850/40">
                  <td className="p-2 font-bold text-white">Role in Scientific Ecosystem</td>
                  <td className="p-2 text-sky-300 font-bold">Tier-1 Rapid Screening &amp; Candidate Triage</td>
                  <td className="p-2 text-amber-300 font-bold">Tier-2 Deep Characterization &amp; Publication Posteriors</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Project Context & Reproducibility Statement */}
        <div id="about" className="bg-space-900 border border-space-800 rounded-xl p-6 sm:p-8 space-y-4 shadow-xl">
          <span className="text-xs font-mono font-bold uppercase text-space-400 tracking-wider">
            PROJECT CONTEXT &amp; SCIENTIFIC REPRODUCIBILITY
          </span>
          <h3 className="text-xl font-bold text-white font-mono">
            About the Trifecta Research Initiative
          </h3>
          <p className="text-xs sm:text-sm text-space-300 leading-relaxed font-sans">
            Trifecta is being developed as an independent student research project in computational astrophysics. The project focuses on scientific reproducibility, transparent decision heuristics, and physics-grounded candidate triage for the TESS mission.
          </p>
          <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono text-space-300">
            <div className="bg-space-950 p-2.5 rounded border border-space-800">
              <span className="text-space-500 block text-[10px]">Research Domain:</span>
              <strong className="text-white">Computational Astrophysics</strong>
            </div>
            <div className="bg-space-950 p-2.5 rounded border border-space-800">
              <span className="text-space-500 block text-[10px]">Target Data Stream:</span>
              <strong className="text-white">TESS Candidates (TOIs)</strong>
            </div>
            <div className="bg-space-950 p-2.5 rounded border border-space-800">
              <span className="text-space-500 block text-[10px]">Evaluation Track:</span>
              <strong className="text-white">IRIS / Regeneron ISEF</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
