import React, { useState, useEffect } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { HeroSection } from './components/sections/HeroSection';
import { UniverseAsDataSection } from './components/sections/UniverseAsDataSection';
import { ProblemSection } from './components/sections/ProblemSection';
import { PillarsSection } from './components/sections/PillarsSection';
import { PipelineExplorerSection } from './components/sections/PipelineExplorerSection';
import { CandidateExplorerSection } from './components/sections/CandidateExplorerSection';
import { RealAnalysisWorkstation } from './components/sections/RealAnalysisWorkstation';
import { SyntheticSandbox } from './components/sections/SyntheticSandbox';
import { ExistingMethodsSection } from './components/sections/ExistingMethodsSection';
import { ValidationBenchmarkingSection } from './components/sections/ValidationBenchmarkingSection';
import { LimitationsSection } from './components/sections/LimitationsSection';
import { ResearchMethodSection } from './components/sections/ResearchMethodSection';
import { ReferencesSection } from './components/sections/ReferencesSection';
import { CtaSection } from './components/sections/CtaSection';
import { StarfieldBackground } from './components/common/StarfieldBackground';
import { ScientificReportModal } from './components/common/ScientificReportModal';
import { CompareCandidatesModal } from './components/common/CompareCandidatesModal';
import { GuidedDemoModal } from './components/common/GuidedDemoModal';
import { LightCurveUploaderModal } from './components/common/LightCurveUploaderModal';
import { LocalTestDashboardModal } from './components/common/LocalTestDashboardModal';
import { ScienceGlossaryModal } from './components/common/ScienceGlossaryModal';
import { WhyMattersModal } from './components/common/WhyMattersModal';
import { JudgeOverviewModal } from './components/sections/JudgeOverviewModal';

const AppContent: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('hero');
  const {
    reportCandidate,
    closeReportModal,
    isCompareModalOpen,
    closeCompareModal,
    isGuidedDemoOpen,
    closeGuidedDemo,
    openReportModal,
    isJudgeMode,
    isUploaderOpen,
    closeUploader,
    isLocalTestOpen,
    closeLocalTest,
    isGlossaryOpen,
    closeGlossary,
    whyMattersKey,
    closeWhyMatters,
    isJudgeOverviewOpen,
    closeJudgeOverview,
    activeCandidateOverride,
    setActiveCandidateOverride
  } = useTheme();

  // Track scroll position to update active navbar indicator
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        'hero',
        'universe-data',
        'problem',
        'three-pillars',
        'pipeline',
        'candidate-explorer',
        'sandbox',
        'validation',
        'research-context',
        'existing-methods',
        'limitations',
        'references',
      ];

      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`min-h-screen flex flex-col bg-space-950 text-white selection:bg-sky-500/30 selection:text-sky-200 transition-colors relative ${
      isJudgeMode ? 'judge-mode-active' : ''
    }`}>
      {/* Global Procedural Starfield & Cosmic Atmosphere (Directive 2 & 27) */}
      <StarfieldBackground />

      {/* Top Navbar */}
      <Navbar
        activeSection={activeSection}
        onNavigate={scrollTo}
      />

      {/* Main Scientific Research Platform Content */}
      <main className="grow relative z-10">
        <HeroSection
          onExploreClick={() => scrollTo('candidate-explorer')}
          onMethodClick={() => scrollTo('research-context')}
        />

        {/* Judge Mode Evaluation View Banner */}
        {isJudgeMode && (
          <div className="bg-sky-950/80 border-b border-sky-800 p-3 text-center text-xs font-mono text-sky-200 backdrop-blur-md">
            <strong>JUDGE EVALUATION VIEW ACTIVE:</strong> Comprehensive methodology, 10-stage processing trace, and error analysis are highlighted for IRIS / ISEF review.
          </div>
        )}

        {/* The Universe As Data Sequence (Directive 9) */}
        <UniverseAsDataSection />

        <ProblemSection />

        <PillarsSection />

        {/* Real Scientific Computational Prototype Workstation */}
        <RealAnalysisWorkstation />

        <PipelineExplorerSection />

        <CandidateExplorerSection />

        {/* Dedicated Sandbox Container */}
        <section id="sandbox" className="py-16 bg-space-950 text-white border-b border-space-800 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SyntheticSandbox />
          </div>
        </section>

        <ValidationBenchmarkingSection />

        <ResearchMethodSection />

        <ExistingMethodsSection />

        <LimitationsSection />

        <ReferencesSection />

        <CtaSection
          onOpenExplorer={() => scrollTo('candidate-explorer')}
          onOpenSandbox={() => scrollTo('sandbox')}
          onOpenMethod={() => scrollTo('research-context')}
        />
      </main>

      {/* Global Modals */}
      {reportCandidate && (
        <ScientificReportModal
          candidate={reportCandidate}
          onClose={closeReportModal}
        />
      )}

      {isCompareModalOpen && (
        <CompareCandidatesModal
          isOpen={isCompareModalOpen}
          onClose={closeCompareModal}
          onSelectCandidate={(id) => {
            scrollTo('candidate-explorer');
          }}
        />
      )}

      {isGuidedDemoOpen && (
        <GuidedDemoModal
          isOpen={isGuidedDemoOpen}
          onClose={closeGuidedDemo}
        />
      )}

      {isUploaderOpen && (
        <LightCurveUploaderModal
          isOpen={isUploaderOpen}
          onClose={closeUploader}
          onCandidateLoaded={(cand) => {
            setActiveCandidateOverride(cand);
            scrollTo('candidate-explorer');
          }}
        />
      )}

      {isLocalTestOpen && (
        <LocalTestDashboardModal
          isOpen={isLocalTestOpen}
          onClose={closeLocalTest}
        />
      )}

      {isGlossaryOpen && (
        <ScienceGlossaryModal
          isOpen={isGlossaryOpen}
          onClose={closeGlossary}
        />
      )}

      {whyMattersKey && (
        <WhyMattersModal
          isOpen={!!whyMattersKey}
          topicKey={whyMattersKey}
          onClose={closeWhyMatters}
        />
      )}

      {isJudgeOverviewOpen && (
        <JudgeOverviewModal
          isOpen={isJudgeOverviewOpen}
          onClose={closeJudgeOverview}
          candidate={reportCandidate || activeCandidateOverride}
          onOpenFullTechnical={() => {
            scrollTo('candidate-explorer');
          }}
        />
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;
