import React, { useState } from 'react';
import { MapPin, Camera, CheckCircle2, Upload, ShieldCheck, Layers } from 'lucide-react';
import { PrototypeBadge } from '../components/PrototypeBadge';

export const FieldSurvey: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [surveyData, setSurveyData] = useState({
    targetId: 'TGT-001',
    collectorName: 'Eng. Ramesh Verma',
    sampleType: 'Manganese Ore Outcrop',
    mnGradeEstimate: '38.5',
    notes: ''
  });

  const recentSurveys = [
    { id: '1', sample_code: 'MN-SAMP-001', mn_assay_percent: 38.5, location_name: 'North Balaghat Outcrop Strike A', collector: 'Eng. Ramesh Verma', date_collected: '2026-09-05' },
    { id: '2', sample_code: 'MN-SAMP-002', mn_assay_percent: 34.2, location_name: 'East Bharweli Quartz-Mn Zone', collector: 'Geol. Priya Sharma', date_collected: '2026-09-02' },
    { id: '3', sample_code: 'MN-SAMP-003', mn_assay_percent: 31.0, location_name: 'Ukwa Extension Shear Contact', collector: 'Geol. Amit Patel', date_collected: '2026-08-28' },
  ];

  const handleSurveySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-6">
      <PrototypeBadge type="banner" />

      {/* Page Title Header */}
      <div className="bg-white border-l-4 border-[#D4AF37] border border-slate-200 p-6 rounded shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#1E3A8A] uppercase tracking-wider">
            <MapPin className="w-4 h-4 text-amber-500" />
            <span>MOIL FIELD GEOLOGY PROGRESSIVE WEB APP (PWA)</span>
          </div>
          <h1 className="text-2xl font-bold text-[#0B192C] font-serif mt-1">
            Ground-Truth Field Inspection & Outcrop Logging
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Offline PWA logging ground-truth manganese outcrop samples for AI prospectivity model re-training.
          </p>
        </div>
        <div className="bg-[#0B192C] text-white p-3 rounded text-xs font-mono border-l-2 border-amber-400">
          <p className="text-amber-400 font-bold">Field App Status</p>
          <p className="text-emerald-400 font-bold">Online & Geo-Synced</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Form: Field Entry */}
        <div className="lg:col-span-2 bg-white rounded border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-[#0B192C] font-serif border-b border-slate-200 pb-3">
            Record New Ground-Truth Geological Sample
          </h3>

          {submitted ? (
            <div className="bg-emerald-50 border border-emerald-300 p-6 rounded text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h4 className="text-lg font-bold text-emerald-900">Sample Logged & Synced</h4>
              <p className="text-xs text-emerald-800">
                Sample reference <span className="font-mono font-bold">MOIL-SURVEY-2026-092</span> synchronized with PostGIS spatial database.
              </p>
              <button 
                onClick={() => setSubmitted(false)}
                className="px-4 py-1.5 bg-[#1E3A8A] text-white text-xs font-bold rounded hover:bg-[#0B192C]"
              >
                Log Additional Sample
              </button>
            </div>
          ) : (
            <form onSubmit={handleSurveySubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target ID / Site *</label>
                  <select
                    value={surveyData.targetId}
                    onChange={(e) => setSurveyData({ ...surveyData, targetId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 font-mono"
                  >
                    <option>TGT-001 (North Balaghat)</option>
                    <option>TGT-002 (East Bharweli)</option>
                    <option>TGT-003 (Ukwa Extension)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Geologist / Field Engineer *</label>
                  <input
                    type="text"
                    required
                    value={surveyData.collectorName}
                    onChange={(e) => setSurveyData({ ...surveyData, collectorName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sample Mineralogy *</label>
                  <input
                    type="text"
                    required
                    value={surveyData.sampleType}
                    onChange={(e) => setSurveyData({ ...surveyData, sampleType: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Est. Mn Grade (%) *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={surveyData.mnGradeEstimate}
                    onChange={(e) => setSurveyData({ ...surveyData, mnGradeEstimate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Outcrop Field Notes & Observations</label>
                <textarea
                  rows={3}
                  placeholder="Enter structural strike/dip, host rock quartzite association..."
                  value={surveyData.notes}
                  onChange={(e) => setSurveyData({ ...surveyData, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#1E3A8A] text-white font-bold text-xs rounded hover:bg-[#0B192C] transition-colors shadow-sm flex items-center gap-2"
                >
                  <Upload className="w-3.5 h-3.5 text-amber-400" />
                  <span>Sync Sample Record</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right Log List */}
        <div className="bg-white rounded border border-slate-200 p-6 shadow-sm space-y-3 text-xs">
          <h3 className="text-base font-bold text-[#0B192C] font-serif border-b border-slate-200 pb-3">
            Recent Ground Inspections
          </h3>

          <div className="space-y-3">
            {recentSurveys.map((survey) => (
              <div key={survey.id} className="p-3 bg-slate-50 border border-slate-200 rounded space-y-1">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-[#1E3A8A]">{survey.sample_code}</span>
                  <span className="text-emerald-700 font-mono">{survey.mn_assay_percent}% Mn</span>
                </div>
                <p className="text-slate-700 text-[11px]">{survey.location_name}</p>
                <p className="text-slate-500 text-[10px] font-mono">{survey.date_collected} | {survey.collector}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
