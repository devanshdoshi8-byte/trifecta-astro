import React, { useState } from 'react';
import { X, Search, BookOpen, ExternalLink, HelpCircle } from 'lucide-react';

interface GlossaryTerm {
  term: string;
  category: 'Concepts' | 'Missions & Catalogs' | 'Measurements & Analysis' | 'Astrophysics';
  level1: string; // Simple
  level2: string; // Scientific
  level3?: string; // Technical details
}

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    term: 'TESS',
    category: 'Missions & Catalogs',
    level1: "NASA's planet-hunting space telescope observing millions of stars.",
    level2: "Transiting Exoplanet Survey Satellite — an all-sky optical photometric survey mission measuring high-precision stellar flux variations.",
    level3: "Observes in 24° x 96° sectors with 21 arcsec/pixel detector resolution and a broad red-optical passband (600–1000 nm)."
  },
  {
    term: 'TOI',
    category: 'Missions & Catalogs',
    level1: 'A star flagged by TESS as potentially having an orbiting planet.',
    level2: 'TESS Object of Interest — a designated astrophysical target displaying periodic transit-like brightness dips identified for follow-up.',
    level3: 'Numbered systematically (e.g., TOI-700.01 indicates candidate 01 around host star TOI-700 / TIC 150428135).'
  },
  {
    term: 'TIC',
    category: 'Missions & Catalogs',
    level1: 'The master registry number for every star observed by TESS.',
    level2: 'TESS Input Catalog — a pre-selected comprehensive stellar catalog providing fundamental astrophysical parameters for millions of targets.',
    level3: 'Compiles optical and infrared photometry, Gaia astrometry, effective temperatures, and stellar radius estimates.'
  },
  {
    term: 'Transit',
    category: 'Concepts',
    level1: 'When a planet passes directly in front of its star, temporarily blocking a tiny fraction of its light.',
    level2: 'An astronomical occultation event where an orbiting companion crosses the line of sight between the observer and the host star.',
    level3: 'Produces a characteristic geometric dimming whose fractional depth is proportional to the area ratio (Rp / R*)^2.'
  },
  {
    term: 'Light Curve',
    category: 'Measurements & Analysis',
    level1: 'A graph showing how a star\'s brightness changes over time.',
    level2: 'A sequential time series of normalized photometric flux measurements recording stellar activity and periodic transit dips.',
    level3: 'Typically plotted as Relative Flux vs. Barycentric TESS Julian Date (BJD - 2457000).'
  },
  {
    term: 'Transit Depth',
    category: 'Measurements & Analysis',
    level1: 'How much the star appears to dim during the transit.',
    level2: 'The fractional decrease in observed flux during the central occultation: δ = ΔF / F_baseline.',
    level3: 'In simple planetary transits, δ ≈ (Rp / R*)^2 * (1 - D), where D is the background stellar dilution factor.'
  },
  {
    term: 'Transit Duration',
    category: 'Measurements & Analysis',
    level1: 'The total time it takes for the planet to cross the star from start to finish.',
    level2: 'Total transit duration T_14 measured from first contact (ingress start) to fourth contact (egress end).',
    level3: 'T_14 = (P / π) * arcsin( (R* / a) * sqrt( (1 + k)^2 - b^2 ) / sin(i) ).'
  },
  {
    term: 'Ingress',
    category: 'Measurements & Analysis',
    level1: 'The initial phase when the planet begins moving onto the face of the star.',
    level2: 'The time interval from first contact (T1) to second contact (T2) as the companion disk fully enters the stellar limb.',
    level3: 'Ingress duration T_12 informs the impact parameter b and companion size ratio k.'
  },
  {
    term: 'Egress',
    category: 'Measurements & Analysis',
    level1: 'The final phase when the planet moves off the face of the star.',
    level2: 'The time interval from third contact (T3) to fourth contact (T4) as the companion disk leaves the stellar limb.',
    level3: 'Transit symmetry requires T_12 ≈ T_34 under circular Keplerian orbital geometry.'
  },
  {
    term: 'Phase Folding',
    category: 'Measurements & Analysis',
    level1: 'Stacking all repeated transits on top of each other using the orbital period.',
    level2: 'A modulo transformation of the time series on orbital period P to align all transits at phase ϕ = 0.',
    level3: 'Phase ϕ = ((t - T0) mod P) / P, mapping data into the normalized phase domain [-0.5, +0.5].'
  },
  {
    term: 'Eclipsing Binary',
    category: 'Astrophysics',
    level1: 'Two stars orbiting each other and periodically blocking each other\'s light.',
    level2: 'A gravitationally bound stellar pair whose orbital plane aligns with Earth, producing mutual stellar eclipses.',
    level3: 'The primary source of astrophysical false positives when blended within wide photometric apertures.'
  },
  {
    term: 'False Positive',
    category: 'Concepts',
    level1: 'A signal that mimics an exoplanet transit but is actually caused by stars or instrumental artifacts.',
    level2: 'A non-planetary scenario producing transit-like flux attenuation (e.g., blended eclipsing binary, grazing binary, background star).',
    level3: 'Accounts for up to 50% of raw transit candidates in wide-field survey missions like TESS.'
  },
  {
    term: 'Chromaticity',
    category: 'Concepts',
    level1: 'Whether the transit dip looks the same in different colors of light.',
    level2: 'The wavelength dependence of transit depth across distinct optical filters: ΔD = D_blue - D_red.',
    level3: 'True planetary occultations are approximately achromatic, whereas blended stars of differing spectral types show chromatic depth variations.'
  },
  {
    term: 'Multi-band Photometry',
    category: 'Measurements & Analysis',
    level1: 'Observing the star through different color filters (e.g., blue, green, red, infrared).',
    level2: 'Simultaneous or synchronized photometric observations through standard astronomical filter bandpasses (e.g., Sloan g, r, i, z).',
    level3: 'Provides independent color constraints that break degeneracies between companion radius and stellar blending.'
  },
  {
    term: 'MAST',
    category: 'Missions & Catalogs',
    level1: 'NASA\'s public archive where all raw and processed TESS data is stored.',
    level2: 'Mikulski Archive for Space Telescopes — the primary NASA data repository hosted at STScI for Kepler, TESS, and Hubble.',
    level3: 'Provides access to target pixel files (TPF) and calibrated SPOC light curve products.'
  },
  {
    term: 'NASA Exoplanet Archive',
    category: 'Missions & Catalogs',
    level1: 'The official catalog of confirmed exoplanets and candidates maintained by NASA/Caltech.',
    level2: 'An online research database providing public astronomical tables, TOI lists, confirmed planetary parameters, and TAP services.',
    level3: 'Queried via Table Access Protocol (TAP) using Astronomical Data Query Language (ADQL).'
  },
  {
    term: 'Gaia',
    category: 'Missions & Catalogs',
    level1: 'The European Space Agency telescope mapping the precise positions and brightnesses of over a billion stars.',
    level2: 'ESA Gaia astrometric space mission providing sub-milliarcsecond positions, parallaxes, proper motions, and photometry (G, BP, RP).',
    level3: 'Critical for resolving background stars within TESS\'s large 21" pixel apertures.'
  },
  {
    term: 'Contamination',
    category: 'Astrophysics',
    level1: 'Extra light from neighboring stars leaking into the target star\'s measurement.',
    level2: 'Photometric flux dilution caused by neighboring unresolved or partially resolved stellar sources inside the photometric aperture mask.',
    level3: 'Calculated as Dilution Factor D = Σ F_contam / (F_target + Σ F_contam).'
  },
  {
    term: 'Stellar Temperature',
    category: 'Astrophysics',
    level1: 'The surface temperature of the host star.',
    level2: 'Effective temperature T_eff of the stellar photosphere, governing its total radiative flux and spectral color.',
    level3: 'Determined from spectroscopic analysis or Gaia/2MASS photometric calibrations.'
  },
  {
    term: 'Equilibrium Temperature',
    category: 'Astrophysics',
    level1: 'The estimated surface temperature of the planet assuming simple radiation balance.',
    level2: 'Theoretical blackbody planet temperature: T_eq = T_eff * sqrt(R* / 2a) * (1 - A_B)^(1/4).',
    level3: 'Assuming standard Bond albedo A_B = 0.3 and uniform heat redistribution.'
  },
  {
    term: 'Semi-major Axis',
    category: 'Astrophysics',
    level1: 'The average orbital distance between the planet and its host star.',
    level2: 'The major radius of an elliptical or circular Keplerian orbit: a = (G M* P^2 / 4π^2)^(1/3).',
    level3: 'Expressed in Astronomical Units (AU) where 1 AU ≈ 1.496 x 10^8 km.'
  },
  {
    term: 'Signal-to-Noise Ratio',
    category: 'Measurements & Analysis',
    level1: 'How clearly the transit signal stands out above random background noise.',
    level2: 'The ratio of measured transit depth to the standard error of the baseline flux: SNR = δ / σ_transit.',
    level3: 'Transit detections with SNR < 7.1 are generally considered ambiguous or unconfirmed in TESS SPOC pipelines.'
  },
  {
    term: 'Detrending',
    category: 'Measurements & Analysis',
    level1: 'Removing stellar flares, starspots, and telescope drift so only the planet dip remains.',
    level2: 'Filtering low-frequency astrophysical variability and instrumental systematics using Savitzky-Golay or Gaussian process filters.',
    level3: 'Preserves the high-frequency transit signal while flattening the out-of-transit baseline to 1.0.'
  },
  {
    term: 'Data Quality',
    category: 'Measurements & Analysis',
    level1: 'A measure of how clean, complete, and reliable the telescope observation is.',
    level2: 'Quantitative evaluation of photometric baseline RMS (ppm), duty cycle, outlier fractions, and SPOC quality bitmasks.',
    level3: 'Prevents false candidate assessments caused by thruster momentum dumps or scattered Earth/Moon light.'
  }
];

export const ScienceGlossaryModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}> = ({ isOpen, onClose, initialQuery = '' }) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedTerm, setExpandedTerm] = useState<string | null>(null);

  if (!isOpen) return null;

  const categories = ['All', 'Concepts', 'Missions & Catalogs', 'Measurements & Analysis', 'Astrophysics'];

  const filteredTerms = GLOSSARY_TERMS.filter(item => {
    const matchesSearch = item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.level1.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.level2.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn font-sans">
      <div className="bg-space-950 border border-space-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-space-800 flex items-center justify-between bg-space-900">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-sky-500/10 border border-sky-500/30 rounded-lg">
              <BookOpen className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-wide font-mono">
                SCIENCE GLOSSARY &middot; CORE ASTRONOMICAL TERMS
              </h3>
              <p className="text-xs text-space-400">
                Clear, concise explanations from basic concept to scientific formulation.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-space-400 hover:text-white rounded-lg hover:bg-space-850 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filters */}
        <div className="p-4 border-b border-space-800 bg-space-950/90 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-space-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search concepts, archives, measurements..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-space-900 border border-space-800 rounded-lg text-xs text-white placeholder-space-500 focus:outline-none focus:border-sky-500 font-mono"
            />
          </div>

          <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/50 font-bold'
                    : 'bg-space-900 text-space-400 hover:text-space-200 border border-space-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Terms List */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3.5 flex-1">
          {filteredTerms.length === 0 ? (
            <div className="text-center py-12 text-space-400 text-sm font-mono">
              No matching astronomical terms found for "{searchQuery}".
            </div>
          ) : (
            filteredTerms.map(t => {
              const isExpanded = expandedTerm === t.term;
              return (
                <div
                  key={t.term}
                  className="bg-space-900/90 border border-space-800 rounded-xl p-4 transition-all hover:border-space-700 shadow-md"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-space-800/60 pb-2 mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-white tracking-wide">
                        {t.term}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-space-950 text-space-400 border border-space-800 text-[10px] uppercase font-mono">
                        {t.category}
                      </span>
                    </div>

                    <button
                      onClick={() => setExpandedTerm(isExpanded ? null : t.term)}
                      className="text-[11px] font-mono text-sky-400 hover:text-sky-300 transition-colors flex items-center gap-1 cursor-pointer self-start sm:self-auto"
                    >
                      <span>{isExpanded ? 'Hide Technical Details' : 'Show Technical Details'}</span>
                    </button>
                  </div>

                  {/* Level 1 & 2 Progressive Disclosure */}
                  <div className="space-y-2 text-xs leading-relaxed">
                    <div className="text-space-200 font-sans">
                      <strong className="text-amber-300/90 font-mono text-[11px] uppercase mr-1">Simple:</strong>
                      {t.level1}
                    </div>

                    <div className="text-space-300 font-sans">
                      <strong className="text-sky-400/90 font-mono text-[11px] uppercase mr-1">Scientific:</strong>
                      {t.level2}
                    </div>

                    {/* Level 3 Technical details if expanded */}
                    {isExpanded && t.level3 && (
                      <div className="mt-2.5 p-3 rounded-lg bg-space-950 border border-space-800 text-space-300 font-mono text-[11.5px] leading-normal animate-fadeIn">
                        <strong className="text-emerald-400 font-bold block mb-1 text-[10.5px] uppercase tracking-wider">
                          Technical Formulation & Constants:
                        </strong>
                        {t.level3}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-space-800 bg-space-900 flex items-center justify-between text-xs text-space-400 font-mono">
          <span>{filteredTerms.length} of {GLOSSARY_TERMS.length} terms</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-sky-400 text-space-950 font-bold rounded-lg hover:bg-sky-300 transition-colors cursor-pointer"
          >
            Close Glossary
          </button>
        </div>
      </div>
    </div>
  );
};
