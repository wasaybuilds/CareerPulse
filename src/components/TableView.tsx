import React from 'react';
import { 
  Star, 
  ExternalLink, 
  Share2, 
  Trash2, 
  Eye, 
  FileText, 
  Clock,
  Plus
} from 'lucide-react';
import { useJobs } from '../context/JobContext';
import type { JobStatus } from '../types/job';
import { formatSalary, formatDate, STATUS_CONFIG } from '../utils/helpers';

export const TableView: React.FC = () => {
  const { 
    filteredJobs, 
    setSelectedJob, 
    updateJobStatus, 
    deleteJob, 
    setSharingJob, 
    setIsShareModalOpen,
    setIsAddModalOpen,
    filters 
  } = useJobs();

  if (filteredJobs.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
        <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-400 mb-3 border border-slate-200">
          <FileText className="w-6 h-6 text-indigo-500" />
        </div>
        <h3 className="text-sm font-bold text-slate-800">No applications found</h3>
        <p className="text-xs text-slate-500 max-w-sm mt-1">
          {filters.status !== 'all' 
            ? `No jobs found in the ${filters.status} stage.` 
            : 'Track your first job application and keep everything organized.'}
        </p>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="mt-4 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm shadow-indigo-200 transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Application</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto p-4 sm:p-6">
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs text-slate-700 border-collapse">
          <thead className="bg-slate-50 text-slate-500 font-semibold text-[11px] border-b border-slate-200 sticky top-0 z-10">
            <tr>
              <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px] text-slate-400">Company & Role</th>
              <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px] text-slate-400">Pipeline Stage</th>
              <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px] text-slate-400">Compensation</th>
              <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px] text-slate-400">Work Mode</th>
              <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px] text-slate-400">Location</th>
              <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px] text-slate-400">Applied Date</th>
              <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px] text-slate-400">Priority</th>
              <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px] text-slate-400">Key Skills</th>
              <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px] text-slate-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredJobs.map(job => {
              const config = STATUS_CONFIG[job.status];
              const upcomingInterview = job.interviewRounds?.find(r => r.status === 'scheduled');

              return (
                <tr
                  key={job.id}
                  onClick={() => setSelectedJob(job)}
                  className="hover:bg-indigo-50/40 cursor-pointer transition-colors group"
                >
                  {/* Company & Role */}
                  <td className="py-3 px-4">
                    <div className="min-w-[160px] max-w-[220px]">
                      <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition truncate">
                        {job.role}
                      </div>
                      <div className="text-slate-500 text-[11px] truncate flex items-center gap-1.5 mt-0.5 font-medium">
                        <span className="text-slate-800 font-semibold">{job.company}</span>
                        {job.source && (
                          <span className="text-slate-400 text-[10px]">· {job.source}</span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Stage Dropdown */}
                  <td className="py-3 px-4" onClick={e => e.stopPropagation()}>
                    <div className="flex flex-col gap-1 min-w-[140px]">
                      <select
                        value={job.status}
                        onChange={(e) => updateJobStatus(job.id, e.target.value as JobStatus)}
                        aria-label={`Stage for ${job.role}`}
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-md border cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500 ${config.badgeBg}`}
                      >
                        {Object.entries(STATUS_CONFIG).map(([key, item]) => (
                          <option key={key} value={key} className="bg-white text-slate-800 font-medium">
                            {item.label}
                          </option>
                        ))}
                      </select>
                      {upcomingInterview && (
                        <span className="text-[10px] text-indigo-700 flex items-center gap-1 font-semibold">
                          <Clock className="w-2.5 h-2.5 shrink-0 text-indigo-500" />
                          <span className="truncate">{upcomingInterview.name} ({formatDate(upcomingInterview.date)})</span>
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Compensation */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    {(job.salaryMin || job.salaryMax) ? (
                      <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 text-[11px]">
                        {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency, job.salaryPeriod)}
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[11px]">Undisclosed</span>
                    )}
                  </td>

                  {/* Work Mode */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="capitalize text-slate-700 font-medium bg-slate-100 px-2 py-0.5 rounded-md text-[11px] border border-slate-200">
                      {job.workMode}
                    </span>
                  </td>

                  {/* Location */}
                  <td className="py-3 px-4">
                    <span className="text-slate-600 text-xs truncate max-w-[120px] block font-medium">
                      {job.location}
                    </span>
                  </td>

                  {/* Applied Date */}
                  <td className="py-3 px-4 whitespace-nowrap text-slate-500 text-[11px] font-medium">
                    {job.dateApplied ? formatDate(job.dateApplied) : <span className="text-slate-400 italic">Saved</span>}
                  </td>

                  {/* Priority */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {Array.from({ length: job.priority }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </td>

                  {/* Skills */}
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1 max-w-[180px]">
                      {job.keySkills.slice(0, 2).map((skill, i) => (
                        <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-medium">
                          {skill}
                        </span>
                      ))}
                      {job.keySkills.length > 2 && (
                        <span className="text-[10px] text-slate-400 font-semibold">
                          +{job.keySkills.length - 2}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right whitespace-nowrap" onClick={e => e.stopPropagation()}>
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
    </div>
  );
};
