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
      className={`flex flex-col flex-shrink-0 w-80 bg-slate-100/80 rounded-xl border transition-all duration-150 shadow-2xs ${
        isDragOver
          ? 'border-indigo-500 bg-indigo-50/50 ring-2 ring-indigo-200'
          : 'border-slate-200'
      }`}
    >
      {/* Column Header */}
      <div className="p-3 border-b border-slate-200/80 bg-white/60 rounded-t-xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${config.dotColor}`}></span>
          <h3 className="font-bold text-slate-800 text-xs">{config.label}</h3>
          <span className="text-[11px] font-bold px-2 py-0.2 rounded-full bg-slate-200/80 text-slate-700">
            {jobs.length}
          </span>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
          title={`Add job to ${config.label}`}
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Cards Container */}
      <div className="p-2.5 flex-1 flex flex-col gap-2.5 overflow-y-auto max-h-[calc(100vh-180px)] min-h-[140px]">
        {jobs.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-6 text-center border-2 border-dashed border-slate-200 rounded-lg">
            <p className="text-[11px] text-slate-400 font-medium">No applications</p>
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
