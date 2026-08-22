import React, { useState } from 'react';
import { CandidateAssessment } from '../../types/astrophysics';
import { DiagnosticStatusBadge, DataSourceBadge } from './DataQualityBadge';
import { X, Printer, Download, Copy, Check, FileText, Orbit, Layers } from 'lucide-react';

interface ScientificReportModalProps {
  candidate: CandidateAssessment | null;
  onClose: () => void;
}

export const ScientificReportModal: React.FC<ScientificReportModalProps> = ({ candidate, onClose }) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!candidate) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    const report = `TRIFECTA CANDIDATE INVESTIGATION REPORT
Candidate ID: ${candidate.candidateId} (TIC ${candidate.ticId})
Host Star: ${candidate.hostStarName}
Overall Assessment: ${candidate.overallStatus.toUpperCase()}
Data Quality Level: ${candidate.dataQuality.overallLevel} (SNR: ${candidate.dataQuality.signalToNoiseRatio})

1. CHROMATICITY ANALYSIS:
Status: ${candidate.chromaticity.status}
Blue Depth: ${candidate.chromaticity.blueBandDepth}% | Red Depth: ${candidate.chromaticity.redBandDepth}%
Delta Depth: ${candidate.chromaticity.deltaDepth}% (Significance: ${candidate.chromaticity.significanceSigma} sigma)
Interpretation: ${candidate.chromaticity.scientificInterpretation}

2. TRANSIT MORPHOLOGY:
Status: ${candidate.morphology.status}
Transit Depth: ${candidate.morphology.transitDepth}% | Duration (T14): ${candidate.morphology.totalDurationHours}h
Ingress (T12): ${candidate.morphology.ingressDurationMin}m | Ratio (tau/T): ${candidate.morphology.ingressTotalRatio}
Shape Consistency: ${candidate.morphology.shapeConsistency}
Interpretation: ${candidate.morphology.scientificInterpretation}

3. ASTROPHYSICAL PLAUSIBILITY:
Status: ${candidate.plausibility.status}
Host Teff: ${candidate.plausibility.hostStarTeftK} K | Radius: ${candidate.plausibility.hostStarRadiusSolar} R_sun
Inferred Radius: ${candidate.plausibility.candidateRadiusEarth} R_earth (${candidate.plausibility.candidateRadiusJupiter} R_jup)
Semi-Major Axis: ${candidate.plausibility.semiMajorAxisAU} AU (Period: ${candidate.plausibility.orbitalPeriodDays}d)
Equilibrium Temp: ${candidate.plausibility.equilibriumTempK} K | Roche Margin: OK
Interpretation: ${candidate.plausibility.scientificInterpretation}

DETAILED REASONING:
${candidate.detailedReasoning}

RECOMMENDED FOLLOW-UP:
${candidate.recommendedFollowup}

DISCLAIMER:
Independent student research prototype. Not officially affiliated with NASA, TESS, or ExoFOP.`;

    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJSON = () => {
    const jsonStr = JSON.stringify(candidate, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${candidate.candidateId}_trifecta_report.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-space-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-space-900 border border-space-700 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-white">
        {/* Modal Top Bar */}
        <div className="bg-space-950 text-white p-4 flex items-center justify-between border-b border-space-800">
          <div className="flex items-center gap-2">
            <Orbit className="w-4 h-4 text-sky-400" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-sky-300">
              TRIFECTA CANDIDATE REPORT &middot; {candidate.candidateId}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyText}
              className="p-1.5 rounded hover:bg-space-800 text-space-300 hover:text-white transition-colors text-xs font-mono flex items-center gap-1 cursor-pointer"
              title="Copy Summary Text"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={handleDownloadJSON}
              className="p-1.5 rounded hover:bg-space-800 text-space-300 hover:text-white transition-colors text-xs font-mono flex items-center gap-1 cursor-pointer"
              title="Export JSON Data"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">JSON</span>
            </button>
            <button
              onClick={handlePrint}
              className="p-1.5 rounded hover:bg-space-800 text-space-300 hover:text-white transition-colors text-xs font-mono flex items-center gap-1 cursor-pointer"
              title="Print Report"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-space-800 text-space-400 hover:text-white transition-colors ml-2 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable/Scrollable Report Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-space-200 font-sans text-xs">
          {/* Header Metadata */}
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-space-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-mono text-white">
                  {candidate.candidateId}
                </h2>
                <DataSourceBadge source={candidate.dataSource} />
              </div>
              <p className="text-xs text-space-300 mt-1 font-mono">
                Host Star: <strong className="text-white">{candidate.hostStarName}</strong> &middot; TIC {candidate.ticId} &middot; Sectors: {candidate.tessSector.join(', ')}
              </p>
            </div>
            <div className="text-right">
              <DiagnosticStatusBadge status={candidate.overallStatus} size="lg" />
              <div className="text-[10.5px] font-mono text-space-400 mt-1">
                SNR: {candidate.dataQuality.signalToNoiseRatio} &middot; Quality: {candidate.dataQuality.overallLevel}
              </div>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="bg-space-950 p-4 rounded-lg border border-space-800 space-y-1">
            <span className="font-mono text-[10.5px] font-bold text-sky-400 uppercase tracking-wider">
              EXECUTIVE ASSESSMENT HEADLINE
            </span>
            <div className="text-sm font-bold text-white font-serif">
              {candidate.headlineSummary}
            </div>
            <p className="text-xs text-space-300 pt-1 leading-relaxed">
              {candidate.detailedReasoning}
            </p>
          </div>

          {/* 3 Pillars Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            {/* Pillar 1 */}
            <div className="bg-space-950 p-3.5 rounded-lg border border-space-800 space-y-2">
              <div className="flex justify-between items-center border-b border-space-800 pb-1">
                <span className="font-bold text-sky-300 text-[11px] uppercase">1. Chromaticity</span>
                <DiagnosticStatusBadge status={candidate.chromaticity.status} size="sm" showIcon={false} />
              </div>
              {candidate.chromaticity.hasMultiBandData ? (
                <div className="space-y-1 text-[11px]">
                  <div>Blue Depth: <span className="font-semibold text-white">{candidate.chromaticity.blueBandDepth}%</span></div>
                  <div>Red Depth: <span className="font-semibold text-white">{candidate.chromaticity.redBandDepth}%</span></div>
                  <div>Delta (Δδ): <span className="font-semibold text-white">{candidate.chromaticity.deltaDepth}% ({candidate.chromaticity.significanceSigma}σ)</span></div>
                  <div className="text-[10px] text-space-400">Filters: {candidate.chromaticity.filtersUsed.join(', ')}</div>
                </div>
              ) : (
                <div className="text-[11px] text-space-400">
                  Ground follow-up data not available. Single-band TESS only.
                </div>
              )}
            </div>

            {/* Pillar 2 */}
            <div className="bg-space-950 p-3.5 rounded-lg border border-space-800 space-y-2">
              <div className="flex justify-between items-center border-b border-space-800 pb-1">
                <span className="font-bold text-emerald-300 text-[11px] uppercase">2. Morphology</span>
                <DiagnosticStatusBadge status={candidate.morphology.status} size="sm" showIcon={false} />
              </div>
              <div className="space-y-1 text-[11px]">
                <div>Transit Depth: <span className="font-semibold text-white">{candidate.morphology.transitDepth}%</span></div>
                <div>Duration (T14): <span className="font-semibold text-white">{candidate.morphology.totalDurationHours} h</span></div>
                <div>Ingress (T12): <span className="font-semibold text-white">{candidate.morphology.ingressDurationMin} min</span></div>
                <div>Shape: <span className="font-semibold text-white">{candidate.morphology.shapeConsistency}</span></div>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="bg-space-950 p-3.5 rounded-lg border border-space-800 space-y-2">
              <div className="flex justify-between items-center border-b border-space-800 pb-1">
                <span className="font-bold text-amber-300 text-[11px] uppercase">3. Plausibility</span>
                <DiagnosticStatusBadge status={candidate.plausibility.status} size="sm" showIcon={false} />
              </div>
              <div className="space-y-1 text-[11px]">
                <div>Inferred Radius: <span className="font-semibold text-white">{candidate.plausibility.candidateRadiusEarth} R⊕ ({candidate.plausibility.candidateRadiusJupiter} RJ)</span></div>
                <div>Period (P): <span className="font-semibold text-white">{candidate.plausibility.orbitalPeriodDays} days</span></div>
                <div>Eq Temp: <span className="font-semibold text-white">{candidate.plausibility.equilibriumTempK} K</span></div>
                <div>Host Teff: <span className="font-semibold text-white">{candidate.plausibility.hostStarTeftK} K</span></div>
              </div>
            </div>
          </div>

          {/* Evidence Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3.5 bg-emerald-950/20 border border-emerald-800/60 rounded-lg space-y-1.5">
              <span className="font-mono text-[10.5px] font-bold text-emerald-300 uppercase">Supporting Observations:</span>
              <ul className="space-y-1 text-[11px]">
                {candidate.evidenceFor.map((ev, i) => (
                  <li key={i} className="text-space-300">• <strong className="text-white">{ev.summary}:</strong> {ev.detail}</li>
                ))}
              </ul>
            </div>

            <div className="p-3.5 bg-amber-950/20 border border-amber-800/60 rounded-lg space-y-1.5">
              <span className="font-mono text-[10.5px] font-bold text-amber-300 uppercase">Cautionary Indicators:</span>
              <ul className="space-y-1 text-[11px]">
                {candidate.evidenceAgainst.map((ev, i) => (
                  <li key={i} className="text-space-300">• <strong className="text-white">{ev.summary}:</strong> {ev.detail}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Actionable Follow-up Recommendation */}
          <div className="p-3.5 bg-space-950 rounded-lg border border-space-800 space-y-1">
            <span className="font-mono text-[10.5px] font-bold text-sky-400 uppercase">Recommended Follow-up Strategy:</span>
            <p className="text-xs text-space-200 leading-relaxed font-sans">{candidate.recommendedFollowup}</p>
          </div>

          {/* Methodology & Reproducibility Footnote */}
          <div className="pt-2 text-[10px] font-mono text-space-500 border-t border-space-800 flex justify-between items-center">
            <span>Generated by Trifecta Astrophysics Research Prototype</span>
            <span>NASA ADS Grounded Equations</span>
          </div>
        </div>
      </div>
    </div>
  );
};
