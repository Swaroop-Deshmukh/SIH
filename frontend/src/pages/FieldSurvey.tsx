import React, { useState } from 'react';
import { PrototypeBadge } from '../components/PrototypeBadge';
import { MapPin, Upload, CheckCircle2 } from 'lucide-react';

export const FieldSurvey: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    targetId: 'MN-042',
    lat: '21.8900',
    lng: '80.2350',
    lithology: 'Quartzite / Mica Schist',
    rockType: 'Metasedimentary',
    sampleId: 'SMP-2026-042-A',
    notes: 'Outcrop shows secondary manganese oxide encrustations along joint planes.'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <PrototypeBadge type="banner" />

      <div className="max-w-2xl mx-auto bg-brand-surface border border-brand-border rounded-xl p-6">
        <div className="flex items-center gap-3 pb-4 mb-6 border-b border-brand-border">
          <div className="p-2.5 rounded-lg bg-brand-accent/20 text-brand-accent">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">
              Field Validation & Ground Survey PWA
            </h2>
            <p className="text-xs text-slate-400">
              Direct field feedback loop: field assays automatically integrate into prospective ML model retraining cycles.
            </p>
          </div>
        </div>

        {submitted ? (
          <div className="p-6 text-center space-y-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto animate-bounce" />
            <h3 className="text-sm font-bold text-white">Observation Successfully Recorded</h3>
            <p className="text-xs text-slate-300">
              Sample ID <strong className="text-emerald-400">{formData.sampleId}</strong> queued for lab assay entry and subsequent model iteration.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Associated Drill Target</label>
                <select 
                  value={formData.targetId} 
                  onChange={(e) => setFormData({ ...formData, targetId: e.target.value })}
                  className="w-full bg-brand-dark border border-brand-border rounded-lg p-2.5 text-white focus:outline-none focus:border-brand-accent"
                >
                  <option value="MN-042">MN-042 (Score: 0.910)</option>
                  <option value="MN-018">MN-018 (Score: 0.872)</option>
                  <option value="MN-074">MN-074 (Score: 0.823)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Sample ID</label>
                <input 
                  type="text" 
                  value={formData.sampleId}
                  onChange={(e) => setFormData({ ...formData, sampleId: e.target.value })}
                  className="w-full bg-brand-dark border border-brand-border rounded-lg p-2.5 text-white focus:outline-none focus:border-brand-accent"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Latitude (°N)</label>
                <input 
                  type="text" 
                  value={formData.lat}
                  onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                  className="w-full bg-brand-dark border border-brand-border rounded-lg p-2.5 text-white focus:outline-none focus:border-brand-accent"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Longitude (°E)</label>
                <input 
                  type="text" 
                  value={formData.lng}
                  onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                  className="w-full bg-brand-dark border border-brand-border rounded-lg p-2.5 text-white focus:outline-none focus:border-brand-accent"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Observed Lithology</label>
                <input 
                  type="text" 
                  value={formData.lithology}
                  onChange={(e) => setFormData({ ...formData, lithology: e.target.value })}
                  className="w-full bg-brand-dark border border-brand-border rounded-lg p-2.5 text-white focus:outline-none focus:border-brand-accent"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Rock Classification</label>
                <input 
                  type="text" 
                  value={formData.rockType}
                  onChange={(e) => setFormData({ ...formData, rockType: e.target.value })}
                  className="w-full bg-brand-dark border border-brand-border rounded-lg p-2.5 text-white focus:outline-none focus:border-brand-accent"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Geological Field Notes</label>
              <textarea 
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full bg-brand-dark border border-brand-border rounded-lg p-2.5 text-white focus:outline-none focus:border-brand-accent"
              />
            </div>

            <div className="p-4 border-2 border-dashed border-brand-border rounded-lg text-center text-slate-400 hover:border-brand-accent/50 cursor-pointer">
              <Upload className="w-5 h-5 mx-auto mb-1 text-slate-500" />
              <p className="text-xs">Attach Outcrop Photos or GPS Tracks</p>
              <p className="text-[10px] text-slate-500 mt-0.5">JPEG, PNG, GPX up to 25MB</p>
            </div>

            <button 
              type="submit"
              className="w-full py-2.5 bg-brand-accent hover:bg-amber-500 text-brand-dark font-bold rounded-lg text-xs tracking-wider uppercase transition-colors"
            >
              Submit Ground Truth Record
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
