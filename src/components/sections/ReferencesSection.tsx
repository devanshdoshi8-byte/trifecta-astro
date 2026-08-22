import React, { useState } from 'react';
import { SCIENTIFIC_REFERENCES, ASTROPHYSICAL_GLOSSARY } from '../../data/references';
import { BookOpen, Search, ExternalLink, BookmarkCheck, FileText, CheckCircle2, Code2 } from 'lucide-react';
import { ScientificNote } from '../common/ScientificNote';

export const ReferencesSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const categories = ['all', 'TESS Mission', 'Validation Pipelines', 'Photometry & Follow-up', 'Transit Physics'];

  const filteredReferences = SCIENTIFIC_REFERENCES.filter(ref => {
    const matchesCat = selectedCategory === 'all' || ref.category === selectedCategory;
    const matchesSearch =
      ref.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ref.authors.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ref.journal.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <section id="references" className="py-16 bg-space-950 text-white border-b border-space-800 transition-colors relative overflow-hidden">
      {/* Background Reticle */}
      <div className="absolute inset-0 bg-celestial-grid opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-400">
              SECTION 09: VERIFIED BIBLIOGRAPHY &amp; GLOSSARY
            </span>
            <span className="text-[10.5px] font-mono bg-space-900 text-sky-300 border border-space-700 px-2 py-0.5 rounded">
              Verified ADS Citations
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
            Scientific Literature &amp; Terminology
          </h2>
          <p className="text-sm sm:text-base text-space-300 leading-relaxed font-serif">
            All analytical equations, limb darkening formulations, and validation paradigms in Trifecta are grounded in peer-reviewed astronomical literature.
          </p>
        </div>

        {/* References Filter Bar */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5 bg-space-900 p-1 rounded-md border border-space-700 text-xs font-mono">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-sky-500 text-space-950 font-bold shadow-xs'
                      : 'text-space-300 hover:text-white'
                  }`}
                >
                  {cat === 'all' ? 'All Publications' : cat}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-space-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search authors, titles, DOIs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-space-900 border border-space-700 rounded text-white font-sans focus:outline-hidden focus:ring-1 focus:ring-sky-400"
              />
            </div>
          </div>

          {/* References Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredReferences.map((ref) => (
              <div
                key={ref.id}
                className="bg-space-900/80 border border-space-800 rounded-lg p-4 space-y-2.5 hover:border-space-700 transition-colors shadow-lg"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-mono font-bold bg-space-950 text-sky-300 border border-sky-800/80 px-2 py-0.5 rounded">
                    {ref.category}
                  </span>
                  <span className="text-xs font-mono text-space-400 font-semibold">{ref.year}</span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-white leading-snug">
                    {ref.title}
                  </h4>
                  <div className="text-[11px] font-sans text-space-300 italic">
                    {ref.authors}
                  </div>
                  <div className="text-[11px] font-mono text-space-400">
                    {ref.journal}
                  </div>
                  {ref.doi && (
                    <div className="text-[10px] font-mono text-sky-400 pt-0.5">
                      DOI: {ref.doi}
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-space-800 text-[11px] text-space-300 font-sans leading-snug bg-space-950 p-2.5 rounded border border-space-800">
                  <strong className="text-sky-300 font-mono text-[10px] uppercase block mb-0.5">Relevance to Trifecta:</strong>
                  {ref.relevance}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Astrophysical Glossary with Formulas */}
        <div className="bg-space-900/90 border border-space-800 rounded-xl p-6 space-y-6 shadow-xl">
          <div className="border-b border-space-800 pb-3">
            <span className="text-xs font-mono font-bold uppercase text-sky-400 tracking-wider">
              Astrophysical Terminology Index
            </span>
            <h3 className="text-lg font-bold text-white mt-0.5 font-mono">
              Standard Astronomical &amp; Screening Definitions
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {ASTROPHYSICAL_GLOSSARY.map((term, idx) => (
              <div key={idx} className="bg-space-950 p-3.5 rounded-lg border border-space-800 space-y-2 text-xs font-mono">
                <div className="font-bold text-white text-xs">
                  {term.term}
                </div>
                {term.formula && (
                  <div className="text-[10.5px] font-mono text-sky-300 bg-sky-950 px-1.5 py-0.5 rounded border border-sky-800">
                    {term.formula}
                  </div>
                )}
                <p className="text-space-300 text-[11.5px] leading-snug font-sans">
                  {term.definition}
                </p>
                <div className="pt-1.5 border-t border-space-800 text-[10.5px] text-space-400 font-mono">
                  <span className="font-bold text-sky-300">Trifecta context: </span>
                  <span className="font-sans text-space-300">{term.relevanceToTrifecta}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <ScientificNote
          variant="note"
          title="Bibliographic Integrity"
          technicalDetail="All citations represent verified literature indexed in the NASA Astrophysics Data System (ADS)."
        >
          References are provided for scientific context and methodology. All citations represent published, peer-reviewed exoplanet literature and standard data reduction algorithms.
        </ScientificNote>
      </div>
    </section>
  );
};
