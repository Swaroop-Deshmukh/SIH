import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
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

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="flex h-screen w-screen overflow-hidden bg-brand-dark font-sans">
        {/* Main Navigation Sidebar */}
        <Sidebar />

        {/* Content Viewport */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Header title="MnVision 360" subtitle="Space-to-Mine Intelligence Platform for MOIL" />

          <main className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
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
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
};
