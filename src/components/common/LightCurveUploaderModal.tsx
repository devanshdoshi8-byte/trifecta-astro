import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  FileCode,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Database,
  Layers,
  HelpCircle,
  Activity,
  Play
} from 'lucide-react';
import {
  parseCSVLightCurve,
  parseFITSLightCurve,
  buildCandidateFromParsedLightCurve,
  SAMPLE_REAL_DATASETS,
  ParsedLightCurveResult
} from '../../services/fitsAndCsvParser';
import { CandidateAssessment } from '../../types/astrophysics';
import { LightCurvePlot } from '../charts/LightCurvePlot';

interface LightCurveUploaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCandidateLoaded: (candidate: CandidateAssessment) => void;
}

export const LightCurveUploaderModal: React.FC<LightCurveUploaderModalProps> = ({
  isOpen,
  onClose,
  onCandidateLoaded
}) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [parsedResult, setParsedResult] = useState<ParsedLightCurveResult | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleFileProcess = async (file: File) => {
    setIsProcessing(true);
    setError(null);

    try {
      const fileName = file.name;
      const lowerName = fileName.toLowerCase();

      if (lowerName.endsWith('.fits') || lowerName.endsWith('.fit')) {
        const buffer = await file.arrayBuffer();
        const parsed = await parseFITSLightCurve(buffer, fileName);
        setParsedResult(parsed);
      } else {
        const text = await file.text();
        const parsed = parseCSVLightCurve(text, fileName);
        setParsedResult(parsed);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to parse light curve file.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleLoadSample = (sampleKey: keyof typeof SAMPLE_REAL_DATASETS) => {
    setIsProcessing(true);
    setError(null);
    try {
      const sample = SAMPLE_REAL_DATASETS[sampleKey];
      const parsed = sample.generate();
      setParsedResult(parsed);
    } catch (err: any) {
      setError(err?.message || 'Failed to generate sample.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInjectIntoWorkstation = () => {
    if (!parsedResult) return;
    const candidate = buildCandidateFromParsedLightCurve(parsedResult);
    onCandidateLoaded(candidate);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-space-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-space-900 border border-space-700 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-white font-mono">
        {/* Top Modal Bar */}
        <div className="bg-space-950 text-white p-4 flex items-center justify-between border-b border-space-800">
          <div className="flex items-center gap-2">
            <Upload className="w-4 h-4 text-sky-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-sky-300">
              LIGHT CURVE INGESTION ENGINE &middot; CSV / FITS PARSER
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-space-400 hover:text-white rounded hover:bg-space-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs font-sans">
          {/* Instructions and Description */}
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white font-mono">
              Upload Custom Photometric Time-Series
            </h3>
            <p className="text-space-300 text-xs leading-relaxed">
              Upload calibrated light curve files from NASA TESS SPOC, Kepler, ground-based follow-up observatories, or synthetic models. The parser will automatically normalize the baseline, detect transit parameters, and evaluate the 3-pillar Trifecta diagnostic criteria.
            </p>
          </div>

          {/* Preset Sample Quick Loaders */}
          <div className="bg-space-950 p-3.5 rounded-xl border border-space-800 space-y-2">
            <div className="text-[11px] font-mono font-bold text-sky-400 uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Instant Test Datasets (1-Click Preview):</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={() => handleLoadSample('tess_spoc_sample')}
                className="p-2.5 bg-space-900 hover:bg-space-850 border border-space-700 rounded-lg text-left transition-colors cursor-pointer space-y-1"
              >
                <div className="font-mono text-xs font-bold text-white">TESS SPOC 2-min (TOI-1233.01)</div>
                <div className="text-[11px] text-space-400">Calibrated single-band orbital transit (P = 3.795d)</div>
              </button>

              <button
                onClick={() => handleLoadSample('muscat_multiband_sample')}
                className="p-2.5 bg-space-900 hover:bg-space-850 border border-space-700 rounded-lg text-left transition-colors cursor-pointer space-y-1"
              >
                <div className="font-mono text-xs font-bold text-sky-300">MuSCAT2 Multi-Band Follow-up</div>
                <div className="text-[11px] text-space-400">Simultaneous 4-color optical light curve testing color invariance</div>
              </button>
            </div>
          </div>

          {/* Drag & Drop File Zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-3 ${
              isDragging
                ? 'border-sky-400 bg-sky-950/30'
                : 'border-space-700 bg-space-950 hover:border-space-600 hover:bg-space-900/50'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleFileProcess(e.target.files[0]);
                }
              }}
              accept=".csv,.fits,.fit,.txt,.tsv"
              className="hidden"
            />

            <div className="w-12 h-12 rounded-full bg-space-900 border border-space-700 flex items-center justify-center text-sky-400 shadow-lg">
              <Upload className="w-6 h-6" />
            </div>

            <div>
              <div className="font-mono text-sm font-bold text-white">
                Drag &amp; drop your light curve file here, or click to browse
              </div>
              <div className="text-space-400 text-xs mt-1 font-sans">
                Supported formats: <strong>.FITS</strong> (SPOC / Kepler binary tables), <strong>.CSV</strong>, <strong>.TSV</strong>, <strong>.TXT</strong> (time, flux, flux_err)
              </div>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3 bg-rose-950/50 border border-rose-800 rounded-lg text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Parsed Light Curve Results Preview */}
          {parsedResult && (
            <div className="bg-space-950 border border-space-800 rounded-xl p-4 space-y-4 font-mono text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-space-800 pb-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-white text-sm">
                    Parsed: {parsedResult.fileName}
                  </span>
                  <span className="bg-space-900 px-2 py-0.5 rounded text-[10.5px] border border-space-700 text-sky-300">
                    {parsedResult.fileType} Format
                  </span>
                </div>
                <div className="text-space-400">
                  {parsedResult.pointCount} photometric points extracted
                </div>
              </div>

              {/* Statistical Extraction Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="bg-space-900 p-2.5 rounded border border-space-800">
                  <span className="text-space-400 text-[10px]">MEASURED DEPTH</span>
                  <div className="text-white font-bold text-sm">{parsedResult.measuredDepthPercent.toFixed(3)}%</div>
                </div>
                <div className="bg-space-900 p-2.5 rounded border border-space-800">
                  <span className="text-space-400 text-[10px]">TRANSIT DURATION</span>
                  <div className="text-white font-bold text-sm">{parsedResult.measuredDurationHours.toFixed(2)} hours</div>
                </div>
                <div className="bg-space-900 p-2.5 rounded border border-space-800">
                  <span className="text-space-400 text-[10px]">ESTIMATED SNR</span>
                  <div className="text-emerald-400 font-bold text-sm">{parsedResult.snr}</div>
                </div>
                <div className="bg-space-900 p-2.5 rounded border border-space-800">
                  <span className="text-space-400 text-[10px]">CHANNELS DETECTED</span>
                  <div className="text-white font-bold text-sm">
                    {parsedResult.bluePoints && parsedResult.redPoints ? 'Dual-Band (g, z)' : 'Single-Band'}
                  </div>
                </div>
              </div>

              {/* Fast Visualizer Preview */}
              <div className="space-y-1">
                <LightCurvePlot
                  tessPoints={parsedResult.tessPoints}
                  bluePoints={parsedResult.bluePoints}
                  redPoints={parsedResult.redPoints}
                  title={`Parsed Light Curve Preview: ${parsedResult.fileName}`}
                  transitDepthPercent={parsedResult.measuredDepthPercent}
                  totalDurationHours={parsedResult.measuredDurationHours}
                  ingressDurationMin={parsedResult.measuredIngressMin}
                  height={180}
                />
              </div>

              {/* Inject CTA */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleInjectIntoWorkstation}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-400 hover:bg-sky-300 text-space-950 font-bold rounded-lg transition-colors shadow-lg shadow-sky-950/60 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Apply Candidate to Analysis Workstation</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
