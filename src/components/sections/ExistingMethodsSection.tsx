import React from 'react';
import { EXISTING_METHODS_COMPARISON } from '../../data/references';
import { Scale, HelpCircle, Layers, CheckCircle2, FileText, ArrowRight } from 'lucide-react';
import { ScientificNote } from '../common/ScientificNote';

export const ExistingMethodsSection: React.FC = () => {
  return (
    <section id="existing-methods" className="py-16 bg-space-950 text-white border-b border-space-800 transition-colors relative overflow-hidden">
      {/* Background Reticle */}
      <div className="absolute inset-0 bg-celestial-grid opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-400">
            SECTION 05: ECOSYSTEM &amp; PRIOR ART
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
            Existing Validation Methods &amp; Ecosystem Landscape
          </h2>
          <p className="text-sm sm:text-base text-space-300 leading-relaxed font-serif">
            A respectful, objective comparative analysis of established exoplanet vetting and statistical validation tools alongside the proposed Trifecta screening framework.
          </p>
        </div>

        {/* Existing Methods Comparison Matrix Table */}
        <div className="bg-space-900/90 rounded-xl p-6 border border-space-800 space-y-4 shadow-2xl backdrop-blur-md">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-space-800 pb-3">
            <div>
              <span className="font-mono text-xs font-bold text-white uppercase flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-sky-400" />
                <span>Exoplanet Candidate Screening &amp; Validation Comparison Matrix</span>
              </span>
              <p className="text-xs text-space-300 mt-0.5 font-sans">
                Trifecta is designed to complement established Bayesian tools, offering a rapid, transparent physical screening layer.
              </p>
            </div>
            <span className="text-[10.5px] font-mono text-space-400">6 Architectural Approaches</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="border-b-2 border-space-700 text-space-400 bg-space-950">
                  <th className="p-3">Framework</th>
                  <th className="p-3">Primary Evidence</th>
                  <th className="p-3">Statistical Approach</th>
                  <th className="p-3">Multi-Band Follow-up</th>
                  <th className="p-3">Interpretability Model</th>
                  <th className="p-3">Role in Workflow</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-space-800">
                {EXISTING_METHODS_COMPARISON.map((tool, idx) => {
                  const isTrifecta = tool.name.includes('TRIFECTA');
                  return (
                    <tr
                      key={idx}
                      className={
                        isTrifecta
                          ? 'bg-sky-950/40 font-semibold text-white border-l-2 border-sky-400'
                          : 'bg-space-900/50 hover:bg-space-850 text-space-200'
                      }
                    >
                      <td className="p-3 whitespace-nowrap">
                        <div className="font-bold text-white">{tool.name}</div>
                        <div className="text-[10px] text-space-400 font-normal font-sans italic">{tool.citation}</div>
                      </td>
                      <td className="p-3 font-sans text-space-300 text-[11.5px]">{tool.primaryEvidence}</td>
                      <td className="p-3 font-sans text-space-300 text-[11.5px]">{tool.statisticalApproach}</td>
                      <td className="p-3 font-sans text-space-300 text-[11.5px]">{tool.multiBandCapability}</td>
                      <td className="p-3 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10.5px] border ${
                          tool.interpretabilityScore.includes('High')
                            ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
                            : 'bg-space-850 text-space-300 border-space-700'
                        }`}>
                          {tool.interpretabilityScore.split(' ')[0]}
                        </span>
                      </td>
                      <td className="p-3 font-sans text-space-400 text-[11px]">{tool.roleInEcosystem}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <ScientificNote
          variant="methodology"
          title="Complementary Coexistence"
          technicalDetail="TRICERATOPS and VESPA perform Monte Carlo galactic population synthesis over millions of virtual stars. Trifecta provides an upfront, explainable physical check that isolates chromatic discrepancies and grazing profiles before computationally intensive Bayesian runs."
        >
          Trifecta does not claim to replace statistical validation tools like TRICERATOPS or VESPA. Rather, it investigates whether a transparent 3-pillar physical triage layer can accelerate the identification of false positives and optimize ground follow-up scheduling.
        </ScientificNote>
      </div>
    </section>
  );
};
