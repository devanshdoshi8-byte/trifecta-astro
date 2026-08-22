import React, { useState, useMemo } from 'react';
import { LightCurvePoint } from '../../types/astrophysics';
import {
  fitMandelAgolTransit,
  evaluateMandelAgolModel,
  TransitFitParameters,
  TransitFitResult
} from '../../utils/transitFittingEngine';
import { DataSourceBadge } from '../common/DataQualityBadge';
import {
  Play,
  RotateCcw,
  Sparkles,
  Sliders,
  CheckCircle2,
  Activity,
  Layers,
  Info,
  Cpu,
  BarChart2
} from 'lucide-react';

interface NumericalTransitFitterProps {
  dataPoints: LightCurvePoint[];
  orbitalPeriodDays?: number;
  candidateTitle?: string;
}

export const NumericalTransitFitter: React.FC<NumericalTransitFitterProps> = ({
  dataPoints,
  orbitalPeriodDays = 10.5,
  candidateTitle = 'Candidate Time-Series'
}) => {
  const [isFitting, setIsFitting] = useState<boolean>(false);
  const [fitResult, setFitResult] = useState<TransitFitResult | null>(null);

  // Manual interactive parameter tweaks
  const [manualK, setManualK] = useState<number>(0.092);
  const [manualB, setManualB] = useState<number>(0.20);
  const [manualAR, setManualAR] = useState<number>(14.5);
  const [showResiduals, setShowResiduals] = useState<boolean>(true);

  // Initial fit run on mount or data change
  const defaultFit = useMemo(() => {
    try {
      return fitMandelAgolTransit(dataPoints, {}, orbitalPeriodDays, 25);
    } catch {
      return null;
    }
  }, [dataPoints, orbitalPeriodDays]);

  const activeResult = fitResult || defaultFit;

  const handleRunOptimizer = () => {
    setIsFitting(true);
    setTimeout(() => {
      try {
        const result = fitMandelAgolTransit(
          dataPoints,
          { radiusRatio: manualK, impactParameter: manualB, scaledSemiMajorAxis: manualAR },
          orbitalPeriodDays,
          35
        );
        setFitResult(result);
        setManualK(result.fittedParams.radiusRatio);
        setManualB(result.fittedParams.impactParameter);
        setManualAR(result.fittedParams.scaledSemiMajorAxis);
      } catch (err) {
        console.error('Fit error:', err);
      } finally {
        setIsFitting(false);
      }
    }, 200);
  };

  const handleResetManual = () => {
    if (defaultFit) {
      setFitResult(defaultFit);
      setManualK(defaultFit.fittedParams.radiusRatio);
      setManualB(defaultFit.fittedParams.impactParameter);
      setManualAR(defaultFit.fittedParams.scaledSemiMajorAxis);
    }
  };

  // Compute live SVG dimensions
  const minTime = Math.min(...dataPoints.map(p => p.time));
  const maxTime = Math.max(...dataPoints.map(p => p.time));
  const timeRange = maxTime - minTime || 1;

  const minFlux = Math.min(...dataPoints.map(p => p.flux));
  const maxFlux = Math.max(...dataPoints.map(p => p.flux));
  const fluxRange = (maxFlux - minFlux) * 1.15 || 0.01;
  const fluxBase = minFlux - fluxRange * 0.05;

  const svgWidth = 600;
  const mainPlotHeight = 180;
  const residPlotHeight = 70;

  const scaleX = (t: number) => 40 + ((t - minTime) / timeRange) * (svgWidth - 60);
  const scaleY = (f: number) => 15 + (1 - (f - fluxBase) / fluxRange) * (mainPlotHeight - 30);
  const scaleResidY = (rPpm: number) => mainPlotHeight + 20 + 25 - (rPpm / 800) * 20;

  // Build SVG path for continuous Mandel-Agol model
  const modelPath = useMemo(() => {
    if (!activeResult) return '';
    const pts = activeResult.fittedModelPoints;
    if (!pts || pts.length === 0) return '';

    return pts
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(p.time).toFixed(1)} ${scaleY(p.flux).toFixed(1)}`)
      .join(' ');
  }, [activeResult, minTime, maxTime, fluxBase, fluxRange]);

  return (
    <div className="bg-space-900/90 border border-space-700/80 rounded-xl p-5 shadow-2xl space-y-4 text-white font-mono text-xs relative overflow-hidden backdrop-blur-md">
      {/* Background Reticle */}
      <div className="absolute inset-0 bg-celestial-grid opacity-20 pointer-events-none" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-space-800 pb-3 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sky-400 text-xs uppercase flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-sky-400" />
              <span>NUMERICAL MANDEL &amp; AGOL (2002) LEAST-SQUARES FITTER</span>
            </span>
            <DataSourceBadge source="OBSERVATIONAL DATA" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
            Non-Linear Quadratic Limb-Darkening Solver
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetManual}
            className="px-2.5 py-1 text-xs text-space-300 bg-space-850 hover:bg-space-800 border border-space-700 rounded transition-colors flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>

          <button
            onClick={handleRunOptimizer}
            disabled={isFitting}
            className="px-3.5 py-1 text-xs font-bold text-space-950 bg-sky-400 hover:bg-sky-300 rounded shadow-lg shadow-sky-950/50 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isFitting ? 'Optimizing Parameters...' : 'Run Levenberg-Marquardt Fit'}</span>
          </button>
        </div>
      </div>

      {/* Main Fitting Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 relative z-10">
        {/* SVG Light Curve & Residuals Canvas */}
        <div className="lg:col-span-8 bg-space-950 p-3 rounded-lg border border-space-800 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-space-400 border-b border-space-800/80 pb-1 px-1">
            <span className="text-white font-bold">{candidateTitle}</span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-space-400" />
                <span>Photometric Points</span>
              </span>
              <span className="flex items-center gap-1 text-sky-400 font-bold">
                <span className="w-3 h-0.5 bg-sky-400" />
                <span>Mandel-Agol Model</span>
              </span>
            </div>
          </div>

          <svg viewBox={`0 0 ${svgWidth} ${mainPlotHeight + (showResiduals ? residPlotHeight : 0)}`} className="w-full h-auto">
            {/* Plot Background Grid */}
            <rect x="35" y="10" width={svgWidth - 50} height={mainPlotHeight - 20} fill="#030712" stroke="#1e293b" strokeWidth="0.8" />
            <line x1="35" y1={scaleY(1.0)} x2={svgWidth - 15} y2={scaleY(1.0)} stroke="#334155" strokeDasharray="3,3" />

            {/* Y-Axis Flux labels */}
            <text x="30" y={scaleY(1.0)} textAnchor="end" fill="#94a3b8" fontSize="8">1.000</text>
            <text x="30" y={scaleY(minFlux)} textAnchor="end" fill="#94a3b8" fontSize="8">{minFlux.toFixed(3)}</text>

            {/* Data Points with error bars */}
            {dataPoints.map((pt, idx) => {
              const cx = scaleX(pt.time);
              const cy = scaleY(pt.flux);
              return (
                <g key={idx}>
                  <circle cx={cx} cy={cy} r="2.2" fill="#94a3b8" opacity="0.85" />
                </g>
              );
            })}

            {/* Continuous Mandel-Agol Best Fit Line */}
            {modelPath && (
              <path
                d={modelPath}
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2.2"
                strokeLinecap="round"
                className="drop-shadow-[0_0_8px_rgba(56,189,248,0.6)]"
              />
            )}

            {/* Residuals Sub-Plot */}
            {showResiduals && activeResult && (
              <g>
                <rect
                  x="35"
                  y={mainPlotHeight + 10}
                  width={svgWidth - 50}
                  height={residPlotHeight - 20}
                  fill="#030712"
                  stroke="#1e293b"
                  strokeWidth="0.8"
                />
                <line
                  x1="35"
                  y1={mainPlotHeight + 20 + 25}
                  x2={svgWidth - 15}
                  y2={mainPlotHeight + 20 + 25}
                  stroke="#334155"
                  strokeDasharray="2,2"
                />
                <text x="30" y={mainPlotHeight + 20 + 28} textAnchor="end" fill="#64748b" fontSize="7.5">
                  0 ppm
                </text>
                <text x="40" y={mainPlotHeight + 22} textAnchor="start" fill="#64748b" fontSize="7">
                  Residuals (O - C)
                </text>

                {activeResult.residuals.map((r, i) => {
                  const rx = scaleX(r.time);
                  const ry = Math.max(
                    mainPlotHeight + 12,
                    Math.min(mainPlotHeight + residPlotHeight - 12, scaleResidY(r.residualPpm))
                  );
                  return (
                    <circle
                      key={i}
                      cx={rx}
                      cy={ry}
                      r="1.8"
                      fill={Math.abs(r.residualPpm) > 400 ? '#f87171' : '#34d399'}
                      opacity="0.8"
                    />
                  );
                })}
              </g>
            )}

            {/* X-Axis labels */}
            <text x={scaleX(minTime)} y={mainPlotHeight + (showResiduals ? residPlotHeight - 2 : -2)} textAnchor="start" fill="#64748b" fontSize="8">
              {minTime.toFixed(1)}h
            </text>
            <text x={scaleX(0)} y={mainPlotHeight + (showResiduals ? residPlotHeight - 2 : -2)} textAnchor="middle" fill="#38bdf8" fontSize="8" fontWeight="bold">
              Transit Center (t₀)
            </text>
            <text x={scaleX(maxTime)} y={mainPlotHeight + (showResiduals ? residPlotHeight - 2 : -2)} textAnchor="end" fill="#64748b" fontSize="8">
              +{maxTime.toFixed(1)}h
            </text>
          </svg>
        </div>

        {/* Parameter Telemetry & Interactive Sliders */}
        <div className="lg:col-span-4 space-y-3">
          {/* Optimization Stats Card */}
          {activeResult && (
            <div className="bg-space-950 p-3 rounded-lg border border-space-800 space-y-2">
              <div className="text-[10.5px] font-bold text-sky-400 uppercase flex items-center justify-between">
                <span>Levenberg-Marquardt Output</span>
                <span className="text-emerald-400 font-bold">
                  {activeResult.converged ? '✓ Converged' : 'Optimized'} ({activeResult.iterations} iters)
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 bg-space-900 rounded border border-space-800">
                  <div className="text-space-400 text-[10px]">Radius Ratio (Rp/R*)</div>
                  <div className="text-white font-bold text-xs mt-0.5">
                    {activeResult.fittedParams.radiusRatio.toFixed(4)}
                  </div>
                  <div className="text-[9.5px] text-space-500">± {activeResult.paramErrors.radiusRatio}</div>
                </div>

                <div className="p-2 bg-space-900 rounded border border-space-800">
                  <div className="text-space-400 text-[10px]">Impact Param (b)</div>
                  <div className="text-white font-bold text-xs mt-0.5">
                    {activeResult.fittedParams.impactParameter.toFixed(3)}
                  </div>
                  <div className="text-[9.5px] text-space-500">± {activeResult.paramErrors.impactParameter}</div>
                </div>

                <div className="p-2 bg-space-900 rounded border border-space-800">
                  <div className="text-space-400 text-[10px]">Semi-Major Axis (a/R*)</div>
                  <div className="text-white font-bold text-xs mt-0.5">
                    {activeResult.fittedParams.scaledSemiMajorAxis.toFixed(2)}
                  </div>
                  <div className="text-[9.5px] text-space-500">± {activeResult.paramErrors.scaledSemiMajorAxis}</div>
                </div>

                <div className="p-2 bg-space-900 rounded border border-space-800">
                  <div className="text-space-400 text-[10px]">Residual RMS (ppm)</div>
                  <div className="text-emerald-400 font-bold text-xs mt-0.5">
                    {activeResult.residualRmsPpm} ppm
                  </div>
                  <div className="text-[9.5px] text-space-500">χ²_ν = {activeResult.reducedChi2}</div>
                </div>
              </div>
            </div>
          )}

          {/* Interactive Sliders for Sensitivity Comparison */}
          <div className="bg-space-950 p-3 rounded-lg border border-space-800 space-y-2.5">
            <div className="text-[10.5px] font-bold text-space-300 uppercase flex items-center justify-between">
              <span>Interactive Parameter Tweaker</span>
              <Sliders className="w-3.5 h-3.5 text-sky-400" />
            </div>

            {/* Slider 1: k */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10.5px]">
                <span className="text-space-400">Radius Ratio (k):</span>
                <span className="text-white font-bold">{manualK.toFixed(4)} ({(manualK * manualK * 100).toFixed(3)}% depth)</span>
              </div>
              <input
                type="range"
                min="0.02"
                max="0.30"
                step="0.002"
                value={manualK}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setManualK(val);
                  if (activeResult) {
                    setFitResult({
                      ...activeResult,
                      fittedParams: { ...activeResult.fittedParams, radiusRatio: val }
                    });
                  }
                }}
                className="w-full h-1 bg-space-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
              />
            </div>

            {/* Slider 2: b */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10.5px]">
                <span className="text-space-400">Impact Parameter (b):</span>
                <span className={manualB > 0.8 ? 'text-amber-400 font-bold' : 'text-white'}>
                  {manualB.toFixed(2)} {manualB > 0.8 ? '(Grazing)' : '(Central)'}
                </span>
              </div>
              <input
                type="range"
                min="0.0"
                max="0.95"
                step="0.02"
                value={manualB}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setManualB(val);
                  if (activeResult) {
                    setFitResult({
                      ...activeResult,
                      fittedParams: { ...activeResult.fittedParams, impactParameter: val }
                    });
                  }
                }}
                className="w-full h-1 bg-space-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
              />
            </div>

            {/* Slider 3: a/R* */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10.5px]">
                <span className="text-space-400">Scaled a/R*:</span>
                <span className="text-white">{manualAR.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="4.0"
                max="40.0"
                step="0.5"
                value={manualAR}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setManualAR(val);
                  if (activeResult) {
                    setFitResult({
                      ...activeResult,
                      fittedParams: { ...activeResult.fittedParams, scaledSemiMajorAxis: val }
                    });
                  }
                }}
                className="w-full h-1 bg-space-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
