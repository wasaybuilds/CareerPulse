import React from 'react';
import { 
  Filter, 
  ArrowUpDown, 
  Star, 
  RotateCcw
} from 'lucide-react';
import { useJobs } from '../context/JobContext';
import type { JobStatus, WorkMode } from '../types/job';
import { STATUS_CONFIG } from '../utils/helpers';

export const FilterBar: React.FC = () => {
  const { jobs, filters, setFilters, filteredJobs } = useJobs();

  // Extract all unique sources and tags from existing jobs
  const sources = Array.from(new Set(jobs.map(j => j.source).filter(Boolean))) as string[];
  const allTags = Array.from(new Set(jobs.flatMap(j => j.tags))).filter(Boolean);

  const hasActiveFilters = 
    filters.status !== 'all' ||
    filters.workMode !== 'all' ||
    filters.jobType !== 'all' ||
    filters.source !== 'all' ||
    filters.tag !== 'all' ||
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
    <div className="bg-slate-900/40 border-b border-slate-800/60 px-4 sm:px-6 lg:px-8 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Left Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-slate-400 font-medium mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as JobStatus | 'all' }))}
            aria-label="Filter jobs by status"
            className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700 focus:outline-none focus:border-indigo-500 transition"
          >
            <option value="all">All Stages ({jobs.length})</option>
            {Object.entries(STATUS_CONFIG).map(([key, config]) => (
              <option key={key} value={key}>
                {config.label} ({jobs.filter(j => j.status === key).length})
              </option>
            ))}
          </select>

          {/* Work Mode */}
          <select
            value={filters.workMode}
            onChange={(e) => setFilters(prev => ({ ...prev, workMode: e.target.value as WorkMode | 'all' }))}
            aria-label="Filter jobs by work mode"
            className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700 focus:outline-none focus:border-indigo-500 transition"
          >
            <option value="all">All Work Modes</option>
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
            <option value="onsite">On-Site</option>
          </select>

          {/* Source */}
          {sources.length > 0 && (
            <select
              value={filters.source}
              onChange={(e) => setFilters(prev => ({ ...prev, source: e.target.value }))}
              aria-label="Filter jobs by source"
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700 focus:outline-none focus:border-indigo-500 transition"
            >
              <option value="all">All Sources</option>
              {sources.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          )}

          {/* Tag Filter */}
          {allTags.length > 0 && (
            <select
              value={filters.tag}
              onChange={(e) => setFilters(prev => ({ ...prev, tag: e.target.value }))}
              aria-label="Filter jobs by tag"
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700 focus:outline-none focus:border-indigo-500 transition"
            >
              <option value="all">All Tags</option>
              {allTags.map(t => (
                <option key={t} value={t}>#{t}</option>
              ))}
            </select>
          )}

          {/* Priority Star Filter */}
          <button
            onClick={() => setFilters(prev => ({ ...prev, minPriority: prev.minPriority === 4 ? 0 : 4 }))}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border transition ${
              filters.minPriority >= 4
                ? 'bg-amber-500/10 text-amber-300 border-amber-500/40'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="High Priority Jobs (4+ Stars)"
          >
            <Star className={`w-3.5 h-3.5 ${filters.minPriority >= 4 ? 'fill-amber-400 text-amber-400' : ''}`} />
            <span>High Priority</span>
          </button>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 px-2 py-1 text-slate-400 hover:text-rose-400 transition"
              title="Reset all filters"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Right Sort Controls & Count */}
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-slate-400">
            Showing <strong className="text-white">{filteredJobs.length}</strong> of {jobs.length}
          </span>

          <div className="h-4 w-px bg-slate-800"></div>

          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
              aria-label="Sort jobs by"
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700 focus:outline-none focus:border-indigo-500 transition"
            >
              <option value="dateAdded">Date Added</option>
              <option value="dateApplied">Date Applied</option>
              <option value="company">Company</option>
              <option value="role">Role</option>
              <option value="salary">Salary</option>
              <option value="priority">Priority</option>
              <option value="deadline">Deadline</option>
            </select>

            <button
              onClick={() => setFilters(prev => ({ ...prev, sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc' }))}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition"
              title={`Sorting ${filters.sortOrder.toUpperCase()}`}
            >
              {filters.sortOrder === 'desc' ? '↓' : '↑'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
