import React, { useState, useMemo } from 'react';
import { LightCurvePoint } from '../../types/astrophysics';
import { binLightCurve, phaseFoldTimeSeries } from '../../utils/physicsEngine';
import { ZoomIn, ZoomOut, RotateCcw, Sliders, Layers, Eye } from 'lucide-react';

interface LightCurvePlotProps {
  tessPoints: LightCurvePoint[];
  bluePoints?: LightCurvePoint[];
  redPoints?: LightCurvePoint[];
  rawUnfoldedPoints?: LightCurvePoint[];
  title?: string;
  showMultiBandToggle?: boolean;
  transitDepthPercent?: number;
  ingressDurationMin?: number;
  totalDurationHours?: number;
  showResiduals?: boolean;
  height?: number;
  periodDays?: number;
  epochBjd?: number;
}

export const LightCurvePlot: React.FC<LightCurvePlotProps> = ({
  tessPoints,
  bluePoints,
  redPoints,
  rawUnfoldedPoints,
  title = 'Phased Light Curve Photometry',
  showMultiBandToggle = true,
  transitDepthPercent,
  showResiduals = true,
  height = 360,
  periodDays = 10.0,
  epochBjd = 2459003.2
}) => {
  // View states
  const [viewMode, setViewMode] = useState<'phased' | 'raw_unfolded'>('phased');
  const [activeBandView, setActiveBandView] = useState<'all' | 'tess' | 'ground_multiband'>('all');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffsetX, setPanOffsetX] = useState<number>(0);
  const [binningHours, setBinningHours] = useState<number>(0); // 0 = unbinned
  const [hoveredPoint, setHoveredPoint] = useState<LightCurvePoint | null>(null);

  const hasMultiBand = Boolean(bluePoints?.length && redPoints?.length);
  const hasRawData = Boolean(rawUnfoldedPoints?.length);

  // Active series points before binning
  const rawSeries = useMemo(() => {
    if (viewMode === 'raw_unfolded' && hasRawData) {
      return [{
        name: 'TESS Raw Unfolded (BJD)',
        color: '#0f172a',
        darkColor: '#f8fafc',
        points: rawUnfoldedPoints || [],
        dotColor: '#475569',
        darkDotColor: '#94a3b8'
      }];
    }

    if (activeBandView === 'tess' || !hasMultiBand) {
      return [{
        name: 'TESS Optical (600–1000 nm)',
        color: '#0f172a',
        darkColor: '#38bdf8',
        points: tessPoints,
        dotColor: '#334155',
        darkDotColor: '#7dd3fc'
      }];
    }
    if (activeBandView === 'ground_multiband') {
      return [
        {
          name: 'Ground g-band (Blue, 400–550 nm)',
          color: '#2563eb',
          darkColor: '#60a5fa',
          points: bluePoints || [],
          dotColor: '#3b82f6',
          darkDotColor: '#93c5fd'
        },
        {
          name: 'Ground z-band (Red, 820–920 nm)',
          color: '#dc2626',
          darkColor: '#f87171',
          points: redPoints || [],
          dotColor: '#ef4444',
          darkDotColor: '#fca5a5'
        }
      ];
    }
    return [
      {
        name: 'TESS Optical (Broadband)',
        color: '#0f172a',
        darkColor: '#94a3b8',
        points: tessPoints,
        dotColor: '#64748b',
        darkDotColor: '#cbd5e1'
      },
      {
        name: 'Ground g-band (Blue)',
        color: '#2563eb',
        darkColor: '#60a5fa',
        points: bluePoints || [],
        dotColor: '#3b82f6',
        darkDotColor: '#93c5fd'
      },
      {
        name: 'Ground z-band (Red)',
        color: '#dc2626',
        darkColor: '#f87171',
        points: redPoints || [],
        dotColor: '#ef4444',
        darkDotColor: '#fca5a5'
      }
    ];
  }, [viewMode, hasRawData, rawUnfoldedPoints, activeBandView, hasMultiBand, tessPoints, bluePoints, redPoints]);

  // Apply optional binning to series points
  const visibleSeries = useMemo(() => {
    if (binningHours <= 0) return rawSeries;
    return rawSeries.map(s => ({
      ...s,
      points: binLightCurve(s.points, binningHours)
    }));
  }, [rawSeries, binningHours]);

  const allVisiblePoints = useMemo(() => visibleSeries.flatMap(s => s.points), [visibleSeries]);

  // Compute time & flux domain bounds
  const { minTime, maxTime, minFlux, maxFlux } = useMemo(() => {
    if (!allVisiblePoints.length) {
      return { minTime: -3, maxTime: 3, minFlux: 0.985, maxFlux: 1.008 };
    }
    let minT = Infinity, maxT = -Infinity, minF = Infinity, maxF = -Infinity;
    for (const p of allVisiblePoints) {
      const tVal = viewMode === 'raw_unfolded' ? (p.rawTime ?? p.time) : p.time;
      if (tVal < minT) minT = tVal;
      if (tVal > maxT) maxT = tVal;
      if (p.flux < minF) minF = p.flux;
      if (p.flux > maxF) maxF = p.flux;
    }
    // Apply zoom & pan
    const rawSpan = maxT - minT || 1;
    const timeSpan = rawSpan / zoomLevel;
    const centerT = (minT + maxT) / 2 + panOffsetX * timeSpan;

    const padF = (maxF - minF) * 0.12 || 0.003;
    return {
      minTime: centerT - timeSpan / 2,
      maxTime: centerT + timeSpan / 2,
      minFlux: Math.min(minF - padF, 0.99 - (transitDepthPercent ? (transitDepthPercent / 100) * 1.2 : 0.02)),
      maxFlux: Math.max(maxF + padF, 1.004)
    };
  }, [allVisiblePoints, viewMode, zoomLevel, panOffsetX, transitDepthPercent]);

  // Dimensions
  const plotWidth = 720;
  const isResVisible = showResiduals && viewMode === 'phased';
  const mainPlotHeight = isResVisible ? height * 0.68 : height - 60;
  const residualPlotHeight = isResVisible ? height * 0.22 : 0;
  const padLeft = 68;
  const padRight = 25;
  const padTop = 20;
  const padBottom = 35;
  const innerWidth = plotWidth - padLeft - padRight;

  const scaleX = (t: number) => padLeft + ((t - minTime) / (maxTime - minTime || 1)) * innerWidth;
  const scaleY = (f: number) => padTop + mainPlotHeight - ((f - minFlux) / (maxFlux - minFlux || 1)) * mainPlotHeight;

  // Residual scale
  const resPadTop = padTop + mainPlotHeight + 20;
  const resLimit = Math.max(0.003, ...allVisiblePoints.map(p => Math.abs(p.residual || 0)));
  const scaleResY = (r: number) => resPadTop + residualPlotHeight / 2 - (r / (resLimit * 1.35)) * (residualPlotHeight / 2);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-sm select-none transition-colors">
      {/* Header controls & legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-xs tracking-wide uppercase text-slate-800 dark:text-slate-200 font-mono">
            {title}
          </span>
          {transitDepthPercent !== undefined && (
            <span className="text-[11px] font-mono text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
              δ = {transitDepthPercent.toFixed(3)}%
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Raw vs Phased Toggle */}
          {hasRawData && (
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded border border-slate-200 dark:border-slate-700 text-xs">
              <button
                onClick={() => setViewMode('phased')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                  viewMode === 'phased' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Phased Transit
              </button>
              <button
                onClick={() => setViewMode('raw_unfolded')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                  viewMode === 'raw_unfolded' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Raw Multi-Sector
              </button>
            </div>
          )}

          {/* Multi-band filter selector */}
          {showMultiBandToggle && hasMultiBand && viewMode === 'phased' && (
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded border border-slate-200 dark:border-slate-700 text-xs">
              <button
                onClick={() => setActiveBandView('all')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                  activeBandView === 'all' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Combined
              </button>
              <button
                onClick={() => setActiveBandView('tess')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                  activeBandView === 'tess' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                TESS Broad
              </button>
              <button
                onClick={() => setActiveBandView('ground_multiband')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                  activeBandView === 'ground_multiband' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Ground Blue/Red
              </button>
            </div>
          )}

          {/* Binning selector */}
          {viewMode === 'phased' && (
            <div className="flex items-center gap-1 text-[11px] font-mono text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
              <span>Bin:</span>
              <button
                onClick={() => setBinningHours(0)}
                className={`px-1 rounded ${binningHours === 0 ? 'bg-white dark:bg-slate-900 font-bold text-slate-900 dark:text-white' : ''}`}
              >
                None
              </button>
              <button
                onClick={() => setBinningHours(0.1)}
                className={`px-1 rounded ${binningHours === 0.1 ? 'bg-white dark:bg-slate-900 font-bold text-slate-900 dark:text-white' : ''}`}
              >
                6m
              </button>
              <button
                onClick={() => setBinningHours(0.25)}
                className={`px-1 rounded ${binningHours === 0.25 ? 'bg-white dark:bg-slate-900 font-bold text-slate-900 dark:text-white' : ''}`}
              >
                15m
              </button>
            </div>
          )}

          {/* Zoom controls */}
          <div className="flex items-center gap-1 border border-slate-200 dark:border-slate-700 rounded p-0.5 bg-slate-50 dark:bg-slate-800">
            <button
              onClick={() => setZoomLevel(prev => Math.min(prev * 1.35, 6))}
              title="Zoom in"
              className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-300"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(prev => Math.max(prev / 1.35, 0.7))}
              title="Zoom out"
              className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-300"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => { setZoomLevel(1); setPanOffsetX(0); }}
              title="Reset view"
              className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-300"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative overflow-hidden w-full">
        <svg
          viewBox={`0 0 ${plotWidth} ${height}`}
          className="w-full h-auto text-slate-600 dark:text-slate-400 font-mono text-[10px]"
        >
          {/* Background Grid */}
          <g className="opacity-30 dark:opacity-20">
            {[minFlux, (minFlux + maxFlux) / 2, 1.0, maxFlux].map((f, i) => (
              <line
                key={`h-${i}`}
                x1={padLeft}
                y1={scaleY(f)}
                x2={padLeft + innerWidth}
                y2={scaleY(f)}
                stroke="currentColor"
                strokeDasharray={f === 1.0 ? 'none' : '3,3'}
                strokeWidth={f === 1.0 ? 1.2 : 0.8}
              />
            ))}
          </g>

          {/* Transit Center Marker Line (t = 0 for phased) */}
          {viewMode === 'phased' && minTime <= 0 && maxTime >= 0 && (
            <line
              x1={scaleX(0)}
              y1={padTop}
              x2={scaleX(0)}
              y2={padTop + mainPlotHeight}
              stroke="#94a3b8"
              strokeDasharray="4,4"
              strokeWidth="1"
            />
          )}

          {/* Render series points and fitted model lines */}
          {visibleSeries.map((series, sIdx) => {
            const sorted = [...series.points].sort((a, b) => {
              const tA = viewMode === 'raw_unfolded' ? (a.rawTime ?? a.time) : a.time;
              const tB = viewMode === 'raw_unfolded' ? (b.rawTime ?? b.time) : b.time;
              return tA - tB;
            });

            // Build Model Line Path
            const modelPathD = viewMode === 'phased'
              ? sorted
                  .filter(p => p.modelFlux !== undefined)
                  .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${scaleX(p.time).toFixed(1)} ${scaleY(p.modelFlux!).toFixed(1)}`)
                  .join(' ')
              : '';

            return (
              <g key={series.name}>
                {/* Error bars */}
                {sorted.map((p, pIdx) => {
                  const tVal = viewMode === 'raw_unfolded' ? (p.rawTime ?? p.time) : p.time;
                  if (tVal < minTime || tVal > maxTime) return null;
                  const x = scaleX(tVal);
                  const yTop = scaleY(p.flux + p.fluxErr);
                  const yBot = scaleY(p.flux - p.fluxErr);
                  return (
                    <line
                      key={`err-${sIdx}-${pIdx}`}
                      x1={x}
                      y1={yTop}
                      x2={x}
                      y2={yBot}
                      stroke={series.dotColor}
                      strokeWidth="0.8"
                      opacity="0.35"
                    />
                  );
                })}

                {/* Data Points */}
                {sorted.map((p, pIdx) => {
                  const tVal = viewMode === 'raw_unfolded' ? (p.rawTime ?? p.time) : p.time;
                  if (tVal < minTime || tVal > maxTime) return null;
                  const x = scaleX(tVal);
                  const y = scaleY(p.flux);
                  const isHovered = hoveredPoint === p;
                  return (
                    <circle
                      key={`pt-${sIdx}-${pIdx}`}
                      cx={x}
                      cy={y}
                      r={isHovered ? 4.5 : binningHours > 0 ? 3.0 : 2.2}
                      fill={series.dotColor}
                      opacity={isHovered ? 1 : 0.8}
                      className="cursor-pointer transition-transform"
                      onMouseEnter={() => setHoveredPoint(p)}
                      onMouseLeave={() => setHoveredPoint(null)}
                    />
                  );
                })}

                {/* Fitted Model Line */}
                {modelPathD && (
                  <path
                    d={modelPathD}
                    fill="none"
                    stroke={series.color}
                    strokeWidth="1.8"
                    opacity="0.9"
                  />
                )}
              </g>
            );
          })}

          {/* Y-Axis Labels (Normalized Flux) */}
          <g className="fill-slate-600 dark:fill-slate-400 text-[10px]">
            <text x={padLeft - 8} y={scaleY(1.0) + 3} textAnchor="end" fontWeight="500">1.0000</text>
            <text x={padLeft - 8} y={scaleY(minFlux) + 3} textAnchor="end">{minFlux.toFixed(4)}</text>
            <text x={padLeft - 8} y={scaleY(maxFlux) + 3} textAnchor="end">{maxFlux.toFixed(4)}</text>
            <text
              x={14}
              y={padTop + mainPlotHeight / 2}
              textAnchor="middle"
              transform={`rotate(-90 14 ${padTop + mainPlotHeight / 2})`}
              className="text-[10.5px] fill-slate-700 dark:fill-slate-300 font-sans font-medium"
            >
              Relative Flux (Normalized)
            </text>
          </g>

          {/* Residuals Panel */}
          {isResVisible && (
            <g>
              <rect
                x={padLeft}
                y={resPadTop}
                width={innerWidth}
                height={residualPlotHeight}
                className="fill-slate-50 dark:fill-slate-950/80 stroke-slate-200 dark:stroke-slate-800"
                strokeWidth="1"
              />
              <line
                x1={padLeft}
                y1={scaleResY(0)}
                x2={padLeft + innerWidth}
                y2={scaleResY(0)}
                stroke="#94a3b8"
                strokeDasharray="2,2"
                strokeWidth="0.9"
              />
              {visibleSeries.map((series, sIdx) => (
                <g key={`res-group-${sIdx}`}>
                  {series.points.map((p, pIdx) => {
                    if (p.residual === undefined || p.time < minTime || p.time > maxTime) return null;
                    return (
                      <circle
                        key={`res-${sIdx}-${pIdx}`}
                        cx={scaleX(p.time)}
                        cy={scaleResY(p.residual)}
                        r="1.8"
                        fill={series.dotColor}
                        opacity="0.6"
                      />
                    );
                  })}
                </g>
              ))}
              <text x={padLeft - 8} y={scaleResY(0) + 3} textAnchor="end" className="fill-slate-500 text-[9px]">0.0</text>
              <text x={padLeft - 8} y={resPadTop + 10} textAnchor="end" className="fill-slate-400 text-[8.5px]">+{(resLimit * 1000).toFixed(0)}m</text>
              <text x={padLeft - 8} y={resPadTop + residualPlotHeight - 2} textAnchor="end" className="fill-slate-400 text-[8.5px]">-{(resLimit * 1000).toFixed(0)}m</text>
              <text
                x={14}
                y={resPadTop + residualPlotHeight / 2}
                textAnchor="middle"
                transform={`rotate(-90 14 ${resPadTop + residualPlotHeight / 2})`}
                className="text-[9px] fill-slate-500 font-sans font-medium"
              >
                Residuals (O-C)
              </text>
            </g>
          )}

          {/* X-Axis Labels */}
          <g className="fill-slate-600 dark:fill-slate-400 text-[10px]">
            {viewMode === 'phased' ? (
              [-3, -2, -1, 0, 1, 2, 3].map((t) => {
                if (t < minTime || t > maxTime) return null;
                return (
                  <g key={`xtick-${t}`} transform={`translate(${scaleX(t)}, ${height - padBottom + 14})`}>
                    <line x1="0" y1="-14" x2="0" y2="-9" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
                    <text textAnchor="middle">{t > 0 ? `+${t}h` : `${t}h`}</text>
                  </g>
                );
              })
            ) : (
              [0, 5, 10, 15, 20, 25].map((d) => {
                const bjdVal = 2459000.0 + d;
                if (bjdVal < minTime || bjdVal > maxTime) return null;
                return (
                  <g key={`xbjd-${d}`} transform={`translate(${scaleX(bjdVal)}, ${height - padBottom + 14})`}>
                    <line x1="0" y1="-14" x2="0" y2="-9" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
                    <text textAnchor="middle">+{d}d</text>
                  </g>
                );
              })
            )}
            <text
              x={padLeft + innerWidth / 2}
              y={height - 6}
              textAnchor="middle"
              className="text-[10.5px] fill-slate-700 dark:fill-slate-300 font-sans font-medium"
            >
              {viewMode === 'phased'
                ? 'Time from Transit Center (Hours, Phase Folded)'
                : 'Observation Timeline (BJD - 2459000.0 Days, Multi-Sector TESS Baseline)'}
            </text>
          </g>
        </svg>

        {/* Hover Tooltip Float */}
        {hoveredPoint && (
          <div className="absolute top-2 right-2 bg-slate-900/95 dark:bg-slate-950 text-slate-100 text-[11px] font-mono px-3 py-2 rounded-lg shadow-xl border border-slate-700 pointer-events-none space-y-0.5 z-20 backdrop-blur-xs">
            <div className="font-semibold text-sky-400">{hoveredPoint.filter || 'Photometry'}</div>
            {hoveredPoint.rawTime && (
              <div>BJD: <span className="text-slate-300">{hoveredPoint.rawTime.toFixed(4)}</span></div>
            )}
            <div>Time (t - t₀): <span className="text-white">{hoveredPoint.time > 0 ? `+${hoveredPoint.time}` : hoveredPoint.time} h</span></div>
            <div>Observed Flux: <span className="text-white">{hoveredPoint.flux.toFixed(5)}</span> ± {hoveredPoint.fluxErr.toFixed(5)}</div>
            {hoveredPoint.modelFlux && (
              <div>Model: <span className="text-slate-300">{hoveredPoint.modelFlux.toFixed(5)}</span></div>
            )}
            {hoveredPoint.residual !== undefined && (
              <div>Residual: <span className={Math.abs(hoveredPoint.residual) > 0.002 ? 'text-amber-300' : 'text-slate-300'}>
                {(hoveredPoint.residual * 1e6).toFixed(0)} ppm
              </span></div>
            )}
          </div>
        )}
      </div>

      {/* Series Legend at Bottom */}
      <div className="flex flex-wrap items-center justify-between text-xs text-slate-600 dark:text-slate-400 pt-2.5 border-t border-slate-100 dark:border-slate-800 mt-2">
        <div className="flex flex-wrap items-center gap-4">
          {visibleSeries.map(s => (
            <div key={s.name} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
              <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300">{s.name}</span>
            </div>
          ))}
        </div>
        <div className="text-[11px] font-mono text-slate-500">
          {allVisiblePoints.length} photometric points {binningHours > 0 ? `(binned ${binningHours * 60}m)` : ''}
        </div>
      </div>
    </div>
  );
};
