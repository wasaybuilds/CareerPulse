import React from 'react';
import { 
  Table as TableIcon, 
  Kanban, 
  BarChart3, 
  Calendar as CalendarIcon, 
  Plus, 
  Sparkles, 
  FileSpreadsheet, 
  RotateCcw, 
  Layers, 
  RefreshCw,
  CheckCircle2,
  Clock,
  Award,
  Archive,
  XCircle,
  Inbox,
  Bookmark
} from 'lucide-react';
import { useJobs } from '../context/JobContext';
import type { JobStatus } from '../types/job';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const { 
    jobs, 
    viewMode, 
    setViewMode, 
    filters, 
    setFilters, 
    setIsAddModalOpen, 
    setIsSmartPasteOpen, 
    setIsImportExportOpen, 
    resetToSampleData, 
    dbStatus, 
    isSyncing, 
    syncWithMongoDB 
  } = useJobs();

  const stageCounts = {
    wishlist: jobs.filter(j => j.status === 'wishlist').length,
    applied: jobs.filter(j => j.status === 'applied').length,
    oa: jobs.filter(j => j.status === 'oa').length,
    interview: jobs.filter(j => j.status === 'interview').length,
    offer: jobs.filter(j => j.status === 'offer').length,
    rejected: jobs.filter(j => j.status === 'rejected').length,
    archived: jobs.filter(j => j.status === 'archived').length
  };

  const handleStageClick = (status: JobStatus | 'all') => {
    setFilters(prev => ({ ...prev, status }));
    if (viewMode === 'analytics' || viewMode === 'calendar') {
      setViewMode('table');
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-[#11141c] border-r border-zinc-800/80
        flex flex-col justify-between
        transition-transform duration-200 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        {/* Top Header */}
        <div className="flex flex-col">
          <div className="p-4 border-b border-zinc-800/70 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-indigo-600/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold shrink-0">
                <Layers className="w-4 h-4 text-indigo-400" />
              </div>
              <div>
                <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-1">
                  Career<span className="text-indigo-400">Pulse</span>
                </h1>
                <p className="text-[10px] text-zinc-400">Job Search Hub</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md text-zinc-400 hover:text-white lg:hidden"
            >
              ✕
            </button>
          </div>

          {/* Quick Action Buttons */}
          <div className="p-3 space-y-1.5 border-b border-zinc-800/60">
            <button
              onClick={() => {
                setIsAddModalOpen(true);
                setIsOpen(false);
              }}
              className="w-full py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Application</span>
            </button>

            <button
              onClick={() => {
                setIsSmartPasteOpen(true);
                setIsOpen(false);
              }}
              className="w-full py-1.5 px-3 rounded-lg bg-[#181d28] hover:bg-[#202736] text-zinc-300 border border-zinc-800 hover:border-zinc-700 font-medium text-xs flex items-center justify-center gap-1.5 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Smart Paste JD</span>
            </button>
          </div>

          {/* Navigation Views */}
          <div className="p-3 space-y-1">
            <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
              Views
            </div>

            <button
              onClick={() => {
                setViewMode('table');
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                viewMode === 'table'
                  ? 'bg-zinc-800 text-white font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850'
              }`}
            >
              <div className="flex items-center gap-2">
                <TableIcon className="w-3.5 h-3.5 text-indigo-400" />
                <span>Applications Table</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#181d28] text-zinc-400">
                {jobs.length}
              </span>
            </button>

            <button
              onClick={() => {
                setViewMode('kanban');
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                viewMode === 'kanban'
                  ? 'bg-zinc-800 text-white font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850'
              }`}
            >
              <div className="flex items-center gap-2">
                <Kanban className="w-3.5 h-3.5 text-indigo-400" />
                <span>Pipeline Board</span>
              </div>
            </button>

            <button
              onClick={() => {
                setViewMode('analytics');
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                viewMode === 'analytics'
                  ? 'bg-zinc-800 text-white font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850'
              }`}
            >
              <div className="flex items-center gap-2">
                <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Analytics & Funnel</span>
              </div>
            </button>

            <button
              onClick={() => {
                setViewMode('calendar');
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                viewMode === 'calendar'
                  ? 'bg-zinc-800 text-white font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850'
              }`}
            >
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-3.5 h-3.5 text-indigo-400" />
                <span>Interview Schedule</span>
              </div>
            </button>
          </div>

          {/* Pipeline Stages Filters */}
          <div className="p-3 pt-1 space-y-1">
            <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
              Stages
            </div>

            <button
              onClick={() => handleStageClick('all')}
              className={`w-full flex items-center justify-between px-2.5 py-1 rounded-md text-xs transition ${
                filters.status === 'all'
                  ? 'bg-zinc-800/80 text-white font-medium'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
              }`}
            >
              <div className="flex items-center gap-2">
                <Inbox className="w-3 h-3 text-zinc-400" />
                <span>All Stages</span>
              </div>
              <span className="text-[10px] text-zinc-400">{jobs.length}</span>
            </button>

            <button
              onClick={() => handleStageClick('wishlist')}
              className={`w-full flex items-center justify-between px-2.5 py-1 rounded-md text-xs transition ${
                filters.status === 'wishlist'
                  ? 'bg-zinc-800/80 text-white font-medium'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
              }`}
            >
              <div className="flex items-center gap-2">
                <Bookmark className="w-3 h-3 text-zinc-400" />
                <span>Wishlist</span>
              </div>
              <span className="text-[10px] text-zinc-400">{stageCounts.wishlist}</span>
            </button>

            <button
              onClick={() => handleStageClick('applied')}
              className={`w-full flex items-center justify-between px-2.5 py-1 rounded-md text-xs transition ${
                filters.status === 'applied'
                  ? 'bg-blue-500/15 text-blue-300 font-medium'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                <span>Applied</span>
              </div>
              <span className="text-[10px] text-zinc-400">{stageCounts.applied}</span>
            </button>

            <button
              onClick={() => handleStageClick('oa')}
              className={`w-full flex items-center justify-between px-2.5 py-1 rounded-md text-xs transition ${
                filters.status === 'oa'
                  ? 'bg-amber-500/15 text-amber-300 font-medium'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
              }`}
            >
              <div className="flex items-center gap-2">
                <Clock className="w-3 h-3 text-amber-400" />
                <span>Assessments (OA)</span>
              </div>
              <span className="text-[10px] text-zinc-400">{stageCounts.oa}</span>
            </button>

            <button
              onClick={() => handleStageClick('interview')}
              className={`w-full flex items-center justify-between px-2.5 py-1 rounded-md text-xs transition ${
                filters.status === 'interview'
                  ? 'bg-indigo-500/15 text-indigo-300 font-medium'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
              }`}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3 h-3 text-indigo-400" />
                <span>Interviewing</span>
              </div>
              <span className="text-[10px] text-zinc-400">{stageCounts.interview}</span>
            </button>

            <button
              onClick={() => handleStageClick('offer')}
              className={`w-full flex items-center justify-between px-2.5 py-1 rounded-md text-xs transition ${
                filters.status === 'offer'
                  ? 'bg-emerald-500/15 text-emerald-300 font-medium'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
              }`}
            >
              <div className="flex items-center gap-2">
                <Award className="w-3 h-3 text-emerald-400" />
                <span>Offers 🎉</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-400">{stageCounts.offer}</span>
            </button>

            <button
              onClick={() => handleStageClick('rejected')}
              className={`w-full flex items-center justify-between px-2.5 py-1 rounded-md text-xs transition ${
                filters.status === 'rejected'
                  ? 'bg-zinc-800/80 text-white font-medium'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
              }`}
            >
              <div className="flex items-center gap-2">
                <XCircle className="w-3 h-3 text-zinc-400" />
                <span>Rejected</span>
              </div>
              <span className="text-[10px] text-zinc-400">{stageCounts.rejected}</span>
            </button>

            <button
              onClick={() => handleStageClick('archived')}
              className={`w-full flex items-center justify-between px-2.5 py-1 rounded-md text-xs transition ${
                filters.status === 'archived'
                  ? 'bg-zinc-800/80 text-white font-medium'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
              }`}
            >
              <div className="flex items-center gap-2">
                <Archive className="w-3 h-3 text-zinc-400" />
                <span>Archived</span>
              </div>
              <span className="text-[10px] text-zinc-400">{stageCounts.archived}</span>
            </button>
          </div>

        </div>

        {/* Footer Actions & MongoDB Status */}
        <div className="p-3 border-t border-zinc-800/70 space-y-2 bg-[#0e1118]">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsImportExportOpen(true)}
              className="flex-1 py-1.5 px-2 rounded-lg bg-[#181d28] hover:bg-[#202736] text-zinc-300 border border-zinc-800 text-[11px] font-medium flex items-center justify-center gap-1.5 transition"
              title="Export CSV / JSON"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Import / Export</span>
            </button>

            <button
              onClick={() => {
                if (confirm('Load demo seed applications?')) {
                  resetToSampleData();
                }
              }}
              className="p-1.5 rounded-lg bg-[#181d28] hover:bg-[#202736] text-zinc-400 hover:text-zinc-200 border border-zinc-800 transition"
              title="Reset sample data"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Database Connection Badge */}
          <button
            onClick={() => syncWithMongoDB()}
            className={`w-full py-1.5 px-2.5 rounded-lg text-[11px] font-medium border flex items-center justify-between transition ${
              dbStatus.online
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20 hover:bg-emerald-500/20'
                : 'bg-zinc-850 text-zinc-400 border-zinc-800 hover:bg-zinc-800'
            }`}
            title="Click to sync with MongoDB Atlas"
          >
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${dbStatus.online ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
              <span>{dbStatus.online ? 'MongoDB Atlas Connected' : 'Local Storage Mode'}</span>
            </div>
            {isSyncing ? (
              <RefreshCw className="w-3 h-3 animate-spin text-zinc-400" />
            ) : (
              <span className="text-[10px] text-zinc-400">Sync</span>
            )}
          </button>
        </div>

      </aside>
    </>
  );
};
