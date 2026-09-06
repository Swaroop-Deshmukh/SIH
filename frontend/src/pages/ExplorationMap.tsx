import React, { useState } from 'react';
import { Map } from '../components/Map';
import { PrototypeBadge } from '../components/PrototypeBadge';
import { Layers, Info, CheckSquare, Square } from 'lucide-react';

export const ExplorationMap: React.FC = () => {
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

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <PrototypeBadge type="banner" />

      <div className="flex-1 flex overflow-hidden">
        {/* Left GIS Layer Controls */}
        <div className="w-72 bg-brand-surface border-r border-brand-border p-4 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-brand-border text-white text-sm font-semibold">
              <Layers className="w-4 h-4 text-brand-accent" />
              <span>Geospatial Evidence Layers</span>
            </div>

            <div className="space-y-2">
              <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
                Earth Observation & Structure
              </p>
              {[
                { id: 'sentinel2', label: 'Sentinel-2 Multispectral Surface', desc: 'Harmonized 10/20m Bands & Indices' },
                { id: 'geology', label: 'GSI Lithology & Formations', desc: 'Balaghat Belt Stratigraphy' },
                { id: 'faults', label: 'Faults & Lineaments', desc: 'ISRO Bhuvan / Structural Contacts' },
                { id: 'occurrences', label: 'Known Manganese Deposits', desc: 'Ground Truth Positive Occurrences' },
              ].map((l) => (
                <button
                  key={l.id}
                  onClick={() => toggleLayer(l.id as keyof typeof layers)}
                  className="w-full flex items-start gap-2.5 p-2 rounded-lg bg-brand-card/40 hover:bg-brand-card text-left transition-colors"
                >
                  <span className="mt-0.5 text-brand-accent">
                    {layers[l.id as keyof typeof layers] ? (
                      <CheckSquare className="w-4 h-4" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-500" />
                    )}
                  </span>
                  <div>
                    <p className="text-xs font-medium text-slate-200">{l.label}</p>
                    <p className="text-[10px] text-slate-500">{l.desc}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="space-y-2 pt-2 border-t border-brand-border/60">
              <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
                AI Prospectivity Output
              </p>
              {[
                { id: 'prospectivity', label: 'Calibrated Prospectivity Score', desc: 'XGBoost Multi-Source Prediction' },
                { id: 'uncertainty', label: 'Uncertainty Estimation Grid', desc: 'Ensemble Variance Model' },
              ].map((l) => (
                <button
                  key={l.id}
                  onClick={() => toggleLayer(l.id as keyof typeof layers)}
                  className="w-full flex items-start gap-2.5 p-2 rounded-lg bg-brand-card/40 hover:bg-brand-card text-left transition-colors"
                >
                  <span className="mt-0.5 text-brand-accent">
                    {layers[l.id as keyof typeof layers] ? (
                      <CheckSquare className="w-4 h-4" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-500" />
                    )}
                  </span>
                  <div>
                    <p className="text-xs font-medium text-slate-200">{l.label}</p>
                    <p className="text-[10px] text-slate-500">{l.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 bg-brand-dark/80 rounded-lg border border-brand-border text-[11px] text-slate-400 flex items-start gap-2">
            <Info className="w-4 h-4 text-brand-accent flex-shrink-0 mt-0.5" />
            <p>
              Phase 5-14 will load genuine Sentinel-2/DEM rasters into this MapLibre viewport.
            </p>
          </div>
        </div>

        {/* Full-bleed Interactive Map */}
        <div className="flex-1 h-full">
          <Map />
        </div>
      </div>
    </div>
  );
};
