import React from 'react';
import { X, HelpCircle, Info, ArrowRight } from 'lucide-react';

export interface WhyMattersTopic {
  title: string;
  level1: string; // Simple
  level2: string; // Scientific
  level3: string; // Technical details
}

export const WHY_MATTERS_TOPICS: Record<string, WhyMattersTopic> = {
  transit_depth: {
    title: 'TRANSIT DEPTH (δ)',
    level1: 'Transit depth tells us how much the observed star\'s brightness decreases during the event. It is one of the basic measurements used to characterize a transit-like signal.',
    level2: 'The fractional flux reduction δ = ΔF / F_0 directly constrains the geometric companion-to-host radius ratio k = Rp / R*.',
    level3: 'Governed by δ ≈ k^2 = (Rp / R*)^2 in the absence of limb darkening and stellar contamination. When blended flux is present, the apparent depth is diluted: δ_obs = δ_true * (1 - D).'
  },
  phase_folding: {
    title: 'PHASE FOLDING',
    level1: 'Phase folding places repeated events on the same orbital timeline. This makes periodic transit-like signals easier to examine.',
    level2: 'A modulo mapping of observation timestamps t against the orbital period P and reference epoch T0: ϕ = ((t - T0) mod P) / P.',
    level3: 'Increases the effective signal-to-noise ratio by sqrt(N_transits) and enables robust chi-square optimization of physical transit models.'
  },
  gaia_neighbors: {
    title: 'GAIA NEIGHBOURS & BLENDING',
    level1: 'Nearby stars can contribute light to the same observed region. Gaia helps us identify nearby sources that may be relevant to interpreting the signal.',
    level2: 'High-precision ESA Gaia DR3 astrometry identifies all neighboring stellar sources within the TESS photometric aperture (45" search radius).',
    level3: 'Quantifies the contamination dilution factor D = Σ F_contam / (F_target + Σ F_contam), preventing underestimated companion radii or false-positive eclipsing binary misclassifications.'
  },
  chromaticity: {
    title: 'CHROMATICITY & MULTI-BAND PHOTOMETRY',
    level1: 'Here we compare transit behaviour at different wavelengths when independent multi-band observations are available. A wavelength-dependent depth can be evidence that deserves further investigation.',
    level2: 'Measures color depth differential ΔD = D_blue - D_red across simultaneous multi-band passbands (e.g. g, r, i, z).',
    level3: 'Achromaticity (|ΔD / σ_ΔD| < 2.5) supports opaque planetary occultation. Large chromatic differences indicate blending with a star of differing effective temperature.'
  },
  plausibility: {
    title: 'ASTROPHYSICAL PLAUSIBILITY',
    level1: 'This module checks whether the proposed system is physically reasonable using the parameters available for the target.',
    level2: 'Derives fundamental Keplerian orbital dynamics, semi-major axis a, incident stellar insolation S_inc, and blackbody equilibrium temperature T_eq.',
    level3: 'Evaluates physical boundary regimes (e.g., Roche disruption limits, ultra-short periods, super-Jupiter radius limits) without black-box dismissal.'
  },
  mast: {
    title: 'MAST (MIKULSKI ARCHIVE)',
    level1: 'MAST is a NASA archive containing astronomical observations, including TESS data.',
    level2: 'The official NASA repository hosted at the Space Telescope Science Institute (STScI) providing calibrated SPOC 2-minute cadence light curves.',
    level3: 'Delivers PDCSAP_FLUX (Pre-search Data Conditioning Simple Aperture Photometry) with systematic instrument corrections and quality bitmasks.'
  },
  nasa_archive: {
    title: 'NASA EXOPLANET ARCHIVE',
    level1: 'This archive provides published and candidate exoplanet information used for contextual comparison.',
    level2: 'The official NASA/Caltech clearinghouse for confirmed exoplanet parameters and TESS Objects of Interest (TOI) candidate tables.',
    level3: 'Queried via Table Access Protocol (TAP) using Astronomical Data Query Language (ADQL) for target metadata, stellar parameters, and catalog designations.'
  },
  morphology: {
    title: 'TRANSIT MORPHOLOGY (MANDEL-AGOL)',
    level1: 'We examine the shape and structure of the brightness dip to see if it has the characteristic flat bottom of a planet crossing a star.',
    level2: 'Fits the analytical Mandel & Agol (2002) quadratic limb-darkened occultation model to extract ingress time T12, total duration T14, and impact parameter b.',
    level3: 'Distinguishes grazing binary configurations (high impact parameter b > 0.9 with V-shaped profiles) from central planetary transits (U-shaped flat bottoms).'
  },
  detrending: {
    title: 'BASELINE DETRENDING & OUTLIER QC',
    level1: 'Removes long-term starspot variations and telescope drifts so the clean transit signal can be measured.',
    level2: 'Applies 3.5-sigma Median Absolute Deviation (MAD) outlier rejection followed by windowed Savitzky-Golay polynomial baseline detrending.',
    level3: 'Preserves rapid transit ingress/egress dynamics while measuring residual baseline flatness RMS (ppm) and out-of-transit signal noise.'
  }
};

export const WhyMattersModal: React.FC<{
  isOpen: boolean;
  topicKey: string | null;
  onClose: () => void;
}> = ({ isOpen, topicKey, onClose }) => {
  if (!isOpen || !topicKey) return null;

  const topic = WHY_MATTERS_TOPICS[topicKey] || {
    title: 'UNDERSTAND THIS MEASUREMENT',
    level1: 'This measurement provides observational or computational evidence used to characterize the candidate signal.',
    level2: 'Quantitative astrophysical metric derived from photometric time series or catalog parameters.',
    level3: 'Used within the Trifecta evidence synthesis engine to evaluate consistency with the planetary companion hypothesis.'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn font-sans">
      <div className="bg-space-950 border border-space-800 rounded-2xl w-full max-w-2xl flex flex-col shadow-2xl overflow-hidden text-white">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-space-800 flex items-center justify-between bg-space-900">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-sky-500/10 border border-sky-500/30 rounded-lg text-sky-400">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-sky-400 tracking-wider">
                Progressive Explanation
              </span>
              <h3 className="text-base sm:text-lg font-bold font-mono text-white">
                {topic.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-space-400 hover:text-white rounded-lg hover:bg-space-850 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3-Level Progressive Disclosure */}
        <div className="p-5 space-y-4 text-xs">
          {/* Level 1: Simple */}
          <div className="bg-space-900/90 border border-space-800 rounded-xl p-4 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800/80 font-mono text-[10px] uppercase font-bold">
                Level 1 &middot; Simple Explanation
              </span>
            </div>
            <p className="text-space-200 text-sm leading-relaxed font-sans">
              {topic.level1}
            </p>
          </div>

          {/* Level 2: Scientific */}
          <div className="bg-space-900/90 border border-space-800 rounded-xl p-4 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-sky-950/80 text-sky-300 border border-sky-800/80 font-mono text-[10px] uppercase font-bold">
                Level 2 &middot; Scientific Formulation
              </span>
            </div>
            <p className="text-space-300 text-xs leading-relaxed font-sans">
              {topic.level2}
            </p>
          </div>

          {/* Level 3: Technical Details */}
          <div className="bg-space-950 border border-space-800 rounded-xl p-4 space-y-1.5 font-mono text-[11px] text-space-300">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 text-[10px] uppercase font-bold">
                Level 3 &middot; Technical & Mathematical Precision
              </span>
            </div>
            <p className="leading-relaxed text-space-300">
              {topic.level3}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-space-800 bg-space-900 flex items-center justify-between text-xs text-space-400 font-mono">
          <span>Trifecta Physics-Informed Screening Layer</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-sky-400 text-space-950 font-bold rounded-lg hover:bg-sky-300 transition-colors cursor-pointer"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};

export const WhyMattersButton: React.FC<{
  topicKey: string;
  onOpen: (key: string) => void;
  label?: string;
  className?: string;
}> = ({ topicKey, onOpen, label = 'Why does this matter?', className = '' }) => {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onOpen(topicKey);
      }}
      className={`inline-flex items-center gap-1 text-[11px] font-mono text-sky-400 hover:text-sky-300 underline underline-offset-2 transition-colors cursor-pointer ${className}`}
      title="Open 3-level progressive explanation"
    >
      <HelpCircle className="w-3.5 h-3.5" />
      <span>{label}</span>
    </button>
  );
};
