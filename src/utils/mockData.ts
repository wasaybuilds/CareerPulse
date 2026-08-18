import type { JobApplication } from '../types/job';

// Default initial state is completely clean (no dummy data)
export const INITIAL_JOBS: JobApplication[] = [];

// Optional sample jobs only loaded if the user clicks "Load demo seed data"
export const SAMPLE_SEED_JOBS: JobApplication[] = [
  {
    id: 'job-1',
    company: 'Stripe',
    role: 'Staff Frontend Engineer',
    location: 'San Francisco, CA',
    workMode: 'hybrid',
    jobType: 'full-time',
    status: 'interview',
    dateAdded: '2026-08-01',
    dateApplied: '2026-08-03',
    deadline: '2026-08-30',
    salaryMin: 185000,
    salaryMax: 240000,
    salaryCurrency: 'USD',
    salaryPeriod: 'year',
    url: 'https://stripe.com/jobs/staff-frontend-eng',
    source: 'LinkedIn',
    jobDescription: `Stripe is looking for an experienced Staff Frontend Engineer to lead core user-facing experiences for Stripe Dashboard and Billing SDKs.`,
    keySkills: ['React', 'TypeScript', 'Frontend Architecture', 'GraphQL', 'Design Systems'],
    matchedSkills: ['React', 'TypeScript', 'Frontend Architecture', 'Design Systems'],
    resumeVersion: 'Resume_StaffFrontend_2026.pdf',
    portfolioLink: 'https://github.com/myusername',
    interviewRounds: [
      {
        id: 'round-1',
        name: 'Recruiter Screening',
        date: '2026-08-06',
        time: '11:00',
        interviewer: 'Sarah Jenkins',
        format: 'phone',
        status: 'passed'
      },
      {
        id: 'round-2',
        name: 'Technical Screen (Live Coding)',
        date: '2026-08-12',
        time: '14:00',
        interviewer: 'David Rossi (Staff Eng)',
        format: 'video',
        status: 'passed'
      }
    ],
    notes: 'Top target company! Review Stripe API documentation before Onsite.',
    priority: 5,
    tags: ['Fintech', 'Staff Role'],
    history: [
      { date: '2026-08-01', status: 'wishlist', note: 'Discovered opening on LinkedIn Jobs.' },
      { date: '2026-08-03', status: 'applied', note: 'Applied via referral.' }
    ]
  },
  {
    id: 'job-2',
    company: 'Linear',
    role: 'Full Stack Product Engineer',
    location: 'Remote',
    workMode: 'remote',
    jobType: 'full-time',
    status: 'offer',
    dateAdded: '2026-07-20',
    dateApplied: '2026-07-22',
    salaryMin: 170000,
    salaryMax: 210000,
    salaryCurrency: 'USD',
    salaryPeriod: 'year',
    url: 'https://linear.app/careers',
    source: 'Wellfound',
    jobDescription: `Build lightning-fast, keyboard-first desktop and web features using React, TypeScript, and Node.js.`,
    keySkills: ['React', 'TypeScript', 'Node.js', 'Offline-First', 'SQLite', 'WebSockets'],
    matchedSkills: ['React', 'TypeScript', 'Node.js'],
    resumeVersion: 'Resume_ProductEngineer.pdf',
    interviewRounds: [],
    notes: 'Received official offer letter! Base: $195k + equity.',
    priority: 5,
    tags: ['Offer Received', 'Remote'],
    history: [
      { date: '2026-07-20', status: 'wishlist' },
      { date: '2026-07-22', status: 'applied' },
      { date: '2026-08-14', status: 'offer', note: 'Offer received: $195,000 / year' }
    ]
  }
];
