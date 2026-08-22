import React from 'react';
import {
  X,
  Award,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Layers,
  Database,
  Compass,
  CheckCircle2,
  HelpCircle,
  Activity,
  FileText
} from 'lucide-react';
import { CandidateAssessment, TrifectaAssessmentReport } from '../../types/astrophysics';

interface JudgeOverviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate?: CandidateAssessment | null;
  report?: TrifectaAssessmentReport | null;
  onOpenFullTechnical: () => void;
}

export const JudgeOverviewModal: React.FC<JudgeOverviewModalProps> = ({
  isOpen,
  onClose,
  candidate,
  report,
  onOpenFullTechnical
}) => {
  if (!isOpen) return null;

  // Target info
  const targetId = report?.target.target_id || candidate?.candidateId || candidate?.hostStarName || 'TOI-700.01';
  const overallState = report?.overall_state || candidate?.headlineSummary || 'REVIEW RECOMMENDED';

  // Dynamic values
  const depthPercent = report?.morphology.measured_depth_percent
    ?? (candidate ? candidate.morphology.transitDepth.toFixed(3) : '0.044');

  const periodDays = report?.plausibility.orbital_period_days
    ?? (candidate ? candidate.plausibility.orbitalPeriodDays.toFixed(4) : '37.4200');

  const radiusEarth = report?.plausibility.inferred_radius_earth
    ?? (candidate ? candidate.plausibility.candidateRadiusEarth.toFixed(2) : '1.31');

  const eqTempK = report?.plausibility.equilibrium_temp_k
    ?? (candidate ? candidate.plausibility.equilibriumTempK : 247);

  // Dynamic evidence summary
  const supportingEvidence = report?.evidence_for?.map(e => e.summary) ||
    candidate?.evidenceFor?.map(e => e.summary) || [
      'U-shaped flat-bottomed Mandel-Agol transit profile consistent with central planetary occultation.',
      'Orbital dynamics and derived companion radius are physically stable and well outside the stellar Roche disruption zone.'
    ];

  const cautionaryEvidence = report?.evidence_against?.map(e => e.summary) ||
    candidate?.evidenceAgainst?.map(e => e.summary) || [
      'Gaia DR3 cross-match reveals neighboring sources with potential flux dilution.'
    ];

  const limitations = report?.scientific_limitations || [
    'Single-band TESS photometry cannot evaluate color depth differentials without independent multi-band ground follow-up data.',
    'Precision radial velocity (PRV) Doppler mass confirmation is required to measure bulk planetary density.'
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-space-950/90 backdrop-blur-md flex items-center justify-center p-4 font-sans">
      <div className="bg-space-900 border border-sky-500/40 rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-white animate-fadeIn">
        {/* Top Header */}
        <div className="bg-space-950 p-4 sm:p-5 border-b border-space-800 flex items-center justify-between font-mono">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-sky-500/10 border border-sky-500/40 rounded-lg text-sky-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10.5px] uppercase font-bold text-sky-300 tracking-wider">
                  SCIENTIFIC EVALUATION VIEW
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800 text-[10px] uppercase font-bold">
                  JUDGE MODE ACTIVE
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
                TRIFECTA FRAMEWORK &middot; EXECUTIVE SCIENTIFIC SUMMARY
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-space-400 hover:text-white rounded-lg hover:bg-space-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs">
          {/* Section 1: Problem & Approach */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-space-950 border border-space-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 font-mono text-sky-400 font-bold text-xs uppercase tracking-wide">
                <Compass className="w-4 h-4" />
                <span>WHAT ARE WE TRYING TO SOLVE?</span>
              </div>
              <p className="text-space-300 leading-relaxed font-sans">
                Wide-field space telescopes like TESS observe large sky regions with 21"/pixel resolution. Light from nearby stars often blends together, allowing eclipsing stellar binaries or background systems to mimic genuine exoplanet transits. Trifecta provides an interpretable screening layer to systematically evaluate ambiguous transit signals.
              </p>
            </div>

            <div className="bg-space-950 border border-space-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 font-mono text-amber-400 font-bold text-xs uppercase tracking-wide">
                <Layers className="w-4 h-4" />
                <span>HOW DOES TRIFECTA APPROACH IT?</span>
              </div>
              <div className="flex items-center justify-between text-center font-mono py-2">
                <div className="px-3 py-1.5 rounded bg-space-900 border border-space-700">
                  <span className="block text-[10px] text-space-400 uppercase font-bold">Pillar 1</span>
                  <strong className="text-white text-xs">SHAPE</strong>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-space-600" />
                <div className="px-3 py-1.5 rounded bg-space-900 border border-space-700">
                  <span className="block text-[10px] text-space-400 uppercase font-bold">Pillar 2</span>
                  <strong className="text-white text-xs">COLOUR</strong>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-space-600" />
                <div className="px-3 py-1.5 rounded bg-space-900 border border-space-700">
                  <span className="block text-[10px] text-space-400 uppercase font-bold">Pillar 3</span>
                  <strong className="text-white text-xs">PHYSICS</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Data Sources Used */}
          <div className="bg-space-950 border border-space-800 rounded-xl p-4 space-y-2 font-mono">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold text-space-300 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                <span>WHAT DATA WERE USED FOR TARGET: <strong className="text-white">{targetId}</strong></span>
              </span>
              <span className="text-[10px] text-emerald-400 font-bold">PUBLIC OBSERVATIONAL DATA</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              <div className="p-2.5 rounded bg-space-900 border border-space-800">
                <span className="block text-[9.5px] text-space-400">Time Series</span>
                <strong className="text-white text-[11px]">MAST TESS SPOC</strong>
              </div>
              <div className="p-2.5 rounded bg-space-900 border border-space-800">
                <span className="block text-[9.5px] text-space-400">Host & TOI</span>
                <strong className="text-white text-[11px]">NASA Exoplanet Archive</strong>
              </div>
              <div className="p-2.5 rounded bg-space-900 border border-space-800">
                <span className="block text-[9.5px] text-space-400">Neighbors (45")</span>
                <strong className="text-white text-[11px]">ESA Gaia DR3 TAP</strong>
              </div>
              <div className="p-2.5 rounded bg-space-900 border border-space-800">
                <span className="block text-[9.5px] text-space-400">Multi-band Follow-up</span>
                <strong className="text-amber-300 text-[11px]">
                  {report?.chromaticity.is_available ? 'User Uploaded' : 'TESS Single-Band (N/A)'}
                </strong>
              </div>
            </div>
          </div>

          {/* Section 3: What Did We Find? (Dynamic Real Results) */}
          <div className="bg-space-950 border border-sky-500/30 rounded-xl p-4 space-y-3 font-mono">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-space-800 pb-2">
              <div>
                <span className="text-[10px] uppercase font-bold text-sky-400">WHAT DID WE FIND?</span>
                <h4 className="text-sm font-bold text-white">Dynamic Physical Assessment</h4>
              </div>
              <span className="px-2.5 py-1 rounded bg-sky-950 text-sky-300 border border-sky-700 font-bold text-xs">
                {overallState}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2 rounded bg-space-900 border border-space-800">
                <span className="text-[10px] text-space-400 block">Transit Depth</span>
                <strong className="text-white">{depthPercent}%</strong>
              </div>
              <div className="p-2 rounded bg-space-900 border border-space-800">
                <span className="text-[10px] text-space-400 block">Orbital Period (P)</span>
                <strong className="text-white">{periodDays} d</strong>
              </div>
              <div className="p-2 rounded bg-space-900 border border-space-800">
                <span className="text-[10px] text-space-400 block">Companion Radius</span>
                <strong className="text-white">{radiusEarth} R⊕</strong>
              </div>
              <div className="p-2 rounded bg-space-900 border border-space-800">
                <span className="text-[10px] text-space-400 block">Equilibrium Temp</span>
                <strong className="text-white">{eqTempK} K</strong>
              </div>
            </div>
          </div>

          {/* Section 4: Why? Evidence & Unknowns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Supporting & Cautionary Evidence */}
            <div className="bg-space-950 border border-space-800 rounded-xl p-4 space-y-2">
              <span className="font-mono text-xs uppercase font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>WHY? &middot; EVIDENCE SUMMARY</span>
              </span>
              <ul className="space-y-1.5 text-[11.5px] text-space-200 font-sans">
                {supportingEvidence.map((ev: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">&bull;</span>
                    <span>{ev}</span>
                  </li>
                ))}
                {cautionaryEvidence.map((ev: string, i: number) => (
                  <li key={`c-${i}`} className="flex items-start gap-2 text-amber-200">
                    <span className="text-amber-400 font-bold">&bull;</span>
                    <span>{ev}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* What is Still Unknown? */}
            <div className="bg-space-950 border border-space-800 rounded-xl p-4 space-y-2">
              <span className="font-mono text-xs uppercase font-bold text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>WHAT IS STILL UNKNOWN? &middot; LIMITATIONS</span>
              </span>
              <ul className="space-y-1.5 text-[11.5px] text-space-300 font-sans">
                {limitations.map((lim: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">&bull;</span>
                    <span>{lim}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-space-950 border-t border-space-800 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono">
          <div className="text-xs text-space-400">
            Trifecta Evidence Synthesis &middot; Evaluated deterministically
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-space-900 hover:bg-space-850 text-space-300 text-xs rounded-lg border border-space-800 transition-colors cursor-pointer w-full sm:w-auto"
            >
              Close Summary
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenFullTechnical();
              }}
              className="px-5 py-2 bg-sky-400 hover:bg-sky-300 text-space-950 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
            >
              <span>Explore Full Technical Analysis</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
