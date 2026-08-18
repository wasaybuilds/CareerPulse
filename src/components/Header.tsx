import React from 'react';
import { 
  Plus, 
  Sparkles, 
  FileSpreadsheet, 
  RotateCcw, 
  Kanban, 
  Table as TableIcon, 
  BarChart3, 
  Calendar as CalendarIcon,
  Search,
  RefreshCw,
  Layers
} from 'lucide-react';
import { useJobs } from '../context/JobContext';

export const Header: React.FC = () => {
  const { 
    metrics, 
    viewMode, 
    setViewMode, 
    setIsAddModalOpen, 
    setIsSmartPasteOpen, 
    setIsImportExportOpen,
    resetToSampleData,
    filters,
    setFilters,
    dbStatus,
    isSyncing,
    syncWithMongoDB
  } = useJobs();

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-800/70 bg-[#0d1117]/95 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          
          {/* Brand & Stats */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold shrink-0">
                <Layers className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold tracking-tight text-white">
                  Career<span className="text-indigo-400">Pulse</span>
                </h1>
                
                {/* Database Status Dot */}
                <button
                  onClick={() => syncWithMongoDB()}
                  className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium border transition ${
                    dbStatus.online
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                      : 'bg-zinc-800/80 text-zinc-400 border-zinc-700/60 hover:bg-zinc-800'
                  }`}
                  title={dbStatus.online ? 'Synced to MongoDB Atlas' : 'Local Cache Active'}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${dbStatus.online ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                  <span>{dbStatus.online ? 'MongoDB' : 'Local'}</span>
                  {isSyncing && <RefreshCw className="w-2.5 h-2.5 animate-spin ml-0.5 text-zinc-400" />}
                </button>
              </div>
            </div>

            {/* Mobile Plus */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="p-1.5 rounded-lg bg-indigo-600 text-white"
                title="Add Application"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="hidden lg:flex items-center gap-2 text-xs text-zinc-400">
            <span className="px-2.5 py-1 rounded-md bg-[#161b22] border border-zinc-800 text-zinc-300">
              <strong className="text-white">{metrics.activeApplications}</strong> Active
            </span>
            <span className="px-2.5 py-1 rounded-md bg-[#161b22] border border-zinc-800 text-zinc-300">
              <strong className="text-indigo-400">{metrics.interview}</strong> Interviews
            </span>
            <span className="px-2.5 py-1 rounded-md bg-[#161b22] border border-zinc-800 text-zinc-300">
              <strong className="text-emerald-400">{metrics.offer}</strong> Offers
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSmartPasteOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-[#161b22] hover:bg-[#21262d] text-zinc-300 border border-zinc-800 hover:border-zinc-700 transition"
              title="Smart Paste Job Description"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Smart Paste</span>
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Job</span>
            </button>

            <div className="h-4 w-px bg-zinc-800 mx-1 hidden sm:block"></div>

            <button
              onClick={() => setIsImportExportOpen(true)}
              className="p-1.5 text-zinc-400 hover:text-zinc-200 bg-[#161b22] hover:bg-[#21262d] rounded-lg border border-zinc-800 transition"
              title="Import / Export"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => {
                if (confirm('Load sample applications?')) {
                  resetToSampleData();
                }
              }}
              className="p-1.5 text-zinc-400 hover:text-zinc-200 bg-[#161b22] hover:bg-[#21262d] rounded-lg border border-zinc-800 transition"
              title="Reset Sample Data"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* View Switcher & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 mt-2.5 pt-2.5 border-t border-zinc-800/60">
          
          {/* Navigation View Switcher */}
          <div className="flex items-center bg-[#161b22] p-0.5 rounded-lg border border-zinc-800 self-start">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition ${
                viewMode === 'kanban' 
                  ? 'bg-zinc-800 text-white shadow-sm font-semibold' 
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Board</span>
            </button>

            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition ${
                viewMode === 'table' 
                  ? 'bg-zinc-800 text-white shadow-sm font-semibold' 
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>

            <button
              onClick={() => setViewMode('analytics')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition ${
                viewMode === 'analytics' 
                  ? 'bg-zinc-800 text-white shadow-sm font-semibold' 
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Analytics</span>
            </button>

            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition ${
                viewMode === 'calendar' 
                  ? 'bg-zinc-800 text-white shadow-sm font-semibold' 
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Schedule</span>
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search company, role, skill..."
              value={filters.searchQuery}
              onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
              className="w-full pl-8 pr-3 py-1 text-xs rounded-lg bg-[#161b22] border border-zinc-800 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
            />
            {filters.searchQuery && (
              <button
                onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))}
                className="absolute right-2 top-1.5 text-xs text-zinc-500 hover:text-zinc-300"
              >
                ✕
              </button>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
