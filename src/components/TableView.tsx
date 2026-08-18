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
        <div className="w-12 h-12 rounded-xl bg-[#161b24] flex items-center justify-center text-zinc-500 mb-3 border border-zinc-800">
          <FileText className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-semibold text-zinc-300">No applications found</h3>
        <p className="text-xs text-zinc-500 max-w-sm mt-1">
          {filters.status !== 'all' 
            ? `No jobs in the ${filters.status} stage.` 
            : 'Get started by tracking your first job application.'}
        </p>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="mt-4 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Application</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto p-4 sm:p-6">
      <div className="rounded-xl border border-zinc-800/80 bg-[#141822] overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs text-zinc-300 border-collapse">
          <thead className="bg-[#0f121a] text-zinc-400 font-semibold text-[11px] border-b border-zinc-800 sticky top-0 z-10">
            <tr>
              <th className="py-3 px-4 font-medium">Company & Role</th>
              <th className="py-3 px-4 font-medium">Pipeline Stage</th>
              <th className="py-3 px-4 font-medium">Compensation</th>
              <th className="py-3 px-4 font-medium">Work Mode</th>
              <th className="py-3 px-4 font-medium">Location</th>
              <th className="py-3 px-4 font-medium">Applied Date</th>
              <th className="py-3 px-4 font-medium">Priority</th>
              <th className="py-3 px-4 font-medium">Key Skills</th>
              <th className="py-3 px-4 font-medium text-right">Actions</th>
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
                  className="hover:bg-[#1a202c] cursor-pointer transition-colors group"
                >
                  {/* Company & Role */}
                  <td className="py-3 px-4">
                    <div className="min-w-[160px] max-w-[220px]">
                      <div className="font-semibold text-zinc-100 group-hover:text-indigo-400 transition truncate">
                        {job.role}
                      </div>
                      <div className="text-zinc-400 text-[11px] truncate flex items-center gap-1.5 mt-0.5">
                        <span className="font-medium text-zinc-300">{job.company}</span>
                        {job.source && (
                          <span className="text-zinc-500 text-[10px]">· {job.source}</span>
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
                        className={`text-[11px] font-medium px-2.5 py-1 rounded-md border bg-[#0f121a] cursor-pointer focus:outline-none ${config.badgeBg}`}
                      >
                        {Object.entries(STATUS_CONFIG).map(([key, item]) => (
                          <option key={key} value={key} className="bg-[#161b24] text-zinc-200">
                            {item.label}
                          </option>
                        ))}
                      </select>
                      {upcomingInterview && (
                        <span className="text-[10px] text-indigo-400 flex items-center gap-1 font-medium">
                          <Clock className="w-2.5 h-2.5 shrink-0" />
                          <span className="truncate">{upcomingInterview.name} ({formatDate(upcomingInterview.date)})</span>
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Compensation */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    {(job.salaryMin || job.salaryMax) ? (
                      <span className="font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 text-[11px]">
                        {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency, job.salaryPeriod)}
                      </span>
                    ) : (
                      <span className="text-zinc-500 text-[11px]">Undisclosed</span>
                    )}
                  </td>

                  {/* Work Mode */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="capitalize text-zinc-300 font-medium bg-zinc-800/60 px-2 py-0.5 rounded text-[11px] border border-zinc-700/50">
                      {job.workMode}
                    </span>
                  </td>

                  {/* Location */}
                  <td className="py-3 px-4">
                    <span className="text-zinc-400 text-xs truncate max-w-[120px] block">
                      {job.location}
                    </span>
                  </td>

                  {/* Applied Date */}
                  <td className="py-3 px-4 whitespace-nowrap text-zinc-400 text-[11px]">
                    {job.dateApplied ? formatDate(job.dateApplied) : <span className="text-zinc-600">Saved</span>}
                  </td>

                  {/* Priority */}
                  <td className="py-3 px-4 whitespace-nowrap">
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
                        <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700/50">
                          {skill}
                        </span>
                      ))}
                      {job.keySkills.length > 2 && (
                        <span className="text-[10px] text-zinc-500 font-medium">
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
                        className="p-1.5 rounded-md text-zinc-400 hover:text-indigo-400 hover:bg-zinc-800 transition"
                        title="View JD & Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          setSharingJob(job);
                          setIsShareModalOpen(true);
                        }}
                        className="p-1.5 rounded-md text-zinc-400 hover:text-emerald-400 hover:bg-zinc-800 transition"
                        title="Share Summary"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>

                      {job.url && (
                        <a
                          href={job.url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-md text-zinc-400 hover:text-blue-400 hover:bg-zinc-800 transition"
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
                        className="p-1.5 rounded-md text-zinc-500 hover:text-rose-400 hover:bg-zinc-800 transition"
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
