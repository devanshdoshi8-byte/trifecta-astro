import { CandidateAssessment } from '../types/astrophysics';
import { generateSyntheticLightCurve, generateRawUnfoldedLightCurve } from '../utils/physicsEngine';

export const RESEARCH_CANDIDATES: CandidateAssessment[] = [
  {
    candidateId: 'TOI-1233.01',
    hostStarName: 'TIC 260128333 (HD 190406-analog)',
    ticId: '260128333',
    tessSector: [14, 15, 26, 40],
    dataSource: 'DEMO DATA — NOT AN OBSERVATIONAL RESULT',
    overallStatus: 'low_concern',
    headlineSummary: 'Low Concern — Pristine Candidate Prioritized for Precision Radial Velocity (PRV)',
    detailedReasoning: 'Transit depth is consistent across blue (g-band, 0.82%) and red (z-band, 0.81%) filters with a statistically non-significant difference (0.16σ). Light curve displays a distinct flat-bottom transit with limb darkening and clean Gaussian residuals (115 ppm RMS). Inferred radius of 2.31 R⊕ at 14.17d orbital period is physically consistent with a temperate sub-Neptune around a Solar analog.',
    recommendedFollowup: 'High-resolution radial velocity monitoring (e.g. ESPRESSO/HARPS-N) to determine planetary mass; adaptive optics imaging to confirm absence of close bound companions.',
    dataQuality: {
      overallLevel: 'EXCELLENT',
      signalToNoiseRatio: 28.4,
      photometricCompleteness: 99.2,
      baselineFlatnessRmsPpm: 115,
      inTransitCoverage: 100.0,
      hasGroundMultiBand: true,
      multiBandFilters: ['MuSCAT2 g-band (400–550 nm)', 'MuSCAT2 z-band (820–920 nm)'],
      flags: ['Clean 4-sector baseline', 'Uniform out-of-transit phase coverage']
    },
    chromaticity: {
      status: 'low_concern',
      blueBandDepth: 0.82,
      blueBandDepthErr: 0.04,
      redBandDepth: 0.81,
      redBandDepthErr: 0.05,
      deltaDepth: 0.01,
      deltaDepthErr: 0.064,
      significanceSigma: 0.16,
      hasMultiBandData: true,
      filtersUsed: ['MuSCAT2 g-band (400–550 nm)', 'MuSCAT2 z-band (820–920 nm)'],
      scientificInterpretation: 'Consistent with approximately achromatic transit across optical bandpasses.',
      technicalDetails: 'Measured depth difference Δδ = 0.01 ± 0.06% yields a significance of 0.16σ, well below the 1.5σ threshold for chromatic concern. Opaque companion occultation model satisfied.',
      notes: 'First-order expectation for an opaque sub-Neptune is satisfied within observational uncertainties.'
    },
    morphology: {
      status: 'low_concern',
      transitDepth: 0.815,
      transitDepthErr: 0.03,
      totalDurationHours: 2.84,
      ingressDurationMin: 14.2,
      egressDurationMin: 14.5,
      ingressTotalRatio: 0.168,
      symmetryScore: 0.98,
      shapeConsistency: 'High (Transit-like)',
      residualRmsPpm: 115,
      signalToNoiseRatio: 28.4,
      scientificInterpretation: 'Transit-like morphology detected with symmetric ingress/egress and distinct limb-darkened flat floor.',
      technicalDetails: 'Fitted impact parameter b = 0.15 ± 0.08. Ratio (T12+T34)/2T14 = 0.168 confirms central transit geometry with clear first-to-second contact distinction.',
      notes: 'Total duration and ingress timing match theoretical central transit of a companion across a 1.02 R☉ host.'
    },
    plausibility: {
      status: 'low_concern',
      hostStarTeftK: 5780,
      hostStarRadiusSolar: 1.02,
      hostStarMassSolar: 1.01,
      hostSpectralType: 'G2V (Solar analog)',
      orbitalPeriodDays: 14.17,
      semiMajorAxisAU: 0.114,
      candidateRadiusEarth: 2.31,
      candidateRadiusJupiter: 0.206,
      incidentFluxEarth: 7.8,
      equilibriumTempK: 540,
      rocheLimitAU: 0.003,
      stellarDensityGcm3: 1.34,
      photometricStellarDensityGcm3: 1.31,
      parameterSpaceFlags: [],
      scientificInterpretation: 'Physical properties are consistent with known sub-Neptune populations without parameter-space anomalies.',
      technicalDetails: 'Mean density derived from transit duration (1.31 g/cm³) closely matches host catalog spectroscopic density (1.34 g/cm³). Roche tidal margin is 38x.',
      notes: 'Separation (0.114 AU) is well outside the stellar Roche boundary. Inferred equilibrium temperature supports a stable gaseous envelope.'
    },
    evidenceFor: [
      {
        type: 'supporting',
        pillar: 'chromaticity',
        summary: 'Achromatic optical transit depth',
        detail: 'Simultaneous g- and z-band depths agree to within 0.16σ (Δδ = 0.01 ± 0.06%), satisfying the first-order expectation for an opaque companion.'
      },
      {
        type: 'supporting',
        pillar: 'morphology',
        summary: 'Distinct limb-darkened flat floor',
        detail: 'Ingress-to-total ratio (0.168) and high symmetry (0.98) match central transit across a solar-type host star.'
      },
      {
        type: 'supporting',
        pillar: 'plausibility',
        summary: 'Photometric stellar density matches host',
        detail: 'Derived stellar density of 1.31 g/cm³ is in close agreement with catalog spectroscopic density of 1.34 g/cm³.'
      },
      {
        type: 'supporting',
        pillar: 'data_quality',
        summary: 'High SNR across 4 TESS sectors',
        detail: 'Clean phased light curve with 28.4 SNR and 115 ppm residual scatter.'
      }
    ],
    evidenceAgainst: [
      {
        type: 'caution',
        pillar: 'data_quality',
        summary: 'Radial velocity mass unconstrained',
        detail: 'True planetary nature cannot be proven until high-precision Doppler measurements rule out non-transiting brown dwarf scenarios.'
      },
      {
        type: 'caution',
        pillar: 'chromaticity',
        summary: 'Atmospheric transmission unprobed',
        detail: 'Ground multi-band precision (±0.04%) is sufficient for stellar blend exclusion, but does not constrain atmospheric scale heights.'
      }
    ],
    lightCurves: {
      tessLightCurve: generateSyntheticLightCurve(0.815, 2.84, 0.24, 0.035, 95, 'TESS (broad)', 0.15),
      blueLightCurve: generateSyntheticLightCurve(0.820, 2.84, 0.24, 0.050, 75, 'g-band (blue)', 0.15),
      redLightCurve: generateSyntheticLightCurve(0.810, 2.84, 0.24, 0.055, 75, 'z-band (red)', 0.15),
      rawUnfoldedLightCurve: generateRawUnfoldedLightCurve(14.17, 0.815, 2.84, 0.24, 27.4, 30)
    }
  },
  {
    candidateId: 'TOI-2180.02',
    hostStarName: 'TIC 419283711',
    ticId: '419283711',
    tessSector: [22, 23],
    dataSource: 'DEMO DATA — NOT AN OBSERVATIONAL RESULT',
    overallStatus: 'false_positive_signature',
    headlineSummary: 'Potential False-Positive Signature — Chromatic Depth Discrepancy Detected (7.18σ)',
    detailedReasoning: 'Ground-based follow-up reveals severe chromatic transit depth variation between blue (g-band: 1.42%) and red (z-band: 0.86%) filters, yielding a 7.18σ discrepancy (Δδ = +0.56 ± 0.078%). This strongly indicates contamination by an unresolved, cooler eclipsing binary where relative flux dilution varies across bandpasses.',
    recommendedFollowup: 'High-contrast speckle interferometry / adaptive optics imaging to resolve nearby visual contaminants; multi-color centroid offset analysis.',
    dataQuality: {
      overallLevel: 'GOOD',
      signalToNoiseRatio: 21.6,
      photometricCompleteness: 96.5,
      baselineFlatnessRmsPpm: 185,
      inTransitCoverage: 100.0,
      hasGroundMultiBand: true,
      multiBandFilters: ['TFOP LCOGT g-band (Sloan g\')', 'TFOP LCOGT z-band (Pan-STARRS z\')'],
      flags: ['Moderate centroid scatter in sector 23']
    },
    chromaticity: {
      status: 'false_positive_signature',
      blueBandDepth: 1.42,
      blueBandDepthErr: 0.06,
      redBandDepth: 0.86,
      redBandDepthErr: 0.05,
      deltaDepth: 0.56,
      deltaDepthErr: 0.078,
      significanceSigma: 7.18,
      hasMultiBandData: true,
      filtersUsed: ['TFOP LCOGT g-band (Sloan g\')', 'TFOP LCOGT z-band (Pan-STARRS z\')'],
      scientificInterpretation: 'Chromaticity detected — investigate blended-source hypothesis.',
      technicalDetails: 'Transit depth difference Δδ = +0.56% exceeds combined observational uncertainty by 7.18σ. Strong wavelength dependence is indicative of differing color temperatures between target and contaminating eclipsing star.',
      notes: 'Depth difference Δδ = 0.56% exceeds observational uncertainty by >7σ. Wavelength dependence of this magnitude is uncharacteristic of planetary atmospheres.'
    },
    morphology: {
      status: 'low_concern',
      transitDepth: 1.08,
      transitDepthErr: 0.05,
      totalDurationHours: 3.10,
      ingressDurationMin: 18.0,
      egressDurationMin: 17.5,
      ingressTotalRatio: 0.191,
      symmetryScore: 0.95,
      shapeConsistency: 'High (Transit-like)',
      residualRmsPpm: 185,
      signalToNoiseRatio: 21.6,
      scientificInterpretation: 'Broadband light curve exhibits deceptive transit-like shape due to spatial flux blending.',
      technicalDetails: 'Single-band shape fitting in TESS broadband yields nominal planetary geometry because flux blending preserves U-shape while scaling depth.',
      notes: 'TESS single-band light curve appears superficially planetary; only multi-band follow-up reveals the blended nature.'
    },
    plausibility: {
      status: 'low_concern',
      hostStarTeftK: 6150,
      hostStarRadiusSolar: 1.25,
      hostStarMassSolar: 1.18,
      hostSpectralType: 'F8V',
      orbitalPeriodDays: 4.82,
      semiMajorAxisAU: 0.058,
      candidateRadiusEarth: 3.82,
      candidateRadiusJupiter: 0.341,
      incidentFluxEarth: 465,
      equilibriumTempK: 1220,
      rocheLimitAU: 0.005,
      stellarDensityGcm3: 0.85,
      photometricStellarDensityGcm3: 0.82,
      parameterSpaceFlags: ['Apparent parameters nominal, but confounded by blended companion flux'],
      scientificInterpretation: 'Individual host star parameters alone do not flag unphysicality; false positive origin is revealed purely through multi-band chromaticity.',
      technicalDetails: 'Calculated semi-major axis (0.058 AU) and inferred radius (3.82 R⊕) are plausible for a warm Neptune, illustrating how blended binaries masquerade in parameter space.',
      notes: 'Demonstrates why morphology and single-band data alone are insufficient to rule out blended eclipsing binaries.'
    },
    evidenceFor: [
      {
        type: 'supporting',
        pillar: 'morphology',
        summary: 'Deceptively clean transit shape',
        detail: 'TESS optical light curve displays a symmetric 3.1h duration event with flat bottom, mimicking a warm Neptune.'
      },
      {
        type: 'supporting',
        pillar: 'plausibility',
        summary: 'Apparent physical properties plausible',
        detail: 'Host spectral type F8V and orbital period 4.82d yield standard planetary parameter bounds if blending is ignored.'
      }
    ],
    evidenceAgainst: [
      {
        type: 'caution',
        pillar: 'chromaticity',
        summary: 'Severe 7.18σ chromatic depth difference',
        detail: 'g-band depth of 1.42% vs z-band depth of 0.86% proves significant color-dependent flux dilution from an unresolved cool companion.'
      },
      {
        type: 'caution',
        pillar: 'data_quality',
        summary: 'Centroid motion detected',
        detail: 'Photometric center-of-light shifts during transit, corroborating an off-target eclipsing binary inside the 21" TESS pixel.'
      }
    ],
    lightCurves: {
      tessLightCurve: generateSyntheticLightCurve(1.08, 3.10, 0.30, 0.045, 95, 'TESS (broad)', 0.2),
      blueLightCurve: generateSyntheticLightCurve(1.42, 3.10, 0.30, 0.065, 75, 'g-band (blue)', 0.2),
      redLightCurve: generateSyntheticLightCurve(0.86, 3.10, 0.30, 0.060, 75, 'z-band (red)', 0.2),
      rawUnfoldedLightCurve: generateRawUnfoldedLightCurve(4.82, 1.08, 3.10, 0.30, 27.4, 30)
    }
  },
  {
    candidateId: 'TOI-503.01',
    hostStarName: 'TIC 141527311',
    ticId: '141527311',
    tessSector: [7, 8, 34],
    dataSource: 'DEMO DATA — NOT AN OBSERVATIONAL RESULT',
    overallStatus: 'review_required',
    headlineSummary: 'Review Required — High Ingress/Egress Ratio (Possible Grazing Binary or High Impact Parameter)',
    detailedReasoning: 'Transit exhibits a pronounced V-shaped morphology with an ingress-to-total duration ratio of 0.48, signaling a high impact parameter (b ≈ 0.88). Multi-band follow-up shows achromatic depth (Δδ = 0.04%, 0.25σ), ruling out strong chromatic dilution, but grazing eclipsing binary scenario cannot be excluded without radial velocity constraints.',
    recommendedFollowup: 'Reconnaissance spectroscopy to measure stellar RV variations and check for double-lined binary spectrum; photometric modeling with unconstrained impact parameter.',
    dataQuality: {
      overallLevel: 'GOOD',
      signalToNoiseRatio: 38.7,
      photometricCompleteness: 98.1,
      baselineFlatnessRmsPpm: 240,
      inTransitCoverage: 100.0,
      hasGroundMultiBand: true,
      multiBandFilters: ['LCOGT 1m B-band', 'LCOGT 1m i-band'],
      flags: ['High SNR deep event']
    },
    chromaticity: {
      status: 'low_concern',
      blueBandDepth: 3.12,
      blueBandDepthErr: 0.11,
      redBandDepth: 3.08,
      redBandDepthErr: 0.12,
      deltaDepth: 0.04,
      deltaDepthErr: 0.163,
      significanceSigma: 0.25,
      hasMultiBandData: true,
      filtersUsed: ['LCOGT 1m B-band', 'LCOGT 1m i-band'],
      scientificInterpretation: 'Consistent with approximately achromatic event.',
      technicalDetails: 'Δδ = 0.04 ± 0.16% (0.25σ) indicates equal optical depths across filters, ruling out severe chromatic dilution from distant background stars.',
      notes: 'No significant color dependence detected; indicates companion is either non-luminous or system has equal color components.'
    },
    morphology: {
      status: 'review_required',
      transitDepth: 3.10,
      transitDepthErr: 0.08,
      totalDurationHours: 1.15,
      ingressDurationMin: 27.5,
      egressDurationMin: 28.0,
      ingressTotalRatio: 0.482,
      symmetryScore: 0.94,
      shapeConsistency: 'V-shaped / Grazing',
      residualRmsPpm: 240,
      signalToNoiseRatio: 38.7,
      scientificInterpretation: 'V-shaped transit geometry detected; lacking distinct flat bottom.',
      technicalDetails: 'Ratio of ingress to total duration (0.482) requires an impact parameter b = 0.88 ± 0.05. In a grazing configuration, the companion disk does not fully enter the host stellar disk.',
      notes: 'Ratio of ingress duration to total duration (0.482) is characteristic of a grazing transit (b > 0.85) or an eclipsing stellar binary with comparable radii.'
    },
    plausibility: {
      status: 'review_required',
      hostStarTeftK: 4750,
      hostStarRadiusSolar: 0.76,
      hostStarMassSolar: 0.78,
      hostSpectralType: 'K3V',
      orbitalPeriodDays: 2.15,
      semiMajorAxisAU: 0.030,
      candidateRadiusEarth: 14.50,
      candidateRadiusJupiter: 1.29,
      incidentFluxEarth: 641,
      equilibriumTempK: 1040,
      rocheLimitAU: 0.004,
      stellarDensityGcm3: 2.50,
      photometricStellarDensityGcm3: 5.80,
      parameterSpaceFlags: ['Large inferred radius (1.29 R_Jup) combined with grazing morphology', 'Photometric stellar density discrepancy (>2x)'],
      scientificInterpretation: 'Radius is in the gas giant / low-mass brown dwarf overlap zone; physical scenario depends heavily on true orbital inclination.',
      technicalDetails: 'Photometric stellar density derived assuming central transit (5.80 g/cm³) severely conflicts with true K3V host density (2.50 g/cm³), reinforcing high impact parameter.',
      notes: 'Under grazing geometry, true companion radius may be significantly larger than calculated under central transit assumption.'
    },
    evidenceFor: [
      {
        type: 'supporting',
        pillar: 'chromaticity',
        summary: 'Achromatic multi-band depth',
        detail: 'B-band (3.12%) and i-band (3.08%) depths agree within 0.25σ, indicating no multi-color flux dilution.'
      },
      {
        type: 'supporting',
        pillar: 'data_quality',
        summary: 'High signal-to-noise ratio (38.7)',
        detail: 'Deep 3.1% signal is unambiguous in raw time series with well-sampled out-of-transit baseline.'
      }
    ],
    evidenceAgainst: [
      {
        type: 'caution',
        pillar: 'morphology',
        summary: 'V-shaped grazing morphology',
        detail: 'Ingress takes ~48% of total duration with no flat bottom, characteristic of b > 0.85 grazing geometry.'
      },
      {
        type: 'caution',
        pillar: 'plausibility',
        summary: 'Stellar density discrepancy',
        detail: 'Photometric stellar density (5.80 g/cm³) diverges from spectroscopic host density (2.50 g/cm³) due to grazing bias.'
      }
    ],
    lightCurves: {
      tessLightCurve: generateSyntheticLightCurve(3.10, 1.15, 0.46, 0.05, 95, 'TESS (broad)', 0.88),
      blueLightCurve: generateSyntheticLightCurve(3.12, 1.15, 0.46, 0.08, 75, 'g-band (blue)', 0.88),
      redLightCurve: generateSyntheticLightCurve(3.08, 1.15, 0.46, 0.08, 75, 'z-band (red)', 0.88),
      rawUnfoldedLightCurve: generateRawUnfoldedLightCurve(2.15, 3.10, 1.15, 0.46, 27.4, 30)
    }
  },
  {
    candidateId: 'TOI-874.01',
    hostStarName: 'TIC 88392019',
    ticId: '88392019',
    tessSector: [11],
    dataSource: 'DEMO DATA — NOT AN OBSERVATIONAL RESULT',
    overallStatus: 'false_positive_signature',
    headlineSummary: 'Potential False-Positive Signature — Unphysical Inferred Companion Radius (3.42 RJup)',
    detailedReasoning: 'Deep transit (6.85%) across a low-mass M-dwarf host (0.38 R☉) yields an inferred companion radius of 3.42 RJup (38.3 R⊕). Because electron degeneracy pressure limits cold hydrogen-helium bodies to ~1.2–1.5 RJup, an inferred radius >3 RJup around an uninflated dwarf implies the eclipsing body is a self-luminous M-dwarf stellar companion.',
    recommendedFollowup: 'Low-resolution optical spectroscopy to detect secondary stellar lines; phase-curve modeling for ellipsoidal variations and secondary eclipse.',
    dataQuality: {
      overallLevel: 'GOOD',
      signalToNoiseRatio: 57.0,
      photometricCompleteness: 97.4,
      baselineFlatnessRmsPpm: 310,
      inTransitCoverage: 100.0,
      hasGroundMultiBand: true,
      multiBandFilters: ['CHAT 0.7m r-band', 'CHAT 0.7m z-band'],
      flags: ['Short orbital period (0.85d)']
    },
    chromaticity: {
      status: 'low_concern',
      blueBandDepth: 6.88,
      blueBandDepthErr: 0.18,
      redBandDepth: 6.82,
      redBandDepthErr: 0.15,
      deltaDepth: 0.06,
      deltaDepthErr: 0.234,
      significanceSigma: 0.26,
      hasMultiBandData: true,
      filtersUsed: ['CHAT 0.7m r-band', 'CHAT 0.7m z-band'],
      scientificInterpretation: 'Achromatic deep eclipse observed.',
      technicalDetails: 'Multi-band depths match (Δδ = 0.06 ± 0.23%, 0.26σ) because both stars in the binary system have similar surface temperatures / spectral types.',
      notes: 'Multi-band depths match because both stars in the binary system have similar surface temperatures / spectral types.'
    },
    morphology: {
      status: 'low_concern',
      transitDepth: 6.85,
      transitDepthErr: 0.12,
      totalDurationHours: 1.45,
      ingressDurationMin: 12.0,
      egressDurationMin: 12.2,
      ingressTotalRatio: 0.140,
      symmetryScore: 0.99,
      shapeConsistency: 'High (Transit-like)',
      residualRmsPpm: 310,
      signalToNoiseRatio: 57.0,
      scientificInterpretation: 'Clear box-shaped eclipse profile.',
      technicalDetails: 'Flat floor is well-defined and ingress is steep (12 min), consistent with complete geometric occultation.',
      notes: 'Flat floor is well-defined, but depth (6.85%) is extraordinarily deep for a planetary candidate.'
    },
    plausibility: {
      status: 'false_positive_signature',
      hostStarTeftK: 3400,
      hostStarRadiusSolar: 0.38,
      hostStarMassSolar: 0.35,
      hostSpectralType: 'M3V (Red Dwarf)',
      orbitalPeriodDays: 0.85,
      semiMajorAxisAU: 0.012,
      candidateRadiusEarth: 38.3,
      candidateRadiusJupiter: 3.42,
      incidentFluxEarth: 1004,
      equilibriumTempK: 890,
      rocheLimitAU: 0.002,
      stellarDensityGcm3: 8.94,
      photometricStellarDensityGcm3: 8.65,
      parameterSpaceFlags: [
        'Candidate radius 3.42 R_Jup exceeds maximum physical limit (~1.5 R_Jup) for sub-stellar objects',
        'Companion radius is comparable to host star radius (Rp/R* ≈ 0.26)'
      ],
      scientificInterpretation: 'Severe parameter space violation: radius is physically incompatible with a planetary body.',
      technicalDetails: 'Planetary radius is constrained by Coulomb forces at low mass and electron degeneracy at high mass; no planet can maintain a radius of 3.42 RJup without being self-luminous.',
      notes: 'Planetary radius is constrained by Coulomb forces at low mass and electron degeneracy at high mass; no planet can maintain a radius of 3.42 RJup.'
    },
    evidenceFor: [
      {
        type: 'supporting',
        pillar: 'chromaticity',
        summary: 'Achromatic eclipse depth',
        detail: 'Equal eclipse depth in r and z filters indicates equal optical extinction across bandpasses.'
      },
      {
        type: 'supporting',
        pillar: 'morphology',
        summary: 'Clear box-like geometry',
        detail: 'Sharp ingress/egress contacts with flat bottom floor.'
      }
    ],
    evidenceAgainst: [
      {
        type: 'caution',
        pillar: 'plausibility',
        summary: 'Unphysical 3.42 RJup inferred radius',
        detail: 'Maximum planetary radius limit for cold or irradiated gas giants is ~1.5–2.0 RJup. An inferred 3.42 RJup object is an eclipsing M-dwarf star.'
      },
      {
        type: 'caution',
        pillar: 'plausibility',
        summary: 'Rp / R* ratio of 0.26',
        detail: 'Companion radius is 26% of host star radius, requiring stellar-mass gravitational equilibrium.'
      }
    ],
    lightCurves: {
      tessLightCurve: generateSyntheticLightCurve(6.85, 1.45, 0.20, 0.07, 95, 'TESS (broad)', 0.1),
      blueLightCurve: generateSyntheticLightCurve(6.88, 1.45, 0.20, 0.10, 75, 'g-band (blue)', 0.1),
      redLightCurve: generateSyntheticLightCurve(6.82, 1.45, 0.20, 0.10, 75, 'z-band (red)', 0.1),
      rawUnfoldedLightCurve: generateRawUnfoldedLightCurve(0.85, 6.85, 1.45, 0.20, 27.4, 30)
    }
  },
  {
    candidateId: 'TOI-3301.01',
    hostStarName: 'TIC 390124810',
    ticId: '390124810',
    tessSector: [31],
    dataSource: 'DEMO DATA — NOT AN OBSERVATIONAL RESULT',
    overallStatus: 'review_required',
    headlineSummary: 'Review Required — Multi-Band Follow-up Data Currently Unavailable in Archive',
    detailedReasoning: 'TESS light curve displays a clean 0.32% transit consistent with a 1.85 R⊕ candidate orbiting a K-dwarf host. However, no ground-based multi-band follow-up observations have been acquired yet. The chromaticity module is appropriately bypassed, and candidate is placed in priority queue for multi-color photometric screening.',
    recommendedFollowup: 'Schedule 2-color or 4-color simultaneous transit observation (e.g. MuSCAT2 or Las Cumbres Observatory) to test chromaticity hypothesis.',
    dataQuality: {
      overallLevel: 'LIMITED',
      signalToNoiseRatio: 16.0,
      photometricCompleteness: 94.2,
      baselineFlatnessRmsPpm: 88,
      inTransitCoverage: 100.0,
      hasGroundMultiBand: false,
      multiBandFilters: [],
      flags: ['Single-sector observation only', 'Ground follow-up pending']
    },
    chromaticity: {
      status: 'insufficient_data',
      blueBandDepth: 0,
      blueBandDepthErr: 0,
      redBandDepth: 0,
      redBandDepthErr: 0,
      deltaDepth: 0,
      deltaDepthErr: 0,
      significanceSigma: 0,
      hasMultiBandData: false,
      missingDataReason: 'No multi-filter ground observations ingested in ExoFOP. TESS single-band broad photometry cannot extract color differences.',
      filtersUsed: [],
      scientificInterpretation: 'Data availability dependent: Multi-band ground follow-up data not yet available in archive.',
      technicalDetails: 'Chromaticity module gracefully bypassed to prevent ungrounded classification. Framework relies on Morphology and Plausibility modules until color data is ingested.',
      notes: 'Chromaticity analysis safely skipped. The framework relies on Morphology and Plausibility modules until color data is ingested.'
    },
    morphology: {
      status: 'low_concern',
      transitDepth: 0.32,
      transitDepthErr: 0.02,
      totalDurationHours: 3.20,
      ingressDurationMin: 18.0,
      egressDurationMin: 18.2,
      ingressTotalRatio: 0.189,
      symmetryScore: 0.97,
      shapeConsistency: 'High (Transit-like)',
      residualRmsPpm: 88,
      signalToNoiseRatio: 16.0,
      scientificInterpretation: 'Transit-like morphology observed in single-sector TESS SPOC light curve.',
      technicalDetails: 'Fitted profile displays shallow flat floor consistent with a small rocky / volatile-rich sub-Neptune (Rp = 1.85 R⊕).',
      notes: 'No obvious morphological anomalies or systematic artifacts detected.'
    },
    plausibility: {
      status: 'low_concern',
      hostStarTeftK: 5100,
      hostStarRadiusSolar: 0.84,
      hostStarMassSolar: 0.86,
      hostSpectralType: 'K1V',
      orbitalPeriodDays: 8.42,
      semiMajorAxisAU: 0.076,
      candidateRadiusEarth: 1.85,
      candidateRadiusJupiter: 0.165,
      incidentFluxEarth: 21.5,
      equilibriumTempK: 685,
      rocheLimitAU: 0.002,
      stellarDensityGcm3: 2.05,
      photometricStellarDensityGcm3: 1.98,
      parameterSpaceFlags: [],
      scientificInterpretation: 'Physical properties match expected Super-Earth / Mini-Neptune regime.',
      technicalDetails: 'Host parameters and orbital separation satisfy standard stability criteria with no Roche disruption risk.',
      notes: 'All host and orbital parameters satisfy baseline astrophysical plausibility bounds.'
    },
    evidenceFor: [
      {
        type: 'supporting',
        pillar: 'morphology',
        summary: 'Transit-like shallow profile',
        detail: 'Symmetric 0.32% transit dip with consistent limb-darkening profile in TESS sector 31.'
      },
      {
        type: 'supporting',
        pillar: 'plausibility',
        summary: 'Plausible 1.85 R⊕ Super-Earth radius',
        detail: 'Orbital period of 8.42d and equilibrium temp of 685 K align with validated exoplanetary distributions.'
      }
    ],
    evidenceAgainst: [
      {
        type: 'caution',
        pillar: 'chromaticity',
        summary: 'Missing multi-band chromaticity follow-up',
        detail: 'Cannot test for blended eclipsing binaries without independent multi-color observations.'
      },
      {
        type: 'caution',
        pillar: 'data_quality',
        summary: 'Single sector coverage only',
        detail: 'Limited observing baseline increases vulnerability to single-sector systematic trends.'
      }
    ],
    lightCurves: {
      tessLightCurve: generateSyntheticLightCurve(0.32, 3.20, 0.30, 0.025, 95, 'TESS (broad)', 0.18),
      rawUnfoldedLightCurve: generateRawUnfoldedLightCurve(8.42, 0.32, 3.20, 0.30, 27.4, 30)
    }
  }
];
