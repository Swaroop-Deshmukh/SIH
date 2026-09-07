import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Landmark, Send, CheckCircle2, ShieldCheck } from 'lucide-react';

export const Contact: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'Exploration & GIS Division',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-8">
      {/* Institutional Page Title Banner */}
      <div className="bg-white border-l-4 border-[#D4AF37] border border-slate-200 p-6 rounded shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#1E3A8A] uppercase tracking-wider">
              <Landmark className="w-4 h-4 text-amber-500" />
              <span>MOIL LIMITED — HEADQUARTERS</span>
            </div>
            <h1 className="text-2xl font-bold text-[#0B192C] font-serif mt-1">
              Contact & Official Inquiry Portal
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              Official contact information for MOIL Limited Headquarters, Balaghat Mining Division, and MnVision 360 System Support.
            </p>
          </div>
          <div className="bg-[#0B192C] text-white p-3 rounded text-xs font-mono border-l-2 border-amber-400">
            <p className="text-amber-400 font-bold">MOIL Registered Office</p>
            <p className="text-slate-300">CIN: L99999MH1962GOI012398</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Official Contact Information */}
        <div className="space-y-6 lg:col-span-1">
          {/* Card 1: Head Office Address */}
          <div className="bg-white p-6 rounded border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-[#0B192C] border-b border-slate-200 pb-2.5 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#1E3A8A]" />
              <span>Registered Head Office</span>
            </h3>

            <div className="text-xs text-slate-700 space-y-2 leading-relaxed">
              <p className="font-bold text-[#0B192C] text-sm">MOIL Limited</p>
              <p>MOIL Bhavan, 1A Katol Road,</p>
              <p>Nagpur - 440 013, Maharashtra, India</p>
            </div>

            <div className="pt-3 border-t border-slate-100 text-xs space-y-2 text-slate-700">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#1E3A8A]" />
                <div>
                  <span className="font-semibold text-slate-900">Telephone: </span>
                  <span>+91-712-2590050, 2590051</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#1E3A8A]" />
                <div>
                  <span className="font-semibold text-slate-900">Email: </span>
                  <a href="mailto:contact@moil.nic.in" className="text-[#1E3A8A] underline">contact@moil.nic.in</a>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#1E3A8A]" />
                <div>
                  <span className="font-semibold text-slate-900">Working Hours: </span>
                  <span>09:30 - 17:30 IST (Mon - Fri)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Balaghat Operations Division */}
          <div className="bg-white p-6 rounded border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-[#0B192C] border-b border-slate-200 pb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#1E3A8A]" />
              <span>Balaghat Mine Division</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Balaghat Mine Office, Post: Bharweli, District: Balaghat, Madhya Pradesh - 481001.
            </p>
            <p className="text-xs text-slate-700">
              <span className="font-semibold">Direct Office: </span>+91-7632-240124
            </p>
          </div>
        </div>

        {/* Right Column: Contact Inquiry Form & Interactive Map Location */}
        <div className="space-y-6 lg:col-span-2">
          {/* Official Inquiry Form */}
          <div className="bg-white p-6 rounded border border-slate-200 shadow-sm">
            <h3 className="text-base font-bold text-[#0B192C] border-b border-slate-200 pb-3 mb-4">
              Official Communication & GIS Support Form
            </h3>

            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-300 p-6 rounded text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-lg font-bold text-emerald-900">Inquiry Submitted Successfully</h4>
                <p className="text-xs text-emerald-800">
                  Your reference ID <span className="font-mono font-bold">MOIL-GIS-2026-8492</span> has been registered. An official response will be sent to <span className="font-bold">{formData.email}</span>.
                </p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="mt-3 px-4 py-1.5 bg-[#1E3A8A] text-white text-xs font-semibold rounded hover:bg-[#0B192C]"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Rajesh Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:outline-none focus:border-[#1E3A8A]"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Official Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. rajesh.sharma@moil.nic.in"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:outline-none focus:border-[#1E3A8A]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Department / Division *</label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:outline-none focus:border-[#1E3A8A]"
                    >
                      <option>Exploration & GIS Division</option>
                      <option>Mine Operations & Planning</option>
                      <option>Production & Metallurgy</option>
                      <option>Equipment & Maintenance</option>
                      <option>General Public Inquiry</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Subject *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Target TGT-014 Core Drilling Verification"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:outline-none focus:border-[#1E3A8A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Detailed Message / Request *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Enter detailed technical or administrative request..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:outline-none focus:border-[#1E3A8A]"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2 bg.gradient bg-[#1E3A8A] text-white font-bold text-xs rounded hover:bg-[#0B192C] transition-colors flex items-center gap-2 shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5 text-amber-400" />
                    <span>Submit Inquiry</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Location Map Section */}
          <div className="bg-white p-6 rounded border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-[#0B192C] mb-3 flex items-center justify-between">
              <span>MOIL Bhavan Head Office Location</span>
              <span className="text-xs text-slate-500 font-normal">Nagpur, Maharashtra</span>
            </h3>
            <div className="w-full h-48 bg-slate-100 border border-slate-300 rounded flex flex-col items-center justify-center text-center p-4">
              <MapPin className="w-8 h-8 text-[#1E3A8A] mb-2 animate-bounce" />
              <p className="font-bold text-slate-800 text-xs">MOIL Bhavan, 1A Katol Road, Nagpur</p>
              <p className="text-[11px] text-slate-500 mt-1">Coordinates: 21.1684° N, 79.0682° E</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
