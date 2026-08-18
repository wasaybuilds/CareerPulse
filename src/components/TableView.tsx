import React from 'react';
import { 
  Star, 
  ExternalLink, 
  Share2, 
  Trash2, 
  Eye, 
  FileText,
  Clock
} from 'lucide-react';
import { useJobs } from '../context/JobContext';
import type { JobStatus } from '../types/job';
import { formatSalary, formatDate, getDaysAgo, STATUS_CONFIG } from '../utils/helpers';

export const TableView: React.FC = () => {
  const { 
    filteredJobs, 
    setSelectedJob, 
    updateJobStatus, 
    deleteJob, 
    setSharingJob, 
    setIsShareModalOpen 
  } = useJobs();

  if (filteredJobs.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center text-slate-500 mb-4 border border-slate-800">
          <FileText className="w-8 h-8" />
        </div>
        <h3 className="text-base font-semibold text-slate-200">No applications match your filter</h3>
        <p className="text-xs text-slate-400 max-w-sm mt-1">
          Try resetting your search query or stage filters to view your saved applications.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-x-auto p-4 sm:p-6">
      <div className="max-w-7xl mx-auto rounded-2xl border border-slate-800/80 bg-slate-950/60 overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900/90 text-slate-400 uppercase font-semibold text-[11px] border-b border-slate-800">
            <tr>
              <th className="py-3.5 px-4">Company & Role</th>
              <th className="py-3.5 px-4">Stage / Status</th>
              <th className="py-3.5 px-4">Compensation</th>
              <th className="py-3.5 px-4">Location / Mode</th>
              <th className="py-3.5 px-4">Applied Date</th>
              <th className="py-3.5 px-4">Priority</th>
              <th className="py-3.5 px-4">Key Skills</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredJobs.map(job => {
              const config = STATUS_CONFIG[job.status];
              const upcomingInterview = job.interviewRounds?.find(r => r.status === 'scheduled');

              return (
                <tr
                  key={job.id}
                  onClick={() => setSelectedJob(job)}
                  className="hover:bg-slate-900/60 cursor-pointer transition group"
                >
                  {/* Company & Role */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-indigo-400 shrink-0">
                        {job.company.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-100 group-hover:text-indigo-300 transition truncate max-w-[200px]">
                          {job.role}
                        </div>
                        <div className="text-slate-400 text-[11px] truncate">
                          {job.company}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Status Dropdown */}
                  <td className="py-3.5 px-4" onClick={e => e.stopPropagation()}>
                    <div className="flex flex-col gap-1">
                      <select
                        value={job.status}
                        onChange={(e) => updateJobStatus(job.id, e.target.value as JobStatus)}
                        aria-label={`Update stage for ${job.role} at ${job.company}`}
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border bg-slate-900 cursor-pointer focus:outline-none ${config.badgeBg}`}
                      >
                        {Object.entries(STATUS_CONFIG).map(([key, item]) => (
                          <option key={key} value={key} className="bg-slate-900 text-slate-200">
                            {item.label}
                          </option>
                        ))}
                      </select>
                      {upcomingInterview && (
                        <span className="text-[10px] text-purple-300 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5 text-purple-400" />
                          {formatDate(upcomingInterview.date)}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Compensation */}
                  <td className="py-3.5 px-4">
                    {(job.salaryMin || job.salaryMax) ? (
                      <span className="font-medium text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20 text-[11px]">
                        {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency, job.salaryPeriod)}
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[11px]">Undisclosed</span>
                    )}
                  </td>

                  {/* Location & Mode */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <span className="truncate max-w-[140px]">{job.location}</span>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 capitalize mt-0.5 inline-block">
                      {job.workMode}
                    </span>
                  </td>

                  {/* Applied Date */}
                  <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                    <div>{job.dateApplied ? formatDate(job.dateApplied) : 'Not applied'}</div>
                    {job.dateApplied && (
                      <div className="text-[10px] text-slate-400">{getDaysAgo(job.dateApplied)}</div>
                    )}
                  </td>

                  {/* Priority */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {Array.from({ length: job.priority }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400" />
                      ))}
                    </div>
                  </td>

                  {/* Skills */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1 max-w-[180px]">
                      {job.keySkills.slice(0, 2).map((skill, i) => (
                        <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/50">
                          {skill}
                        </span>
                      ))}
                      {job.keySkills.length > 2 && (
                        <span className="text-[10px] text-slate-400">
                          +{job.keySkills.length - 2}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedJob(job)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition"
                        title="View Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          setSharingJob(job);
                          setIsShareModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition"
                        title="Share Summary"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>

                      {job.url && (
                        <a
                          href={job.url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition"
                          title="Open Link"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}

                      <button
                        onClick={() => {
                          if (confirm(`Delete application for ${job.role} at ${job.company}?`)) {
                            deleteJob(job.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
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
