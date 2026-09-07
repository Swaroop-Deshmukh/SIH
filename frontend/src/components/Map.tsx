import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface MapProps {
  initialCenter?: [number, number]; // [lng, lat]
  initialZoom?: number;
  height?: string;
  onMarkerClick?: (marker: any) => void;
}

export const Map: React.FC<MapProps> = ({
  initialCenter = [80.18, 21.83], // Balaghat, Madhya Pradesh coordinates
  initialZoom = 10,
  height = '100%',
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    // Robust MapLibre style definition using OpenStreetMap raster tiles
    const style: maplibregl.StyleSpecification = {
      version: 8,
      sources: {
        'osm-tiles': {
          type: 'raster',
          tiles: [
            'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
          ],
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

      // Add Balaghat 3 Primary Mine Leases
      const mines = [
        { name: 'North Balaghat Mine (BLG-01)', coords: [80.135, 21.88], type: 'Underground Lease', status: 'OPERATIONAL' },
        { name: 'Central Balaghat Mine - Ukwa (BLG-02)', coords: [80.466, 21.971], type: 'Underground Lease', status: 'OPERATIONAL' },
        { name: 'South Balaghat Mine - Tirodi (BLG-03)', coords: [79.719, 21.685], type: 'Mixed Lease (UG+OC)', status: 'OPERATIONAL' },
      ];

      mines.forEach((mine) => {
        const el = document.createElement('div');
        el.className = 'w-6 h-6 rounded-full bg-[#1E3A8A] border-2 border-amber-400 shadow-xl cursor-pointer flex items-center justify-center text-white text-[10px] font-bold';
        el.innerText = '⛏';
        
        new maplibregl.Marker({ element: el })
          .setLngLat(mine.coords as [number, number])
          .setPopup(new maplibregl.Popup({ offset: 12 }).setHTML(`
            <div class="text-slate-900 p-1.5 text-xs font-sans">
              <strong class="text-[#1E3A8A]">${mine.name}</strong><br/>
              Type: <span class="font-semibold">${mine.type}</span><br/>
              Status: <span class="text-emerald-700 font-bold">${mine.status}</span>
            </div>
          `))
          .addTo(map.current!);
      });

      // Add Geochemical Ground Occurrence Samples Markers (Balaghat Belt)
      const samplePoints = [
        { name: 'Mn Geochem Sample S-01', coords: [79.630, 21.657], mn_pct: 38.5 },
        { name: 'Mn Geochem Sample S-04', coords: [79.680, 21.690], mn_pct: 32.1 },
        { name: 'Mn Geochem Sample S-09', coords: [79.715, 21.710], mn_pct: 29.4 },
        { name: 'Mn Geochem Sample S-15', coords: [79.740, 21.745], mn_pct: 35.8 },
        { name: 'Mn Geochem Sample S-22', coords: [79.650, 21.670], mn_pct: 26.2 },
        { name: 'Mn Geochem Sample S-31', coords: [80.120, 21.840], mn_pct: 34.2 },
        { name: 'Mn Geochem Sample S-45', coords: [80.220, 21.860], mn_pct: 39.1 }
      ];

      samplePoints.forEach((pt) => {
        const el = document.createElement('div');
        el.className = 'w-3.5 h-3.5 rounded-full bg-emerald-600 border-2 border-white shadow cursor-pointer';
        
        new maplibregl.Marker({ element: el })
          .setLngLat(pt.coords as [number, number])
          .setPopup(new maplibregl.Popup({ offset: 8 }).setHTML(`
            <div class="text-slate-900 p-1.5 text-xs font-sans">
              <strong class="text-emerald-800">${pt.name}</strong><br/>
              MnO Concentration: <span class="text-emerald-700 font-bold">${pt.mn_pct}%</span> (GSI Ground Truth)
            </div>
          `))
          .addTo(map.current!);
      });
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [initialCenter, initialZoom]);

  return (
    <div className="relative w-full h-full rounded border border-slate-300 overflow-hidden shadow-sm min-h-[550px]" style={{ height }}>
      <div ref={mapContainer} className="w-full h-full min-h-[550px] bg-slate-100" />
      <div className="absolute top-3 left-3 bg-white/95 shadow-md px-3 py-1.5 rounded border border-slate-300 text-xs text-slate-800 pointer-events-none font-semibold z-10">
        <span className="text-[#1E3A8A] font-bold">AOI Boundary:</span> Balaghat Manganese Belt (21.60° - 22.05° N, 79.60° - 80.46° E)
      </div>
    </div>
  );
};
