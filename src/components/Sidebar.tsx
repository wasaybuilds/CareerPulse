import React from 'react';
import { 
  Table as TableIcon, 
  Kanban, 
  BarChart3, 
  Calendar as CalendarIcon, 
  Plus, 
  Sparkles, 
  FileSpreadsheet, 
  Trash2, 
  Layers, 
  RefreshCw,
  CheckCircle2,
  Clock,
  Award,
  Archive,
  XCircle,
  Inbox,
  Bookmark,
  LogIn,
  LogOut,
  Shield
} from 'lucide-react';
import { useJobs } from '../context/JobContext';
import { useAuth } from '../context/AuthContext';
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
    clearAllData, 
    dbStatus, 
    isSyncing, 
    syncWithMongoDB 
  } = useJobs();

  const { user, isAuthenticated, setIsAuthModalOpen, logout } = useAuth();

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

  const getUserInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Dark SaaS Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-[#0f172a] text-slate-200 border-r border-slate-800
        flex flex-col justify-between
        transition-transform duration-200 ease-in-out shadow-xl lg:shadow-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        {/* Top Header & Navigation */}
        <div className="flex flex-col">
          
          {/* Logo & Workspace Brand */}
          <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-950 shrink-0">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h1 className="text-sm font-extrabold tracking-tight text-white flex items-center gap-1">
                  Career<span className="text-indigo-400">Pulse</span>
                </h1>
                <p className="text-[10px] text-slate-400 font-medium">Job Application OS</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md text-slate-400 hover:text-white lg:hidden"
            >
              ✕
            </button>
          </div>

          {/* Primary Action Buttons */}
          <div className="p-3 space-y-1.5 border-b border-slate-800/60 bg-slate-900/40">
            <button
              onClick={() => {
                setIsAddModalOpen(true);
                setIsOpen(false);
              }}
              className="w-full py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-950 transition active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>New Application</span>
            </button>

            <button
              onClick={() => {
                setIsSmartPasteOpen(true);
                setIsOpen(false);
              }}
              className="w-full py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center justify-center gap-2 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Smart Paste JD</span>
            </button>
          </div>

          {/* Main Navigation Views */}
          <div className="p-3 space-y-1">
            <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Views
            </div>

            <button
              onClick={() => {
                setViewMode('table');
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition ${
                viewMode === 'table'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <TableIcon className="w-4 h-4" />
                <span>Applications Table</span>
              </div>
              <span className={`text-[10px] px-2 py-0.2 rounded-full font-bold ${
                viewMode === 'table' ? 'bg-indigo-700 text-white' : 'bg-slate-800 text-slate-300'
              }`}>
                {jobs.length}
              </span>
            </button>

            <button
              onClick={() => {
                setViewMode('kanban');
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition ${
                viewMode === 'kanban'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Kanban className="w-4 h-4" />
                <span>Pipeline Board</span>
              </div>
            </button>

            <button
              onClick={() => {
                setViewMode('analytics');
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition ${
                viewMode === 'analytics'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BarChart3 className="w-4 h-4" />
                <span>Analytics & Funnel</span>
              </div>
            </button>

            <button
              onClick={() => {
                setViewMode('calendar');
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition ${
                viewMode === 'calendar'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <CalendarIcon className="w-4 h-4" />
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
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition ${
                filters.status === 'all'
                  ? 'bg-slate-800 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 font-medium'
              }`}
            >
              <div className="flex items-center gap-2">
                <Inbox className="w-3.5 h-3.5 text-slate-400" />
                <span>All Applications</span>
              </div>
              <span className="text-[10px] text-slate-400 font-bold">{jobs.length}</span>
            </button>

            <button
              onClick={() => handleStageClick('wishlist')}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition ${
                filters.status === 'wishlist'
                  ? 'bg-slate-800 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 font-medium'
              }`}
            >
              <div className="flex items-center gap-2">
                <Bookmark className="w-3.5 h-3.5 text-slate-400" />
                <span>Wishlist</span>
              </div>
              <span className="text-[10px] text-slate-400">{stageCounts.wishlist}</span>
            </button>

            <button
              onClick={() => handleStageClick('applied')}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition ${
                filters.status === 'applied'
                  ? 'bg-blue-950/80 text-blue-300 border border-blue-800/60 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 font-medium'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                <span>Applied</span>
              </div>
              <span className="text-[10px] text-blue-400 font-bold">{stageCounts.applied}</span>
            </button>

            <button
              onClick={() => handleStageClick('oa')}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition ${
                filters.status === 'oa'
                  ? 'bg-amber-950/80 text-amber-300 border border-amber-800/60 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 font-medium'
              }`}
            >
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Assessment (OA)</span>
              </div>
              <span className="text-[10px] text-amber-400 font-bold">{stageCounts.oa}</span>
            </button>

            <button
              onClick={() => handleStageClick('interview')}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition ${
                filters.status === 'interview'
                  ? 'bg-indigo-950/80 text-indigo-300 border border-indigo-800/60 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 font-medium'
              }`}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Interviewing</span>
              </div>
              <span className="text-[10px] text-indigo-400 font-bold">{stageCounts.interview}</span>
            </button>

            <button
              onClick={() => handleStageClick('offer')}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition ${
                filters.status === 'offer'
                  ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-700/60 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 font-medium'
              }`}
            >
              <div className="flex items-center gap-2">
                <Award className="w-3.5 h-3.5 text-emerald-400" />
                <span>Offers 🎉</span>
              </div>
              <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-900/60 px-1.5 py-0.2 rounded-full">{stageCounts.offer}</span>
            </button>

            <button
              onClick={() => handleStageClick('rejected')}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition ${
                filters.status === 'rejected'
                  ? 'bg-slate-800 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 font-medium'
              }`}
            >
              <div className="flex items-center gap-2">
                <XCircle className="w-3.5 h-3.5 text-rose-400" />
                <span>Rejected</span>
              </div>
              <span className="text-[10px] text-slate-400">{stageCounts.rejected}</span>
            </button>

            <button
              onClick={() => handleStageClick('archived')}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition ${
                filters.status === 'archived'
                  ? 'bg-slate-800 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 font-medium'
              }`}
            >
              <div className="flex items-center gap-2">
                <Archive className="w-3.5 h-3.5 text-slate-400" />
                <span>Archived</span>
              </div>
              <span className="text-[10px] text-slate-400">{stageCounts.archived}</span>
            </button>
          </div>

        </div>

        {/* Dark Footer: User Profile, CSV, Clear & MongoDB Status */}
        <div className="p-3 border-t border-slate-800 space-y-2 bg-[#0a0f1d]">
          
          {/* User Profile Card / Sign In Button */}
          {isAuthenticated && user ? (
            <div className="p-2 rounded-xl bg-slate-800/90 border border-slate-700/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-sm">
                  {getUserInitials(user.name)}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate flex items-center gap-1">
                    <span>{user.name}</span>
                    <Shield className="w-3 h-3 text-indigo-400" />
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">{user.email}</div>
                </div>
              </div>

              <button
                onClick={() => {
                  if (confirm('Log out from CareerPulse?')) {
                    logout();
                  }
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-700/60 transition"
                title="Log Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="w-full py-2 px-3 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-xs font-bold flex items-center justify-center gap-2 transition shadow-sm"
            >
              <LogIn className="w-3.5 h-3.5 text-indigo-400" />
              <span>Sign In / Private Account</span>
            </button>
          )}

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsImportExportOpen(true)}
              className="flex-1 py-1.5 px-2 rounded-lg bg-slate-850 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition"
              title="Export CSV / JSON"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Import / Export</span>
            </button>

            {jobs.length > 0 && (
              <button
                onClick={() => {
                  if (confirm('Clear all applications and start completely fresh?')) {
                    clearAllData();
                  }
                }}
                className="p-1.5 rounded-lg bg-slate-850 hover:bg-rose-950 text-slate-400 hover:text-rose-400 border border-slate-700/80 transition"
                title="Clear all applications"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Database Connection Badge */}
          <button
            onClick={() => syncWithMongoDB()}
            className={`w-full py-1.5 px-2.5 rounded-lg text-[11px] font-semibold border flex items-center justify-between transition ${
              dbStatus.online
                ? 'bg-emerald-950/60 text-emerald-300 border-emerald-700/50 hover:bg-emerald-900/60'
                : 'bg-slate-850 text-slate-400 border-slate-800 hover:bg-slate-800'
            }`}
            title="Click to sync with MongoDB Atlas"
          >
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${dbStatus.online ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
              <span>{dbStatus.online ? 'MongoDB Atlas Live' : 'Local Storage'}</span>
            </div>
            {isSyncing ? (
              <RefreshCw className="w-3 h-3 animate-spin text-slate-400" />
            ) : (
              <span className="text-[10px] text-slate-400 font-bold">Sync</span>
            )}
          </button>
        </div>

      </aside>
    </>
  );
};
