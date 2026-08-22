import React, { useState } from 'react';
import {
  Database,
  Filter,
  Activity,
  SlidersHorizontal,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  Cpu,
  Layers,
  ChevronRight,
  Info
} from 'lucide-react';
import { ScientificNote } from '../common/ScientificNote';

interface PipelineStep {
  id: string;
  stepNum: string;
  title: string;
  shortDesc: string;
  detailedSpecs: {
    inputs: string[];
    operations: string[];
    qualityChecks: string[];
    outputs: string[];
  };
}

export const WorkflowPipelineSection: React.FC = () => {
  const [selectedStepId, setSelectedStepId] = useState<string>('qc');

  const steps: PipelineStep[] = [
    {
      id: 'sources',
      stepNum: '01',
      title: 'Data Ingestion & Multi-Source Harvest',
      shortDesc: 'Aggregates broad-band TESS SPOC light curves, ground-based multi-color follow-up (ExoFOP), and stellar catalog parameters (Gaia / TIC).',
      detailedSpecs: {
        inputs: ['TESS calibrated 2-min cadence SPOC FITS files', 'ExoFOP multi-filter ground photometry (g, r, i, z)', 'TIC v8.2 & Gaia DR3 stellar parameters'],
        operations: ['Parse FITS light curve tables', 'Extract BJD timestamps, SAP & PDCSAP fluxes', 'Match coordinate cross-identifications'],
        qualityChecks: ['Check timestamp continuity', 'Flag missing header metadata', 'Filter compatibility check'],
        outputs: ['Standardized multi-band time-series arrays', 'Host stellar parameter dictionary']
      }
    },
    {
      id: 'qc',
      stepNum: '02',
      title: 'Quality Control & Data Integrity Screening',
      shortDesc: 'Before any physics is computed, rigorous data quality checks prevent misleading classifications from photometric artifacts.',
      detailedSpecs: {
        inputs: ['Raw time-series flux arrays', 'Measurement uncertainty vectors', 'Instrument quality flags'],
        operations: ['3-sigma outlier clipping on out-of-transit baseline', 'Detection of photometric data gaps', 'Signal-to-noise ratio (SNR) assessment'],
        qualityChecks: ['Sufficient out-of-transit baseline (>3x duration)', 'Photometric precision threshold (>5 SNR)', 'Timestamp monotonicity'],
        outputs: ['Cleaned, mask-verified light curve data', 'Data quality rating (Good / Marginal / Insufficient)']
      }
    },
    {
      id: 'detrending',
      stepNum: '03',
      title: 'Normalization & Stellar Detrending',
      shortDesc: 'Removes long-term stellar variability and instrumental baseline drift while preserving transit shape.',
      detailedSpecs: {
        inputs: ['Cleaned time-series flux', 'Identified transit center ephemeris (t0, P)'],
        operations: ['Mask in-transit points', 'Fit iterative Gaussian Process / spline baseline', 'Normalize baseline median to 1.0000'],
        qualityChecks: ['Ensure transit depth is not attenuated by detrending filter', 'Inspect residual baseline flatness'],
        outputs: ['Normalized phase-folded light curve with zero-centered transit']
      }
    },
    {
      id: 'features',
      stepNum: '04',
      title: 'Feature Extraction & Analytical Modeling',
      shortDesc: 'Fits Mandel-Agol quadratic limb-darkening transit profiles and extracts geometric timing parameters.',
      detailedSpecs: {
        inputs: ['Normalized phased light curves (TESS & multi-band follow-up)'],
        operations: ['Levenberg-Marquardt & MCMC transit profile fitting', 'Extract transit depth (δ), total duration (T14), ingress (T12)', 'Compute symmetry index and residual RMS'],
        qualityChecks: ['Fit convergence verification', 'Check parameter covariance matrix', 'Residual Gaussianity test (Kolmogorov-Smirnov)'],
        outputs: ['Transit parameter vectors with robust error bounds']
      }
    },
    {
      id: 'diagnostics',
      stepNum: '05',
      title: 'Trifecta Three-Pillar Diagnostic Engine',
      shortDesc: 'Applies Chromaticity (Pillar 1), Morphology (Pillar 2), and Astrophysical Plausibility (Pillar 3) in parallel.',
      detailedSpecs: {
        inputs: ['Extracted transit features', 'Multi-band depth measurements', 'Host star mass, radius, and temperature'],
        operations: ['Calculate chromatic difference significance: σ = |Δδ| / sqrt(σ_b² + σ_r²)', 'Assess ingress-to-total ratio τ/T for grazing geometry', 'Evaluate candidate radius Rp, Teq, S_inc, and Roche boundary'],
        qualityChecks: ['Verify if multi-band data is available (bypass Pillar 1 gracefully if absent)', 'Flag parameter space anomalies without hard universal cutoffs'],
        outputs: ['Three independent diagnostic status reports and quantitative significance metrics']
      }
    },
    {
      id: 'evidence',
      stepNum: '06',
      title: 'Evidence Fusion & Explainable Assessment',
      shortDesc: 'Synthesizes diagnostic outputs into a transparent classification category with full contextual justification.',
      detailedSpecs: {
        inputs: ['Pillar 1, 2, 3 diagnostic vectors', 'Data quality ratings', 'Astrophysical flags'],
        operations: ['Evaluate combined risk matrix', 'Categorize into: Low Concern / Review Required / Potential False-Positive / Insufficient Data', 'Synthesize natural language justification for every flag'],
        qualityChecks: ['Ensure transparent justification is generated for all flags', 'Cross-verify recommendation against follow-up needs'],
        outputs: ['Explainable Candidate Report', 'Targeted Ground Follow-up Recommendations']
      }
    }
  ];

  const currentStep = steps.find(s => s.id === selectedStepId) || steps[0];

  return (
    <section id="pipeline" className="py-16 bg-slate-50/60 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="max-w-3xl space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-700">
            SECTION 03: ARCHITECTURE &amp; METHODOLOGY
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-mono">
            The Trifecta Research Pipeline
          </h2>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-serif">
            A modular, reproducible computational framework designed to transform raw survey photometry and follow-up data into interpretable, physics-informed screening assessments.
          </p>
        </div>

        {/* Horizontal Pipeline Steps Track */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {steps.map((step) => {
            const isSelected = step.id === selectedStepId;
            return (
              <button
                key={step.id}
                onClick={() => setSelectedStepId(step.id)}
                className={`p-3 text-left rounded-lg border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white border-blue-600 shadow-md ring-1 ring-blue-600/20'
                    : 'bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-mono font-bold ${isSelected ? 'text-blue-600' : 'text-slate-400'}`}>
                      PHASE {step.stepNum}
                    </span>
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
                  </div>
                  <div className={`text-xs font-semibold leading-snug ${isSelected ? 'text-slate-950' : 'text-slate-700'}`}>
                    {step.title.split('&')[0]}
                  </div>
                </div>
                <div className="text-[10.5px] font-mono text-slate-400 mt-2 flex items-center gap-1">
                  <span>Inspect Phase</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Step Detailed Inspection Panel */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-blue-700 uppercase bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  PHASE {currentStep.stepNum} SPECIFICATION
                </span>
                <span className="text-xs font-mono text-slate-500">Pipeline Module</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mt-1">
                {currentStep.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 font-sans">
                {currentStep.shortDesc}
              </p>
            </div>
          </div>

          {/* 4 Technical Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
            {/* 1. Inputs */}
            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-2">
              <div className="text-[10.5px] font-bold text-slate-700 uppercase flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-blue-600" />
                <span>Input Data</span>
              </div>
              <ul className="space-y-1.5 text-slate-600 font-sans text-[11.5px]">
                {currentStep.detailedSpecs.inputs.map((inp, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-blue-500 font-mono">•</span>
                    <span>{inp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 2. Operations */}
            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-2">
              <div className="text-[10.5px] font-bold text-slate-700 uppercase flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-emerald-600" />
                <span>Computational Operations</span>
              </div>
              <ul className="space-y-1.5 text-slate-600 font-sans text-[11.5px]">
                {currentStep.detailedSpecs.operations.map((op, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-500 font-mono">•</span>
                    <span>{op}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 3. Quality Checks */}
            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-2">
              <div className="text-[10.5px] font-bold text-slate-700 uppercase flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                <span>Data Quality Checks</span>
              </div>
              <ul className="space-y-1.5 text-slate-600 font-sans text-[11.5px]">
                {currentStep.detailedSpecs.qualityChecks.map((qc, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-amber-500 font-mono">•</span>
                    <span>{qc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 4. Outputs */}
            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-2">
              <div className="text-[10.5px] font-bold text-slate-700 uppercase flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5 text-sky-600" />
                <span>Outputs &amp; Reports</span>
              </div>
              <ul className="space-y-1.5 text-slate-600 font-sans text-[11.5px]">
                {currentStep.detailedSpecs.outputs.map((out, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-sky-500 font-mono">•</span>
                    <span>{out}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Data Quality & Statistical Thinking Callouts (Sections 16 & 17) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <h4 className="text-sm font-bold font-mono text-slate-900 uppercase">
                Before Physics Comes Data Quality
              </h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              The framework does not blindly execute physical fits on degraded data. Missing follow-up observations, low SNR, light curve gaps, and irregular baseline slopes cause candidates to be assigned an explicit status of <strong>Insufficient Data</strong> rather than generating an ungrounded scientific classification.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600" />
              <h4 className="text-sm font-bold font-mono text-slate-900 uppercase">
                From Rules to Statistical Evidence
              </h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              Trifecta rejects arbitrary binary thresholds. A candidate is not discarded simply because blue depth \(\ne\) red depth; the difference must be statistically distinguishable from measurement uncertainty (\(\sigma \ge 3.0\)). Morphology is evaluated as a likelihood shift rather than an absolute rule.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
