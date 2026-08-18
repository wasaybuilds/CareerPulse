export type JobStatus = 
  | 'wishlist'
  | 'applied'
  | 'oa'
  | 'interview'
  | 'offer'
  | 'rejected'
  | 'archived';

export type WorkMode = 'remote' | 'hybrid' | 'onsite';

export type JobType = 'full-time' | 'part-time' | 'contract' | 'internship';

export interface InterviewRound {
  id: string;
  name: string; // e.g., 'Recruiter Screen', 'Technical Coding', 'System Design', 'Behavioral / Leadership'
  date: string; // YYYY-MM-DD
  time?: string; // HH:mm
  interviewer?: string;
  format?: 'video' | 'phone' | 'onsite' | 'take-home';
  questionsAsked?: string[];
  notes?: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'passed' | 'failed';
}

export interface Contact {
  name: string;
  role?: string;
  email?: string;
  linkedin?: string;
  notes?: string;
}

export interface JobApplication {
  id: string;
  company: string;
  role: string;
  location: string;
  workMode: WorkMode;
  jobType: JobType;
  status: JobStatus;
  dateAdded: string;
  dateApplied?: string;
  deadline?: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency: string;
  salaryPeriod: 'year' | 'month' | 'hour';
  url?: string;
  source?: string; // LinkedIn, Indeed, Referral, Wellfound, Direct, etc.
  jobDescription: string;
  keySkills: string[];
  matchedSkills: string[];
  resumeVersion?: string; // e.g. "Resume_Frontend_2026.pdf"
  portfolioLink?: string;
  referralContact?: Contact;
  recruiterContact?: Contact;
  interviewRounds: InterviewRound[];
  notes: string;
  priority: 1 | 2 | 3 | 4 | 5; // 1 (Low) to 5 (Top Choice)
  tags: string[];
  history: {
    date: string;
    status: JobStatus;
    note?: string;
  }[];
}

export type ViewMode = 'kanban' | 'table' | 'analytics' | 'calendar';

export interface FilterState {
  searchQuery: string;
  status: JobStatus | 'all';
  workMode: WorkMode | 'all';
  jobType: JobType | 'all';
  source: string | 'all';
  tag: string | 'all';
  minPriority: number;
  sortBy: 'dateAdded' | 'dateApplied' | 'company' | 'role' | 'salary' | 'priority' | 'deadline';
  sortOrder: 'asc' | 'desc';
}

export interface MetricSummary {
  total: number;
  wishlist: number;
  applied: number;
  oa: number;
  interview: number;
  offer: number;
  rejected: number;
  archived: number;
  responseRate: number;
  offerRate: number;
  activeApplications: number;
}
