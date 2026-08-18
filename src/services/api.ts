import type { JobApplication } from '../types/job';

// In production on Vercel, requests to '/api' are handled by the serverless function.
// In local dev, it connects to localhost:5000 or custom VITE_API_URL.
const API_BASE_URL = import.meta.env.VITE_API_URL || (
  typeof window !== 'undefined' && window.location.hostname !== 'localhost'
    ? '/api'
    : 'http://localhost:5000/api'
);

export interface DbStatus {
  online: boolean;
  database: 'connected' | 'disconnected' | 'offline';
}

export const apiService = {
  // Check health & database status
  async checkHealth(): Promise<DbStatus> {
    try {
      const res = await fetch(`${API_BASE_URL}/health`, {
        signal: AbortSignal.timeout(2500)
      });
      if (!res.ok) throw new Error('Health check non-200');
      const data = await res.json();
      return {
        online: true,
        database: data.database || 'disconnected'
      };
    } catch {
      return { online: false, database: 'offline' };
    }
  },

  // Fetch all jobs
  async getJobs(): Promise<JobApplication[]> {
    const res = await fetch(`${API_BASE_URL}/jobs`, {
      signal: AbortSignal.timeout(4000)
    });
    if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);
    return await res.json();
  },

  // Create single job
  async createJob(job: Partial<JobApplication>): Promise<JobApplication> {
    const res = await fetch(`${API_BASE_URL}/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(job)
    });
    if (!res.ok) throw new Error('Failed to create job in MongoDB');
    return await res.json();
  },

  // Update single job
  async updateJob(id: string, updates: Partial<JobApplication>): Promise<JobApplication> {
    const res = await fetch(`${API_BASE_URL}/jobs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update job in MongoDB');
    return await res.json();
  },

  // Delete single job
  async deleteJob(id: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/jobs/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete job');
  },

  // Bulk import
  async importJobs(jobs: Partial<JobApplication>[]): Promise<number> {
    const res = await fetch(`${API_BASE_URL}/jobs/import`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jobs)
    });
    if (!res.ok) throw new Error('Bulk import failed');
    const data = await res.json();
    return data.count || jobs.length;
  }
};
