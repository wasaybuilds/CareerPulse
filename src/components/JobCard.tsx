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

  // Derive vibrant company avatar background color based on name
  const getCompanyColor = (name: string) => {
    const colors = [
      'from-blue-600 to-indigo-600',
      'from-purple-600 to-pink-600',
      'from-emerald-600 to-teal-600',
      'from-amber-600 to-orange-600',
      'from-rose-600 to-red-600',
      'from-cyan-600 to-blue-600'
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

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
      className="group relative bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800/80 hover:border-indigo-500/40 rounded-xl p-3.5 shadow-md hover:shadow-xl transition-all cursor-pointer select-none"
    >
      {/* Top Row: Company, Avatar & Priority */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${getCompanyColor(job.company)} flex items-center justify-center text-white font-bold text-xs shadow-sm shrink-0`}>
            {job.company.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h4 className="font-semibold text-slate-100 text-sm truncate group-hover:text-indigo-300 transition">
              {job.role}
            </h4>
            <p className="text-xs text-slate-400 font-medium truncate flex items-center gap-1">
              <span>{job.company}</span>
              {job.workMode && (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 capitalize">
                  {job.workMode}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Priority & Quick Actions */}
        <div className="flex items-center gap-1 shrink-0" onClick={e => e.stopPropagation()}>
          <div className="flex items-center text-amber-400/90 text-xs">
            <Star className="w-3 h-3 fill-amber-400" />
            <span className="text-[11px] font-semibold ml-0.5">{job.priority}</span>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
              title="Job Options"
            >
              <MoreVertical className="w-3.5 h-3.5" />
            </button>

            {showMenu && (
              <div 
                className="absolute right-0 top-full mt-1 w-44 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-1 z-30 text-xs animate-fade-in"
                onClick={e => e.stopPropagation()}
              >
                <button
                  onClick={() => {
                    setSelectedJob(job);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center gap-2"
                >
                  <FileText className="w-3.5 h-3.5 text-indigo-400" />
                  <span>View JD & Details</span>
                </button>
                <button
                  onClick={() => {
                    setSharingJob(job);
                    setIsShareModalOpen(true);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center gap-2"
                >
                  <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Share Summary</span>
                </button>
                {job.url && (
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center gap-2"
                    onClick={() => setShowMenu(false)}
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                    <span>Open Posting</span>
                  </a>
                )}
                <div className="h-px bg-slate-800 my-1"></div>
                <div className="px-3 py-1 text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
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
                      className="w-full text-left px-3 py-1 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center gap-1.5 text-[11px]"
                    >
                      <span className={`w-2 h-2 rounded-full ${STATUS_CONFIG[statusKey].dotColor}`}></span>
                      <span>{STATUS_CONFIG[statusKey].label}</span>
                    </button>
                  );
                })}
                <div className="h-px bg-slate-800 my-1"></div>
                <button
                  onClick={() => {
                    if (confirm(`Are you sure you want to delete ${job.role} at ${job.company}?`)) {
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
      <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-300">
        {(job.salaryMin || job.salaryMax) ? (
          <span className="font-semibold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-500/20 text-[11px]">
            {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency, job.salaryPeriod)}
          </span>
        ) : (
          <span className="text-slate-500 text-[11px]">Salary not listed</span>
        )}

        <span className="text-slate-400 text-[11px] truncate flex items-center gap-1">
          <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
          {job.location}
        </span>
      </div>

      {/* Skills Chips */}
      {job.keySkills && job.keySkills.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-1">
          {job.keySkills.slice(0, 3).map((skill, i) => (
            <span
              key={i}
              className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700/50"
            >
              {skill}
            </span>
          ))}
          {job.keySkills.length > 3 && (
            <span className="text-[10px] px-1 py-0.5 text-slate-400">
              +{job.keySkills.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Upcoming Interview Alert Box */}
      {upcomingInterview && (
        <div className="mt-2.5 px-2.5 py-1.5 rounded-lg bg-purple-950/30 border border-purple-500/30 text-purple-200 text-xs flex items-center justify-between">
          <div className="flex items-center gap-1.5 min-w-0">
            <Clock className="w-3 h-3 text-purple-400 shrink-0 animate-pulse" />
            <span className="truncate text-[11px] font-medium">{upcomingInterview.name}</span>
          </div>
          <span className="text-[10px] text-purple-300 shrink-0 font-semibold">
            {formatDate(upcomingInterview.date)}
          </span>
        </div>
      )}

      {/* Footer Info: Applied Date & Resume Version */}
      <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
        <span className="text-slate-400">
          {job.dateApplied ? `Applied ${getDaysAgo(job.dateApplied)}` : `Added ${getDaysAgo(job.dateAdded)}`}
        </span>

        {job.resumeVersion && (
          <span className="text-slate-400 truncate max-w-[110px]" title={job.resumeVersion}>
            📄 {job.resumeVersion}
          </span>
        )}
      </div>

    </div>
  );
};
