import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
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
import { AuthModal } from './components/AuthModal';

const AppContent: React.FC = () => {
  const { viewMode } = useJobs();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-indigo-500 selection:text-white overflow-hidden">
      
      {/* Sleek Dark SaaS Left Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-[#f8fafc]">
        
        {/* Top Navbar */}
        <TopNav onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        {/* View Switcher Container */}
        <main className="flex-1 flex flex-col overflow-y-auto min-h-0 bg-[#f8fafc]">
          {viewMode === 'table' && <TableView />}
          {viewMode === 'kanban' && <KanbanBoard />}
          {viewMode === 'analytics' && <AnalyticsDashboard />}
          {viewMode === 'calendar' && <CalendarView />}
        </main>

      </div>

      {/* Modals & Dialogs */}
      <AuthModal />
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
    <AuthProvider>
      <JobProvider>
        <AppContent />
      </JobProvider>
    </AuthProvider>
  );
}

export default App;
