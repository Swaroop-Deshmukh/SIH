import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface MapProps {
  initialCenter?: [number, number]; // [lng, lat]
  initialZoom?: number;
  height?: string;
  activeLayers?: Record<string, boolean>;
  selectedTarget?: string;
  onMarkerClick?: (marker: any) => void;
}

export const Map: React.FC<MapProps> = ({
  initialCenter = [80.18, 21.83], // Balaghat, Madhya Pradesh coordinates
  initialZoom = 10,
  height = '100%',
  activeLayers = {
    sentinel2: true,
    geology: true,
    faults: true,
    occurrences: true,
    prospectivity: true,
    uncertainty: false,
    geochemistry: true,
    geophysics: false,
  },
  selectedTarget
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    // OpenStreetMap raster tiles base style
    const style: maplibregl.StyleSpecification = {
      version: 8,
      sources: {
        'osm-tiles': {
          type: 'raster',
          tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
          tileSize: 256,
          attribution: '&copy; OpenStreetMap contributors'
        }
      },
      layers: [
        {
          id: 'osm-tiles-layer',
          type: 'raster',
          source: 'osm-tiles',
          minzoom: 0,
          maxzoom: 19
        }
      ]
    };

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: style,
      center: initialCenter,
      zoom: initialZoom,
      attributionControl: false,
    });

    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
    map.current.addControl(new maplibregl.ScaleControl({ maxWidth: 100, unit: 'metric' }), 'bottom-left');

    map.current.on('load', () => {
      if (!map.current) return;

      // 1. Sentinel-2 Optical False-Color Reflectance Layer (Cyan Overlay)
      map.current.addSource('sentinel2-source', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: { name: 'Sentinel-2 NIR Band Index' },
              geometry: {
                type: 'Polygon',
                coordinates: [[
                  [79.65, 21.65], [80.45, 21.65], [80.45, 21.98], [79.65, 21.98], [79.65, 21.65]
                ]]
              }
            }
          ]
        }
      });
      map.current.addLayer({
        id: 'sentinel2-fill',
        type: 'fill',
        source: 'sentinel2-source',
        paint: {
          'fill-color': '#06B6D4',
          'fill-opacity': 0.18
        }
      });

      // 2. GSI Lithology & Formations Layer (Purple Sausar Belt Overlay)
      map.current.addSource('geology-source', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: { formation: 'Mansar Formation (Manganese Ore Horizon)' },
              geometry: {
                type: 'Polygon',
                coordinates: [[
                  [79.70, 21.68], [80.10, 21.84], [80.48, 21.96], [80.45, 21.92], [79.72, 21.66], [79.70, 21.68]
                ]]
              }
            }
          ]
        }
      });
      map.current.addLayer({
        id: 'geology-fill',
        type: 'fill',
        source: 'geology-source',
        paint: {
          'fill-color': '#8B5CF6',
          'fill-opacity': 0.35
        }
      });

      // 3. Prospectivity Heatmap Raster (Vibrant Green Zone)
      map.current.addSource('prospectivity-source', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: { prospectivity: 0.91, name: 'Target MN-042 (T-004)' },
              geometry: {
                type: 'Polygon',
                coordinates: [[
                  [80.12, 21.82], [80.18, 21.82], [80.18, 21.87], [80.12, 21.87], [80.12, 21.82]
                ]]
              }
            },
            {
              type: 'Feature',
              properties: { prospectivity: 0.87, name: 'Target MN-018 (T-007)' },
              geometry: {
                type: 'Polygon',
                coordinates: [[
                  [80.38, 21.93], [80.48, 21.93], [80.48, 21.99], [80.38, 21.99], [80.38, 21.93]
                ]]
              }
            },
            {
              type: 'Feature',
              properties: { prospectivity: 0.82, name: 'Target MN-074 (T-011)' },
              geometry: {
                type: 'Polygon',
                coordinates: [[
                  [79.66, 21.65], [79.74, 21.65], [79.74, 21.72], [79.66, 21.72], [79.66, 21.65]
                ]]
              }
            }
          ]
        }
      });
      map.current.addLayer({
        id: 'prospectivity-fill',
        type: 'fill',
        source: 'prospectivity-source',
        paint: {
          'fill-color': '#10B981',
          'fill-opacity': 0.55
        }
      });

      // 4. Structural Lineaments & Faults (Thick Red Lines)
      map.current.addSource('faults-source', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: { name: 'Balaghat Thrust Fault F-1' },
              geometry: {
                type: 'LineString',
                coordinates: [[79.60, 21.64], [80.15, 21.85], [80.50, 21.98]]
              }
            },
            {
              type: 'Feature',
              properties: { name: 'Ukwa Shear Contact F-2' },
              geometry: {
                type: 'LineString',
                coordinates: [[80.10, 21.80], [80.45, 21.95]]
              }
            }
          ]
        }
      });
      map.current.addLayer({
        id: 'faults-line',
        type: 'line',
        source: 'faults-source',
        paint: {
          'line-color': '#EF4444',
          'line-width': 4,
          'line-dasharray': [3, 1]
        }
      });

      // 5. Uncertainty Heatmap Layer (Amber Overlay)
      map.current.addSource('uncertainty-source', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: { uncertainty: 0.35 },
              geometry: {
                type: 'Polygon',
                coordinates: [[
                  [79.80, 21.73], [80.00, 21.73], [80.00, 21.83], [79.80, 21.83], [79.80, 21.73]
                ]]
              }
            }
          ]
        }
      });
      map.current.addLayer({
        id: 'uncertainty-fill',
        type: 'fill',
        source: 'uncertainty-source',
        paint: {
          'fill-color': '#F59E0B',
          'fill-opacity': 0.45
        }
      });

      // 6. Geochemistry Anomaly Grid (Pink Zone)
      map.current.addSource('geochemistry-source', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: { anomaly: 'High MnO Assay' },
              geometry: {
                type: 'Polygon',
                coordinates: [[
                  [80.10, 21.80], [80.25, 21.80], [80.25, 21.88], [80.10, 21.88], [80.10, 21.80]
                ]]
              }
            }
          ]
        }
      });
      map.current.addLayer({
        id: 'geochemistry-fill',
        type: 'fill',
        source: 'geochemistry-source',
        paint: {
          'fill-color': '#EC4899',
          'fill-opacity': 0.4
        }
      });

      // 7. Aeromagnetic Anomaly Grid (Blue Zone)
      map.current.addSource('geophysics-source', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: { anomaly: 'Bouguer High' },
              geometry: {
                type: 'Polygon',
                coordinates: [[
                  [79.62, 21.62], [79.76, 21.62], [79.76, 21.70], [79.62, 21.70], [79.62, 21.62]
                ]]
              }
            }
          ]
        }
      });
      map.current.addLayer({
        id: 'geophysics-fill',
        type: 'fill',
        source: 'geophysics-source',
        paint: {
          'fill-color': '#3B82F6',
          'fill-opacity': 0.35
        }
      });
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [initialCenter, initialZoom]);

  // Dynamically update map layers visibility & markers when activeLayers prop changes!
  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded()) return;

    const layerMap: Record<string, string> = {
      sentinel2: 'sentinel2-fill',
      geology: 'geology-fill',
      prospectivity: 'prospectivity-fill',
      faults: 'faults-line',
      uncertainty: 'uncertainty-fill',
      geochemistry: 'geochemistry-fill',
      geophysics: 'geophysics-fill'
    };

    Object.entries(layerMap).forEach(([key, layerId]) => {
      if (map.current?.getLayer(layerId)) {
        const isVisible = activeLayers[key] !== false;
        map.current.setLayoutProperty(
          layerId,
          'visibility',
          isVisible ? 'visible' : 'none'
        );
      }
    });

    // Re-render Map Markers (Mines, Sample Points, Targets)
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Add Mine Markers
    const mines = [
      { name: 'North Balaghat Mine (BLG-01)', coords: [80.135, 21.88], type: 'Underground Lease', status: 'OPERATIONAL' },
      { name: 'Central Balaghat Mine - Ukwa (BLG-02)', coords: [80.466, 21.971], type: 'Underground Lease', status: 'OPERATIONAL' },
      { name: 'South Balaghat Mine - Tirodi (BLG-03)', coords: [79.719, 21.685], type: 'Mixed Lease (UG+OC)', status: 'OPERATIONAL' },
    ];

    mines.forEach((mine) => {
      const el = document.createElement('div');
      el.className = 'w-6 h-6 rounded-full bg-[#003366] border-2 border-amber-400 shadow-xl cursor-pointer flex items-center justify-center text-white text-[10px] font-bold';
      el.innerText = '⛏';
      
      const m = new maplibregl.Marker({ element: el })
        .setLngLat(mine.coords as [number, number])
        .setPopup(new maplibregl.Popup({ offset: 12 }).setHTML(`
          <div class="text-slate-900 p-1.5 text-xs font-sans">
            <strong class="text-[#003366]">${mine.name}</strong><br/>
            Type: <span class="font-semibold">${mine.type}</span><br/>
            Status: <span class="text-emerald-700 font-bold">${mine.status}</span>
          </div>
        `))
        .addTo(map.current!);
      markersRef.current.push(m);
    });

    // Add Drill Targets Markers (T-004 / MN-042, T-007 / MN-018, T-011 / MN-074)
    if (activeLayers.prospectivity !== false || activeLayers.occurrences !== false) {
      const targets = [
        { id: 'T-004', name: 'Target T-004 (MN-042)', coords: [80.14, 21.84], prob: '91%', conf: '87% HIGH' },
        { id: 'T-007', name: 'Target T-007 (MN-018)', coords: [80.44, 21.965], prob: '87%', conf: '83% HIGH' },
        { id: 'T-011', name: 'Target T-011 (MN-074)', coords: [79.71, 21.69], prob: '84%', conf: '81% HIGH' },
      ];

      targets.forEach((tgt) => {
        const isSelected = selectedTarget === tgt.id || selectedTarget === 'MN-042';
        const el = document.createElement('div');
        el.className = `w-7 h-7 rounded-full bg-red-600 border-2 border-white shadow-2xl cursor-pointer flex items-center justify-center text-white text-[10px] font-extrabold ${isSelected ? 'ring-4 ring-amber-400 scale-125' : 'animate-bounce'}`;
        el.innerText = '🎯';

        const m = new maplibregl.Marker({ element: el })
          .setLngLat(tgt.coords as [number, number])
          .setPopup(new maplibregl.Popup({ offset: 12 }).setHTML(`
            <div class="text-slate-900 p-1.5 text-xs font-sans">
              <strong class="text-red-700">${tgt.name}</strong><br/>
              Prospectivity: <span class="text-emerald-700 font-extrabold">${tgt.prob}</span><br/>
              Confidence: <span class="font-bold text-slate-800">${tgt.conf}</span><br/>
              <span class="text-[10px] text-blue-900 font-bold">Recommended: Field Core Drill</span>
            </div>
          `))
          .addTo(map.current!);
        markersRef.current.push(m);
      });
    }

    // Add Geochemical Occurrence Sample Point Markers if active
    if (activeLayers.occurrences !== false || activeLayers.geochemistry !== false) {
      const samplePoints = [
        { name: 'Mn Geochem Sample S-01', coords: [79.630, 21.657], mn_pct: 38.5 },
        { name: 'Mn Geochem Sample S-04', coords: [79.680, 21.690], mn_pct: 32.1 },
        { name: 'Mn Geochem Sample S-15', coords: [79.740, 21.745], mn_pct: 35.8 },
        { name: 'Mn Geochem Sample S-45', coords: [80.220, 21.860], mn_pct: 39.1 }
      ];

      samplePoints.forEach((pt) => {
        const el = document.createElement('div');
        el.className = 'w-3.5 h-3.5 rounded-full bg-emerald-600 border-2 border-white shadow cursor-pointer';
        
        const m = new maplibregl.Marker({ element: el })
          .setLngLat(pt.coords as [number, number])
          .setPopup(new maplibregl.Popup({ offset: 8 }).setHTML(`
            <div class="text-slate-900 p-1.5 text-xs font-sans">
              <strong class="text-emerald-800">${pt.name}</strong><br/>
              MnO Concentration: <span class="text-emerald-700 font-bold">${pt.mn_pct}%</span> (GSI Ground Assay)
            </div>
          `))
          .addTo(map.current!);
        markersRef.current.push(m);
      });
    }
  }, [activeLayers, selectedTarget]);

  const activeCount = Object.values(activeLayers).filter(Boolean).length;

  return (
    <div className="relative w-full h-full rounded border border-slate-300 overflow-hidden shadow-sm min-h-[550px]" style={{ height }}>
      <div ref={mapContainer} className="w-full h-full min-h-[550px] bg-slate-100" />
      
      {/* Top Left AOI Badge */}
      <div className="absolute top-3 left-3 bg-white/95 shadow-md px-3 py-1.5 rounded border border-slate-300 text-xs text-slate-800 pointer-events-none font-semibold z-10">
        <span className="text-[#003366] font-bold">AOI Boundary:</span> Balaghat Manganese Belt (21.60° - 22.05° N, 79.60° - 80.46° E)
      </div>

      {/* Bottom Right Live Active Layers Legend */}
      <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm shadow-xl p-3 rounded-lg border border-slate-300 text-xs text-slate-800 pointer-events-none space-y-1.5 z-10 max-w-xs font-sans">
        <div className="flex items-center justify-between border-b border-slate-200 pb-1">
          <span className="font-extrabold text-[#003366] uppercase text-[10px] tracking-wider">Canvas Layer Legend</span>
          <span className="bg-[#003366] text-white text-[10px] px-1.5 py-0.2 rounded font-mono font-bold">
            {activeCount} Active
          </span>
        </div>
        
        {activeLayers.prospectivity && (
          <div className="flex items-center gap-2 text-[11px]">
            <span className="w-3 h-3 rounded bg-emerald-500 border border-emerald-700 shrink-0" />
            <span>XGBoost Prospectivity (0.91 Max)</span>
          </div>
        )}

        {activeLayers.faults && (
          <div className="flex items-center gap-2 text-[11px]">
            <span className="w-3 h-0.5 bg-red-600 shrink-0" />
            <span>GSI Fault Lineaments (ISRO)</span>
          </div>
        )}

        {activeLayers.geology && (
          <div className="flex items-center gap-2 text-[11px]">
            <span className="w-3 h-3 rounded bg-purple-500/70 border border-purple-700 shrink-0" />
            <span>GSI Sausar Group Formations</span>
          </div>
        )}

        {activeLayers.sentinel2 && (
          <div className="flex items-center gap-2 text-[11px]">
            <span className="w-3 h-3 rounded bg-cyan-500/60 border border-cyan-700 shrink-0" />
            <span>Sentinel-2 NIR Surface Reflectance</span>
          </div>
        )}

        {activeLayers.uncertainty && (
          <div className="flex items-center gap-2 text-[11px]">
            <span className="w-3 h-3 rounded bg-amber-500/70 border border-amber-700 shrink-0" />
            <span>Ensemble Uncertainty Grid</span>
          </div>
        )}

        {activeLayers.geochemistry && (
          <div className="flex items-center gap-2 text-[11px]">
            <span className="w-3 h-3 rounded bg-pink-500/70 border border-pink-700 shrink-0" />
            <span>Geochemical Anomaly Grid</span>
          </div>
        )}

        {activeLayers.geophysics && (
          <div className="flex items-center gap-2 text-[11px]">
            <span className="w-3 h-3 rounded bg-blue-500/70 border border-blue-700 shrink-0" />
            <span>Aeromagnetic Anomaly Grid</span>
          </div>
        )}

        {activeLayers.occurrences && (
          <div className="flex items-center gap-2 text-[11px]">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0" />
            <span>160 GSI Manganese Occurrences</span>
          </div>
        )}
      </div>
    </div>
  );
};
