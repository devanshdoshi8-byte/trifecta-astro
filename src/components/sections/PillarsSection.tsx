import React, { useState } from 'react';
import {
  Palette,
  Activity,
  Orbit,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Layers,
  Database,
  Compass,
  ArrowRight,
  Code2
} from 'lucide-react';
import { TrifectaRadarDiagram } from '../charts/TrifectaRadarDiagram';
import { WavelengthSpectrumVisualizer } from '../charts/WavelengthSpectrumVisualizer';
import { PlanetarySystemVisualizer } from '../charts/PlanetarySystemVisualizer';
import { NumericalTransitFitter } from '../charts/NumericalTransitFitter';
import { generateSyntheticLightCurve } from '../../utils/physicsEngine';
import { DataSourceBadge } from '../common/DataQualityBadge';
import { ScientificNote } from '../common/ScientificNote';

export const PillarsSection: React.FC = () => {
  const [activePillarTab, setActivePillarTab] = useState<'chromaticity' | 'morphology' | 'plausibility'>('chromaticity');

  return (
    <section id="three-pillars" className="py-16 bg-space-950 text-white border-b border-space-800 transition-colors relative overflow-hidden">
      {/* Background Reticle */}
      <div className="absolute inset-0 bg-celestial-grid opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-400">
            SECTION 02: THE CORE SCREENING ENGINE
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
            The Three Physical Pillars of Trifecta
          </h2>
          <p className="text-sm sm:text-base text-space-300 leading-relaxed font-serif">
            Rather than relying on a single opacity metric or black-box probability, Trifecta evaluates candidate exoplanets through three physically complementary and interpretable diagnostic lenses.
          </p>
        </div>

        {/* Central Constellation Diagram */}
        <TrifectaRadarDiagram
          activePillar={activePillarTab}
          onSelectPillar={(p) => setActivePillarTab(p)}
        />

        {/* Pillar Tab Selector */}
        <div className="flex border-b border-space-800 space-x-2">
          <button
            onClick={() => setActivePillarTab('chromaticity')}
            className={`pb-3 px-4 text-xs sm:text-sm font-mono font-semibold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all ${
              activePillarTab === 'chromaticity'
                ? 'border-sky-400 text-sky-300'
                : 'border-transparent text-space-400 hover:text-white'
            }`}
          >
            <Palette className="w-4 h-4 text-sky-400" />
            <span>1. Chromaticity</span>
          </button>
          <button
            onClick={() => setActivePillarTab('morphology')}
            className={`pb-3 px-4 text-xs sm:text-sm font-mono font-semibold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all ${
              activePillarTab === 'morphology'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-space-400 hover:text-white'
            }`}
          >
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>2. Transit Morphology</span>
          </button>
          <button
            onClick={() => setActivePillarTab('plausibility')}
            className={`pb-3 px-4 text-xs sm:text-sm font-mono font-semibold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all ${
              activePillarTab === 'plausibility'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-space-400 hover:text-white'
            }`}
          >
            <Orbit className="w-4 h-4 text-amber-400" />
            <span>3. Astrophysical Plausibility</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* PILLAR 1: CHROMATICITY DEEP DIVE */}
        {/* ========================================================================= */}
        {activePillarTab === 'chromaticity' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Interactive Multi-Wavelength Visualizer */}
            <WavelengthSpectrumVisualizer />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-sky-400 uppercase bg-sky-950 px-2 py-0.5 rounded border border-sky-800">
                    Pillar 1 Diagnostic
                  </span>
                  <DataSourceBadge source="DATA AVAILABILITY DEPENDENT" />
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-white font-mono">
                  Does the apparent transit depth depend on wavelength?
                </h3>

                <p className="text-xs sm:text-sm text-space-200 leading-relaxed font-sans">
                  For a conventional opaque planetary transit observed in comparable photometric conditions, the transit depth is expected to be <em>approximately wavelength-independent</em> to first order (aside from secondary effects caused by stellar limb darkening, planetary atmospheric Rayleigh scattering, and instrumental filter responses).
                </p>

                <p className="text-xs sm:text-sm text-space-200 leading-relaxed font-sans">
                  In contrast, a blended eclipsing binary (BEB) consists of stars with distinct spectral energy distributions. When the blended light is measured in different optical filters (e.g. Sloan g' vs Pan-STARRS z'), the fractional flux dilution changes, causing an apparent <strong>wavelength-dependent transit depth</strong>.
                </p>

                {/* Ground Follow-up Callout */}
                <div className="bg-space-900 rounded-lg p-4 font-mono text-xs space-y-2 border border-space-800">
                  <div className="text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5" />
                    <span>TESS Alone Is Not Enough for the Chromaticity Test</span>
                  </div>
                  <p className="text-space-300 text-[11px] leading-relaxed font-sans">
                    TESS observes in a single wide-band optical passband (600–1000 nm). Therefore, the Trifecta chromaticity module cannot extract independent red and blue transit depths from TESS itself. The framework ingests <strong>ground-based multi-band follow-up photometry</strong> (e.g. MuSCAT2 4-color cameras, Las Cumbres Observatory, ExoFOP/TFOP SG1).
                  </p>
                  <div className="pt-2 text-[10.5px] text-space-400 border-t border-space-800 flex items-center justify-between">
                    <span>Ground follow-up available? <strong className="text-emerald-400">YES &rarr; Run color test</strong></span>
                    <span>Unavailable? <strong className="text-space-300">NO &rarr; Gracefully bypass module</strong></span>
                  </div>
                </div>

                <ScientificNote
                  variant="caveat"
                  title="Atmospheric & Stellar Nuance"
                  technicalDetail="Planetary atmospheres exhibit transmission spectral variations on the order of 10–100 ppm due to Rayleigh scattering and atomic/molecular absorption lines (e.g. Na, K, H2O). Trifecta screens for coarse stellar-blend chromaticity (Δδ > 0.2% or ≥ 3σ), not fine transmission spectroscopy."
                >
                  Real exoplanetary atmospheres can produce wavelength-dependent transit depths (transmission spectra) on the order of 10–100 parts per million (ppm). Trifecta screens for coarse stellar-blend chromaticity (&Delta;&delta; &gt; 0.2% or &ge; 3&sigma;), not fine transmission spectroscopy.
                </ScientificNote>
              </div>

              {/* Statistical Flowchart */}
              <div className="lg:col-span-5 bg-space-900/80 border border-space-800 rounded-lg p-5 space-y-4">
                <div className="font-mono text-xs font-bold text-sky-400 uppercase pb-2 border-b border-space-800">
                  Chromaticity Decision Logic
                </div>

                <div className="space-y-2 font-mono text-xs">
                  <div className="bg-space-950 p-2.5 rounded border border-space-800 space-y-1">
                    <div className="text-[10px] text-sky-400 font-bold uppercase">1. Multi-band Ingestion</div>
                    <div className="text-space-200 text-[11px]">Short &lambda; (Blue / g-band) + Long &lambda; (Red / z-band)</div>
                  </div>

                  <div className="text-center text-space-500">&darr;</div>

                  <div className="bg-space-950 p-2.5 rounded border border-space-800 space-y-1">
                    <div className="text-[10px] text-sky-400 font-bold uppercase">2. Depth &amp; Uncertainty Estimation</div>
                    <div className="text-space-200 text-[11px]">&delta;<sub>blue</sub> &plusmn; &sigma;<sub>blue</sub> and &delta;<sub>red</sub> &plusmn; &sigma;<sub>red</sub></div>
                  </div>

                  <div className="text-center text-space-500">&darr;</div>

                  <div className="bg-space-950 p-2.5 rounded border border-space-800 space-y-1">
                    <div className="text-[10px] text-sky-400 font-bold uppercase">3. Significance Test</div>
                    <div className="text-space-200 text-[11px]">
                      &Delta;&delta; = &delta;<sub>blue</sub> - &delta;<sub>red</sub> &nbsp;|&nbsp;
                      &sigma;<sub>diff</sub> = |&Delta;&delta;| / &radic;(&sigma;<sub>blue</sub>&sup2; + &sigma;<sub>red</sub>&sup2;)
                    </div>
                  </div>

                  <div className="text-center text-space-500">&darr;</div>

                  <div className="bg-space-950 p-2.5 rounded border border-space-800 space-y-1.5">
                    <div className="text-[10px] text-sky-400 font-bold uppercase">4. Interpretable Output Categories</div>
                    <div className="space-y-1 text-[10.5px]">
                      <div className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 shrink-0" />
                        <span>Consistent with approximately achromatic transit (&sigma; &lt; 1.5)</span>
                      </div>
                      <div className="text-rose-400 flex items-center gap-1">
                        <XCircle className="w-3 h-3 shrink-0" />
                        <span>Chromaticity detected &mdash; investigate blend (&sigma; &ge; 3.0)</span>
                      </div>
                      <div className="text-space-400 flex items-center gap-1">
                        <HelpCircle className="w-3 h-3 shrink-0" />
                        <span>Insufficient data / Single-band TESS only</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PILLAR 2: TRANSIT MORPHOLOGY DEEP DIVE */}
        {/* ========================================================================= */}
        {activePillarTab === 'morphology' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-emerald-400 uppercase bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                    Pillar 2 Diagnostic
                  </span>
                  <span className="text-[11px] font-mono text-space-400">Geometry &amp; Timing</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-white font-mono">
                  What does the geometric shape of the light curve tell us?
                </h3>

                <p className="text-xs sm:text-sm text-space-200 leading-relaxed font-sans">
                  The geometric profile of a transit event carries information about the relative size ratio R<sub>p</sub> / R<sub>*</sub>, orbital impact parameter b = (a/R<sub>*</sub>) cos(i), and stellar limb darkening coefficients.
                </p>

                <div className="bg-space-900/80 p-4 rounded-lg border border-space-800 space-y-2">
                  <div className="font-mono text-xs font-bold text-emerald-300 uppercase">
                    Extracted Morphological Features:
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="bg-space-950 p-2 rounded border border-space-800">
                      <span className="text-space-400 text-[10px]">Total Duration (T<sub>14</sub>)</span>
                      <div className="font-semibold text-white">Contact I to Contact IV</div>
                    </div>
                    <div className="bg-space-950 p-2 rounded border border-space-800">
                      <span className="text-space-400 text-[10px]">Ingress/Egress (T<sub>12</sub>, T<sub>34</sub>)</span>
                      <div className="font-semibold text-white">Contact I–II &amp; III–IV</div>
                    </div>
                    <div className="bg-space-950 p-2 rounded border border-space-800">
                      <span className="text-space-400 text-[10px]">Ingress-to-Total Ratio</span>
                      <div className="font-semibold text-white">&tau;/T = (T<sub>12</sub> + T<sub>34</sub>) / 2T<sub>14</sub></div>
                    </div>
                    <div className="bg-space-950 p-2 rounded border border-space-800">
                      <span className="text-space-400 text-[10px]">Residual Structure RMS</span>
                      <div className="font-semibold text-white">Out-of-transit scatter vs in-transit</div>
                    </div>
                  </div>
                </div>

                <ScientificNote
                  variant="caveat"
                  title="Physical Complexity Reminder"
                  technicalDetail="Under Mandel & Agol (2002) quadratic limb darkening I(mu) = 1 - u1(1-mu) - u2(1-mu)^2, central transits exhibit a subtle concave floor, while grazing transits (b > 1 - Rp/R*) produce triangular V-shapes lacking flat contact zones."
                >
                  Transit morphology can provide a useful diagnostic, but real systems produce a wide range of shapes. Grazing planetary transits, limb darkening, finite integration time, noise, stellar variability, and eclipsing binaries can all complicate this distinction.
                </ScientificNote>
              </div>

              {/* Sample Analysis Panel */}
              <div className="lg:col-span-5 bg-space-900 border border-space-800 rounded-lg p-5 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-space-800 pb-2">
                  <span className="font-mono text-xs font-bold text-white uppercase">
                    Sample Morphology Extraction
                  </span>
                  <span className="text-[10.5px] font-mono text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                    TOI-1233.01 Trace
                  </span>
                </div>

                <div className="space-y-2 font-mono text-xs">
                  <div className="flex justify-between py-1 border-b border-space-800">
                    <span className="text-space-400">Transit Depth (&delta;):</span>
                    <span className="font-semibold text-white">0.82% &plusmn; 0.03%</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-space-800">
                    <span className="text-space-400">Ingress Duration (T<sub>12</sub>):</span>
                    <span className="font-semibold text-white">14.2 minutes</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-space-800">
                    <span className="text-space-400">Egress Duration (T<sub>34</sub>):</span>
                    <span className="font-semibold text-white">14.5 minutes</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-space-800">
                    <span className="text-space-400">Total Duration (T<sub>14</sub>):</span>
                    <span className="font-semibold text-white">2.84 hours</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-space-800">
                    <span className="text-space-400">Shape Consistency:</span>
                    <span className="font-semibold text-emerald-400">High (Transit-like)</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-space-400">Signal-to-Noise Ratio:</span>
                    <span className="font-semibold text-white">28.4</span>
                  </div>
                </div>

                <div className="bg-emerald-950/40 border border-emerald-800 rounded p-3 text-xs space-y-1">
                  <div className="font-mono text-[10.5px] font-bold text-emerald-300 uppercase">
                    Diagnostic Interpretation:
                  </div>
                  <div className="text-emerald-200 font-semibold">
                    Transit-like morphology detected
                  </div>
                  <p className="text-[11px] text-emerald-200/80 leading-tight font-sans">
                    Flat floor consistent with complete disk occultation across 1.02 R☉ host. No grazing asymmetry.
                  </p>
                </div>
              </div>
            </div>

            {/* Embedded Live Numerical Mandel-Agol Least Squares Fitter */}
            <div className="pt-2">
              <NumericalTransitFitter
                dataPoints={generateSyntheticLightCurve(0.85, 2.8, 0.25, 0.035, 75, 'TESS (broad)', 0.2)}
                orbitalPeriodDays={3.795}
                candidateTitle="TOI-1233.01 (P = 3.795d) Mandel & Agol (2002) Model Optimization"
              />
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PILLAR 3: ASTROPHYSICAL PLAUSIBILITY DEEP DIVE */}
        {/* ========================================================================= */}
        {activePillarTab === 'plausibility' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Interactive Planetary System Visualization */}
            <PlanetarySystemVisualizer />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-amber-400 uppercase bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
                    Pillar 3 Diagnostic
                  </span>
                  <span className="text-[11px] font-mono text-space-400">Stellar &amp; Orbital Context</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-white font-mono">
                  Is the proposed planetary interpretation physically reasonable?
                </h3>

                <p className="text-xs sm:text-sm text-space-200 leading-relaxed font-sans">
                  The third module evaluates whether the proposed planetary companion is consistent with the fundamental properties of the host star, orbital dynamics, and planetary structural physics.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div className="bg-space-900/80 p-3 rounded border border-space-800 space-y-1">
                    <span className="text-[10px] text-amber-400 font-bold uppercase">Inferred Radius Bounds</span>
                    <p className="text-space-300 text-[11px] font-sans">
                      Flags candidate radii R<sub>p</sub> &gt; 2.0 R<sub>Jup</sub> that exceed physical degeneracy limits for cold hydrogen/helium bodies.
                    </p>
                  </div>
                  <div className="bg-space-900/80 p-3 rounded border border-space-800 space-y-1">
                    <span className="text-[10px] text-amber-400 font-bold uppercase">Fluid Roche Limit</span>
                    <p className="text-space-300 text-[11px] font-sans">
                      Checks orbital separation against tidal disruption threshold: d<sub>Roche</sub> &approx; 2.44 R<sub>p</sub> (&rho;<sub>p</sub>/&rho;<sub>*</sub>)<sup>1/3</sup>.
                    </p>
                  </div>
                  <div className="bg-space-900/80 p-3 rounded border border-space-800 space-y-1">
                    <span className="text-[10px] text-amber-400 font-bold uppercase">Irradiation &amp; Equilibrium Temp</span>
                    <p className="text-space-300 text-[11px] font-sans">
                      Evaluates incident flux S<sub>inc</sub> and T<sub>eq</sub> in the context of atmospheric photo-evaporation.
                    </p>
                  </div>
                  <div className="bg-space-900/80 p-3 rounded border border-space-800 space-y-1">
                    <span className="text-[10px] text-amber-400 font-bold uppercase">Stellar Density Consistency</span>
                    <p className="text-space-300 text-[11px] font-sans">
                      Compares photometric stellar density derived from transit duration with catalog spectroscopic density.
                    </p>
                  </div>
                </div>

                <ScientificNote
                  variant="caveat"
                  title="Parameter-Space Screening, Not Hard Thresholds"
                  technicalDetail="Planetary radius is constrained by Coulomb forces at low mass and electron degeneracy at high mass (Guillot 2005). Cold H/He gas giants peak at ~1.1 R_Jup. While strong stellar irradiation can inflate hot Jupiters to ~1.8 R_Jup (e.g. WASP-12b), uninflated objects with Rp > 2.5 R_Jup are non-planetary stellar companions."
                >
                  Some combinations of planet size, orbital separation, and host-star properties indicate an extreme physical environment and deserve additional scrutiny. Trifecta flags these as parameter-space anomalies rather than declaring them physically impossible, explicitly recognizing rare real populations such as ultra-hot Jupiters and inflated gas giants.
                </ScientificNote>
              </div>

              {/* Sample Plausibility Evaluation Panel */}
              <div className="lg:col-span-5 bg-space-900 border border-space-800 rounded-lg p-5 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-space-800 pb-2">
                  <span className="font-mono text-xs font-bold text-white uppercase">
                    Host &amp; Orbit Consistency Check
                  </span>
                  <span className="text-[10.5px] font-mono text-amber-300 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
                    Physical Plausibility
                  </span>
                </div>

                <div className="space-y-2 font-mono text-xs">
                  <div className="flex justify-between py-1 border-b border-space-800">
                    <span className="text-space-400">Host Temperature (T<sub>eff</sub>):</span>
                    <span className="font-semibold text-white">5780 K (G2V)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-space-800">
                    <span className="text-space-400">Host Radius &amp; Mass:</span>
                    <span className="font-semibold text-white">1.02 R☉ / 1.01 M☉</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-space-800">
                    <span className="text-space-400">Inferred Candidate Radius:</span>
                    <span className="font-semibold text-white">2.31 R⊕ (0.21 R_Jup)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-space-800">
                    <span className="text-space-400">Semi-Major Axis (a):</span>
                    <span className="font-semibold text-white">0.114 AU (P = 14.17d)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-space-800">
                    <span className="text-space-400">Equilibrium Temp (T<sub>eq</sub>):</span>
                    <span className="font-semibold text-white">540 K (Albedo = 0.3)</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-space-400">Roche Disruption Margin:</span>
                    <span className="font-semibold text-emerald-400">38&times; Safety Margin</span>
                  </div>
                </div>

                <div className="bg-space-950 border border-space-800 rounded p-3 text-xs space-y-1">
                  <div className="font-mono text-[10.5px] font-bold text-space-400 uppercase">
                    Plausibility Status:
                  </div>
                  <div className="text-white font-semibold">
                    No major astrophysical anomalies detected
                  </div>
                  <p className="text-[11px] text-space-300 leading-tight font-sans">
                    Inferred physical dimensions and orbital separation match temperate sub-Neptune regime.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
