import React from 'react';
import { PipelineVisualizer } from '../charts/PipelineVisualizer';
import { ShieldCheck, Activity, Database, Cpu, Layers } from 'lucide-react';
import { ScientificNote } from '../common/ScientificNote';

export const PipelineExplorerSection: React.FC = () => {
  return (
    <section id="pipeline" className="py-16 bg-space-950 text-white border-b border-space-800 transition-colors relative overflow-hidden">
      {/* Background Reticle */}
      <div className="absolute inset-0 bg-celestial-grid opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        {/* Header */}
        <div className="max-w-3xl space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-400">
            SECTION 03: COMPUTATIONAL ARCHITECTURE &amp; METHODOLOGY
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
            The 10-Stage Research Pipeline
          </h2>
          <p className="text-sm sm:text-base text-space-300 leading-relaxed font-serif">
            A modular, reproducible computational framework designed to transform raw survey photometry and follow-up data into interpretable, physics-informed screening assessments.
          </p>
        </div>

        {/* Interactive 10-Stage Pipeline Visualizer */}
        <PipelineVisualizer />

        {/* Data Quality & Statistical Thinking Callouts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-space-900 border border-space-800 rounded-lg p-5 space-y-3 shadow-xl">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h4 className="text-sm font-bold font-mono text-white uppercase">
                Before Physics Comes Data Quality
              </h4>
            </div>
            <p className="text-xs text-space-300 leading-relaxed font-sans">
              The framework does not blindly execute physical fits on degraded data. Missing follow-up observations, low SNR, light curve gaps, and irregular baseline slopes cause candidates to be assigned an explicit status of <strong>Insufficient Data</strong> rather than generating an ungrounded scientific classification.
            </p>
            <ScientificNote
              variant="methodology"
              title="Data Gating Rationale"
              technicalDetail="Photometric time series with SNR < 5.0 or baseline coverage < 3x transit duration are quarantined. Incomplete multi-band follow-up prompts a Data Availability Dependent flag rather than a simulated zero."
            >
              Candidates failing quality thresholds enter an explicit review queue rather than forcing a low-confidence classification.
            </ScientificNote>
          </div>

          <div className="bg-space-900 border border-space-800 rounded-lg p-5 space-y-3 shadow-xl">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-sky-400" />
              <h4 className="text-sm font-bold font-mono text-white uppercase">
                From Rules to Statistical Evidence
              </h4>
            </div>
            <p className="text-xs text-space-300 leading-relaxed font-sans">
              Trifecta rejects arbitrary binary thresholds. A candidate is not discarded simply because blue depth ≠ red depth; the difference must be statistically distinguishable from measurement uncertainty (σ ≥ 3.0). Morphology is evaluated as a likelihood shift rather than an absolute rule.
            </p>
            <ScientificNote
              variant="caveat"
              title="Significance Formulation"
              technicalDetail="Chromatic significance is evaluated using Welch pooled variance: sigma = |Delta delta| / sqrt(sigma_blue^2 + sigma_red^2). Depth delta is deemed significant only when sigma >= 3.0."
            >
              Significance testing prevents observational noise from mimicking false-positive chromaticity.
            </ScientificNote>
          </div>
        </div>
      </div>
    </section>
  );
};
