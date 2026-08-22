import React, { createContext, useContext, useState, useEffect } from 'react';
import { CandidateAssessment } from '../types/astrophysics';

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  isJudgeMode: boolean;
  toggleJudgeMode: () => void;
  isGuidedDemoOpen: boolean;
  openGuidedDemo: () => void;
  closeGuidedDemo: () => void;
  isCompareModalOpen: boolean;
  openCompareModal: () => void;
  closeCompareModal: () => void;
  isUploaderOpen: boolean;
  openUploader: () => void;
  closeUploader: () => void;
  isLocalTestOpen: boolean;
  openLocalTest: () => void;
  closeLocalTest: () => void;
  isGlossaryOpen: boolean;
  openGlossary: () => void;
  closeGlossary: () => void;
  whyMattersKey: string | null;
  openWhyMatters: (key: string) => void;
  closeWhyMatters: () => void;
  isJudgeOverviewOpen: boolean;
  openJudgeOverview: () => void;
  closeJudgeOverview: () => void;
  reportCandidate: CandidateAssessment | null;
  openReportModal: (candidate: CandidateAssessment) => void;
  closeReportModal: () => void;
  activeCandidateOverride: CandidateAssessment | null;
  setActiveCandidateOverride: (candidate: CandidateAssessment | null) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('trifecta_theme');
    if (saved) return saved === 'dark';
    return true; // Default to Observatory Dark Mode
  });

  const [isJudgeMode, setIsJudgeMode] = useState<boolean>(() => {
    return localStorage.getItem('trifecta_judge_mode') === 'true';
  });

  const [isGuidedDemoOpen, setIsGuidedDemoOpen] = useState<boolean>(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState<boolean>(false);
  const [isUploaderOpen, setIsUploaderOpen] = useState<boolean>(false);
  const [isLocalTestOpen, setIsLocalTestOpen] = useState<boolean>(false);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState<boolean>(false);
  const [whyMattersKey, setWhyMattersKey] = useState<string | null>(null);
  const [isJudgeOverviewOpen, setIsJudgeOverviewOpen] = useState<boolean>(false);
  const [reportCandidate, setReportCandidate] = useState<CandidateAssessment | null>(null);
  const [activeCandidateOverride, setActiveCandidateOverride] = useState<CandidateAssessment | null>(null);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('trifecta_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('trifecta_theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    localStorage.setItem('trifecta_judge_mode', String(isJudgeMode));
  }, [isJudgeMode]);

  const toggleTheme = () => setIsDark(prev => !prev);
  const toggleJudgeMode = () => {
    setIsJudgeMode(prev => {
      const next = !prev;
      if (next) {
        setIsJudgeOverviewOpen(true);
      }
      return next;
    });
  };
  const openGuidedDemo = () => setIsGuidedDemoOpen(true);
  const closeGuidedDemo = () => setIsGuidedDemoOpen(false);
  const openCompareModal = () => setIsCompareModalOpen(true);
  const closeCompareModal = () => setIsCompareModalOpen(false);
  const openUploader = () => setIsUploaderOpen(true);
  const closeUploader = () => setIsUploaderOpen(false);
  const openLocalTest = () => setIsLocalTestOpen(true);
  const closeLocalTest = () => setIsLocalTestOpen(false);
  const openGlossary = () => setIsGlossaryOpen(true);
  const closeGlossary = () => setIsGlossaryOpen(false);
  const openWhyMatters = (key: string) => setWhyMattersKey(key);
  const closeWhyMatters = () => setWhyMattersKey(null);
  const openJudgeOverview = () => setIsJudgeOverviewOpen(true);
  const closeJudgeOverview = () => setIsJudgeOverviewOpen(false);
  const openReportModal = (candidate: CandidateAssessment) => setReportCandidate(candidate);
  const closeReportModal = () => setReportCandidate(null);

  return (
    <ThemeContext.Provider
      value={{
        isDark,
        toggleTheme,
        isJudgeMode,
        toggleJudgeMode,
        isGuidedDemoOpen,
        openGuidedDemo,
        closeGuidedDemo,
        isCompareModalOpen,
        openCompareModal,
        closeCompareModal,
        isUploaderOpen,
        openUploader,
        closeUploader,
        isLocalTestOpen,
        openLocalTest,
        closeLocalTest,
        isGlossaryOpen,
        openGlossary,
        closeGlossary,
        whyMattersKey,
        openWhyMatters,
        closeWhyMatters,
        isJudgeOverviewOpen,
        openJudgeOverview,
        closeJudgeOverview,
        reportCandidate,
        openReportModal,
        closeReportModal,
        activeCandidateOverride,
        setActiveCandidateOverride,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
