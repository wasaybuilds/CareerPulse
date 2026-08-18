import type { JobApplication, JobStatus, WorkMode, MetricSummary } from '../types/job';

export const STATUS_CONFIG: Record<JobStatus, {
  label: string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
  lightBg: string;
  dotColor: string;
  description: string;
}> = {
  wishlist: {
    label: 'Wishlist / Saved',
    badgeBg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    badgeText: 'text-rose-400',
    borderColor: 'border-rose-500/40',
    lightBg: 'bg-rose-950/20',
    dotColor: 'bg-rose-400',
    description: 'Jobs you plan to apply to or are tracking'
  },
  applied: {
    label: 'Applied',
    badgeBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    badgeText: 'text-cyan-400',
    borderColor: 'border-cyan-500/40',
    lightBg: 'bg-cyan-950/20',
    dotColor: 'bg-cyan-400',
    description: 'Submitted application, waiting for response'
  },
  oa: {
    label: 'Assessment (OA)',
    badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    badgeText: 'text-amber-400',
    borderColor: 'border-amber-500/40',
    lightBg: 'bg-amber-950/20',
    dotColor: 'bg-amber-400',
    description: 'Take-home assignment or HackerRank / LeetCode OA'
  },
  interview: {
    label: 'Interviewing',
    badgeBg: 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/30',
    badgeText: 'text-fuchsia-400',
    borderColor: 'border-fuchsia-500/40',
    lightBg: 'bg-fuchsia-950/20',
    dotColor: 'bg-fuchsia-400',
    description: 'Active interview rounds in progress'
  },
  offer: {
    label: 'Offer Received 🎉',
    badgeBg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
    badgeText: 'text-emerald-300',
    borderColor: 'border-emerald-500/50',
    lightBg: 'bg-emerald-950/30',
    dotColor: 'bg-emerald-400',
    description: 'Congratulations! Official job offer made'
  },
  rejected: {
    label: 'Rejected',
    badgeBg: 'bg-slate-500/10 text-slate-400 border-slate-700/50',
    badgeText: 'text-slate-400',
    borderColor: 'border-slate-700/50',
    lightBg: 'bg-slate-900/40',
    dotColor: 'bg-slate-500',
    description: 'Application was not selected'
  },
  archived: {
    label: 'Archived / Ghosted',
    badgeBg: 'bg-zinc-500/10 text-zinc-400 border-zinc-700/40',
    badgeText: 'text-zinc-400',
    borderColor: 'border-zinc-700/40',
    lightBg: 'bg-zinc-950/20',
    dotColor: 'bg-zinc-500',
    description: 'Closed, withdrawn, or no response for 30+ days'
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
  if (!min && !max) return 'Salary undisclosed';

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
  return 'Salary undisclosed';
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
  result.keySkills = Array.from(detectedSkills).slice(0, 10);
  result.matchedSkills = [];

  return result;
}

export function generateShareableSummary(job: JobApplication): string {
  const statusLabel = STATUS_CONFIG[job.status]?.label || job.status;
  const salaryStr = formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency, job.salaryPeriod);
  
  return `🍉 *Job Application Update*
🏢 *Company:* ${job.company}
💼 *Role:* ${job.role}
📍 *Location:* ${job.location} (${job.workMode.toUpperCase()})
📊 *Status:* ${statusLabel}
💰 *Compensation:* ${salaryStr}
${job.dateApplied ? `📅 *Applied Date:* ${job.dateApplied}\n` : ''}${job.url ? `🔗 *Job Link:* ${job.url}\n` : ''}
💡 *Key Skills:* ${job.keySkills.join(', ') || 'Not specified'}
${job.notes ? `📝 *Notes:* ${job.notes}\n` : ''}
_Tracked via CareerPulse 🍉_`;
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
