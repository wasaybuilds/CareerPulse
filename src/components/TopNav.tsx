import React from 'react';
import { 
  Menu, 
  Search, 
  Plus, 
  Sparkles, 
  ArrowUpDown,
  RotateCcw
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
    setIsAddModalOpen, 
    setIsSmartPasteOpen 
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
    <header className="sticky top-0 z-20 bg-[#0f121a]/95 backdrop-blur-md border-b border-zinc-800/80 px-4 sm:px-6 py-2.5">
      <div className="flex items-center justify-between gap-3">
        
        {/* Left: Mobile Toggle & Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onToggleSidebar}
            className="p-1.5 rounded-lg bg-[#161b24] hover:bg-zinc-800 border border-zinc-800 text-zinc-300 transition"
            title="Toggle sidebar"
          >
            <Menu className="w-4 h-4" />
          </button>

          <div className="min-w-0">
            <h2 className="text-sm font-bold text-white truncate flex items-center gap-2">
              <span>{getViewTitle()}</span>
              <span className="text-[11px] font-semibold px-2 py-0.2 rounded-full bg-zinc-800 text-zinc-300">
                {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'}
              </span>
            </h2>
          </div>
        </div>

        {/* Center/Right: Search, Filters & Actions */}
        <div className="flex items-center gap-2.5">
          
          {/* Search Box */}
          <div className="relative w-44 sm:w-64">
            <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search company, role, skill..."
              value={filters.searchQuery}
              onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-[#161b24] border border-zinc-800 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
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

          {/* Work Mode Filter */}
          <div className="hidden md:flex items-center gap-1.5">
            <select
              value={filters.workMode}
              onChange={(e) => setFilters(prev => ({ ...prev, workMode: e.target.value as WorkMode | 'all' }))}
              aria-label="Filter by work mode"
              className="px-2.5 py-1.5 rounded-lg bg-[#161b24] border border-zinc-800 text-zinc-300 text-xs focus:outline-none focus:border-indigo-500"
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
              className="px-2.5 py-1.5 rounded-lg bg-[#161b24] border border-zinc-800 text-zinc-300 text-xs focus:outline-none focus:border-indigo-500"
            >
              <option value="dateAdded">Date Added</option>
              <option value="dateApplied">Date Applied</option>
              <option value="company">Company</option>
              <option value="role">Role</option>
              <option value="salary">Salary</option>
              <option value="priority">Priority</option>
            </select>

            <button
              onClick={() => setFilters(prev => ({ ...prev, sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc' }))}
              className="p-1.5 rounded-lg bg-[#161b24] border border-zinc-800 text-zinc-400 hover:text-zinc-200 text-xs transition"
              title={`Order: ${filters.sortOrder.toUpperCase()}`}
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 text-xs flex items-center gap-1 transition"
                title="Reset filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Add Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsSmartPasteOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-[#161b24] hover:bg-[#202736] text-zinc-300 border border-zinc-800 hover:border-zinc-700 transition"
              title="Smart Paste JD"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Smart Paste</span>
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add Job</span>
            </button>
          </div>

        </div>

      </div>
    </header>
  );
};
