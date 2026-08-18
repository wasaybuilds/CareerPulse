import React from 'react';
import { useJobs } from '../context/JobContext';
import type { JobStatus } from '../types/job';
import { KanbanColumn } from './KanbanColumn';

const PIPELINE_COLUMNS: JobStatus[] = [
  'wishlist',
  'applied',
  'oa',
  'interview',
  'offer',
  'rejected',
  'archived'
];

export const KanbanBoard: React.FC = () => {
  const { filteredJobs } = useJobs();

  return (
    <div className="flex-1 overflow-x-auto p-4 sm:p-6">
      <div className="flex items-start gap-4 min-w-max pb-4">
        {PIPELINE_COLUMNS.map(status => {
          const columnJobs = filteredJobs.filter(j => j.status === status);
          return (
            <KanbanColumn
              key={status}
              status={status}
              jobs={columnJobs}
            />
          );
        })}
      </div>
    </div>
  );
};
