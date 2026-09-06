import React, { useState } from 'react';
import { Map } from '../components/Map';
import { PrototypeBadge } from '../components/PrototypeBadge';
import { FIXTURE_TARGETS, FIXTURE_OCCURRENCES } from '../services/fixtures';
import { Layers, Info, CheckSquare, Square, Eye, Target, HelpCircle, ChevronRight, Sliders } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ExplorationMap: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'layers' | 'targets' | 'uncertainty'>('layers');
  const [minConfidenceFilter, setMinConfidenceFilter] = useState<number>(70);
  const [layers, setLayers] = useState({
    sentinel2: true,
    geology: true,
    faults: true,
    occurrences: true,
    prospectivity: true,
    uncertainty: false,
    geophysics: false,
    geochemistry: false,
  });

  const toggleLayer = (key: keyof typeof layers) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const filteredTargets = FIXTURE_TARGETS.filter(t => (t.mean_prospectivity * 100) >= minConfidenceFilter);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <PrototypeBadge type="banner" />

      {/* Secondary Explorer Navigation Bar */}
      <div className="h-11 bg-brand-surface/90 border-b border-brand-border px-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-1">
          {[
            { id: 'layers', label: 'Layer Stacks & Evidence', icon: Layers },
            { id: 'targets', label: 'Exploration Targets (3)', icon: Target },
            { id: 'uncertainty', label: 'Uncertainty Engine', icon: HelpCircle }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-brand-accent/20 text-brand-accent font-semibold border border-brand-accent/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            PostGIS Spatial Service: <strong className="text-slate-200">Online</strong>
          </span>
          <span className="text-slate-600">|</span>
          <span>CRS: <strong className="text-slate-300">EPSG:4326 / UTM 44N</strong></span>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left GIS Explorer Panel */}
        <div className="w-80 bg-brand-surface border-r border-brand-border p-4 flex flex-col justify-between overflow-y-auto">
          {activeTab === 'layers' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-brand-border text-white text-xs font-bold uppercase tracking-wider">
                <span>Multi-Source Geospatial Stack</span>
                <span className="text-[10px] text-brand-accent font-mono">8 LAYERS</span>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                  Surface & Structural Evidence
                </p>
                {[
                  { id: 'sentinel2', label: 'Sentinel-2 L2A Surface Reflectance', desc: '10/20m Bands (B2-B12) & NDVI, NDMI', badge: 'COPERNICUS' },
                  { id: 'geology', label: 'GSI Lithology & Sausar Formations', desc: 'Banded Manganese & Quartzite Contacts', badge: 'GSI / NGDR' },
                  { id: 'faults', label: 'Structural Faults & Lineaments', desc: 'ISRO Bhuvan / Structural Proxies', badge: 'ISRO' },
                  { id: 'occurrences', label: 'Known Manganese Deposits', desc: `${FIXTURE_OCCURRENCES.length} Validated Ground Truth Occurrences`, badge: 'LABELS' },
                ].map((l) => (
                  <button
                    key={l.id}
                    onClick={() => toggleLayer(l.id as keyof typeof layers)}
                    className="w-full flex items-start gap-2.5 p-2.5 rounded-lg bg-brand-card/40 hover:bg-brand-card text-left transition-colors border border-transparent hover:border-brand-border"
                  >
                    <span className="mt-0.5 text-brand-accent">
                      {layers[l.id as keyof typeof layers] ? (
                        <CheckSquare className="w-4 h-4" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-500" />
                      )}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-xs font-semibold text-slate-200 truncate">{l.label}</p>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">{l.desc}</p>
                      <span className="inline-block mt-1 text-[9px] bg-brand-dark px-1.5 py-0.5 rounded text-slate-400 font-mono">
                        {l.badge}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="space-y-2 pt-3 border-t border-brand-border/60">
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                  AI Calibrated Prospects & Uncertainty
                </p>
                {[
                  { id: 'prospectivity', label: 'Calibrated Prospectivity Raster', desc: 'SpatialBlockCV XGBoost Prediction Score', badge: 'ML v0.1' },
                  { id: 'uncertainty', label: 'Ensemble Uncertainty Heatmap', desc: 'Tree Prediction Variance (Std Dev)', badge: 'UNCERTAINTY' },
                  { id: 'geochemistry', label: 'Geochemical Anomalies (Fe/Mn)', desc: 'Surface Rock & Soil Sampling Grid', badge: 'OPTIONAL' },
                  { id: 'geophysics', label: 'Airborne Magnetic Anomaly', desc: 'NGDR Aeromagnetic / Gravity Layer', badge: 'OPTIONAL' },
                ].map((l) => (
                  <button
                    key={l.id}
                    onClick={() => toggleLayer(l.id as keyof typeof layers)}
                    className="w-full flex items-start gap-2.5 p-2.5 rounded-lg bg-brand-card/40 hover:bg-brand-card text-left transition-colors border border-transparent hover:border-brand-border"
                  >
                    <span className="mt-0.5 text-brand-accent">
                      {layers[l.id as keyof typeof layers] ? (
                        <CheckSquare className="w-4 h-4" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-500" />
                      )}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-xs font-semibold text-slate-200 truncate">{l.label}</p>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">{l.desc}</p>
                      <span className="inline-block mt-1 text-[9px] bg-brand-dark px-1.5 py-0.5 rounded text-slate-400 font-mono">
                        {l.badge}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'targets' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-brand-border text-white text-xs font-bold uppercase tracking-wider">
                <span>DrillTarget Candidates</span>
                <span className="text-[10px] text-emerald-400 font-mono">{filteredTargets.length} FOUND</span>
              </div>

              {/* Threshold Filter Slider */}
              <div className="p-3 bg-brand-card/50 rounded-lg border border-brand-border">
                <div className="flex items-center justify-between text-xs text-slate-300 mb-1.5 font-medium">
                  <span className="flex items-center gap-1">
                    <Sliders className="w-3.5 h-3.5 text-brand-accent" />
                    Min Prospectivity:
                  </span>
                  <span className="font-bold text-brand-accent">{minConfidenceFilter}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="95"
                  value={minConfidenceFilter}
                  onChange={(e) => setMinConfidenceFilter(Number(e.target.value))}
                  className="w-full accent-brand-accent cursor-pointer"
                />
              </div>

              <div className="space-y-2.5">
                {filteredTargets.map((target) => (
                  <div key={target.id} className="p-3 bg-brand-card/40 border border-brand-border rounded-lg hover:border-brand-accent/50 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-white tracking-wider">{target.target_id}</span>
                      <span className="text-[10px] font-bold text-brand-accent bg-brand-accent/15 px-1.5 py-0.5 rounded border border-brand-accent/30">
                        {target.priority_level}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 my-2">
                      <div>Score: <strong className="text-white">{(target.mean_prospectivity * 100).toFixed(1)}%</strong></div>
                      <div>Uncertainty: <strong className="text-slate-300">{(target.uncertainty * 100).toFixed(1)}%</strong></div>
                      <div>Area: <strong className="text-slate-300">{target.area_sqkm} km²</strong></div>
                      <div>Road Access: <strong className="text-emerald-400">{target.accessibility}</strong></div>
                    </div>
                    <Link
                      to={`/exploration/${target.target_id}`}
                      className="w-full mt-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors"
                    >
                      <span>Detailed SHAP Breakdown</span>
                      <ChevronRight className="w-3 h-3 text-brand-accent" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'uncertainty' && (
            <div className="space-y-4 text-xs">
              <div className="pb-2 border-b border-brand-border text-white text-xs font-bold uppercase tracking-wider">
                Uncertainty & Spatial Validation
              </div>
              <div className="p-3 bg-brand-card/50 rounded-lg border border-brand-border space-y-2">
                <h4 className="font-bold text-slate-200">Spatial Autocorrelation Guard</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Evaluating prospectivity via random pixel splitting creates severe data leakage. MnVision 360 enforces <strong className="text-slate-200">SpatialBlockCV</strong> across geographically disjoint 5km tiles.
                </p>
              </div>

              <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/30 text-slate-300 text-[11px] leading-relaxed">
                <strong className="text-amber-400 block mb-1">Scientific Integrity Notice:</strong>
                High model scores with high uncertainty denote areas of spectral similarity without geological ground confirmation. Field validation remains mandatory before exploratory drilling.
              </div>
            </div>
          )}

          {/* Bottom GIS Context Footnote */}
          <div className="mt-4 p-3 bg-brand-dark/80 rounded-lg border border-brand-border text-[11px] text-slate-400 flex items-start gap-2">
            <Info className="w-4 h-4 text-brand-accent flex-shrink-0 mt-0.5" />
            <p>
              Raster layers clip dynamically to the Balaghat AOI boundary (21.83° N, 80.18° E).
            </p>
          </div>
        </div>

        {/* Full-bleed Interactive Map with Layer Overlay Indicator */}
        <div className="flex-1 h-full relative">
          <Map />
          <div className="absolute bottom-4 right-4 bg-brand-surface/90 backdrop-blur-md px-3 py-2 rounded-xl border border-brand-border text-xs text-slate-300 shadow-xl pointer-events-none space-y-1">
            <div className="font-bold text-white text-[11px] uppercase tracking-wider">Active GIS Viewport</div>
            <div className="flex items-center gap-2 text-[10px]">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
              <span>Sentinel-2 L2A Harmonized Optical SR</span>
            </div>
            <div className="flex items-center gap-2 text-[10px]">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
              <span>GSI Sausar Group Precambrian Boundary</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
