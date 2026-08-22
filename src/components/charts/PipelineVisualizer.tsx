import React, { useState } from 'react';
import { PIPELINE_STEPS_DETAILED } from '../../data/researchLog';
import { PipelineStepDetail } from '../../types/astrophysics';
import {
  Database,
  ShieldCheck,
  Activity,
  SlidersHorizontal,
  FileCheck,
  ChevronRight,
  ChevronLeft,
  Info,
  CheckCircle2,
  Cpu,
  Layers,
  Sparkles,
  Telescope,
  Radio,
  Orbit,
  Palette
} from 'lucide-react';
import { ScientificNote } from '../common/ScientificNote';

export const PipelineVisualizer: React.FC = () => {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(6); // Default to Pillar 1 Chromaticity

  const currentStep: PipelineStepDetail =
    PIPELINE_STEPS_DETAILED.find(s => s.stepIndex === activeStepIndex) || PIPELINE_STEPS_DETAILED[0];

  // Pipeline flow items (Directive 11)
  const pipelineFlow = [
    { label: 'STAR FIELD', desc: 'Target & Field Stars', icon: Telescope },
    { label: 'TESS OBSERVATION', desc: '21″/pix CCD Cadence', icon: Radio },
    { label: 'PHOTOMETRY', desc: 'Normalized Flux F(t)', icon: Activity },
    { label: 'TRANSIT SIGNAL', desc: 'Phase-Folded Dip', icon: Sparkles },
    { label: 'CANDIDATE', desc: 'TOI / Threshold Crossing', icon: Orbit },
    { label: 'TRIFECTA ANALYSIS', desc: '3 Physical Lenses', icon: Palette },
  ];

  return (
    <div className="bg-space-900/90 dark:bg-space-950/90 border border-space-700/80 rounded-xl p-6 shadow-2xl space-y-6 relative overflow-hidden backdrop-blur-md">
      {/* Background Reticle */}
      <div className="absolute inset-0 bg-celestial-grid opacity-20 pointer-events-none" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-space-700/60 pb-4 relative z-10">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-400">
            SECTION 03: COMPUTATIONAL OBSERVATION PIPELINE
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-white font-mono mt-1">
            From Sky Photons to Physics-Informed Triage
          </h3>
          <p className="text-xs sm:text-sm text-space-300 mt-1 max-w-2xl font-sans">
            Follow how wide-field celestial measurements are transformed into calibrated time series and evaluated through Trifecta’s modular screening stages.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={() => setActiveStepIndex(prev => Math.max(1, prev - 1))}
            disabled={activeStepIndex === 1}
            className="p-1.5 rounded border border-space-700 text-space-300 disabled:opacity-30 hover:bg-space-800 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-bold text-white px-2">
            Phase 0{currentStep.stepIndex} / 10
          </span>
          <button
            onClick={() => setActiveStepIndex(prev => Math.min(10, prev + 1))}
            disabled={activeStepIndex === 10}
            className="p-1.5 rounded border border-space-700 text-space-300 disabled:opacity-30 hover:bg-space-800 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Directive 11: Scientific Observation Pipeline Flow Banner */}
      <div className="bg-space-950 p-4 rounded-xl border border-space-800 relative z-10 space-y-3">
        <div className="text-[11px] font-mono font-bold text-sky-400 uppercase tracking-wider flex items-center justify-between">
          <span>THE SCIENTIFIC OBSERVATION PIPELINE</span>
          <span className="text-space-500 font-normal">Instrumentation Architecture</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {pipelineFlow.map((flow, i) => {
            const Icon = flow.icon;
            return (
              <div key={i} className="bg-space-900/80 p-3 rounded-lg border border-space-800 flex flex-col justify-between space-y-2 relative">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-space-500 font-bold">0{i + 1}</span>
                  <Icon className="w-4 h-4 text-sky-400" />
                </div>
                <div>
                  <div className="text-xs font-mono font-bold text-white">{flow.label}</div>
                  <div className="text-[10.5px] text-space-400 font-sans mt-0.5 leading-snug">{flow.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 10-Step Horizontal Stepper */}
      <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-1.5 relative z-10">
        {PIPELINE_STEPS_DETAILED.map((step) => {
          const isSelected = step.stepIndex === activeStepIndex;
          const isPillar = step.stepIndex >= 6 && step.stepIndex <= 8;
          return (
            <button
              key={step.id}
              onClick={() => setActiveStepIndex(step.stepIndex)}
              className={`p-2 rounded-lg border text-left transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-space-850 text-white border-sky-400 shadow-lg shadow-sky-950/60 ring-1 ring-sky-400/50'
                  : isPillar
                  ? 'bg-sky-950/30 text-sky-200 border-sky-800/50 hover:bg-sky-950/50'
                  : 'bg-space-900/40 text-space-300 border-space-800 hover:border-space-700'
              }`}
            >
              <div className="text-[10px] font-mono font-bold opacity-70">
                0{step.stepIndex}
              </div>
              <div className="text-[10.5px] font-semibold leading-tight line-clamp-2 mt-1">
                {step.name.replace('Pillar ', 'P')}
              </div>
              <div className="mt-1.5 text-[8.5px] font-mono uppercase tracking-tighter opacity-60">
                {step.category}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Phase Detailed Inspector Box */}
      <div className="bg-space-950 rounded-xl p-5 border border-space-800 space-y-4 relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-space-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold uppercase text-sky-300 bg-sky-950 px-2 py-0.5 rounded border border-sky-800">
                PHASE 0{currentStep.stepIndex} SPECIFICATION
              </span>
              <span className="text-xs font-mono text-space-400">{currentStep.category}</span>
            </div>
            <h4 className="text-lg font-bold text-white font-mono mt-1">
              {currentStep.name}
            </h4>
          </div>

          <div className="text-xs text-space-300 font-serif italic max-w-md">
            "{currentStep.scientificRationale}"
          </div>
        </div>

        {/* 4-Quadrant Technical Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
          {/* Inputs */}
          <div className="bg-space-900 p-3.5 rounded-lg border border-space-800 space-y-2">
            <div className="text-[10.5px] font-bold text-sky-400 uppercase flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-sky-400" />
              <span>Input Data</span>
            </div>
            <ul className="space-y-1 text-space-300 font-sans text-[11px]">
              {currentStep.inputs.map((inp, idx) => (
                <li key={idx} className="flex items-start gap-1">
                  <span className="text-sky-400 font-mono">•</span>
                  <span>{inp}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Operations */}
          <div className="bg-space-900 p-3.5 rounded-lg border border-space-800 space-y-2">
            <div className="text-[10.5px] font-bold text-emerald-400 uppercase flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              <span>Algorithms</span>
            </div>
            <ul className="space-y-1 text-space-300 font-sans text-[11px]">
              {currentStep.operations.map((op, idx) => (
                <li key={idx} className="flex items-start gap-1">
                  <span className="text-emerald-400 font-mono">•</span>
                  <span>{op}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quality Controls */}
          <div className="bg-space-900 p-3.5 rounded-lg border border-space-800 space-y-2">
            <div className="text-[10.5px] font-bold text-amber-400 uppercase flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Quality Checks</span>
            </div>
            <ul className="space-y-1 text-space-300 font-sans text-[11px]">
              {currentStep.qualityControls.map((qc, idx) => (
                <li key={idx} className="flex items-start gap-1">
                  <span className="text-amber-400 font-mono">•</span>
                  <span>{qc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Outputs */}
          <div className="bg-space-900 p-3.5 rounded-lg border border-space-800 space-y-2">
            <div className="text-[10.5px] font-bold text-sky-400 uppercase flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5 text-sky-400" />
              <span>Outputs</span>
            </div>
            <ul className="space-y-1 text-space-300 font-sans text-[11px]">
              {currentStep.outputs.map((out, idx) => (
                <li key={idx} className="flex items-start gap-1">
                  <span className="text-sky-400 font-mono">•</span>
                  <span>{out}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Known Limitations Bar */}
        <div className="bg-amber-950/30 border border-amber-900/60 rounded-lg p-3 text-xs text-amber-300 flex items-start gap-2">
          <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="font-mono text-[10.5px] uppercase">Phase Limitation / Boundary: </strong>
            <span className="font-sans text-[11px]">{currentStep.limitations}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
