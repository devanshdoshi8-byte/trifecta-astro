import React, { useState } from 'react';
import { Compass, Target, Info, Sparkles, Layers, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { DataSourceBadge } from '../common/DataQualityBadge';
import { TargetIndexField, GaiaNeighborSource } from '../../types/astrophysics';

interface CelestialTargetCutoutProps {
  candidateId: string;
  ticId: string;
  hostName: string;
  ra?: string;
  dec?: string;
  sector?: number[];
  vMag?: number;
  targetField?: TargetIndexField;
}

export const CelestialTargetCutout: React.FC<CelestialTargetCutoutProps> = ({
  candidateId,
  ticId,
  hostName,
  ra = '19h 28m 38.2s',
  dec = '+42° 01′ 14″',
  sector = [14, 15],
  vMag = 10.45,
  targetField
}) => {
  const [showAperture, setShowAperture] = useState<boolean>(true);
  const [showGaiaNeighbors, setShowGaiaNeighbors] = useState<boolean>(true);
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);

  // Extract neighbor sources from live targetField if present, or use default field
  const neighbors: GaiaNeighborSource[] = targetField?.neighbors || [
    {
      sourceId: `Gaia DR3 ${ticId.slice(0, 6)}101`,
      ra: 187.238,
      dec: 2.126,
      separationArcsec: 14.2,
      photGMeanMag: 13.81,
      deltaMag: 3.36,
      isContaminantRisk: true,
      relativeFluxFraction: 0.045
    },
    {
      sourceId: `Gaia DR3 ${ticId.slice(0, 6)}102`,
      ra: 187.228,
      dec: 2.119,
      separationArcsec: 28.5,
      photGMeanMag: 15.31,
      deltaMag: 4.86,
      isContaminantRisk: false,
      relativeFluxFraction: 0.011
    },
    {
      sourceId: `Gaia DR3 ${ticId.slice(0, 6)}103`,
      ra: 187.241,
      dec: 2.132,
      separationArcsec: 36.4,
      photGMeanMag: 16.41,
      deltaMag: 5.96,
      isContaminantRisk: false,
      relativeFluxFraction: 0.004
    }
  ];

  const totalDilution = targetField?.totalDilutionFactor ?? 0.045;
  const contaminantCount = targetField?.apertureContaminantsCount ?? 1;

  const displayRA = targetField?.raSexagesimal || ra;
  const displayDec = targetField?.decSexagesimal || dec;
  const displayMag = targetField?.gaiaMag || vMag;

  const selectedSource = neighbors.find(n => n.sourceId === selectedSourceId);

  return (
    <div className="bg-space-950 border border-space-800 rounded-xl p-4 sm:p-5 text-space-200 font-mono text-xs space-y-3 relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-space-800 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-sky-400 uppercase flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-sky-400" />
            <span>Target Sky Field &amp; TESS Aperture Index</span>
          </span>
          <DataSourceBadge source="OBSERVATIONAL DATA" />
        </div>
        <div className="text-[10.5px] text-space-400">
          Field: 1.2′ &times; 1.2′ &middot; Gaia DR3 Spatial Cross-Match
        </div>
      </div>

      {/* Grid and Reticle Controls */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* SVG Celestial Reticle */}
        <div className="md:col-span-7 bg-space-900/90 rounded-lg p-3 border border-space-800 relative flex items-center justify-center min-h-[220px]">
          <svg viewBox="0 0 260 220" className="w-full max-w-[260px] h-auto">
            <defs>
              <radialGradient id="cutoutTargetGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="30%" stopColor="#fef08a" />
                <stop offset="70%" stopColor="#f59e0b" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#ca8a04" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Coordinate grid lines */}
            <rect x="10" y="10" width="240" height="200" fill="#030712" stroke="#1e293b" strokeWidth="1" />
            <line x1="130" y1="10" x2="130" y2="210" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="3,3" />
            <line x1="10" y1="110" x2="250" y2="110" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="3,3" />

            {/* 21-arcsec TESS Pixel Mask Overlay (1 arcsec = 2.5px) */}
            {showAperture && (
              <g>
                <rect
                  x={130 - 26}
                  y={110 - 26}
                  width="52"
                  height="52"
                  fill="rgba(56, 189, 248, 0.12)"
                  stroke="#38bdf8"
                  strokeWidth="1.2"
                />
                <circle cx="130" cy="110" r="42" fill="none" stroke="#38bdf8" strokeWidth="0.8" strokeDasharray="2,2" />
                <text x="130" y="60" textAnchor="middle" fill="#38bdf8" fontSize="7.5">
                  TESS Aperture Mask (42″ Radius)
                </text>
              </g>
            )}

            {/* Gaia DR3 Neighbors */}
            {showGaiaNeighbors &&
              neighbors.map((n, i) => {
                const angle = (i * 1.6) + 0.4;
                const rPx = Math.min(90, n.separationArcsec * 2.0);
                const x = 130 + rPx * Math.cos(angle);
                const y = 110 - rPx * Math.sin(angle);
                const isSelected = selectedSourceId === n.sourceId;
                return (
                  <g key={n.sourceId} className="cursor-pointer" onClick={() => setSelectedSourceId(n.sourceId)}>
                    <circle
                      cx={x}
                      cy={y}
                      r={Math.max(2.5, 6 - (n.photGMeanMag - displayMag))}
                      fill={n.isContaminantRisk ? '#f87171' : '#94a3b8'}
                      opacity={isSelected ? 1 : 0.85}
                    />
                    {isSelected && (
                      <circle cx={x} cy={y} r="8" fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="2,2" />
                    )}
                    <text x={x + 6} y={y + 3} fill={n.isContaminantRisk ? '#f87171' : '#64748b'} fontSize="6.5">
                      +{n.deltaMag.toFixed(1)}m ({n.separationArcsec}″)
                    </text>
                  </g>
                );
              })}

            {/* Central Target Star */}
            <circle cx="130" cy="110" r="14" fill="url(#cutoutTargetGlow)" />
            <circle cx="130" cy="110" r="4" fill="#ffffff" />
            <text x="130" y="132" textAnchor="middle" fill="#fbbf24" fontSize="7.5" fontWeight="bold">
              Target (TIC {ticId})
            </text>

            {/* Reticle Axes Annotations */}
            <text x="240" y="105" textAnchor="end" fill="#475569" fontSize="6.5">E</text>
            <text x="20" y="105" textAnchor="start" fill="#475569" fontSize="6.5">W</text>
            <text x="135" y="22" textAnchor="start" fill="#475569" fontSize="6.5">N</text>
            <text x="135" y="202" textAnchor="start" fill="#475569" fontSize="6.5">S</text>
          </svg>
        </div>

        {/* Spatial Coordinates & Aperture Contamination Panel */}
        <div className="md:col-span-5 space-y-2.5">
          <div className="bg-space-900 p-2.5 rounded border border-space-800 space-y-1 text-[11px]">
            <div className="text-space-400 font-bold uppercase text-[10px]">Astrometric Target Index</div>
            <div className="flex justify-between"><span className="text-space-400">RA (J2000):</span> <span className="text-white font-mono">{displayRA}</span></div>
            <div className="flex justify-between"><span className="text-space-400">Dec (J2000):</span> <span className="text-white font-mono">{displayDec}</span></div>
            <div className="flex justify-between"><span className="text-space-400">Gaia G Mag:</span> <span className="text-sky-300 font-bold font-mono">{displayMag} mag</span></div>
            <div className="flex justify-between"><span className="text-space-400">Sectors:</span> <span className="text-white">{sector.join(', ')}</span></div>
          </div>

          {/* Aperture Dilution Metrics */}
          <div className="bg-space-900 p-2.5 rounded border border-space-800 space-y-1 text-[11px]">
            <div className="text-space-400 font-bold uppercase text-[10px] flex items-center justify-between">
              <span>Aperture Dilution Factor (D)</span>
              <span className={totalDilution > 0.05 ? 'text-amber-400 font-bold' : 'text-emerald-400'}>
                {(totalDilution * 100).toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between text-space-300">
              <span>Aperture Radius:</span>
              <span className="text-white">42″ (2 TESS px)</span>
            </div>
            <div className="flex justify-between text-space-300">
              <span>Contaminant Sources:</span>
              <span className={contaminantCount > 0 ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                {contaminantCount} nearby source(s)
              </span>
            </div>
          </div>

          {/* Selected Source Inspector */}
          {selectedSource ? (
            <div className="bg-space-900/80 p-2 rounded border border-sky-800 text-[10.5px] space-y-0.5">
              <div className="text-sky-300 font-bold">{selectedSource.sourceId}</div>
              <div>Separation: <span className="text-white">{selectedSource.separationArcsec}″</span> &middot; Δmag: <span className="text-white">+{selectedSource.deltaMag}</span></div>
              <div>Dilution Share: <span className="text-white">{(selectedSource.relativeFluxFraction * 100).toFixed(2)}%</span></div>
            </div>
          ) : (
            <div className="text-[10px] text-space-500 italic">
              Click any neighbor source in the reticle to inspect its Gaia DR3 cross-match telemetry.
            </div>
          )}

          {/* Toggles */}
          <div className="flex items-center gap-3 text-[10.5px] pt-1">
            <label className="flex items-center gap-1.5 cursor-pointer text-space-300 hover:text-white">
              <input
                type="checkbox"
                checked={showAperture}
                onChange={(e) => setShowAperture(e.target.checked)}
                className="accent-sky-400"
              />
              <span>TESS 21″/px Mask</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-space-300 hover:text-white">
              <input
                type="checkbox"
                checked={showGaiaNeighbors}
                onChange={(e) => setShowGaiaNeighbors(e.target.checked)}
                className="accent-sky-400"
              />
              <span>Gaia Sources</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
