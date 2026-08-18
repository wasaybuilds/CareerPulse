import React, { useState } from 'react';
import { JobProvider, useJobs } from './context/JobContext';
import { Sidebar } from './components/Sidebar';
import { TopNav } from './components/TopNav';
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#0b0e14] text-zinc-100 font-sans selection:bg-indigo-500 selection:text-white overflow-hidden">
      
      {/* SaaS Left Sidebar Navigation */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        
        {/* Top Navbar */}
        <TopNav onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        {/* View Switcher Container */}
        <main className="flex-1 flex flex-col overflow-y-auto min-h-0 bg-[#0d1017]">
          {viewMode === 'table' && <TableView />}
          {viewMode === 'kanban' && <KanbanBoard />}
          {viewMode === 'analytics' && <AnalyticsDashboard />}
          {viewMode === 'calendar' && <CalendarView />}
        </main>

      </div>

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
