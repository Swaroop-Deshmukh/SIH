import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';

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

    // Light basemap style
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://demotiles.maplibre.org/style.json',
      center: initialCenter,
      zoom: initialZoom,
      attributionControl: false,
    });

    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
    map.current.addControl(new maplibregl.ScaleControl({ maxWidth: 100, unit: 'metric' }), 'bottom-left');

    map.current.on('load', () => {
      if (!map.current) return;

      // Add Balaghat Mine Markers
      const mines = [
        { name: 'North Balaghat Mine (BLG-01)', coords: [80.135, 21.88], status: 'OPERATIONAL' },
        { name: 'Central Balaghat Mine (BLG-02)', coords: [80.19, 21.835], status: 'OPERATIONAL' },
        { name: 'South Balaghat Mine (BLG-03)', coords: [80.16, 21.775], status: 'OPERATIONAL' },
      ];

      mines.forEach((mine) => {
        const el = document.createElement('div');
        el.className = 'w-4 h-4 rounded-full bg-[#1E3A8A] border-2 border-amber-400 shadow-md cursor-pointer animate-pulse';
        
        new maplibregl.Marker({ element: el })
          .setLngLat(mine.coords as [number, number])
          .setPopup(new maplibregl.Popup({ offset: 10 }).setHTML(`
            <div class="text-slate-900 p-1 text-xs">
              <strong>${mine.name}</strong><br/>
              Status: <span class="text-emerald-700 font-bold">${mine.status}</span>
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
    <div className="relative w-full h-full rounded border border-slate-300 overflow-hidden shadow-sm" style={{ height }}>
      <div ref={mapContainer} className="w-full h-full" />
      <div className="absolute top-3 left-3 bg-white/95 shadow-md px-3 py-1.5 rounded border border-slate-300 text-xs text-slate-800 pointer-events-none font-semibold">
        <span className="text-[#1E3A8A] font-bold">AOI Boundary:</span> Balaghat Manganese Belt (21.83° N, 80.18° E)
      </div>
    </div>
  );
};
