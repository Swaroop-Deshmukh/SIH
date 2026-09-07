import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Breadcrumb } from './components/Breadcrumb';
import { Footer } from './components/Footer';
import { CommandCenter } from './pages/CommandCenter';
import { ExplorationMap } from './pages/ExplorationMap';
import { DrillPlanning } from './pages/DrillPlanning';
import { TargetAnalysis } from './pages/TargetAnalysis';
import { MineTwin } from './pages/MineTwin';
import { Production } from './pages/Production';
import { Equipment } from './pages/Equipment';
import { DecisionCenter } from './pages/DecisionCenter';
import { FieldSurvey } from './pages/FieldSurvey';
import { DataModels } from './pages/DataModels';
import { Contact } from './pages/Contact';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen w-full bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
        {/* Full-Width Government Sticky Top Header & Navigation */}
        <Header />

        {/* Dynamic Breadcrumbs */}
        <Breadcrumb />

        {/* Main Content Body */}
        <main className="flex-1 w-full">
          <Routes>
            <Route path="/" element={<CommandCenter />} />
            <Route path="/exploration" element={<ExplorationMap />} />
            <Route path="/drill-planning" element={<DrillPlanning />} />
            <Route path="/exploration/:targetId" element={<TargetAnalysis />} />
            <Route path="/mine-twin" element={<MineTwin />} />
            <Route path="/production" element={<Production />} />
            <Route path="/equipment" element={<Equipment />} />
            <Route path="/decisions" element={<DecisionCenter />} />
            <Route path="/field-survey" element={<FieldSurvey />} />
            <Route path="/data-models" element={<DataModels />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>

        {/* Large Government PSU Footer */}
        <Footer />
      </div>
    </BrowserRouter>
  );
};
