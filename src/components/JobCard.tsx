import React, { useState } from 'react';
import { 
  MapPin, 
  Star, 
  MoreVertical, 
  Share2, 
  ExternalLink,
  Clock,
  FileText
} from 'lucide-react';
import type { JobApplication, JobStatus } from '../types/job';
import { useJobs } from '../context/JobContext';
import { formatSalary, formatDate, getDaysAgo, STATUS_CONFIG } from '../utils/helpers';

interface JobCardProps {
  job: JobApplication;
}

export const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const { setSelectedJob, updateJobStatus, setSharingJob, setIsShareModalOpen, deleteJob } = useJobs();
  const [showMenu, setShowMenu] = useState(false);

  // Find next upcoming interview
  const upcomingInterview = job.interviewRounds?.find(r => r.status === 'scheduled');

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', job.id);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onClick={() => setSelectedJob(job)}
      className="group relative bg-[#161b22] hover:bg-[#1c2128] border border-zinc-800/80 hover:border-zinc-700 rounded-xl p-3 shadow-sm hover:shadow-md transition-all cursor-pointer select-none"
    >
      {/* Top Row: Role, Company & Star */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h4 className="font-semibold text-zinc-100 text-xs leading-snug truncate group-hover:text-indigo-400 transition">
            {job.role}
          </h4>
          <p className="text-[11px] text-zinc-400 font-medium truncate mt-0.5 flex items-center gap-1.5">
            <span className="text-zinc-300 font-semibold">{job.company}</span>
            <span>•</span>
            <span className="capitalize">{job.workMode}</span>
          </p>
        </div>

        {/* Priority & Options */}
        <div className="flex items-center gap-1 shrink-0" onClick={e => e.stopPropagation()}>
          <div className="flex items-center text-amber-400 text-xs">
            <Star className="w-3 h-3 fill-amber-400" />
            <span className="text-[10px] font-semibold ml-0.5">{job.priority}</span>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 rounded text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/60"
              title="Options"
            >
              <MoreVertical className="w-3.5 h-3.5" />
            </button>

            {showMenu && (
              <div 
                className="absolute right-0 top-full mt-1 w-44 bg-[#161b22] border border-zinc-700 rounded-xl shadow-xl py-1 z-30 text-xs animate-fade-in"
                onClick={e => e.stopPropagation()}
              >
                <button
                  onClick={() => {
                    setSelectedJob(job);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-zinc-800 text-zinc-300 hover:text-white flex items-center gap-2"
                >
                  <FileText className="w-3.5 h-3.5 text-indigo-400" />
                  <span>View Details & JD</span>
                </button>
                <button
                  onClick={() => {
                    setSharingJob(job);
                    setIsShareModalOpen(true);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-zinc-800 text-zinc-300 hover:text-white flex items-center gap-2"
                >
                  <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Share Summary</span>
                </button>
                {job.url && (
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full text-left px-3 py-1.5 hover:bg-zinc-800 text-zinc-300 hover:text-white flex items-center gap-2"
                    onClick={() => setShowMenu(false)}
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                    <span>Open Posting</span>
                  </a>
                )}
                <div className="h-px bg-zinc-800 my-1"></div>
                <div className="px-3 py-1 text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">
                  Move Stage
                </div>
                {(['wishlist', 'applied', 'oa', 'interview', 'offer', 'rejected', 'archived'] as JobStatus[]).map(statusKey => {
                  if (statusKey === job.status) return null;
                  return (
                    <button
                      key={statusKey}
                      onClick={() => {
                        updateJobStatus(job.id, statusKey);
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-3 py-1 hover:bg-zinc-800 text-zinc-300 hover:text-white flex items-center gap-1.5 text-[11px]"
                    >
                      <span className={`w-2 h-2 rounded-full ${STATUS_CONFIG[statusKey].dotColor}`}></span>
                      <span>{STATUS_CONFIG[statusKey].label}</span>
                    </button>
                  );
                })}
                <div className="h-px bg-zinc-800 my-1"></div>
                <button
                  onClick={() => {
                    if (confirm(`Delete ${job.role} at ${job.company}?`)) {
                      deleteJob(job.id);
                    }
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-rose-500/10 text-rose-400 hover:text-rose-300"
                >
                  Delete Job
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Salary & Location Info */}
      <div className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-zinc-400">
        {(job.salaryMin || job.salaryMax) ? (
          <span className="font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20 text-[10px]">
            {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency, job.salaryPeriod)}
          </span>
        ) : (
          <span className="text-zinc-500 text-[10px]">Undisclosed</span>
        )}

        <span className="text-zinc-400 text-[10px] truncate flex items-center gap-0.5">
          <MapPin className="w-2.5 h-2.5 text-zinc-500 shrink-0" />
          {job.location}
        </span>
      </div>

      {/* Skills Chips */}
      {job.keySkills && job.keySkills.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {job.keySkills.slice(0, 3).map((skill, i) => (
            <span
              key={i}
              className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800/80 text-zinc-300 border border-zinc-700/50"
            >
              {skill}
            </span>
          ))}
          {job.keySkills.length > 3 && (
            <span className="text-[10px] px-1 py-0.5 text-zinc-500">
              +{job.keySkills.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Upcoming Interview Alert Box */}
      {upcomingInterview && (
        <div className="mt-2 px-2 py-1 rounded-md bg-indigo-950/40 border border-indigo-500/30 text-indigo-300 text-[11px] flex items-center justify-between">
          <div className="flex items-center gap-1.5 min-w-0">
            <Clock className="w-3 h-3 text-indigo-400 shrink-0" />
            <span className="truncate">{upcomingInterview.name}</span>
          </div>
          <span className="text-[10px] text-indigo-400 shrink-0 font-medium">
            {formatDate(upcomingInterview.date)}
          </span>
        </div>
      )}

      {/* Footer Info */}
      <div className="mt-2.5 pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[10px] text-zinc-500">
        <span>
          {job.dateApplied ? `Applied ${getDaysAgo(job.dateApplied)}` : `Added ${getDaysAgo(job.dateAdded)}`}
        </span>

        {job.resumeVersion && (
          <span className="truncate max-w-[100px]" title={job.resumeVersion}>
            📄 {job.resumeVersion}
          </span>
        )}
      </div>

    </div>
  );
};
