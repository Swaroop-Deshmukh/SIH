import React, { useState } from 'react';
import { Map } from '../components/Map';
import { PrototypeBadge } from '../components/PrototypeBadge';
import { FIXTURE_TARGETS, FIXTURE_OCCURRENCES } from '../services/fixtures';
import { Layers, Info, CheckSquare, Square, Target, HelpCircle, ChevronRight, Sliders, MapPin } from 'lucide-react';
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
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-6">
      <PrototypeBadge type="banner" />

      {/* Page Title Header */}
      <div className="bg-white border-l-4 border-[#D4AF37] border border-slate-200 p-6 rounded shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#1E3A8A] uppercase tracking-wider">
            <MapPin className="w-4 h-4 text-amber-500" />
            <span>BALAGHAT MANGANESE BELT (EPSG:4326 / UTM 44N)</span>
          </div>
          <h1 className="text-2xl font-bold text-[#0B192C] font-serif mt-1">
            Multi-Source Exploration GIS & Prospectivity
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Fusing Sentinel-2, Sentinel-1 SAR, SRTM DEM, and GSI Geology into XGBoost prospectivity & uncertainty grids.
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs bg-slate-100 p-3 rounded border border-slate-200">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
          <div>
            <p className="font-bold text-slate-900">PostGIS Spatial Engine</p>
            <p className="text-[11px] text-slate-500">Active & Validated</p>
          </div>
        </div>
      </div>

      {/* Main GIS Workbench Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar Control Panel */}
        <div className="lg:col-span-1 bg-white rounded border border-slate-200 p-4 shadow-sm space-y-4">
          {/* Secondary Explorer Navigation Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded border border-slate-200">
            {[
              { id: 'layers', label: 'Layers', icon: Layers },
              { id: 'targets', label: 'Targets', icon: Target },
              { id: 'uncertainty', label: 'Validation', icon: HelpCircle }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded text-xs font-semibold transition-colors ${
                    activeTab === tab.id
                      ? 'bg-[#1E3A8A] text-white shadow-sm'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: LAYERS */}
          {activeTab === 'layers' && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 font-bold text-[#0B192C] uppercase tracking-wider text-[11px]">
                <span>Geospatial Evidence Layers</span>
                <span className="text-[#1E3A8A]">8 Active</span>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] uppercase font-bold text-slate-500">Surface & Structural Data</p>
                {[
                  { id: 'sentinel2', label: 'Sentinel-2 Surface Reflectance', desc: 'Bands B2-B12, NDVI, NDRE', badge: 'COPERNICUS' },
                  { id: 'geology', label: 'GSI Lithology & Formations', desc: 'Sausar Group Manganese Contacts', badge: 'GSI / NGDR' },
                  { id: 'faults', label: 'Structural Lineaments & Faults', desc: 'Lineament Proximity Rasters', badge: 'ISRO' },
                  { id: 'occurrences', label: 'Known Manganese Deposits', desc: `${FIXTURE_OCCURRENCES.length} Validated Ground Deposits`, badge: 'LABELS' },
                ].map((l) => (
                  <button
                    key={l.id}
                    onClick={() => toggleLayer(l.id as keyof typeof layers)}
                    className="w-full flex items-start gap-2.5 p-2.5 rounded bg-slate-50 hover:bg-slate-100 text-left transition-colors border border-slate-200"
                  >
                    <span className="mt-0.5 text-[#1E3A8A]">
                      {layers[l.id as keyof typeof layers] ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4 text-slate-400" />}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[#0B192C] text-xs truncate">{l.label}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{l.desc}</p>
                      <span className="inline-block mt-1 text-[9px] bg-slate-200 px-1.5 py-0.5 rounded text-slate-700 font-mono font-semibold">
                        {l.badge}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="space-y-2 pt-3 border-t border-slate-200">
                <p className="text-[10px] uppercase font-bold text-slate-500">AI Prospects & Uncertainty</p>
                {[
                  { id: 'prospectivity', label: 'XGBoost Prospectivity Raster', desc: 'SpatialBlockCV Prediction Score', badge: 'ML MODEL' },
                  { id: 'uncertainty', label: 'Ensemble Uncertainty Heatmap', desc: 'Tree Variance Standard Dev', badge: 'UNCERTAINTY' },
                  { id: 'geochemistry', label: 'Geochemical Anomalies (Fe/Mn)', desc: 'Surface Assay Point Grids', badge: 'OPTIONAL' },
                  { id: 'geophysics', label: 'Aeromagnetic Anomaly Grid', desc: 'Bouguer Gravity / Magnetic', badge: 'OPTIONAL' },
                ].map((l) => (
                  <button
                    key={l.id}
                    onClick={() => toggleLayer(l.id as keyof typeof layers)}
                    className="w-full flex items-start gap-2.5 p-2.5 rounded bg-slate-50 hover:bg-slate-100 text-left transition-colors border border-slate-200"
                  >
                    <span className="mt-0.5 text-[#1E3A8A]">
                      {layers[l.id as keyof typeof layers] ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4 text-slate-400" />}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[#0B192C] text-xs truncate">{l.label}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{l.desc}</p>
                      <span className="inline-block mt-1 text-[9px] bg-slate-200 px-1.5 py-0.5 rounded text-slate-700 font-mono font-semibold">
                        {l.badge}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: TARGETS */}
          {activeTab === 'targets' && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 font-bold text-[#0B192C] uppercase tracking-wider text-[11px]">
                <span>Drill Target Candidates</span>
                <span className="text-[#1E3A8A]">{filteredTargets.length} Found</span>
              </div>

              <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between text-slate-700 font-bold text-xs">
                  <span className="flex items-center gap-1">
                    <Sliders className="w-3.5 h-3.5 text-[#1E3A8A]" />
                    Min Prospectivity:
                  </span>
                  <span className="text-[#1E3A8A]">{minConfidenceFilter}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="95"
                  value={minConfidenceFilter}
                  onChange={(e) => setMinConfidenceFilter(Number(e.target.value))}
                  className="w-full accent-[#1E3A8A] cursor-pointer"
                />
              </div>

              <div className="space-y-2.5">
                {filteredTargets.map((target) => (
                  <div key={target.id} className="p-3 bg-slate-50 border border-slate-200 rounded hover:border-[#1E3A8A] transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-[#0B192C]">{target.target_id}</span>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                        {target.priority_level}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-600 my-1">
                      <div>Score: <strong className="text-slate-900">{(target.mean_prospectivity * 100).toFixed(1)}%</strong></div>
                      <div>Uncertainty: <strong className="text-slate-900">{(target.uncertainty * 100).toFixed(1)}%</strong></div>
                      <div>Area: <strong>{target.area_sqkm} km²</strong></div>
                      <div>Access: <strong className="text-emerald-700">{target.accessibility}</strong></div>
                    </div>
                    <Link
                      to={`/exploration/${target.target_id}`}
                      className="w-full mt-2 py-1 bg-[#1E3A8A] text-white rounded text-[11px] font-semibold flex items-center justify-center gap-1 hover:bg-[#0B192C] transition-colors"
                    >
                      <span>Detailed SHAP Breakdown</span>
                      <ChevronRight className="w-3 h-3 text-amber-400" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: UNCERTAINTY */}
          {activeTab === 'uncertainty' && (
            <div className="space-y-4 text-xs">
              <div className="pb-2 border-b border-slate-200 font-bold text-[#0B192C] uppercase tracking-wider text-[11px]">
                Spatial Autocorrelation & Validation
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-2">
                <h4 className="font-bold text-[#0B192C]">SpatialBlockCV Guard</h4>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Random pixel train/test splitting introduces severe spatial autocorrelation leakage. MnVision 360 enforces <strong className="text-slate-900">SpatialBlockCV</strong> across disjoint 5km spatial tiles.
                </p>
              </div>

              <div className="p-3 bg-amber-50 rounded border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
                <strong className="block mb-1 text-amber-900 font-bold">Scientific Integrity Policy:</strong>
                High prospectivity combined with high uncertainty indicates spectral similarity lacking ground geological confirmation. Field verification remains required.
              </div>
            </div>
          )}

          <div className="p-3 bg-slate-100 rounded border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2">
            <Info className="w-4 h-4 text-[#1E3A8A] flex-shrink-0 mt-0.5" />
            <p>
              All layers clipped to Balaghat AOI boundary (21.83° N, 80.18° E).
            </p>
          </div>
        </div>

        {/* Right Main Map Canvas */}
        <div className="lg:col-span-3 h-[600px] relative">
          <Map />
          <div className="absolute bottom-4 right-4 bg-white/95 shadow-md px-3 py-2 rounded border border-slate-300 text-xs text-slate-800 pointer-events-none space-y-1">
            <div className="font-bold text-[#0B192C] text-[11px] uppercase tracking-wider">Active Layers Overlay</div>
            <div className="flex items-center gap-2 text-[11px]">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
              <span>Sentinel-2 L2A Surface Reflectance</span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1E3A8A] inline-block" />
              <span>GSI Sausar Group Precambrian Faults</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
