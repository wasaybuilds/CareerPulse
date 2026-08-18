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
import { formatSalary, formatDate, STATUS_CONFIG } from '../utils/helpers';

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
        <div className="w-12 h-12 rounded-xl bg-[#161b22] flex items-center justify-center text-zinc-500 mb-3 border border-zinc-800">
          <FileText className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-semibold text-zinc-300">No applications found</h3>
        <p className="text-xs text-zinc-500 max-w-sm mt-1">
          Try adjusting your search query or stage filters.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-x-auto p-4 sm:p-6">
      <div className="max-w-7xl mx-auto rounded-xl border border-zinc-800/80 bg-[#161b22]/90 overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs text-zinc-300">
          <thead className="bg-[#0d1117]/80 text-zinc-400 font-semibold text-[11px] border-b border-zinc-800">
            <tr>
              <th className="py-3 px-4">Company & Role</th>
              <th className="py-3 px-4">Stage</th>
              <th className="py-3 px-4">Compensation</th>
              <th className="py-3 px-4">Location</th>
              <th className="py-3 px-4">Applied</th>
              <th className="py-3 px-4">Priority</th>
              <th className="py-3 px-4">Skills</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {filteredJobs.map(job => {
              const config = STATUS_CONFIG[job.status];
              const upcomingInterview = job.interviewRounds?.find(r => r.status === 'scheduled');

              return (
                <tr
                  key={job.id}
                  onClick={() => setSelectedJob(job)}
                  className="hover:bg-zinc-800/50 cursor-pointer transition group"
                >
                  {/* Company & Role */}
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-semibold text-zinc-100 group-hover:text-indigo-400 transition truncate max-w-[200px]">
                        {job.role}
                      </div>
                      <div className="text-zinc-400 text-[11px] truncate">
                        {job.company}
                      </div>
                    </div>
                  </td>

                  {/* Status Dropdown */}
                  <td className="py-3 px-4" onClick={e => e.stopPropagation()}>
                    <div className="flex flex-col gap-1">
                      <select
                        value={job.status}
                        onChange={(e) => updateJobStatus(job.id, e.target.value as JobStatus)}
                        aria-label={`Update stage for ${job.role} at ${job.company}`}
                        className={`text-[11px] font-medium px-2 py-0.5 rounded-md border bg-[#0d1117] cursor-pointer focus:outline-none ${config.badgeBg}`}
                      >
                        {Object.entries(STATUS_CONFIG).map(([key, item]) => (
                          <option key={key} value={key} className="bg-[#161b22] text-zinc-200">
                            {item.label}
                          </option>
                        ))}
                      </select>
                      {upcomingInterview && (
                        <span className="text-[10px] text-indigo-400 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          {formatDate(upcomingInterview.date)}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Compensation */}
                  <td className="py-3 px-4">
                    {(job.salaryMin || job.salaryMax) ? (
                      <span className="font-medium text-emerald-400 text-[11px]">
                        {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency, job.salaryPeriod)}
                      </span>
                    ) : (
                      <span className="text-zinc-500 text-[11px]">Undisclosed</span>
                    )}
                  </td>

                  {/* Location */}
                  <td className="py-3 px-4">
                    <div className="text-zinc-300 truncate max-w-[130px]">{job.location}</div>
                    <span className="text-[10px] text-zinc-500 capitalize">{job.workMode}</span>
                  </td>

                  {/* Applied Date */}
                  <td className="py-3 px-4 text-zinc-400 text-[11px]">
                    <div>{job.dateApplied ? formatDate(job.dateApplied) : 'Not applied'}</div>
                  </td>

                  {/* Priority */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {Array.from({ length: job.priority }).map((_, i) => (
                        <Star key={i} className="w-2.5 h-2.5 fill-amber-400" />
                      ))}
                    </div>
                  </td>

                  {/* Skills */}
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1 max-w-[180px]">
                      {job.keySkills.slice(0, 2).map((skill, i) => (
                        <span key={i} className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300 border border-zinc-700/40">
                          {skill}
                        </span>
                      ))}
                      {job.keySkills.length > 2 && (
                        <span className="text-[10px] text-zinc-500">
                          +{job.keySkills.length - 2}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setSelectedJob(job)}
                        className="p-1 rounded text-zinc-400 hover:text-indigo-400 hover:bg-zinc-800 transition"
                        title="View Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          setSharingJob(job);
                          setIsShareModalOpen(true);
                        }}
                        className="p-1 rounded text-zinc-400 hover:text-emerald-400 hover:bg-zinc-800 transition"
                        title="Share Summary"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>

                      {job.url && (
                        <a
                          href={job.url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1 rounded text-zinc-400 hover:text-blue-400 hover:bg-zinc-800 transition"
                          title="Open Link"
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
                        className="p-1 rounded text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 transition"
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
