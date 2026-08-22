import React, { useState } from 'react';
import { RESEARCH_CANDIDATES } from '../../data/mockCandidates';
import { CandidateAssessment } from '../../types/astrophysics';
import { DiagnosticStatusBadge } from './DataQualityBadge';
import { X, Layers, CheckSquare, Square, ArrowRight } from 'lucide-react';

interface CompareCandidatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCandidate: (candidateId: string) => void;
}

export const CompareCandidatesModal: React.FC<CompareCandidatesModalProps> = ({
  isOpen,
  onClose,
  onSelectCandidate
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(['TOI-1233.01', 'TOI-2180.02', 'TOI-503.01']);

  if (!isOpen) return null;

  const toggleCandidate = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 1) {
        setSelectedIds(prev => prev.filter(item => item !== id));
      }
    } else {
      if (selectedIds.length < 4) {
        setSelectedIds(prev => [...prev, id]);
      }
    }
  };

  const activeCandidates: CandidateAssessment[] = selectedIds
    .map(id => RESEARCH_CANDIDATES.find(c => c.candidateId === id)!)
    .filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-space-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-space-900 border border-space-700 rounded-2xl max-w-6xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-white">
        {/* Top bar */}
        <div className="bg-space-950 text-white p-4 flex items-center justify-between border-b border-space-800">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-sky-400" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-sky-300">
              MULTI-CANDIDATE COMPARATIVE MATRIX
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-space-400 hover:text-white rounded hover:bg-space-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Candidate Selector Badges */}
        <div className="p-4 bg-space-950 border-b border-space-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-space-400 font-semibold uppercase text-[11px]">Select (1-4):</span>
            {RESEARCH_CANDIDATES.map(c => {
              const isChecked = selectedIds.includes(c.candidateId);
              return (
                <button
                  key={c.candidateId}
                  onClick={() => toggleCandidate(c.candidateId)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded border transition-all cursor-pointer ${
                    isChecked
                      ? 'bg-sky-500/20 text-sky-300 border-sky-500 font-semibold'
                      : 'bg-space-900 text-space-400 border-space-800 hover:border-space-700 hover:text-white'
                  }`}
                >
                  {isChecked ? <CheckSquare className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5" />}
                  <span>{c.candidateId}</span>
                </button>
              );
            })}
          </div>

          <div className="text-[11px] text-space-400">
            Comparing {activeCandidates.length} exoplanet candidate profiles side-by-side
          </div>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto p-6 text-xs font-mono">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-space-700">
                <th className="p-3 text-left font-bold text-space-400 uppercase w-48">Feature / Metric</th>
                {activeCandidates.map(c => (
                  <th key={c.candidateId} className="p-3 text-left font-bold text-white bg-space-950/60">
                    <div className="text-sm font-mono text-sky-300">{c.candidateId}</div>
                    <div className="text-[11px] font-sans font-normal text-space-400">{c.hostStarName}</div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-space-800 text-space-200">
              {/* Overall Assessment */}
              <tr className="bg-space-950/40">
                <td className="p-3 font-bold text-white">Overall Status</td>
                {activeCandidates.map(c => (
                  <td key={c.candidateId} className="p-3">
                    <DiagnosticStatusBadge status={c.overallStatus} size="sm" />
                  </td>
                ))}
              </tr>

              {/* Data Source */}
              <tr>
                <td className="p-3 font-semibold text-space-400">Data Source</td>
                {activeCandidates.map(c => (
                  <td key={c.candidateId} className="p-3 text-space-300 font-sans">{c.dataSource}</td>
                ))}
              </tr>

              {/* SNR */}
              <tr>
                <td className="p-3 font-semibold text-space-400">Signal-to-Noise (SNR)</td>
                {activeCandidates.map(c => (
                  <td key={c.candidateId} className="p-3 text-white font-bold">{c.dataQuality.signalToNoiseRatio}</td>
                ))}
              </tr>

              {/* Section Header: Pillar 1 */}
              <tr className="bg-sky-950/30 text-sky-300 font-bold">
                <td colSpan={activeCandidates.length + 1} className="p-2 px-3 uppercase tracking-wider text-[11px]">
                  Pillar 1: Chromaticity Module
                </td>
              </tr>

              <tr>
                <td className="p-3 font-semibold text-space-400">Multi-Band Follow-up</td>
                {activeCandidates.map(c => (
                  <td key={c.candidateId} className="p-3">
                    {c.chromaticity.hasMultiBandData ? (
                      <span className="text-emerald-400 font-semibold">Available ({c.chromaticity.filtersUsed.join(', ')})</span>
                    ) : (
                      <span className="text-space-400 italic">None (Single TESS)</span>
                    )}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-semibold text-space-400">Blue vs Red Depth</td>
                {activeCandidates.map(c => (
                  <td key={c.candidateId} className="p-3">
                    {c.chromaticity.hasMultiBandData
                      ? `g: ${c.chromaticity.blueBandDepth}% | z: ${c.chromaticity.redBandDepth}%`
                      : '—'}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-semibold text-space-400">Delta Depth (Δδ)</td>
                {activeCandidates.map(c => (
                  <td key={c.candidateId} className="p-3">
                    {c.chromaticity.hasMultiBandData ? (
                      <span className={c.chromaticity.significanceSigma >= 3 ? 'text-rose-400 font-bold' : 'text-white'}>
                        {c.chromaticity.deltaDepth}% ({c.chromaticity.significanceSigma}σ)
                      </span>
                    ) : '—'}
                  </td>
                ))}
              </tr>

              {/* Section Header: Pillar 2 */}
              <tr className="bg-emerald-950/30 text-emerald-300 font-bold">
                <td colSpan={activeCandidates.length + 1} className="p-2 px-3 uppercase tracking-wider text-[11px]">
                  Pillar 2: Transit Morphology
                </td>
              </tr>

              <tr>
                <td className="p-3 font-semibold text-space-400">Transit Depth</td>
                {activeCandidates.map(c => (
                  <td key={c.candidateId} className="p-3 text-white font-semibold">{c.morphology.transitDepth}%</td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-semibold text-space-400">Total Duration (T14)</td>
                {activeCandidates.map(c => (
                  <td key={c.candidateId} className="p-3">{c.morphology.totalDurationHours} hours</td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-semibold text-space-400">Shape Class</td>
                {activeCandidates.map(c => (
                  <td key={c.candidateId} className="p-3">
                    <span className={c.morphology.shapeConsistency.includes('V-shape') ? 'text-amber-400 font-semibold' : 'text-white'}>
                      {c.morphology.shapeConsistency}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Section Header: Pillar 3 */}
              <tr className="bg-amber-950/30 text-amber-300 font-bold">
                <td colSpan={activeCandidates.length + 1} className="p-2 px-3 uppercase tracking-wider text-[11px]">
                  Pillar 3: Astrophysical Plausibility
                </td>
              </tr>

              <tr>
                <td className="p-3 font-semibold text-space-400">Inferred Radius (Rp)</td>
                {activeCandidates.map(c => (
                  <td key={c.candidateId} className="p-3">
                    <span className={c.plausibility.candidateRadiusJupiter > 2.0 ? 'text-rose-400 font-bold' : 'text-white font-bold'}>
                      {c.plausibility.candidateRadiusEarth} R⊕ ({c.plausibility.candidateRadiusJupiter} RJ)
                    </span>
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-semibold text-space-400">Orbital Period (P)</td>
                {activeCandidates.map(c => (
                  <td key={c.candidateId} className="p-3">{c.plausibility.orbitalPeriodDays} days</td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-semibold text-space-400">Equilibrium Temp</td>
                {activeCandidates.map(c => (
                  <td key={c.candidateId} className="p-3">{c.plausibility.equilibriumTempK} K</td>
                ))}
              </tr>

              {/* Action row */}
              <tr className="bg-space-950">
                <td className="p-3 font-bold text-space-400">Inspect Deep Dive</td>
                {activeCandidates.map(c => (
                  <td key={c.candidateId} className="p-3">
                    <button
                      onClick={() => {
                        onSelectCandidate(c.candidateId);
                        onClose();
                      }}
                      className="inline-flex items-center gap-1 text-sky-400 hover:text-sky-300 font-bold transition-colors cursor-pointer"
                    >
                      <span>Open Workstation</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
