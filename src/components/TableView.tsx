import React from 'react';
import { 
  Star, 
  ExternalLink, 
  Share2, 
  Trash2, 
  Eye, 
  FileText, 
  Clock, 
  Plus, 
  Building2,
  Briefcase
} from 'lucide-react';
import { useJobs } from '../context/JobContext';
import type { JobStatus } from '../types/job';
import { formatSalary, formatDate, STATUS_CONFIG } from '../utils/helpers';

export const TableView: React.FC = () => {
  const { 
    filteredJobs, 
    jobs,
    setSelectedJob, 
    updateJobStatus, 
    updateJob,
    deleteJob, 
    setSharingJob, 
    setIsShareModalOpen,
    setIsAddModalOpen,
    filters,
    setFilters
  } = useJobs();

  const getCompanyInitial = (name: string) => {
    return (name || 'C').charAt(0).toUpperCase();
  };

  const getCompanyAvatarColor = (name: string) => {
    const colors = [
      'bg-indigo-100 text-indigo-700 border-indigo-200',
      'bg-blue-100 text-blue-700 border-blue-200',
      'bg-emerald-100 text-emerald-700 border-emerald-200',
      'bg-amber-100 text-amber-700 border-amber-200',
      'bg-purple-100 text-purple-700 border-purple-200',
      'bg-rose-100 text-rose-700 border-rose-200',
      'bg-cyan-100 text-cyan-700 border-cyan-200'
    ];
    let hash = 0;
    for (let i = 0; i < (name || '').length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#f8fafc]">
      
      {/* Table Sub-Header / Quick Stage Tabs */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-2 shadow-2xs">
        <div className="flex items-center gap-1 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setFilters(prev => ({ ...prev, status: 'all' }))}
            className={`px-3 py-1.5 rounded-lg transition ${
              filters.status === 'all'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            All Applications ({jobs.length})
          </button>

          <button
            onClick={() => setFilters(prev => ({ ...prev, status: 'applied' }))}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              filters.status === 'applied'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
            <span>Applied ({jobs.filter(j => j.status === 'applied').length})</span>
          </button>

          <button
            onClick={() => setFilters(prev => ({ ...prev, status: 'interview' }))}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              filters.status === 'interview'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
            <span>Interviewing ({jobs.filter(j => j.status === 'interview').length})</span>
          </button>

          <button
            onClick={() => setFilters(prev => ({ ...prev, status: 'offer' }))}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              filters.status === 'offer'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Offers ({jobs.filter(j => j.status === 'offer').length}) 🎉</span>
          </button>

          <button
            onClick={() => setFilters(prev => ({ ...prev, status: 'wishlist' }))}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              filters.status === 'wishlist'
                ? 'bg-slate-700 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span>Wishlist ({jobs.filter(j => j.status === 'wishlist').length})</span>
          </button>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-indigo-200 transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Application</span>
        </button>
      </div>

      {/* Main Table Grid Container */}
      <div className="flex-1 overflow-auto p-4 sm:p-6">
        {filteredJobs.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-2xs">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-3 border border-indigo-100">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">No applications found in this view</h3>
            <p className="text-xs text-slate-500 max-w-sm mt-1">
              {filters.status !== 'all' 
                ? `There are currently no jobs marked as "${filters.status}".` 
                : 'Start tracking jobs to build your application pipeline.'}
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-indigo-200 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add Job Application</span>
            </button>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700 border-collapse">
                
                {/* Table Header */}
                <thead className="bg-slate-50/90 text-slate-500 font-bold text-[11px] border-b border-slate-200 sticky top-0 z-10 backdrop-blur-xs">
                  <tr>
                    <th className="py-3 px-3 w-10 text-center text-slate-400 font-semibold">#</th>
                    <th className="py-3 px-4 font-bold uppercase tracking-wider text-[10px] text-slate-500 min-w-[200px]">Company & Role</th>
                    <th className="py-3 px-4 font-bold uppercase tracking-wider text-[10px] text-slate-500 min-w-[160px]">Pipeline Stage</th>
                    <th className="py-3 px-4 font-bold uppercase tracking-wider text-[10px] text-slate-500 min-w-[140px]">Compensation</th>
                    <th className="py-3 px-4 font-bold uppercase tracking-wider text-[10px] text-slate-500 min-w-[100px]">Work Mode</th>
                    <th className="py-3 px-4 font-bold uppercase tracking-wider text-[10px] text-slate-500 min-w-[130px]">Location</th>
                    <th className="py-3 px-4 font-bold uppercase tracking-wider text-[10px] text-slate-500 min-w-[110px]">Applied</th>
                    <th className="py-3 px-4 font-bold uppercase tracking-wider text-[10px] text-slate-500 min-w-[90px]">Priority</th>
                    <th className="py-3 px-4 font-bold uppercase tracking-wider text-[10px] text-slate-500 min-w-[180px]">Required Skills</th>
                    <th className="py-3 px-4 font-bold uppercase tracking-wider text-[10px] text-slate-500 text-right min-w-[110px]">Actions</th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-slate-100">
                  {filteredJobs.map((job, idx) => {
                    const config = STATUS_CONFIG[job.status];
                    const upcomingInterview = job.interviewRounds?.find(r => r.status === 'scheduled');
                    const avatarColorClass = getCompanyAvatarColor(job.company);

                    return (
                      <tr
                        key={job.id}
                        onClick={() => setSelectedJob(job)}
                        className="hover:bg-indigo-50/40 cursor-pointer transition-colors group"
                      >
                        {/* Index */}
                        <td className="py-3.5 px-3 text-center text-[11px] text-slate-400 font-mono">
                          {idx + 1}
                        </td>

                        {/* Company & Role with Avatar */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs border shrink-0 shadow-2xs ${avatarColorClass}`}>
                              {getCompanyInitial(job.company)}
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition truncate text-xs">
                                {job.role}
                              </div>
                              <div className="text-slate-500 text-[11px] truncate flex items-center gap-1.5 mt-0.5 font-medium">
                                <span className="text-slate-800 font-semibold">{job.company}</span>
                                {job.source && (
                                  <span className="text-slate-400 text-[10px]">· {job.source}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Stage Dropdown */}
                        <td className="py-3.5 px-4" onClick={e => e.stopPropagation()}>
                          <div className="flex flex-col gap-1">
                            <select
                              value={job.status}
                              onChange={(e) => updateJobStatus(job.id, e.target.value as JobStatus)}
                              aria-label={`Stage for ${job.role}`}
                              className={`text-[11px] font-bold px-2.5 py-1 rounded-md border cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-2xs ${config.badgeBg}`}
                            >
                              {Object.entries(STATUS_CONFIG).map(([key, item]) => (
                                <option key={key} value={key} className="bg-white text-slate-800 font-medium">
                                  {item.label}
                                </option>
                              ))}
                            </select>
                            {upcomingInterview && (
                              <span className="text-[10px] text-indigo-700 flex items-center gap-1 font-bold">
                                <Clock className="w-2.5 h-2.5 shrink-0 text-indigo-500" />
                                <span className="truncate">{upcomingInterview.name} ({formatDate(upcomingInterview.date)})</span>
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Compensation */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {(job.salaryMin || job.salaryMax) ? (
                            <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 text-[11px]">
                              {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency, job.salaryPeriod)}
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[11px]">Undisclosed</span>
                          )}
                        </td>

                        {/* Work Mode */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="capitalize text-slate-700 font-bold bg-slate-100 px-2 py-0.5 rounded-md text-[11px] border border-slate-200">
                            {job.workMode}
                          </span>
                        </td>

                        {/* Location */}
                        <td className="py-3.5 px-4">
                          <span className="text-slate-600 text-xs truncate max-w-[120px] block font-medium">
                            {job.location}
                          </span>
                        </td>

                        {/* Applied Date */}
                        <td className="py-3.5 px-4 whitespace-nowrap text-slate-500 text-[11px] font-semibold">
                          {job.dateApplied ? formatDate(job.dateApplied) : <span className="text-slate-400 italic font-normal">Saved</span>}
                        </td>

                        {/* Priority */}
                        <td className="py-3.5 px-4 whitespace-nowrap" onClick={e => e.stopPropagation()}>
                          <div className="flex items-center gap-0.5">
                            {([1, 2, 3, 4, 5] as const).map(num => (
                              <button
                                key={num}
                                onClick={() => updateJob(job.id, { priority: num })}
                                className="p-0.5 hover:scale-110 transition"
                                title={`Set priority ${num}`}
                              >
                                <Star className={`w-3 h-3 ${num <= job.priority ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                              </button>
                            ))}
                          </div>
                        </td>

                        {/* Key Skills */}
                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap gap-1 max-w-[180px]">
                            {job.keySkills.slice(0, 2).map((skill, i) => (
                              <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-semibold">
                                {skill}
                              </span>
                            ))}
                            {job.keySkills.length > 2 && (
                              <span className="text-[10px] text-slate-400 font-bold">
                                +{job.keySkills.length - 2}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={e => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => setSelectedJob(job)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
                              title="View JD & Details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => {
                                setSharingJob(job);
                                setIsShareModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition"
                              title="Share Summary"
                            >
                              <Share2 className="w-3.5 h-3.5" />
                            </button>

                            {job.url && (
                              <a
                                href={job.url}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition"
                                title="Open Job Link"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}

                            <button
                              onClick={() => {
                                if (confirm(`Delete ${job.role} at ${job.company}?`)) {
                                  deleteJob(job.id);
                                }
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Table Footer Summary Bar */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-medium">
              <div>
                Showing <strong className="text-slate-800">{filteredJobs.length}</strong> of <strong className="text-slate-800">{jobs.length}</strong> total applications
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                  <span>{jobs.filter(j => j.status === 'applied').length} Active Submissions</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>{new Set(jobs.map(j => j.company)).size} Unique Companies</span>
                </span>
              </div>
            </div>

          </div>
        )}
      </div>

    </div>
  );
};
