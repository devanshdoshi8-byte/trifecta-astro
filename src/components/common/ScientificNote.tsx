import React, { useState } from 'react';
import { Info, AlertCircle, HelpCircle, ChevronDown, ChevronUp, Code2 } from 'lucide-react';

interface ScientificNoteProps {
  title?: string;
  children: React.ReactNode;
  technicalDetail?: React.ReactNode;
  variant?: 'note' | 'caveat' | 'methodology';
  className?: string;
}

export const ScientificNote: React.FC<ScientificNoteProps> = ({
  title = 'Scientific Note',
  children,
  technicalDetail,
  variant = 'note',
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const getStyles = () => {
    switch (variant) {
      case 'caveat':
        return {
          bg: 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200',
          badge: 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800',
          icon: <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        };
      case 'methodology':
        return {
          bg: 'bg-blue-50/60 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/60 text-blue-950 dark:text-sky-200',
          badge: 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-sky-300 border-blue-300 dark:border-blue-800',
          icon: <HelpCircle className="w-4 h-4 text-blue-600 dark:text-sky-400 shrink-0 mt-0.5" />
        };
      default:
        return {
          bg: 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200',
          badge: 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700',
          icon: <Info className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0 mt-0.5" />
        };
    }
  };

  const style = getStyles();

  return (
    <div className={`my-3 p-3.5 border rounded-lg text-xs leading-relaxed transition-colors ${style.bg} ${className}`}>
      <div className="flex items-start gap-2.5">
        {style.icon}
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center justify-between">
            <div className="font-semibold uppercase tracking-wider text-[11px] text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <span>{title}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded border font-mono font-normal lowercase opacity-75">
                scholarly context
              </span>
            </div>

            {technicalDetail && (
              <button
                onClick={() => setIsExpanded(prev => !prev)}
                className="inline-flex items-center gap-1 text-[10.5px] font-mono text-blue-600 dark:text-sky-400 hover:underline cursor-pointer"
              >
                <span>{isExpanded ? 'Hide Technical Detail' : 'Inspect Technical Detail'}</span>
                {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            )}
          </div>

          {/* Level 1: Plain scientific communication */}
          <div className="text-slate-700 dark:text-slate-300 font-sans">{children}</div>

          {/* Level 2: Expandable technical depth */}
          {technicalDetail && isExpanded && (
            <div className="pt-2.5 mt-2 border-t border-slate-200/80 dark:border-slate-700/80 text-[11.5px] font-mono text-slate-800 dark:text-slate-200 space-y-1 animate-fadeIn">
              <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Code2 className="w-3 h-3 text-blue-500" />
                <span>Level 2: Mathematical / Observational Formulation</span>
              </div>
              <div className="p-2 bg-white/70 dark:bg-slate-950/70 rounded border border-slate-200 dark:border-slate-800">
                {technicalDetail}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
