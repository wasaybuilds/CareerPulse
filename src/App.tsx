import React from 'react';
import { JobProvider, useJobs } from './context/JobContext';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { KanbanBoard } from './components/KanbanBoard';
import { TableView } from './components/TableView';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { CalendarView } from './components/CalendarView';
import { JobDetailModal } from './components/JobDetailModal';
import { JobFormModal } from './components/JobFormModal';
import { SmartPasteModal } from './components/SmartPasteModal';
import { ShareSummaryModal } from './components/ShareSummaryModal';
import { ImportExportModal } from './components/ImportExportModal';

const AppContent: React.FC = () => {
  const { viewMode } = useJobs();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Header with quick stats, search, view switcher, and quick add buttons */}
      <Header />

      {/* Filter and Sort bar (hidden in analytics and calendar views if desired, or active for table & kanban) */}
      {(viewMode === 'kanban' || viewMode === 'table') && (
        <FilterBar />
      )}

      {/* Main View Container */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {viewMode === 'kanban' && <KanbanBoard />}
        {viewMode === 'table' && <TableView />}
        {viewMode === 'analytics' && <AnalyticsDashboard />}
        {viewMode === 'calendar' && <CalendarView />}
      </main>

      {/* Modals & Dialogs */}
      <JobDetailModal />
      <JobFormModal />
      <SmartPasteModal />
      <ShareSummaryModal />
      <ImportExportModal />
    </div>
  );
};

export function App() {
  return (
    <JobProvider>
      <AppContent />
    </JobProvider>
  );
}

export default App;
