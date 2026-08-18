import type { JobApplication, User, AuthResponse } from '../types/job';

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

let authToken: string | null = null;

// Initialize token from localStorage if present
if (typeof window !== 'undefined') {
  authToken = localStorage.getItem('careerpulse_auth_token');
}

const getHeaders = () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  return headers;
};

export const apiService = {
  setAuthToken(token: string | null) {
    authToken = token;
    if (token) {
      localStorage.setItem('careerpulse_auth_token', token);
    } else {
      localStorage.removeItem('careerpulse_auth_token');
    }
  },

  getAuthToken(): string | null {
    return authToken;
  },

  // Auth: Register
  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');
    this.setAuthToken(data.token);
    return data;
  },

  // Auth: Login
  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    this.setAuthToken(data.token);
    return data;
  },

  // Auth: Get current user
  async getMe(): Promise<User | null> {
    if (!authToken) return null;
    try {
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: getHeaders(),
        signal: AbortSignal.timeout(3500)
      });
      if (!res.ok) {
        this.setAuthToken(null);
        return null;
      }
      const data = await res.json();
      return data.user;
    } catch {
      return null;
    }
  },

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

  // Fetch all jobs for the authenticated user
  async getJobs(): Promise<JobApplication[]> {
    const res = await fetch(`${API_BASE_URL}/jobs`, {
      headers: getHeaders(),
      signal: AbortSignal.timeout(4000)
    });
    if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);
    return await res.json();
  },

  // Create single job
  async createJob(job: Partial<JobApplication>): Promise<JobApplication> {
    const res = await fetch(`${API_BASE_URL}/jobs`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(job)
    });
    if (!res.ok) throw new Error('Failed to create job in MongoDB');
    return await res.json();
  },

  // Update single job
  async updateJob(id: string, updates: Partial<JobApplication>): Promise<JobApplication> {
    const res = await fetch(`${API_BASE_URL}/jobs/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update job in MongoDB');
    return await res.json();
  },

  // Delete single job
  async deleteJob(id: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/jobs/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete job');
  },

  // Bulk import
  async importJobs(jobs: Partial<JobApplication>[]): Promise<number> {
    const res = await fetch(`${API_BASE_URL}/jobs/import`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(jobs)
    });
    if (!res.ok) throw new Error('Bulk import failed');
    const data = await res.json();
    return data.count || jobs.length;
  }
};
