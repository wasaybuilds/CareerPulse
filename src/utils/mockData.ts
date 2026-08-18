import type { JobApplication } from '../types/job';

export const INITIAL_JOBS: JobApplication[] = [
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
    jobDescription: `About Stripe:
Stripe is a financial infrastructure platform for the internet. Millions of companies—from the world’s largest enterprises to the most ambitious startups—use Stripe to accept payments, grow their revenue, and accelerate new business opportunities.

The Role:
We are looking for an experienced Staff Frontend Engineer to lead core user-facing experiences for Stripe Dashboard and Billing SDKs.

Responsibilities:
• Architect resilient, accessible, and fast web applications using React, TypeScript, and modern browser standards.
• Collaborate with product designers, backend teams, and data scientists to build complex financial dashboards.
• Mentor engineers across the organization and champion frontend best practices and performance metrics (Core Web Vitals).

Qualifications:
• 6+ years of professional web application engineering experience.
• Mastery in TypeScript, React, state management, CSS architecture, and web performance.
• Deep understanding of distributed backend systems and API design.
• Excellent written and verbal communication skills.`,
    keySkills: ['React', 'TypeScript', 'Frontend Architecture', 'GraphQL', 'Web Performance', 'Design Systems'],
    matchedSkills: ['React', 'TypeScript', 'Frontend Architecture', 'Design Systems'],
    resumeVersion: 'Resume_StaffFrontend_2026.pdf',
    portfolioLink: 'https://github.com/myusername',
    recruiterContact: {
      name: 'Sarah Jenkins',
      role: 'Senior Technical Recruiter',
      email: 'sjenkins@stripe.com',
      linkedin: 'https://linkedin.com/in/sarahjenkins-stripe',
      notes: 'Reached out directly on LinkedIn regarding the Billing Dashboard team.'
    },
    referralContact: {
      name: 'Alex Chen',
      role: 'Staff Engineer at Stripe',
      email: 'alex.c@stripe.com',
      linkedin: 'https://linkedin.com/in/alexchen-tech',
      notes: 'Former colleague from previous startup. Submitted internal referral on Aug 2.'
    },
    interviewRounds: [
      {
        id: 'round-1',
        name: 'Recruiter Screening',
        date: '2026-08-06',
        time: '11:00',
        interviewer: 'Sarah Jenkins',
        format: 'phone',
        questionsAsked: [
          'Walk me through your recent Staff-level frontend project.',
          'Why Stripe Billing specifically?',
          'What are your compensation expectations?'
        ],
        notes: 'Very positive conversation. Moved to Technical Screen.',
        status: 'passed'
      },
      {
        id: 'round-2',
        name: 'Technical Screen (Live Coding)',
        date: '2026-08-12',
        time: '14:00',
        interviewer: 'David Rossi (Staff Eng)',
        format: 'video',
        questionsAsked: [
          'Build an async streaming data grid with virtualized scrolling and keyboard navigation in React/TS.',
          'Handle optimistic UI updates and rollback on network errors.'
        ],
        notes: 'Passed with high marks! Interviewer was impressed by virtualization technique.',
        status: 'passed'
      },
      {
        id: 'round-3',
        name: 'Onsite: System Design & Leadership',
        date: '2026-08-22',
        time: '10:00',
        interviewer: 'Panel (VP Eng + 2 Staff Engs)',
        format: 'video',
        questionsAsked: [],
        notes: 'Prep topics: Global state synchronization, micro-frontends vs monorepo, latency budgets.',
        status: 'scheduled'
      }
    ],
    notes: 'Top target company! Review Stripe API documentation and payment intent life cycle before Onsite.',
    priority: 5,
    tags: ['Dream Job', 'High Pay', 'Fintech', 'Staff Role'],
    history: [
      { date: '2026-08-01', status: 'wishlist', note: 'Discovered opening on LinkedIn Jobs.' },
      { date: '2026-08-03', status: 'applied', note: 'Applied via Alex referral link.' },
      { date: '2026-08-06', status: 'interview', note: 'Completed recruiter screen.' }
    ]
  },
  {
    id: 'job-2',
    company: 'Linear',
    role: 'Full Stack Product Engineer',
    location: 'Remote (Worldwide)',
    workMode: 'remote',
    jobType: 'full-time',
    status: 'offer',
    dateAdded: '2026-07-20',
    dateApplied: '2026-07-22',
    deadline: '2026-08-15',
    salaryMin: 170000,
    salaryMax: 210000,
    salaryCurrency: 'USD',
    salaryPeriod: 'year',
    url: 'https://linear.app/careers/product-engineer',
    source: 'Wellfound',
    jobDescription: `Linear is the issue tracking tool you actually want to use. We build tools that empower modern software teams to build high quality software.

What you'll do:
• Build lightning-fast, keyboard-first desktop and web features using React, TypeScript, SQLite/IndexedDB syncing, and Node.js.
• Own full end-to-end features from UX concept to production telemetry.
• Ensure ultra-responsive 60fps micro-interactions and offline-first data sync.

Requirements:
• Exceptional product sense and attention to detail.
• Strong foundation with React, TypeScript, WebSockets, offline sync engines.
• Self-driven and comfortable working in an asynchronous, remote team.`,
    keySkills: ['React', 'TypeScript', 'Node.js', 'Offline-First', 'SQLite', 'WebSockets', 'Tailwind'],
    matchedSkills: ['React', 'TypeScript', 'Node.js', 'Tailwind', 'WebSockets'],
    resumeVersion: 'Resume_ProductEngineer_v2.pdf',
    portfolioLink: 'https://myportfolio.dev',
    recruiterContact: {
      name: 'Elena Rostova',
      role: 'Head of Talent',
      email: 'elena@linear.app',
      linkedin: 'https://linkedin.com/in/elenarostova'
    },
    interviewRounds: [
      {
        id: 'round-1',
        name: 'Async Product Challenge',
        date: '2026-07-28',
        time: '18:00',
        interviewer: 'Engineering Lead',
        format: 'take-home',
        questionsAsked: ['Build an offline-syncing issue board prototype with smooth animations.'],
        notes: 'Submitted on GitHub with custom video demo.',
        status: 'passed'
      },
      {
        id: 'round-2',
        name: 'Technical & Culture Chat with Founders',
        date: '2026-08-10',
        time: '16:00',
        interviewer: 'Tuomas Artman & Karri Saarinen',
        format: 'video',
        questionsAsked: ['Deep dive into architecture choices and product craftsmanship.'],
        notes: 'Great conversation about high-craft engineering.',
        status: 'passed'
      }
    ],
    notes: 'Received official offer letter! Base: $195k + 0.15% equity + $5k home office grant. Decision deadline Aug 28.',
    priority: 5,
    tags: ['Offer Received', 'Remote', 'High Growth', 'Product Focused'],
    history: [
      { date: '2026-07-20', status: 'wishlist' },
      { date: '2026-07-22', status: 'applied' },
      { date: '2026-07-28', status: 'interview' },
      { date: '2026-08-14', status: 'offer', note: 'Offer received: $195,000 / year + equity.' }
    ]
  },
  {
    id: 'job-3',
    company: 'Datadog',
    role: 'Senior Software Engineer - UI Platform',
    location: 'New York, NY',
    workMode: 'hybrid',
    jobType: 'full-time',
    status: 'oa',
    dateAdded: '2026-08-08',
    dateApplied: '2026-08-10',
    deadline: '2026-08-25',
    salaryMin: 165000,
    salaryMax: 205000,
    salaryCurrency: 'USD',
    salaryPeriod: 'year',
    url: 'https://careers.datadoghq.com/detail/123456',
    source: 'Company Website',
    jobDescription: `Datadog is the monitoring and security platform for cloud applications.

The UI Platform team empowers over 800 engineers by building shared design systems, build tooling, micro-frontend orchestrators, and browser monitoring SDKs.

Requirements:
• 5+ years experience building large scale React/TypeScript ecosystems.
• Strong understanding of Webpack/Vite/Rspack, Module Federation, and Monorepos (Turborepo/Nx).
• Experience with telemetry, performance budgets, and testing frameworks (Playwright, Jest).`,
    keySkills: ['TypeScript', 'React', 'Design Systems', 'Module Federation', 'Webpack/Vite', 'CI/CD'],
    matchedSkills: ['TypeScript', 'React', 'Design Systems', 'Webpack/Vite'],
    resumeVersion: 'Resume_Frontend_2026.pdf',
    recruiterContact: {
      name: 'Marcus Bell',
      email: 'marcus.bell@datadoghq.com'
    },
    interviewRounds: [
      {
        id: 'round-1',
        name: 'HackerRank Online Assessment (OA)',
        date: '2026-08-19',
        time: '23:59',
        format: 'take-home',
        questionsAsked: [],
        notes: '2 DSA problems + 1 Frontend Component test (90 minutes total). Due by Aug 19.',
        status: 'scheduled'
      }
    ],
    notes: 'Online assessment link received via HackerRank. Prepare LeetCode graphs & React hooks patterns.',
    priority: 4,
    tags: ['Infra', 'Platform Eng', 'NYC'],
    history: [
      { date: '2026-08-08', status: 'wishlist' },
      { date: '2026-08-10', status: 'applied' },
      { date: '2026-08-14', status: 'oa', note: 'Received HackerRank OA link.' }
    ]
  },
  {
    id: 'job-4',
    company: 'Vercel',
    role: 'Developer Experience (DX) Engineer',
    location: 'Remote',
    workMode: 'remote',
    jobType: 'full-time',
    status: 'applied',
    dateAdded: '2026-08-12',
    dateApplied: '2026-08-14',
    deadline: '2026-09-01',
    salaryMin: 160000,
    salaryMax: 200000,
    salaryCurrency: 'USD',
    salaryPeriod: 'year',
    url: 'https://vercel.com/careers/dx-engineer',
    source: 'Twitter / X',
    jobDescription: `Vercel is the platform for frontend developers, providing the speed and reliability innovators need to create at the moment of inspiration.

We're looking for a DX Engineer to improve our CLI, Next.js templates, AI SDK integration guides, and developer workflows.`,
    keySkills: ['Next.js', 'React', 'Node.js', 'CLI Tools', 'TypeScript', 'AI SDK'],
    matchedSkills: ['Next.js', 'React', 'Node.js', 'TypeScript', 'AI SDK'],
    resumeVersion: 'Resume_DX_Fullstack.pdf',
    interviewRounds: [],
    notes: 'Submitted with personal link to open-source Next.js template repo.',
    priority: 4,
    tags: ['DX', 'Remote', 'Next.js'],
    history: [
      { date: '2026-08-12', status: 'wishlist' },
      { date: '2026-08-14', status: 'applied', note: 'Direct submission on Vercel careers site.' }
    ]
  },
  {
    id: 'job-5',
    company: 'Airbnb',
    role: 'Senior Software Engineer - Guest Experience',
    location: 'San Francisco, CA',
    workMode: 'remote',
    jobType: 'full-time',
    status: 'wishlist',
    dateAdded: '2026-08-16',
    salaryMin: 180000,
    salaryMax: 225000,
    salaryCurrency: 'USD',
    salaryPeriod: 'year',
    url: 'https://careers.airbnb.com/positions/guest-exp',
    source: 'LinkedIn',
    jobDescription: `Airbnb is looking for a Senior Software Engineer to build the next generation of Search & Discovery experiences for millions of travelers worldwide.`,
    keySkills: ['React', 'TypeScript', 'GraphQL', 'Search UX', 'A/B Testing'],
    matchedSkills: ['React', 'TypeScript', 'GraphQL'],
    interviewRounds: [],
    notes: 'Need to get referral from alumni network before applying.',
    priority: 5,
    tags: ['Target', 'Travel Tech', 'Live Anywhere'],
    history: [
      { date: '2026-08-16', status: 'wishlist' }
    ]
  },
  {
    id: 'job-6',
    company: 'Spotify',
    role: 'Frontend Engineer II - Web Player',
    location: 'Stockholm / Remote EU',
    workMode: 'hybrid',
    jobType: 'full-time',
    status: 'rejected',
    dateAdded: '2026-07-05',
    dateApplied: '2026-07-08',
    salaryMin: 90000,
    salaryMax: 115000,
    salaryCurrency: 'EUR',
    salaryPeriod: 'year',
    url: 'https://spotifyjobs.com/role/1234',
    source: 'LinkedIn',
    jobDescription: `Join Spotify's Web Player team to deliver seamless audio playback to over 600M active listeners worldwide.`,
    keySkills: ['Web Audio API', 'React', 'TypeScript', 'Service Workers'],
    matchedSkills: ['React', 'TypeScript', 'Service Workers'],
    interviewRounds: [
      {
        id: 'round-1',
        name: 'Recruiter Screening',
        date: '2026-07-15',
        interviewer: 'Karin Larsson',
        status: 'passed'
      },
      {
        id: 'round-2',
        name: 'Technical Pair Programming',
        date: '2026-07-24',
        interviewer: 'Johan B',
        status: 'failed',
        notes: 'They decided to proceed with an internal candidate with more Web Audio API experience.'
      }
    ],
    notes: 'Good learning experience on Web Audio buffers and audio streaming architectures.',
    priority: 3,
    tags: ['Audio', 'Music', 'EU'],
    history: [
      { date: '2026-07-05', status: 'wishlist' },
      { date: '2026-07-08', status: 'applied' },
      { date: '2026-07-15', status: 'interview' },
      { date: '2026-07-28', status: 'rejected', note: 'Role closed for internal transfer.' }
    ]
  }
];
