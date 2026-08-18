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
      className="group relative bg-white hover:bg-slate-50/80 border border-slate-200/90 hover:border-slate-300 rounded-xl p-3.5 shadow-2xs hover:shadow-md transition-all cursor-pointer select-none"
    >
      {/* Top Row: Role, Company & Star */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h4 className="font-bold text-slate-900 text-xs leading-snug truncate group-hover:text-indigo-600 transition">
            {job.role}
          </h4>
          <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5 flex items-center gap-1.5">
            <span className="text-slate-800 font-semibold">{job.company}</span>
            <span>•</span>
            <span className="capitalize">{job.workMode}</span>
          </p>
        </div>

        {/* Priority & Options */}
        <div className="flex items-center gap-1 shrink-0" onClick={e => e.stopPropagation()}>
          <div className="flex items-center text-amber-500 text-xs">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-[10px] font-bold ml-0.5 text-slate-700">{job.priority}</span>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              title="Options"
            >
              <MoreVertical className="w-3.5 h-3.5" />
            </button>

            {showMenu && (
              <div 
                className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-30 text-xs animate-fade-in"
                onClick={e => e.stopPropagation()}
              >
                <button
                  onClick={() => {
                    setSelectedJob(job);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-700 font-medium flex items-center gap-2"
                >
                  <FileText className="w-3.5 h-3.5 text-indigo-600" />
                  <span>View Details & JD</span>
                </button>
                <button
                  onClick={() => {
                    setSharingJob(job);
                    setIsShareModalOpen(true);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-700 font-medium flex items-center gap-2"
                >
                  <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Share Summary</span>
                </button>
                {job.url && (
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-700 font-medium flex items-center gap-2"
                    onClick={() => setShowMenu(false)}
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                    <span>Open Posting</span>
                  </a>
                )}
                <div className="h-px bg-slate-100 my-1"></div>
                <div className="px-3 py-1 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
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
                      className="w-full text-left px-3 py-1 hover:bg-slate-50 text-slate-700 flex items-center gap-1.5 text-[11px] font-medium"
                    >
                      <span className={`w-2 h-2 rounded-full ${STATUS_CONFIG[statusKey].dotColor}`}></span>
                      <span>{STATUS_CONFIG[statusKey].label}</span>
                    </button>
                  );
                })}
                <div className="h-px bg-slate-100 my-1"></div>
                <button
                  onClick={() => {
                    if (confirm(`Delete ${job.role} at ${job.company}?`)) {
                      deleteJob(job.id);
                    }
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-rose-50 text-rose-600 font-medium"
                >
                  Delete Application
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Salary & Location Info */}
      <div className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
        {(job.salaryMin || job.salaryMax) ? (
          <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 text-[10px]">
            {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency, job.salaryPeriod)}
          </span>
        ) : (
          <span className="text-slate-400 text-[10px]">Undisclosed</span>
        )}

        <span className="text-slate-500 text-[10px] truncate flex items-center gap-0.5 font-medium">
          <MapPin className="w-2.5 h-2.5 text-slate-400 shrink-0" />
          {job.location}
        </span>
      </div>

      {/* Skills Chips */}
      {job.keySkills && job.keySkills.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-1">
          {job.keySkills.slice(0, 3).map((skill, i) => (
            <span
              key={i}
              className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium border border-slate-200"
            >
              {skill}
            </span>
          ))}
          {job.keySkills.length > 3 && (
            <span className="text-[10px] px-1 py-0.5 text-slate-400 font-bold">
              +{job.keySkills.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Upcoming Interview Box */}
      {upcomingInterview && (
        <div className="mt-2.5 px-2.5 py-1.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-900 text-[11px] flex items-center justify-between font-medium">
          <div className="flex items-center gap-1.5 min-w-0">
            <Clock className="w-3 h-3 text-indigo-600 shrink-0" />
            <span className="truncate">{upcomingInterview.name}</span>
          </div>
          <span className="text-[10px] text-indigo-700 shrink-0 font-bold">
            {formatDate(upcomingInterview.date)}
          </span>
        </div>
      )}

      {/* Footer Info */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-medium">
        <span>
          {job.dateApplied ? `Applied ${getDaysAgo(job.dateApplied)}` : `Added ${getDaysAgo(job.dateAdded)}`}
        </span>

        {job.resumeVersion && (
          <span className="truncate max-w-[100px] text-slate-500 font-semibold" title={job.resumeVersion}>
            📄 {job.resumeVersion}
          </span>
        )}
      </div>

    </div>
  );
};
