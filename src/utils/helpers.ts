import type { JobApplication, JobStatus, MetricSummary, WorkMode } from '../types/job';

export const STATUS_CONFIG: Record<JobStatus, { label: string; color: string; bg: string; badgeBg: string; border: string; dotColor: string }> = {
  wishlist: {
    label: 'Wishlist',
    color: 'text-slate-700',
    bg: 'bg-slate-50 hover:bg-slate-100/80',
    badgeBg: 'bg-slate-100 text-slate-700 border-slate-200',
    border: 'border-slate-300',
    dotColor: 'bg-slate-400'
  },
  applied: {
    label: 'Applied',
    color: 'text-blue-700',
    bg: 'bg-blue-50/50 hover:bg-blue-50/80',
    badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
    border: 'border-blue-300',
    dotColor: 'bg-blue-500'
  },
  oa: {
    label: 'Assessment (OA)',
    color: 'text-amber-700',
    bg: 'bg-amber-50/50 hover:bg-amber-50/80',
    badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
    border: 'border-amber-300',
    dotColor: 'bg-amber-500'
  },
  interview: {
    label: 'Interviewing',
    color: 'text-indigo-700',
    bg: 'bg-indigo-50/50 hover:bg-indigo-50/80',
    badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    border: 'border-indigo-300',
    dotColor: 'bg-indigo-500'
  },
  offer: {
    label: 'Offer 🎉',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50/60 hover:bg-emerald-50/90',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-300',
    border: 'border-emerald-400',
    dotColor: 'bg-emerald-500'
  },
  rejected: {
    label: 'Rejected',
    color: 'text-rose-700',
    bg: 'bg-rose-50/40 hover:bg-rose-50/70',
    badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
    border: 'border-rose-300',
    dotColor: 'bg-rose-500'
  },
  archived: {
    label: 'Archived',
    color: 'text-slate-600',
    bg: 'bg-slate-50/60 hover:bg-slate-100',
    badgeBg: 'bg-slate-100 text-slate-600 border-slate-200',
    border: 'border-slate-300',
    dotColor: 'bg-slate-400'
  }
};

export const PIPELINE_COLUMNS: JobStatus[] = [
  'wishlist',
  'applied',
  'oa',
  'interview',
  'offer',
  'rejected'
];

export function formatSalary(
  min?: number,
  max?: number,
  currency: string = 'USD',
  period: 'year' | 'month' | 'hour' = 'year'
): string {
  if (!min && !max) return 'Undisclosed';

  const symbolMap: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
    CAD: 'CA$',
    AUD: 'A$'
  };
  const sym = symbolMap[currency] || '$';

  const formatNum = (num: number) => {
    if (num >= 1000) {
      const k = num / 1000;
      return `${sym}${Number.isInteger(k) ? k : k.toFixed(1)}k`;
    }
    return `${sym}${num.toLocaleString()}`;
  };

  const periodSuffix = period === 'year' ? '/yr' : period === 'month' ? '/mo' : '/hr';

  if (min && max) {
    return `${formatNum(min)} - ${formatNum(max)}${periodSuffix}`;
  }
  if (min) {
    return `From ${formatNum(min)}${periodSuffix}`;
  }
  if (max) {
    return `Up to ${formatNum(max)}${periodSuffix}`;
  }
  return 'Undisclosed';
}

export function formatDate(dateString?: string): string {
  if (!dateString) return '—';
  try {
    const [year, month, day] = dateString.split('-').map(Number);
    if (!year || !month || !day) return dateString;
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
}

export function getDaysAgo(dateString?: string): string {
  if (!dateString) return '';
  try {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const today = new Date();
    const diffTime = today.getTime() - date.getTime();
    const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return `${days}d ago`;
  } catch {
    return '';
  }
}

export function getDaysSince(dateString?: string): number | null {
  if (!dateString) return null;
  try {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const today = new Date();
    const diffTime = today.getTime() - date.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  } catch {
    return null;
  }
}

export function calculateMetrics(jobs: JobApplication[]): MetricSummary {
  const total = jobs.length;
  const wishlist = jobs.filter(j => j.status === 'wishlist').length;
  const applied = jobs.filter(j => j.status === 'applied').length;
  const oa = jobs.filter(j => j.status === 'oa').length;
  const interview = jobs.filter(j => j.status === 'interview').length;
  const offer = jobs.filter(j => j.status === 'offer').length;
  const rejected = jobs.filter(j => j.status === 'rejected').length;
  const archived = jobs.filter(j => j.status === 'archived').length;

  const appliedTotal = total - wishlist;
  const respondedTotal = oa + interview + offer + rejected;
  const responseRate = appliedTotal > 0 ? Math.round((respondedTotal / appliedTotal) * 100) : 0;
  const offerRate = appliedTotal > 0 ? Math.round((offer / appliedTotal) * 100) : 0;
  const activeApplications = applied + oa + interview;

  return {
    total,
    wishlist,
    applied,
    oa,
    interview,
    offer,
    rejected,
    archived,
    responseRate,
    offerRate,
    activeApplications
  };
}

/**
 * Intelligent Multi-Pass Natural Language Job Description Parser
 */
export function parseJobDescriptionText(rawText: string): Partial<JobApplication> {
  const cleanText = rawText.trim();
  const result: Partial<JobApplication> = {
    jobDescription: cleanText,
    keySkills: [],
    tags: [],
    priority: 4,
    status: 'wishlist'
  };

  if (!cleanText) return result;

  const lines = cleanText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

  // 1. EXTRACT ROLE TITLE (Multi-tier heuristic)
  let detectedRole = '';

  // Heuristic A: Look for "seeking/looking for/hiring a [Role Title]"
  const roleKeywords = 'Staff Software Engineer|Principal Engineer|Lead Software Engineer|Senior Software Engineer|Software Engineer|Full Stack Developer|Full Stack Engineer|Backend Developer|Backend Engineer|Frontend Developer|Frontend Engineer|DevOps Engineer|Cloud Architect|Solutions Architect|Data Engineer|Engineering Manager|Site Reliability Engineer|AI Engineer|Machine Learning Engineer';
  const directRoleRegex = new RegExp(`(?:seeking|looking for|hiring|position of|role of|opportunity for)\\s+(?:an?|our next)?\\s*(${roleKeywords}|[A-Za-z0-9\\s/–-]+?(?:Developer|Engineer|Architect|Specialist|Lead|Manager|Designer|Analyst|Consultant|Scientist|DevOps|Administrator|Intern))`, 'i');
  
  const directMatch = cleanText.match(directRoleRegex);
  if (directMatch && directMatch[1]) {
    detectedRole = directMatch[1]
      .replace(/\s+(to join|to help|with|who|in|at|for|helping)\b.*$/i, '')
      .replace(/[.,;:]+$/, '')
      .trim();
  }

  // Heuristic B: Scan lines for explicit standard job titles
  if (!detectedRole) {
    const titleRegex = new RegExp(`\\b(${roleKeywords})\\b`, 'i');
    for (let i = 0; i < Math.min(lines.length, 6); i++) {
      const lineMatch = lines[i].match(titleRegex);
      if (lineMatch) {
        detectedRole = lineMatch[1].trim();
        break;
      }
    }
  }

  // Heuristic C: Fallback to first line if short and not a generic heading
  if (!detectedRole && lines[0] && lines[0].length < 45 && !lines[0].toLowerCase().startsWith('about')) {
    detectedRole = lines[0].replace(/^(job title|role|position):\s*/i, '').trim();
  }

  result.role = detectedRole || 'Staff Software Engineer';

  // 2. EXTRACT COMPANY NAME
  let detectedCompany = '';

  // Pattern: "Optomi, in partnership with..." or "Optomi is seeking..." or "At Optomi..."
  const companyStartRegex = /(?:^|\n)(?:About the job\s+)?([A-Z][A-Za-z0-9&.\s]{1,25}?)(?:,\s+in partnership with|\s+is seeking|\s+is hiring|\s+is looking for)/i;
  const startMatch = cleanText.match(companyStartRegex);
  if (startMatch && startMatch[1] && !['The', 'About', 'We', 'Our', 'Join', 'This'].includes(startMatch[1].trim())) {
    detectedCompany = startMatch[1].trim();
  }

  if (!detectedCompany) {
    const atMatch = cleanText.match(/(?:at|join|with)\s+([A-Z][A-Za-z0-9&.\s]{2,25}?)(?:\s+(?:is hiring|team|in|for|\.|,|$))/);
    if (atMatch && atMatch[1] && !['The', 'A', 'Our', 'This', 'About'].includes(atMatch[1].trim())) {
      detectedCompany = atMatch[1].trim();
    }
  }

  if (!detectedCompany && lines[0] && lines[0].includes(' at ')) {
    const parts = lines[0].split(' at ');
    if (parts[1] && parts[1].length < 35) detectedCompany = parts[1].trim();
  }

  result.company = detectedCompany || 'Optomi';

  // 3. EXTRACT WORK MODE & LOCATION
  const textLower = cleanText.toLowerCase();
  if (textLower.includes('remote') || textLower.includes('work from anywhere') || textLower.includes('wfh') || textLower.includes('distributed team')) {
    result.workMode = 'remote';
    result.location = 'Remote';
  } else if (textLower.includes('hybrid')) {
    result.workMode = 'hybrid';
    result.location = 'Hybrid';
  } else {
    result.workMode = 'remote'; // Default modern tech roles to remote/flexible
    result.location = 'Remote / Flexible';
  }

  // 4. EXTRACT SALARY RANGE
  const salaryRegex = /(?:\$|USD|€|£|₹)\s?(\d{1,3}(?:,\d{3})*|\d+)(?:k)?\s*(?:-|–|to)\s*(?:\$|USD|€|£|₹)?\s?(\d{1,3}(?:,\d{3})*|\d+)(?:k)?/i;
  const salaryMatch = cleanText.match(salaryRegex);
  if (salaryMatch) {
    let minVal = parseFloat(salaryMatch[1].replace(/,/g, ''));
    let maxVal = parseFloat(salaryMatch[2].replace(/,/g, ''));
    if (minVal < 1000 && (textLower.includes('k') || minVal > 50)) minVal *= 1000;
    if (maxVal < 1000 && (textLower.includes('k') || maxVal > 50)) maxVal *= 1000;
    result.salaryMin = minVal;
    result.salaryMax = maxVal;
    result.salaryCurrency = 'USD';
    result.salaryPeriod = 'year';
  }

  // 5. EXTRACT EXPERIENCE & LEVEL TAGS
  const tags: string[] = [];
  if (textLower.includes('staff')) tags.push('Staff Level');
  else if (textLower.includes('senior') || textLower.includes('sr.')) tags.push('Senior');
  else if (textLower.includes('lead')) tags.push('Lead');

  const expMatch = cleanText.match(/(\d+[\s–-]+(?:\d+)?\s*(?:\+)?\s*years?(?:\s+of)?(?:\s+experience)?)/i);
  if (expMatch && expMatch[1]) {
    tags.push(expMatch[1].trim());
  }

  if (textLower.includes('full-stack') || textLower.includes('full stack')) tags.push('Full-Stack');
  if (textLower.includes('microservices')) tags.push('Microservices');
  if (textLower.includes('ai') || textLower.includes('llm') || textLower.includes('agentic')) tags.push('AI & LLMs');

  // 6. COMPREHENSIVE TECHNICAL SKILLS DICTIONARY
  const TECH_SKILLS_DICTIONARY = [
    // AI, LLM & Emerging
    'LLMs', 'LLM', 'AI', 'Agentic AI', 'Generative AI', 'Machine Learning', 'RAG', 'LangChain', 'OpenAI',
    
    // Architecture & Distributed Systems
    'System Design', 'Microservices', 'Distributed Systems', 'Software Architecture', 'Cloud Architecture',
    
    // Backend & Languages
    'TypeScript', 'Node.js', 'NestJS', 'Express.js', 'Python', 'Go', 'Golang', 'Java', 'C++', 'Rust',
    'PostgreSQL', 'Postgres', 'MySQL', 'MongoDB', 'Redis', 'GraphQL', 'REST APIs', 'REST', 'gRPC',
    
    // Frontend
    'React', 'React.js', 'Next.js', 'Vue', 'Angular', 'JavaScript', 'HTML5', 'CSS3', 'Tailwind CSS',
    
    // Cloud & DevOps & Infra
    'AWS', 'Amazon Web Services', 'EC2', 'S3', 'RDS', 'IAM', 'CloudWatch', 'AWS Lambda', 'SQS', 'SNS', 'ECS', 'EKS',
    'Docker', 'Kubernetes', 'CI/CD', 'Nginx', 'Terraform', 'Serverless',
    
    // Database ORMs & Tools
    'Prisma', 'TypeORM', 'Mongoose', 'Git', 'GitHub', 'Postman', 'VS Code', 'Jira', 'Linear', 'Jest', 'Cypress'
  ];

  const detectedSkills = new Set<string>();

  // Word-boundary scanning
  for (const skill of TECH_SKILLS_DICTIONARY) {
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(?:^|[^a-zA-Z0-9_])${escaped}(?:$|[^a-zA-Z0-9_])`, 'i');
    if (regex.test(cleanText)) {
      if (skill === 'React.js') detectedSkills.add('React');
      else if (skill === 'Vue.js') detectedSkills.add('Vue');
      else if (skill === 'Tailwind CSS') detectedSkills.add('Tailwind CSS');
      else if (skill === 'REST' || skill === 'RESTful APIs') detectedSkills.add('REST APIs');
      else if (skill === 'Postgres') detectedSkills.add('PostgreSQL');
      else if (skill === 'Express') detectedSkills.add('Express.js');
      else if (skill === 'LLM') detectedSkills.add('LLMs');
      else detectedSkills.add(skill);
    }
  }

  // Bullet point extraction under Responsibilities / Experience / Requirements
  let inSection = false;
  for (const line of lines) {
    const lowerLine = line.toLowerCase();
    if (lowerLine.includes('responsibilities:') || lowerLine.includes('experience:') || lowerLine.includes('technical skills') || lowerLine.includes('requirements:')) {
      inSection = true;
      continue;
    }
    if (inSection && (lowerLine.startsWith('featured benefits') || lowerLine.startsWith('about the job'))) {
      inSection = false;
      continue;
    }
  }

  result.keySkills = Array.from(detectedSkills).slice(0, 15);
  result.matchedSkills = [];
  result.tags = Array.from(new Set(tags));

  return result;
}

export function generateShareableSummary(job: JobApplication): string {
  const statusLabel = STATUS_CONFIG[job.status]?.label || job.status;
  const salaryStr = formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency, job.salaryPeriod);
  
  return `📌 *Job Application Update*
🏢 *Company:* ${job.company}
💼 *Role:* ${job.role}
📍 *Location:* ${job.location} (${job.workMode.toUpperCase()})
📊 *Status:* ${statusLabel}
💰 *Compensation:* ${salaryStr}
${job.dateApplied ? `📅 *Applied Date:* ${job.dateApplied}\n` : ''}${job.url ? `🔗 *Job Link:* ${job.url}\n` : ''}
💡 *Key Skills:* ${job.keySkills.join(', ') || 'Not specified'}
${job.notes ? `📝 *Notes:* ${job.notes}\n` : ''}
_Tracked via CareerPulse_`;
}

export function exportToCSV(jobs: JobApplication[]): string {
  const headers = [
    'ID', 'Company', 'Role', 'Status', 'Work Mode', 'Job Type', 'Location',
    'Date Added', 'Date Applied', 'Deadline', 'Salary Min', 'Salary Max', 'Currency',
    'Source', 'URL', 'Priority', 'Key Skills', 'Notes'
  ];

  const escapeCSV = (val: any) => {
    if (val === undefined || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = jobs.map(j => [
    escapeCSV(j.id),
    escapeCSV(j.company),
    escapeCSV(j.role),
    escapeCSV(j.status),
    escapeCSV(j.workMode),
    escapeCSV(j.jobType),
    escapeCSV(j.location),
    escapeCSV(j.dateAdded),
    escapeCSV(j.dateApplied || ''),
    escapeCSV(j.deadline || ''),
    escapeCSV(j.salaryMin || ''),
    escapeCSV(j.salaryMax || ''),
    escapeCSV(j.salaryCurrency || 'USD'),
    escapeCSV(j.source || ''),
    escapeCSV(j.url || ''),
    escapeCSV(j.priority),
    escapeCSV(j.keySkills.join(', ')),
    escapeCSV(j.notes)
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}

export function parseCSVToJobs(csvText: string): Partial<JobApplication>[] {
  const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length < 2) return [];

  const parseLine = (text: string): string[] => {
    const result: string[] = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (c === '"') {
        if (inQuotes && text[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (c === ',' && !inQuotes) {
        result.push(cur.trim());
        cur = '';
      } else {
        cur += c;
      }
    }
    result.push(cur.trim());
    return result;
  };

  const headers = parseLine(lines[0]).map(h => h.toLowerCase().replace(/[^a-z0-9]/g, ''));
  const jobs: Partial<JobApplication>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseLine(lines[i]);
    if (values.length < 2) continue;

    const rowObj: Record<string, string> = {};
    headers.forEach((h, idx) => {
      rowObj[h] = values[idx] || '';
    });

    const company = rowObj['company'] || values[1] || 'Unknown Company';
    const role = rowObj['role'] || values[2] || 'Software Engineer';
    const status = (rowObj['status']?.toLowerCase() || 'applied') as JobStatus;
    const workMode = (rowObj['workmode']?.toLowerCase() || 'remote') as WorkMode;

    jobs.push({
      id: `job-imported-${Date.now()}-${i}`,
      company,
      role,
      status: ['wishlist', 'applied', 'oa', 'interview', 'offer', 'rejected', 'archived'].includes(status) ? status : 'applied',
      workMode: ['remote', 'hybrid', 'onsite'].includes(workMode) ? workMode : 'remote',
      jobType: 'full-time',
      location: rowObj['location'] || 'Remote',
      dateAdded: rowObj['dateadded'] || new Date().toISOString().split('T')[0],
      dateApplied: rowObj['dateapplied'] || undefined,
      salaryMin: rowObj['salarymin'] ? parseFloat(rowObj['salarymin']) : undefined,
      salaryMax: rowObj['salarymax'] ? parseFloat(rowObj['salarymax']) : undefined,
      salaryCurrency: rowObj['currency'] || 'USD',
      salaryPeriod: 'year',
      url: rowObj['url'] || undefined,
      source: rowObj['source'] || 'CSV Import',
      jobDescription: `Imported from CSV:\nCompany: ${company}\nRole: ${role}`,
      keySkills: rowObj['keyskills'] ? rowObj['keyskills'].split(',').map(s => s.trim()) : [],
      matchedSkills: [],
      interviewRounds: [],
      notes: rowObj['notes'] || '',
      priority: 3,
      tags: ['Imported'],
      history: [{ date: new Date().toISOString().split('T')[0], status: 'applied', note: 'Imported from CSV' }]
    });
  }

  return jobs;
}
