import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';
import confetti from 'canvas-confetti';
import type { 
  JobApplication, 
  JobStatus, 
  FilterState, 
  ViewMode, 
  MetricSummary, 
  InterviewRound 
} from '../types/job';
import { INITIAL_JOBS, SAMPLE_SEED_JOBS } from '../utils/mockData';
import { calculateMetrics } from '../utils/helpers';
import { apiService, type DbStatus } from '../services/api';
import { useAuth } from './AuthContext';

interface JobContextType {
  jobs: JobApplication[];
  filteredJobs: JobApplication[];
  metrics: MetricSummary;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  selectedJob: JobApplication | null;
  setSelectedJob: (job: JobApplication | null) => void;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
  isSmartPasteOpen: boolean;
  setIsSmartPasteOpen: (open: boolean) => void;
  isImportExportOpen: boolean;
  setIsImportExportOpen: (open: boolean) => void;
  isShareModalOpen: boolean;
  setIsShareModalOpen: (open: boolean) => void;
  sharingJob: JobApplication | null;
  setSharingJob: (job: JobApplication | null) => void;
  dbStatus: DbStatus;
  isSyncing: boolean;
  syncWithMongoDB: () => Promise<void>;
  
  // Actions
  addJob: (jobData: Omit<JobApplication, 'id' | 'dateAdded' | 'history'>) => Promise<JobApplication>;
  updateJob: (id: string, updates: Partial<JobApplication>) => Promise<void>;
  deleteJob: (id: string) => Promise<void>;
  updateJobStatus: (id: string, newStatus: JobStatus, note?: string) => Promise<void>;
  addInterviewRound: (jobId: string, round: Omit<InterviewRound, 'id'>) => Promise<void>;
  updateInterviewRound: (jobId: string, roundId: string, updates: Partial<InterviewRound>) => Promise<void>;
  deleteInterviewRound: (jobId: string, roundId: string) => Promise<void>;
  importJobs: (newJobs: Partial<JobApplication>[]) => Promise<number>;
  resetToSampleData: () => Promise<void>;
  clearAllData: () => Promise<void>;
}

const defaultFilters: FilterState = {
  searchQuery: '',
  status: 'all',
  workMode: 'all',
  jobType: 'all',
  source: 'all',
  tag: 'all',
  minPriority: 0,
  sortBy: 'dateAdded',
  sortOrder: 'desc'
};

const JobContext = createContext<JobContextType | undefined>(undefined);

export const JobProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const storageKey = user ? `careerpulse_jobs_${user.id}` : 'careerpulse_jobs_guest';

  const [jobs, setJobs] = useState<JobApplication[]>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error reading localStorage:', e);
    }
    return INITIAL_JOBS;
  });

  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [selectedJob, setSelectedJob] = useState<JobApplication | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isSmartPasteOpen, setIsSmartPasteOpen] = useState<boolean>(false);
  const [isImportExportOpen, setIsImportExportOpen] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [sharingJob, setSharingJob] = useState<JobApplication | null>(null);
  
  const [dbStatus, setDbStatus] = useState<DbStatus>({ online: false, database: 'offline' });
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Sync to localStorage as resilient offline-first cache
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(jobs));
    } catch (e) {
      console.error('Error caching jobs to storage:', e);
    }
  }, [jobs, storageKey]);

  // Fetch from MongoDB
  const syncWithMongoDB = async () => {
    setIsSyncing(true);
    try {
      const health = await apiService.checkHealth();
      setDbStatus(health);

      if (health.online) {
        const remoteJobs = await apiService.getJobs();
        if (Array.isArray(remoteJobs)) {
          setJobs(remoteJobs);
        }
      }
    } catch (err) {
      console.warn('MongoDB sync note:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    syncWithMongoDB();
    const interval = setInterval(async () => {
      const health = await apiService.checkHealth();
      setDbStatus(health);
    }, 15000);
    return () => clearInterval(interval);
  }, [user]);

  // Synchronize selectedJob
  useEffect(() => {
    if (selectedJob) {
      const current = jobs.find(j => j.id === selectedJob.id);
      if (current) {
        setSelectedJob(current);
      }
    }
  }, [jobs, selectedJob]);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        colors: ['#4f46e5', '#10b981', '#ffffff', '#f59e0b', '#3b82f6'],
        origin: { y: 0.6 }
      });
    } catch {
      // Confetti fallback
    }
  };

  const addJob = async (jobData: Omit<JobApplication, 'id' | 'dateAdded' | 'history'>): Promise<JobApplication> => {
    const today = new Date().toISOString().split('T')[0];
    const newJob: JobApplication = {
      ...jobData,
      id: `job-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      userId: user?.id || 'anonymous',
      dateAdded: today,
      history: [
        {
          date: today,
          status: jobData.status,
          note: jobData.status === 'applied' ? 'Application submitted' : 'Job added to pipeline'
        }
      ]
    };

    setJobs(prev => [newJob, ...prev]);

    if (newJob.status === 'offer') {
      triggerConfetti();
    }

    try {
      if (dbStatus.online) {
        await apiService.createJob(newJob);
      }
    } catch (e) {
      console.error('Error saving job to MongoDB:', e);
    }

    return newJob;
  };

  const updateJob = async (id: string, updates: Partial<JobApplication>) => {
    setJobs(prev => prev.map(job => {
      if (job.id !== id) return job;
      return { ...job, ...updates };
    }));

    try {
      if (dbStatus.online) {
        await apiService.updateJob(id, updates);
      }
    } catch (e) {
      console.error('Error updating job on MongoDB:', e);
    }
  };

  const deleteJob = async (id: string) => {
    setJobs(prev => prev.filter(j => j.id !== id));
    if (selectedJob?.id === id) {
      setSelectedJob(null);
    }

    try {
      if (dbStatus.online) {
        await apiService.deleteJob(id);
      }
    } catch (e) {
      console.error('Error deleting from MongoDB:', e);
    }
  };

  const updateJobStatus = async (id: string, newStatus: JobStatus, note?: string) => {
    const today = new Date().toISOString().split('T')[0];
    let updatedJobData: Partial<JobApplication> = {};

    setJobs(prev => prev.map(job => {
      if (job.id !== id) return job;
      if (job.status === newStatus) return job;

      const dateApplied = (newStatus === 'applied' && !job.dateApplied) ? today : job.dateApplied;
      const historyEntry = {
        date: today,
        status: newStatus,
        note: note || `Stage moved to ${newStatus.toUpperCase()}`
      };

      updatedJobData = {
        status: newStatus,
        dateApplied,
        history: [...(job.history || []), historyEntry]
      };

      return { ...job, ...updatedJobData };
    }));

    if (newStatus === 'offer') {
      triggerConfetti();
    }

    try {
      if (dbStatus.online && Object.keys(updatedJobData).length > 0) {
        await apiService.updateJob(id, updatedJobData);
      }
    } catch (e) {
      console.error('Error syncing status to MongoDB:', e);
    }
  };

  const addInterviewRound = async (jobId: string, round: Omit<InterviewRound, 'id'>) => {
    const newRound: InterviewRound = {
      ...round,
      id: `round-${Date.now()}`
    };

    let updatedRounds: InterviewRound[] = [];
    setJobs(prev => prev.map(job => {
      if (job.id !== jobId) return job;
      updatedRounds = [...job.interviewRounds, newRound];
      return { ...job, interviewRounds: updatedRounds };
    }));

    try {
      if (dbStatus.online) {
        await apiService.updateJob(jobId, { interviewRounds: updatedRounds });
      }
    } catch (e) {
      console.error('Error saving round to MongoDB:', e);
    }
  };

  const updateInterviewRound = async (jobId: string, roundId: string, updates: Partial<InterviewRound>) => {
    let updatedRounds: InterviewRound[] = [];
    setJobs(prev => prev.map(job => {
      if (job.id !== jobId) return job;
      updatedRounds = job.interviewRounds.map(r => r.id === roundId ? { ...r, ...updates } : r);
      return { ...job, interviewRounds: updatedRounds };
    }));

    try {
      if (dbStatus.online) {
        await apiService.updateJob(jobId, { interviewRounds: updatedRounds });
      }
    } catch (e) {
      console.error('Error updating round on MongoDB:', e);
    }
  };

  const deleteInterviewRound = async (jobId: string, roundId: string) => {
    let updatedRounds: InterviewRound[] = [];
    setJobs(prev => prev.map(job => {
      if (job.id !== jobId) return job;
      updatedRounds = job.interviewRounds.filter(r => r.id !== roundId);
      return { ...job, interviewRounds: updatedRounds };
    }));

    try {
      if (dbStatus.online) {
        await apiService.updateJob(jobId, { interviewRounds: updatedRounds });
      }
    } catch (e) {
      console.error('Error deleting round on MongoDB:', e);
    }
  };

  const importJobs = async (newJobs: Partial<JobApplication>[]): Promise<number> => {
    const today = new Date().toISOString().split('T')[0];
    const formatted: JobApplication[] = newJobs.map(j => ({
      id: j.id || `job-imp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      userId: user?.id || 'anonymous',
      company: j.company || 'Unknown Company',
      role: j.role || 'Software Engineer',
      location: j.location || 'Remote',
      workMode: j.workMode || 'remote',
      jobType: j.jobType || 'full-time',
      status: j.status || 'applied',
      dateAdded: j.dateAdded || today,
      dateApplied: j.dateApplied,
      deadline: j.deadline,
      salaryMin: j.salaryMin,
      salaryMax: j.salaryMax,
      salaryCurrency: j.salaryCurrency || 'USD',
      salaryPeriod: j.salaryPeriod || 'year',
      url: j.url,
      source: j.source || 'Import',
      jobDescription: j.jobDescription || 'Imported job listing',
      keySkills: j.keySkills || [],
      matchedSkills: j.matchedSkills || [],
      resumeVersion: j.resumeVersion,
      portfolioLink: j.portfolioLink,
      referralContact: j.referralContact,
      recruiterContact: j.recruiterContact,
      interviewRounds: j.interviewRounds || [],
      notes: j.notes || '',
      priority: j.priority || 3,
      tags: j.tags || ['Imported'],
      history: j.history || [{ date: today, status: j.status || 'applied', note: 'Imported' }]
    }));

    setJobs(prev => [...formatted, ...prev]);

    try {
      if (dbStatus.online) {
        await apiService.importJobs(formatted);
      }
    } catch (e) {
      console.error('Error importing to MongoDB:', e);
    }

    return formatted.length;
  };

  const resetToSampleData = async () => {
    setJobs(SAMPLE_SEED_JOBS);
    try {
      if (dbStatus.online) {
        await apiService.importJobs(SAMPLE_SEED_JOBS);
      }
    } catch (e) {
      console.error('Error seeding MongoDB:', e);
    }
  };

  const clearAllData = async () => {
    setJobs([]);
    setSelectedJob(null);
    localStorage.removeItem(storageKey);
  };

  // Filter and Sort calculation
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const matchesCompany = job.company.toLowerCase().includes(query);
        const matchesRole = job.role.toLowerCase().includes(query);
        const matchesLocation = job.location.toLowerCase().includes(query);
        const matchesSkills = job.keySkills.some(s => s.toLowerCase().includes(query));
        const matchesTags = job.tags.some(t => t.toLowerCase().includes(query));
        const matchesNotes = job.notes.toLowerCase().includes(query);
        if (!matchesCompany && !matchesRole && !matchesLocation && !matchesSkills && !matchesTags && !matchesNotes) {
          return false;
        }
      }

      if (filters.status === 'all') {
        // Exclude archived jobs by default unless user selects 'archived' filter
        if (job.status === 'archived') return false;
      } else if (job.status !== filters.status) {
        return false;
      }

      if (filters.workMode !== 'all' && job.workMode !== filters.workMode) return false;
      if (filters.jobType !== 'all' && job.jobType !== filters.jobType) return false;
      if (filters.source !== 'all' && job.source !== filters.source) return false;
      if (filters.tag !== 'all' && !job.tags.includes(filters.tag)) return false;
      if (filters.minPriority > 0 && job.priority < filters.minPriority) return false;

      return true;
    }).sort((a, b) => {
      let comparison = 0;
      switch (filters.sortBy) {
        case 'company':
          comparison = a.company.localeCompare(b.company);
          break;
        case 'role':
          comparison = a.role.localeCompare(b.role);
          break;
        case 'salary': {
          const salA = a.salaryMax || a.salaryMin || 0;
          const salB = b.salaryMax || b.salaryMin || 0;
          comparison = salA - salB;
          break;
        }
        case 'priority':
          comparison = a.priority - b.priority;
          break;
        case 'dateApplied':
          comparison = (a.dateApplied || '').localeCompare(b.dateApplied || '');
          break;
        case 'deadline':
          comparison = (a.deadline || '').localeCompare(b.deadline || '');
          break;
        case 'dateAdded':
        default:
          comparison = a.dateAdded.localeCompare(b.dateAdded);
          break;
      }
      return filters.sortOrder === 'desc' ? -comparison : comparison;
    });
  }, [jobs, filters]);

  const metrics = useMemo(() => calculateMetrics(jobs), [jobs]);

  return (
    <JobContext.Provider
      value={{
        jobs,
        filteredJobs,
        metrics,
        filters,
        setFilters,
        viewMode,
        setViewMode,
        selectedJob,
        setSelectedJob,
        isAddModalOpen,
        setIsAddModalOpen,
        isSmartPasteOpen,
        setIsSmartPasteOpen,
        isImportExportOpen,
        setIsImportExportOpen,
        isShareModalOpen,
        setIsShareModalOpen,
        sharingJob,
        setSharingJob,
        dbStatus,
        isSyncing,
        syncWithMongoDB,
        addJob,
        updateJob,
        deleteJob,
        updateJobStatus,
        addInterviewRound,
        updateInterviewRound,
        deleteInterviewRound,
        importJobs,
        resetToSampleData,
        clearAllData
      }}
    >
      {children}
    </JobContext.Provider>
  );
};

export const useJobs = () => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
};
