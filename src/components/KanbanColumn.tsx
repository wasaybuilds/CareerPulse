import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import type { JobApplication, JobStatus } from '../types/job';
import { STATUS_CONFIG } from '../utils/helpers';
import { JobCard } from './JobCard';
import { useJobs } from '../context/JobContext';

interface KanbanColumnProps {
  status: JobStatus;
  jobs: JobApplication[];
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({ status, jobs }) => {
  const { updateJobStatus, setIsAddModalOpen } = useJobs();
  const [isDragOver, setIsDragOver] = useState(false);
  const config = STATUS_CONFIG[status];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const jobId = e.dataTransfer.getData('text/plain');
    if (jobId) {
      updateJobStatus(jobId, status);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col flex-shrink-0 w-80 bg-slate-950/60 rounded-2xl border transition-all duration-200 ${
        isDragOver
          ? 'border-indigo-500 bg-indigo-950/20 ring-2 ring-indigo-500/20'
          : 'border-slate-800/80 hover:border-slate-700/80'
      }`}
    >
      {/* Column Header */}
      <div className="p-3.5 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${config.dotColor}`}></span>
          <h3 className="font-semibold text-slate-200 text-sm">{config.label}</h3>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-400 border border-slate-700/50">
            {jobs.length}
          </span>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          title={`Add job to ${config.label}`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Cards Scroll Container */}
      <div className="p-3 flex-1 flex flex-col gap-3 overflow-y-auto max-h-[calc(100vh-230px)] min-h-[140px]">
        {jobs.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-6 text-center border border-dashed border-slate-800/70 rounded-xl">
            <p className="text-xs text-slate-400">No jobs in {config.label}</p>
            <span className="text-[11px] text-slate-400 mt-1">Drag cards here</span>
          </div>
        ) : (
          jobs.map(job => (
            <JobCard key={job.id} job={job} />
          ))
        )}
      </div>
    </div>
  );
};
