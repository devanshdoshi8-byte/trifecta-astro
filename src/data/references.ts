import { ExistingMethodComparison, ScientificReference, GlossaryTerm } from '../types/astrophysics';

export const EXISTING_METHODS_COMPARISON: ExistingMethodComparison[] = [
  {
    name: 'SPOC / DV',
    citation: 'Jenkins et al. (2016)',
    primaryEvidence: 'TESS pixel-level time-series & centroid offsets',
    statisticalApproach: 'Automated threshold crossing (TPS) & Data Validation (DV) suite',
    multiBandCapability: 'Single broadband (600–1000 nm)',
    interpretabilityScore: 'Moderate (Bayesian Probabilities)',
    computationalCost: 'Low (Seconds)',
    roleInEcosystem: 'Primary mission alert pipeline discovering initial candidate dips.'
  },
  {
    name: 'DAVE',
    citation: 'Kostov et al. (2019)',
    primaryEvidence: 'Centroid motion, odd-even depth differences, secondary eclipses',
    statisticalApproach: 'Automated statistical veto triage algorithms',
    multiBandCapability: 'Single broadband',
    interpretabilityScore: 'High (Explicit Reasoning)',
    computationalCost: 'Low (Seconds)',
    roleInEcosystem: 'Rapid identification of instrumental artifacts and obvious eclipsing binaries.'
  },
  {
    name: 'VESPA',
    citation: 'Morton (2012, 2015)',
    primaryEvidence: 'Single-band light curve shape & TRILEGAL galactic star counts',
    statisticalApproach: 'Bayesian model comparison calculating False Positive Probability (FPP)',
    multiBandCapability: 'Single broadband (with optional color imaging priors)',
    interpretabilityScore: 'Moderate (Bayesian Probabilities)',
    computationalCost: 'High (MCMC Population Sampling)',
    roleInEcosystem: 'Statistical planet validation via exhaustive galactic binary likelihood modeling.'
  },
  {
    name: 'TRICERATOPS',
    citation: 'Giacalone & Dressing (2020)',
    primaryEvidence: 'TESS target pixels, TIC/Gaia neighbor catalogs, ground follow-up',
    statisticalApproach: 'Bayesian marginalization of 18 astrophysical scenarios (FPP & NFPP)',
    multiBandCapability: 'Ingests ground contrast curves and follow-up transit depths',
    interpretabilityScore: 'Moderate (Bayesian Probabilities)',
    computationalCost: 'High (MCMC Population Sampling)',
    roleInEcosystem: 'Standard Bayesian validation tool for TESS candidates in crowded fields.'
  },
  {
    name: 'TRICERATOPS+',
    citation: 'Giacalone et al. (2023)',
    primaryEvidence: 'Multivariate Bayesian modeling with radial velocity priors',
    statisticalApproach: 'Combined photometric + spectroscopic Bayesian likelihood',
    multiBandCapability: 'Multi-filter transit depth incorporation',
    interpretabilityScore: 'Moderate (Bayesian Probabilities)',
    computationalCost: 'High (MCMC Population Sampling)',
    roleInEcosystem: 'High-precision statistical validation incorporating ground imaging & RVs.'
  },
  {
    name: 'TRIFECTA (This Work)',
    citation: 'Student Research Initiative (2026)',
    primaryEvidence: 'Multi-band follow-up depth deltas, light curve geometry, host-star plausibility',
    statisticalApproach: 'Interpretable multi-pillar diagnostic screening with transparent reasoning',
    multiBandCapability: 'Explicit multi-band depth delta significance testing (g, r, i, z)',
    interpretabilityScore: 'High (Explicit Reasoning)',
    computationalCost: 'Low (Seconds)',
    roleInEcosystem: 'Complementary screening layer prioritizing candidates before heavy Bayesian runs.'
  }
];

export const SCIENTIFIC_REFERENCES: ScientificReference[] = [
  {
    id: 'ricker2015',
    authors: 'Ricker, G. R., Winn, J. N., Vanderspek, R., et al.',
    year: 2015,
    title: 'Transiting Exoplanet Survey Satellite (TESS)',
    journal: 'Journal of Astronomical Telescopes, Instruments, and Systems, 1(1), 014003',
    doi: '10.1117/1.JATIS.1.1.014003',
    relevance: 'Defines the primary mission architecture, wide-field optical bandpass (600–1000 nm), and candidate discovery parameters for TESS.',
    category: 'TESS Mission'
  },
  {
    id: 'giacalone2020',
    authors: 'Giacalone, S., Dressing, C. D., Jensen, E. L. N., et al.',
    year: 2021,
    title: 'Vetting of Exoplanet Candidates with TRICERATOPS and Validation of 17 TESS Exoplanets',
    journal: 'The Astronomical Journal, 161(1), 24',
    doi: '10.3847/1538-3881/abc446',
    relevance: 'Bayesian tool calculating false-positive probabilities (FPP) and nearby false-positive probabilities (NFPP) from stellar catalogs and light curves.',
    category: 'Validation Pipelines'
  },
  {
    id: 'morton2012',
    authors: 'Morton, T. D.',
    year: 2012,
    title: 'An Efficient Automated Validation Procedure for Transiting Exoplanets',
    journal: 'The Astrophysical Journal, 761(1), 6',
    doi: '10.1088/0004-637X/761/1/6',
    relevance: 'Foundational automated statistical validation framework (VESPA) calculating Bayesian likelihood of competing astrophysical hypotheses.',
    category: 'Validation Pipelines'
  },
  {
    id: 'kostov2019',
    authors: 'Kostov, V. B., Schlieder, J. E., Barclay, T., et al.',
    year: 2019,
    title: 'Discovery and Vetting of Exoplanet Candidates with the TESS Mission',
    journal: 'The Astronomical Journal, 158(1), 32',
    doi: '10.3847/1538-3881/ab2459',
    relevance: 'Standardized vetting protocols for TESS Objects of Interest (TOIs) and characterization of instrumental vs astrophysical false alarms.',
    category: 'TESS Mission'
  },
  {
    id: 'mandel2002',
    authors: 'Mandel, K., & Agol, E.',
    year: 2002,
    title: 'Analytic Light Curves for Planetary Transit Searches',
    journal: 'The Astrophysical Journal Letters, 580(2), L171',
    doi: '10.1086/345520',
    relevance: 'Analytic equations for light curves of transiting systems including non-linear and quadratic limb darkening models.',
    category: 'Transit Physics'
  },
  {
    id: 'narita2019',
    authors: 'Narita, N., Fukui, A., Kusakabe, N., et al.',
    year: 2019,
    title: 'MuSCAT2: 4-color Simultaneous Camera for the 1.52 m Telescopio Carlos Sánchez',
    journal: 'Journal of Astronomical Telescopes, Instruments, and Systems, 5(1), 015001',
    doi: '10.1117/1.JATIS.5.1.015001',
    relevance: 'Demonstrates simultaneous 4-band optical transit photometry (g, r, i, z_s) for ruling out blended eclipsing binaries via chromatic depth verification.',
    category: 'Photometry & Follow-up'
  },
  {
    id: 'collins2018',
    authors: 'Collins, K. A., Quinn, S. N., Latham, D. W., et al.',
    year: 2018,
    title: 'The TESS Follow-up Observing Program (TFOP)',
    journal: 'American Astronomical Society Meeting Abstracts #231, 439.08',
    relevance: 'Framework organizing ground-based photometric, spectroscopic, and imaging follow-up to eliminate false positives in large pixel apertures (21 arcsec/pixel).',
    category: 'Photometry & Follow-up'
  },
  {
    id: 'jenkins2016',
    authors: 'Jenkins, J. M., Twicken, J. D., McCauliff, S., et al.',
    year: 2016,
    title: 'The TESS Science Processing Operations Center (SPOC) Pipeline',
    journal: 'Software and Cyberinfrastructure for Astronomy IV, SPIE Proc. 9913, 99133E',
    doi: '10.1117/12.2233418',
    relevance: 'Automated data reduction, calibration, detrending, transit search (TPS), and data validation (DV) pipeline for the primary TESS data stream.',
    category: 'TESS Mission'
  }
];

export const ASTROPHYSICAL_GLOSSARY: GlossaryTerm[] = [
  {
    term: 'TESS Object of Interest (TOI)',
    definition: 'A candidate exoplanet transit signal identified in TESS time-series photometric data that has passed initial automated triage and been assigned for follow-up.',
    relevanceToTrifecta: 'Primary input population for the Trifecta screening workflow.'
  },
  {
    term: 'Blended Eclipsing Binary (BEB)',
    definition: 'An astrophysical false positive where the light from an eclipsing binary system is spatially blended inside the instrument photometric aperture with a brighter foreground star.',
    relevanceToTrifecta: 'Targeted directly by the Chromaticity module through multi-band depth comparison.',
    formula: 'Δδ = δ_blue - δ_red'
  },
  {
    term: 'Achromaticity',
    definition: 'The physical property of producing identical relative transit depths across different optical and infrared wavelength bandpasses to first order for an opaque companion.',
    relevanceToTrifecta: 'Core hypothesis of Pillar 1: genuine planetary transits are expected to be approximately achromatic across broad optical filters.'
  },
  {
    term: 'Limb Darkening',
    definition: 'The optical effect where the central disc of a star appears brighter than its outer perimeter due to increasing optical depth through cooler upper atmospheric layers.',
    relevanceToTrifecta: 'Governs the subtle curved bottom in planetary transits analyzed by Pillar 2 (Morphology).'
  },
  {
    term: 'Impact Parameter (b)',
    definition: 'The sky-projected distance between the center of the stellar disk and the center of the planet disk at mid-transit, normalized to the stellar radius.',
    relevanceToTrifecta: 'High impact parameters (b > 0.8) produce grazing, V-shaped transits which overlap with eclipsing binary morphologies.',
    formula: 'b = (a/R*) * cos(i)'
  },
  {
    term: 'Equilibrium Temperature (T_eq)',
    definition: 'The theoretical surface temperature of a planet assuming radiative balance between absorbed stellar irradiation and re-emitted thermal energy.',
    relevanceToTrifecta: 'Used in Pillar 3 (Plausibility) to identify extreme irradiation regimes and atmospheric evaporation boundaries.',
    formula: 'T_eq = T_* * sqrt(R_* / 2a) * (1 - A_B)^(1/4)'
  },
  {
    term: 'Fluid Roche Limit',
    definition: 'The minimum orbital distance at which a celestial body, held together only by its own gravity, can approach a host star without being torn apart by tidal forces.',
    relevanceToTrifecta: 'Screening check in Pillar 3 to flag unphysically close orbital configurations.',
    formula: 'd_Roche ≈ 2.44 * R_p * (ρ_p / ρ_*)^(1/3)'
  },
  {
    term: 'ExoFOP / TFOP',
    definition: 'The Exoplanet Follow-up Observing Program web portal providing centralized access to ground-based follow-up observations, high-resolution imaging, and multi-color photometry.',
    relevanceToTrifecta: 'The source repository from which multi-wavelength photometric data is ingested when available.'
  }
];
