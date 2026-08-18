import type { JobApplication, JobStatus, WorkMode, MetricSummary } from '../types/job';

export const STATUS_CONFIG: Record<JobStatus, {
  label: string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
  dotColor: string;
  description: string;
}> = {
  wishlist: {
    label: 'Wishlist',
    badgeBg: 'bg-slate-100 text-slate-700 border-slate-200',
    badgeText: 'text-slate-700',
    borderColor: 'border-slate-300',
    dotColor: 'bg-slate-500',
    description: 'Saved roles to apply to'
  },
  applied: {
    label: 'Applied',
    badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
    badgeText: 'text-blue-700',
    borderColor: 'border-blue-300',
    dotColor: 'bg-blue-600',
    description: 'Application submitted'
  },
  oa: {
    label: 'Assessment (OA)',
    badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
    badgeText: 'text-amber-700',
    borderColor: 'border-amber-300',
    dotColor: 'bg-amber-500',
    description: 'Online assessment / Take-home'
  },
  interview: {
    label: 'Interviewing',
    badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    badgeText: 'text-indigo-700',
    borderColor: 'border-indigo-300',
    dotColor: 'bg-indigo-600',
    description: 'Interview rounds in progress'
  },
  offer: {
    label: 'Offer Received 🎉',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-300 font-semibold',
    badgeText: 'text-emerald-700',
    borderColor: 'border-emerald-400',
    dotColor: 'bg-emerald-600',
    description: 'Official offer received'
  },
  rejected: {
    label: 'Rejected',
    badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
    badgeText: 'text-rose-700',
    borderColor: 'border-rose-200',
    dotColor: 'bg-rose-500',
    description: 'Application not selected'
  },
  archived: {
    label: 'Archived',
    badgeBg: 'bg-zinc-100 text-zinc-600 border-zinc-200',
    badgeText: 'text-zinc-600',
    borderColor: 'border-zinc-300',
    dotColor: 'bg-zinc-400',
    description: 'Closed or withdrawn'
  }
};

export const WORK_MODE_CONFIG: Record<WorkMode, { label: string; iconName: string }> = {
  remote: { label: 'Remote', iconName: 'Globe' },
  hybrid: { label: 'Hybrid', iconName: 'Building2' },
  onsite: { label: 'On-site', iconName: 'MapPin' }
};

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
    AUD: 'AU$'
  };
  const sym = symbolMap[currency] || `${currency} `;

  const formatNum = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 }) + 'k';
    }
    return num.toLocaleString();
  };

  const periodSuffix = period === 'year' ? '/yr' : period === 'month' ? '/mo' : '/hr';

  if (min && max) {
    if (min === max) return `${sym}${formatNum(min)}${periodSuffix}`;
    return `${sym}${formatNum(min)} - ${sym}${formatNum(max)}${periodSuffix}`;
  }
  if (min) return `From ${sym}${formatNum(min)}${periodSuffix}`;
  if (max) return `Up to ${sym}${formatNum(max)}${periodSuffix}`;
  return 'Undisclosed';
}

export function formatDate(dateStr?: string): string {
  if (!dateStr) return 'N/A';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
}

export function getDaysAgo(dateStr?: string): string {
  if (!dateStr) return '';
  const now = new Date();
  const past = new Date(dateStr);
  const diffTime = Math.abs(now.getTime() - past.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 30) return `${diffDays}d ago`;
  const diffMonths = Math.floor(diffDays / 30);
  return `${diffMonths}mo ago`;
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

export function parseJobDescriptionText(rawText: string): Partial<JobApplication> {
  const result: Partial<JobApplication> = {
    jobDescription: rawText.trim(),
    keySkills: [],
    tags: []
  };

  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length === 0) return result;

  if (lines.length > 0) {
    const firstLine = lines[0];
    if (firstLine.includes(' at ')) {
      const parts = firstLine.split(' at ');
      result.role = parts[0].trim();
      result.company = parts[1].trim();
    } else if (firstLine.includes(' - ')) {
      const parts = firstLine.split(' - ');
      result.company = parts[0].trim();
      result.role = parts[1].trim();
    } else {
      result.role = firstLine;
      if (lines[1] && lines[1].length < 40) {
        result.company = lines[1];
      }
    }
  }

  const textLower = rawText.toLowerCase();
  if (textLower.includes('remote') || textLower.includes('work from anywhere') || textLower.includes('wfh')) {
    result.workMode = 'remote';
    result.location = 'Remote';
  } else if (textLower.includes('hybrid')) {
    result.workMode = 'hybrid';
  } else {
    result.workMode = 'onsite';
  }

  const salaryRegex = /(?:\$|USD|€|£|₹)\s?(\d{1,3}(?:,\d{3})*|\d+)(?:k)?\s*(?:-|–|to)\s*(?:\$|USD|€|£|₹)?\s?(\d{1,3}(?:,\d{3})*|\d+)(?:k)?/i;
  const salaryMatch = rawText.match(salaryRegex);
  if (salaryMatch) {
    let minVal = parseFloat(salaryMatch[1].replace(/,/g, ''));
    let maxVal = parseFloat(salaryMatch[2].replace(/,/g, ''));
    if (minVal < 1000 && (rawText.toLowerCase().includes('k') || minVal > 50)) minVal *= 1000;
    if (maxVal < 1000 && (rawText.toLowerCase().includes('k') || maxVal > 50)) maxVal *= 1000;
    result.salaryMin = minVal;
    result.salaryMax = maxVal;
    result.salaryCurrency = 'USD';
    result.salaryPeriod = 'year';
  }

  const commonSkills = [
    'React', 'TypeScript', 'JavaScript', 'Next.js', 'Node.js', 'Python', 'Go', 'Golang',
    'Rust', 'Java', 'C++', 'C#', '.NET', 'AWS', 'GCP', 'Azure', 'Docker', 'Kubernetes',
    'GraphQL', 'REST API', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Tailwind',
    'Tailwind CSS', 'Redux', 'Zustand', 'Vue', 'Angular', 'Svelte', 'FastAPI', 'Django',
    'Spring Boot', 'Kafka', 'Elasticsearch', 'CI/CD', 'Git', 'System Design', 'Microservices'
  ];

  const detectedSkills = new Set<string>();
  for (const skill of commonSkills) {
    const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (regex.test(rawText)) {
      detectedSkills.add(skill);
    }
  }
  result.keySkills = Array.from(detectedSkills).slice(0, 8);
  result.matchedSkills = [];

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
