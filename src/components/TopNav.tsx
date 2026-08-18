import React from 'react';
import { 
  Menu, 
  Search, 
  ArrowUpDown,
  RotateCcw,
  Star,
  Clock,
  Award
} from 'lucide-react';
import { useJobs } from '../context/JobContext';
import { STATUS_CONFIG } from '../utils/helpers';
import type { JobStatus, WorkMode } from '../types/job';

interface TopNavProps {
  onToggleSidebar: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({ onToggleSidebar }) => {
  const { 
    viewMode, 
    filters, 
    setFilters, 
    filteredJobs,
    metrics
  } = useJobs();

  const getViewTitle = () => {
    switch (viewMode) {
      case 'table':
        return filters.status === 'all' 
          ? 'Applications Table' 
          : `${STATUS_CONFIG[filters.status as JobStatus]?.label || filters.status} Applications`;
      case 'kanban':
        return 'Pipeline Board';
      case 'analytics':
        return 'Analytics & Conversion Funnel';
      case 'calendar':
        return 'Interview Schedule & Calendar';
      default:
        return 'Applications';
    }
  };

  const hasActiveFilters = 
    filters.status !== 'all' ||
    filters.workMode !== 'all' ||
    filters.source !== 'all' ||
    filters.minPriority > 0 ||
    filters.searchQuery !== '';

  const resetFilters = () => {
    setFilters({
      searchQuery: '',
      status: 'all',
      workMode: 'all',
      jobType: 'all',
      source: 'all',
      tag: 'all',
      minPriority: 0,
      sortBy: 'dateAdded',
      sortOrder: 'desc'
    });
  };

  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 py-2.5 shadow-2xs">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        
        {/* Left: Mobile Toggle & Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onToggleSidebar}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            title="Toggle sidebar"
          >
            <Menu className="w-4 h-4" />
          </button>

          <div className="min-w-0">
            <h2 className="text-sm font-extrabold text-slate-900 truncate flex items-center gap-2">
              <span>{getViewTitle()}</span>
              <span className="text-[11px] font-bold px-2 py-0.2 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                {filteredJobs.length} {filteredJobs.length === 1 ? 'item' : 'items'}
              </span>
            </h2>
          </div>
        </div>

        {/* Center/Right: Search, Filters & Quick Stats */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* Quick Search */}
          <div className="relative w-full sm:w-56">
            <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search company, role, skill..."
              value={filters.searchQuery}
              onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
            />
            {filters.searchQuery && (
              <button
                onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))}
                className="absolute right-2 top-1.5 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Work Mode Filter */}
          <select
            value={filters.workMode}
            onChange={(e) => setFilters(prev => ({ ...prev, workMode: e.target.value as WorkMode | 'all' }))}
            aria-label="Filter by work mode"
            className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-xs focus:outline-none focus:border-indigo-500 font-medium"
          >
            <option value="all">All Modes</option>
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
            <option value="onsite">On-Site</option>
          </select>

          {/* Sort Filter */}
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
            aria-label="Sort applications"
            className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-xs focus:outline-none focus:border-indigo-500 font-medium"
          >
            <option value="dateAdded">Sort: Date Added</option>
            <option value="dateApplied">Sort: Date Applied</option>
            <option value="company">Sort: Company</option>
            <option value="role">Sort: Role</option>
            <option value="salary">Sort: Salary</option>
            <option value="priority">Sort: Priority</option>
          </select>

          <button
            onClick={() => setFilters(prev => ({ ...prev, sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc' }))}
            className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 text-xs transition"
            title={`Order: ${filters.sortOrder.toUpperCase()}`}
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
          </button>

          {/* Star Filter */}
          <button
            onClick={() => setFilters(prev => ({ ...prev, minPriority: prev.minPriority === 4 ? 0 : 4 }))}
            className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition font-semibold ${
              filters.minPriority >= 4
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
            title="Toggle High Priority (4+ stars)"
          >
            <Star className={`w-3.5 h-3.5 ${filters.minPriority >= 4 ? 'fill-amber-400 text-amber-400' : ''}`} />
            <span className="hidden lg:inline">Priority</span>
          </button>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 text-xs flex items-center gap-1 transition"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

          <div className="h-4 w-px bg-slate-200 hidden xl:block"></div>

          {/* Top Quick Badges */}
          <div className="hidden xl:flex items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700 font-medium">
              <strong className="text-slate-900">{metrics.activeApplications}</strong> Active
            </span>
            <span className="px-2.5 py-1 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-700 font-medium flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <strong>{metrics.interview}</strong> Interviews
            </span>
            <span className="px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold flex items-center gap-1">
              <Award className="w-3 h-3" />
              <strong>{metrics.offer}</strong> Offers
            </span>
          </div>

        </div>

      </div>
    </header>
  );
};
