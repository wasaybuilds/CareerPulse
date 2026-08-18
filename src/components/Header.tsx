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
  CheckCircle2,
  Clock,
  Award,
  Database,
  RefreshCw
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
    <header className="sticky top-0 z-30 border-b border-rose-500/10 bg-[#080d14]/85 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3.5">
          
          {/* Brand & Logo with Watermelon UI Vibe */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-[#ff2d55] via-[#ff477e] to-[#10b981] p-0.5 shadow-lg shadow-rose-500/25 shrink-0 animate-pulse-subtle">
                <div className="w-full h-full bg-[#090e15] rounded-[14px] flex items-center justify-center">
                  <span className="text-lg select-none">🍉</span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-extrabold tracking-tight text-white flex items-center gap-1">
                    Career<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff3864] via-[#ff5e85] to-[#10b981]">Pulse</span>
                  </h1>
                  
                  {/* Database Status Badge */}
                  <button
                    onClick={() => syncWithMongoDB()}
                    className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border transition ${
                      dbStatus.online
                        ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30 hover:bg-emerald-900/50'
                        : 'bg-rose-950/40 text-rose-300 border-rose-500/30 hover:bg-rose-900/50'
                    }`}
                    title={dbStatus.online ? 'Connected to MongoDB Atlas. Click to sync.' : 'Running in Local Cache Mode. Click to reconnect.'}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${dbStatus.online ? 'bg-emerald-400 animate-ping' : 'bg-rose-400'}`}></span>
                    <Database className="w-3 h-3" />
                    <span>{dbStatus.online ? 'MongoDB Live' : 'Local DB'}</span>
                    {isSyncing && <RefreshCw className="w-2.5 h-2.5 animate-spin ml-0.5" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">
                  Track jobs, JDs, resumes & interviews backed by MongoDB
                </p>
              </div>
            </div>

            {/* Mobile Plus Button */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="p-2 rounded-xl bg-gradient-to-r from-[#ff2d55] to-[#ff477e] text-white shadow-md shadow-rose-500/20"
                title="Add Job"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar with Watermelon Aesthetics */}
          <div className="hidden lg:flex items-center gap-2.5 bg-[#0d141e]/80 p-1.5 rounded-2xl border border-white/[0.06] text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900/60 text-slate-300 border border-slate-800/60">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-bold text-white">{metrics.activeApplications}</span> Active
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900/60 text-slate-300 border border-slate-800/60">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#ff477e]" />
              <span className="font-bold text-white">{metrics.interview}</span> Interviewing
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#03231a] text-emerald-300 border border-emerald-500/30">
              <Award className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-bold text-emerald-400">{metrics.offer}</span> {metrics.offer === 1 ? 'Offer' : 'Offers'} 🎉
            </div>
          </div>

          {/* Main Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <button
              onClick={() => setIsSmartPasteOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-[#ff3864]/10 to-[#10b981]/10 hover:from-[#ff3864]/20 hover:to-[#10b981]/20 text-rose-300 border border-rose-500/30 hover:border-rose-500/60 transition shadow-sm"
              title="Paste raw Job Description text to auto-parse"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#ff477e]" />
              <span className="hidden sm:inline">Smart Paste JD</span>
              <span className="sm:hidden">Paste JD</span>
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-[#ff2d55] to-[#ff477e] hover:from-[#ff1a47] hover:to-[#ff3864] text-white shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 transition hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>Add Job</span>
            </button>

            <div className="h-6 w-px bg-slate-800 mx-1 hidden sm:block"></div>

            <button
              onClick={() => setIsImportExportOpen(true)}
              className="p-2 text-slate-400 hover:text-slate-100 bg-[#0d141e] hover:bg-slate-800 rounded-xl border border-white/[0.07] transition"
              title="Export to CSV/Sheets or Import"
            >
              <FileSpreadsheet className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                if (confirm('Load demo sample jobs and sync with database?')) {
                  resetToSampleData();
                }
              }}
              className="p-2 text-slate-400 hover:text-slate-100 bg-[#0d141e] hover:bg-slate-800 rounded-xl border border-white/[0.07] transition"
              title="Load Sample Demo Data"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* View Switcher & Quick Search Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-3 pt-3 border-t border-white/[0.06]">
          
          {/* Navigation Views with Watermelon highlights */}
          <div className="flex items-center bg-[#0d141e]/90 p-1 rounded-2xl border border-white/[0.08] self-start">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition ${
                viewMode === 'kanban' 
                  ? 'bg-gradient-to-r from-[#ff2d55] to-[#ff477e] text-white shadow-md shadow-rose-500/25' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Pipeline Board</span>
            </button>

            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition ${
                viewMode === 'table' 
                  ? 'bg-gradient-to-r from-[#ff2d55] to-[#ff477e] text-white shadow-md shadow-rose-500/25' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Table Grid</span>
            </button>

            <button
              onClick={() => setViewMode('analytics')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition ${
                viewMode === 'analytics' 
                  ? 'bg-gradient-to-r from-[#ff2d55] to-[#ff477e] text-white shadow-md shadow-rose-500/25' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Analytics</span>
            </button>

            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition ${
                viewMode === 'calendar' 
                  ? 'bg-gradient-to-r from-[#ff2d55] to-[#ff477e] text-white shadow-md shadow-rose-500/25' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Schedule</span>
            </button>
          </div>

          {/* Quick Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search role, company, skill..."
              value={filters.searchQuery}
              onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-[#0d141e] border border-white/[0.08] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#ff3864] focus:ring-1 focus:ring-[#ff3864] transition"
            />
            {filters.searchQuery && (
              <button
                onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))}
                className="absolute right-2.5 top-2 text-xs text-slate-500 hover:text-slate-300"
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
