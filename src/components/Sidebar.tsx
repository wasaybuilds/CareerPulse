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
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-white border-r border-slate-200
        flex flex-col justify-between
        transition-transform duration-200 ease-in-out shadow-sm lg:shadow-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        {/* Top Header */}
        <div className="flex flex-col">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold shadow-sm shadow-indigo-200 shrink-0">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h1 className="text-sm font-bold tracking-tight text-slate-900 flex items-center gap-1 font-sans">
                  Career<span className="text-indigo-600">Pulse</span>
                </h1>
                <p className="text-[10px] text-slate-400 font-medium">Job Search Command Center</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 lg:hidden"
            >
              ✕
            </button>
          </div>

          {/* Action Buttons */}
          <div className="p-3 space-y-1.5 border-b border-slate-100 bg-slate-50/50">
            <button
              onClick={() => {
                setIsAddModalOpen(true);
                setIsOpen(false);
              }}
              className="w-full py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm shadow-indigo-200 transition active:scale-[0.98]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Application</span>
            </button>

            <button
              onClick={() => {
                setIsSmartPasteOpen(true);
                setIsOpen(false);
              }}
              className="w-full py-1.5 px-3 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-medium text-xs flex items-center justify-center gap-1.5 transition shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Smart Paste JD</span>
            </button>
          </div>

          {/* Navigation Views */}
          <div className="p-3 space-y-1">
            <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Workspace Views
            </div>

            <button
              onClick={() => {
                setViewMode('table');
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                viewMode === 'table'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <TableIcon className={`w-3.5 h-3.5 ${viewMode === 'table' ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span>Applications Table</span>
              </div>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                viewMode === 'table' ? 'bg-indigo-200/60 text-indigo-800' : 'bg-slate-100 text-slate-500'
              }`}>
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
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <Kanban className={`w-3.5 h-3.5 ${viewMode === 'kanban' ? 'text-indigo-600' : 'text-slate-400'}`} />
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
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <BarChart3 className={`w-3.5 h-3.5 ${viewMode === 'analytics' ? 'text-indigo-600' : 'text-slate-400'}`} />
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
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <CalendarIcon className={`w-3.5 h-3.5 ${viewMode === 'calendar' ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span>Interview Schedule</span>
              </div>
            </button>
          </div>

          {/* Pipeline Stages Filters */}
          <div className="p-3 pt-1 space-y-1">
            <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Stages
            </div>

            <button
              onClick={() => handleStageClick('all')}
              className={`w-full flex items-center justify-between px-2.5 py-1 rounded-lg text-xs transition ${
                filters.status === 'all'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <Inbox className="w-3.5 h-3.5 text-slate-500" />
                <span>All Applications</span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium">{jobs.length}</span>
            </button>

            <button
              onClick={() => handleStageClick('wishlist')}
              className={`w-full flex items-center justify-between px-2.5 py-1 rounded-lg text-xs transition ${
                filters.status === 'wishlist'
                  ? 'bg-slate-200 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <Bookmark className="w-3.5 h-3.5 text-slate-500" />
                <span>Wishlist</span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium">{stageCounts.wishlist}</span>
            </button>

            <button
              onClick={() => handleStageClick('applied')}
              className={`w-full flex items-center justify-between px-2.5 py-1 rounded-lg text-xs transition ${
                filters.status === 'applied'
                  ? 'bg-blue-50 text-blue-800 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span>Applied</span>
              </div>
              <span className="text-[10px] text-blue-600 font-semibold">{stageCounts.applied}</span>
            </button>

            <button
              onClick={() => handleStageClick('oa')}
              className={`w-full flex items-center justify-between px-2.5 py-1 rounded-lg text-xs transition ${
                filters.status === 'oa'
                  ? 'bg-amber-50 text-amber-800 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span>Assessment (OA)</span>
              </div>
              <span className="text-[10px] text-amber-600 font-semibold">{stageCounts.oa}</span>
            </button>

            <button
              onClick={() => handleStageClick('interview')}
              className={`w-full flex items-center justify-between px-2.5 py-1 rounded-lg text-xs transition ${
                filters.status === 'interview'
                  ? 'bg-indigo-50 text-indigo-800 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" />
                <span>Interviewing</span>
              </div>
              <span className="text-[10px] text-indigo-600 font-semibold">{stageCounts.interview}</span>
            </button>

            <button
              onClick={() => handleStageClick('offer')}
              className={`w-full flex items-center justify-between px-2.5 py-1 rounded-lg text-xs transition ${
                filters.status === 'offer'
                  ? 'bg-emerald-50 text-emerald-800 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <Award className="w-3.5 h-3.5 text-emerald-600" />
                <span>Offers 🎉</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded-full">{stageCounts.offer}</span>
            </button>

            <button
              onClick={() => handleStageClick('rejected')}
              className={`w-full flex items-center justify-between px-2.5 py-1 rounded-lg text-xs transition ${
                filters.status === 'rejected'
                  ? 'bg-rose-50 text-rose-800 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <XCircle className="w-3.5 h-3.5 text-rose-400" />
                <span>Rejected</span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium">{stageCounts.rejected}</span>
            </button>

            <button
              onClick={() => handleStageClick('archived')}
              className={`w-full flex items-center justify-between px-2.5 py-1 rounded-lg text-xs transition ${
                filters.status === 'archived'
                  ? 'bg-slate-100 text-slate-800 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <Archive className="w-3.5 h-3.5 text-slate-400" />
                <span>Archived</span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium">{stageCounts.archived}</span>
            </button>
          </div>

        </div>

        {/* Footer Actions & MongoDB Status */}
        <div className="p-3 border-t border-slate-200 space-y-2 bg-slate-50/50">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsImportExportOpen(true)}
              className="flex-1 py-1.5 px-2 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition shadow-2xs"
              title="Export CSV / JSON"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Import / Export</span>
            </button>

            <button
              onClick={() => {
                if (confirm('Load demo seed applications?')) {
                  resetToSampleData();
                }
              }}
              className="p-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-800 border border-slate-200 transition shadow-2xs"
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
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
            title="Click to sync with MongoDB Atlas"
          >
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${dbStatus.online ? 'bg-emerald-500 ring-2 ring-emerald-200' : 'bg-amber-400'}`}></span>
              <span className="font-semibold">{dbStatus.online ? 'MongoDB Atlas Live' : 'Local Storage'}</span>
            </div>
            {isSyncing ? (
              <RefreshCw className="w-3 h-3 animate-spin text-slate-400" />
            ) : (
              <span className="text-[10px] text-slate-400 font-semibold">Sync</span>
            )}
          </button>
        </div>

      </aside>
    </>
  );
};
