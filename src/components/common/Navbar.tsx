import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import {
  Orbit,
  Activity,
  Sliders,
  BookOpen,
  ShieldCheck,
  Menu,
  X,
  Sun,
  Moon,
  Layers,
  Sparkles,
  Award,
  Radio,
  Compass,
  Upload
} from 'lucide-react';

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection, onNavigate }) => {
  const {
    isDark,
    toggleTheme,
    isJudgeMode,
    toggleJudgeMode,
    openGuidedDemo,
    openCompareModal,
    openUploader,
    openLocalTest,
    openGlossary,
    openJudgeOverview
  } = useTheme();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'universe-data', label: 'Overview' },
    { id: 'problem', label: 'The Problem' },
    { id: 'three-pillars', label: 'Three Pillars' },
    { id: 'pipeline', label: 'Pipeline' },
    { id: 'candidate-explorer', label: 'Explorer' },
    { id: 'sandbox', label: 'Sandbox' },
    { id: 'validation', label: 'Validation' },
    { id: 'research-context', label: 'Methodology' },
    { id: 'existing-methods', label: 'Prior Art' },
    { id: 'limitations', label: 'Limitations' },
    { id: 'references', label: 'References' },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-space-950/95 backdrop-blur-md border-b border-space-800 transition-colors">
      {/* Top Academic Status Bar */}
      <div className="bg-space-900 text-space-300 text-[11px] font-mono px-4 py-1 flex items-center justify-between border-b border-space-800">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white font-medium">OBSERVATORY INTERFACE</span>
          <span className="text-space-600">|</span>
          <span className="hidden sm:inline text-space-300">TESS Computational Astrophysics Prototype</span>
          <span className="hidden xl:inline text-space-600">|</span>
          <span className="hidden xl:inline text-space-400">SPOC calibrated time-series generated from archive parameters; raw FITS upload supported.</span>
        </div>

        <div className="flex items-center gap-3 text-[10.5px]">
          {/* Start Here / Understand Trifecta Button */}
          <button
            onClick={openGuidedDemo}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-400 text-space-950 font-bold hover:bg-amber-300 transition-colors cursor-pointer shadow-sm"
            title="Start here: 60-90 second guided walkthrough"
          >
            <Sparkles className="w-3 h-3 text-space-950" />
            <span>START HERE (60s Tour)</span>
          </button>
          <span className="text-space-600">|</span>

          {/* Science Glossary Button */}
          <button
            onClick={openGlossary}
            className="inline-flex items-center gap-1 text-sky-400 hover:text-sky-300 font-semibold transition-colors cursor-pointer"
            title="Search scientific definitions, formulas, and parameters"
          >
            <BookOpen className="w-3 h-3" />
            <span>Science Glossary</span>
          </button>
          <span className="text-space-600">|</span>

          {/* Judge Mode Switch / Overview */}
          <button
            onClick={() => {
              if (isJudgeMode) {
                openJudgeOverview();
              } else {
                toggleJudgeMode();
              }
            }}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded transition-colors cursor-pointer ${
              isJudgeMode
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 font-bold'
                : 'text-space-400 hover:text-space-200'
            }`}
            title="Toggle Judge Mode (Reorganizes interface for scientific evaluation)"
          >
            <Award className="w-3 h-3" />
            <span>{isJudgeMode ? 'Judge Mode ON (View)' : 'Judge Mode'}</span>
          </button>
          <span className="text-space-600">|</span>

          {/* Custom Upload Button */}
          <button
            onClick={openUploader}
            className="hidden md:inline-flex items-center gap-1 text-space-300 hover:text-white transition-colors cursor-pointer"
          >
            <Upload className="w-3 h-3" />
            <span>Upload Follow-up</span>
          </button>
          <span className="hidden md:inline text-space-600">|</span>

          {/* System Health / Local Test Button */}
          <button
            onClick={openLocalTest}
            className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold transition-colors cursor-pointer"
            title="Open real-time system health and self-test audit"
          >
            <Radio className="w-3 h-3 text-emerald-400" />
            <span>System Health</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Custom Trifecta Brand Mark */}
          <div
            onClick={() => handleNavClick('hero')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg border border-space-700 bg-space-900 flex items-center justify-center text-white shadow-lg group-hover:border-sky-400 transition-colors">
              <svg viewBox="0 0 24 24" className="w-5 h-5">
                <circle cx="12" cy="12" r="9" fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="2,2" />
                <polygon points="12,4 5,18 19,18" fill="none" stroke="#38bdf8" strokeWidth="1.2" />
                <circle cx="12" cy="4" r="1.8" fill="#38bdf8" />
                <circle cx="5" cy="18" r="1.8" fill="#34d399" />
                <circle cx="19" cy="18" r="1.8" fill="#fbbf24" />
                <circle cx="12" cy="13.3" r="1.5" fill="#ffffff" />
              </svg>
            </div>
            <div>
              <span className="font-bold text-sm sm:text-base tracking-tight text-white font-mono">
                TRIFECTA<span className="text-sky-400 font-sans font-light ml-1">FRAMEWORK</span>
              </span>
              <div className="text-[9.5px] font-mono text-space-400 tracking-tight leading-none hidden sm:block">
                Astrophysical Screening System
              </div>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-2.5 py-1.5 rounded-md text-xs font-mono font-medium transition-colors cursor-pointer ${
                  activeSection === item.id
                    ? 'bg-space-800 text-sky-300 font-semibold border border-space-700'
                    : 'text-space-400 hover:text-white hover:bg-space-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Action Tools & Theme Controls */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={openUploader}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono font-medium text-sky-300 bg-sky-950/60 hover:bg-sky-900/60 border border-sky-800 rounded transition-colors cursor-pointer"
              title="Upload custom light curve (FITS / CSV)"
            >
              <Upload className="w-3.5 h-3.5 text-sky-400" />
              <span>Upload Data</span>
            </button>

            <button
              onClick={openCompareModal}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono font-medium text-space-300 bg-space-900 hover:bg-space-800 border border-space-700 rounded transition-colors cursor-pointer"
              title="Compare candidates side-by-side"
            >
              <Layers className="w-3.5 h-3.5 text-sky-400" />
              <span>Compare</span>
            </button>

            <button
              onClick={() => handleNavClick('sandbox')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono font-medium text-space-300 bg-space-900 hover:bg-space-800 border border-space-700 rounded transition-colors cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5 text-sky-400" />
              <span>Sandbox</span>
            </button>

            {/* Dark / Light Toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-md text-space-300 hover:bg-space-850 border border-space-700 transition-colors cursor-pointer"
              title={isDark ? 'Switch to Publication Light Mode' : 'Switch to Observatory Dark Mode'}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-space-400" />}
            </button>

            <button
              onClick={() => handleNavClick('candidate-explorer')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-mono font-semibold text-space-950 bg-sky-400 hover:bg-sky-300 rounded border border-sky-400 transition-colors shadow-lg shadow-sky-950/50 cursor-pointer"
            >
              <Activity className="w-3.5 h-3.5 text-space-950" />
              <span>Explorer</span>
            </button>
          </div>

          {/* Mobile menu toggle */}
          <div className="flex xl:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-md text-space-300"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-space-400" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-space-300 hover:bg-space-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-space-950 border-b border-space-800 px-4 pt-2 pb-4 space-y-1 shadow-2xl">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`block w-full text-left px-3 py-2 rounded-md text-xs font-mono font-medium ${
                activeSection === item.id
                  ? 'bg-space-800 text-sky-300 font-semibold'
                  : 'text-space-400 hover:bg-space-900 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2 flex flex-wrap gap-2 border-t border-space-800 mt-2 font-mono text-xs">
            <button
              onClick={() => { openUploader(); setMobileMenuOpen(false); }}
              className="flex-1 py-2 text-center font-semibold text-sky-300 bg-sky-950/60 border border-sky-800 rounded"
            >
              Upload Data
            </button>
            <button
              onClick={() => { openGuidedDemo(); setMobileMenuOpen(false); }}
              className="flex-1 py-2 text-center font-semibold text-amber-300 bg-amber-950/60 border border-amber-800 rounded"
            >
              2-Min Tour
            </button>
            <button
              onClick={() => { openCompareModal(); setMobileMenuOpen(false); }}
              className="flex-1 py-2 text-center font-medium text-space-200 bg-space-900 border border-space-700 rounded"
            >
              Compare
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
