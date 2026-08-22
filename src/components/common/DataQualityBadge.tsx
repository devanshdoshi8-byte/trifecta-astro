import React from 'react';
import { DiagnosticStatus, DataSourceType, DataQualityLevel } from '../../types/astrophysics';
import { CheckCircle2, AlertTriangle, XCircle, HelpCircle, Database, Sparkles, ShieldCheck } from 'lucide-react';

export const DiagnosticStatusBadge: React.FC<{
  status: DiagnosticStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}> = ({ status, size = 'md', showIcon = true }) => {
  const configs = {
    low_concern: {
      label: 'Low Concern',
      sublabel: 'Prioritize for Validation',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
    },
    review_required: {
      label: 'Review Required',
      sublabel: 'Ambiguous Diagnostic Signal',
      bg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
    },
    false_positive_signature: {
      label: 'Potential False-Positive Signature',
      sublabel: 'Investigate Binary / Blending Hypothesis',
      bg: 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800',
      icon: <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" />
    },
    insufficient_data: {
      label: 'Insufficient Data',
      sublabel: 'Multi-band follow-up pending',
      bg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700',
      icon: <HelpCircle className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
    },
    unavailable: {
      label: 'Unavailable',
      sublabel: 'Single-band passband only',
      bg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700',
      icon: <HelpCircle className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
    }
  };

  const config = configs[status] || configs.insufficient_data;
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : size === 'lg' ? 'px-3.5 py-1.5 text-sm' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium border rounded-md ${config.bg} ${sizeClasses}`}>
      {showIcon && config.icon}
      <span>{config.label}</span>
    </span>
  );
};

export const DataQualityBadge: React.FC<{
  level: DataQualityLevel;
  snr?: number;
  className?: string;
}> = ({ level, snr, className = '' }) => {
  const configs: Record<DataQualityLevel, { label: string; bg: string }> = {
    EXCELLENT: {
      label: 'EXCELLENT QUALITY',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
    },
    GOOD: {
      label: 'GOOD QUALITY',
      bg: 'bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-sky-300 border-blue-300 dark:border-blue-800'
    },
    MODERATE: {
      label: 'MODERATE QUALITY',
      bg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800'
    },
    LIMITED: {
      label: 'LIMITED DATA',
      bg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
    },
    INSUFFICIENT: {
      label: 'INSUFFICIENT DATA',
      bg: 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800'
    }
  };

  const config = configs[level] || configs.LIMITED;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10.5px] font-mono font-semibold border rounded-sm ${config.bg} ${className}`}>
      <ShieldCheck className="w-3 h-3" />
      <span>{config.label}</span>
      {snr !== undefined && <span className="opacity-75">| SNR {snr.toFixed(1)}</span>}
    </span>
  );
};

export const DataSourceBadge: React.FC<{
  source: DataSourceType | 'DATA AVAILABILITY DEPENDENT';
  className?: string;
}> = ({ source, className = '' }) => {
  if (source === 'DATA AVAILABILITY DEPENDENT') {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10.5px] font-mono tracking-tight bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 rounded ${className}`}>
        <Database className="w-3 h-3 text-slate-500" />
        <span>DATA AVAILABILITY DEPENDENT</span>
      </span>
    );
  }

  const isSimulated = source === 'SIMULATED DATA' || source === 'SYNTHETIC DEMO' || source.includes('DEMO DATA');

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10.5px] font-mono font-medium tracking-tight border rounded ${
      isSimulated
        ? 'bg-amber-50/80 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800'
        : 'bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-sky-300 border-blue-300 dark:border-blue-800'
    } ${className}`}>
      {isSimulated ? <Sparkles className="w-3 h-3 text-amber-600 dark:text-amber-400" /> : <Database className="w-3 h-3 text-blue-600 dark:text-sky-400" />}
      <span>{source}</span>
    </span>
  );
};
