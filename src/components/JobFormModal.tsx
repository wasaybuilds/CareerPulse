import React, { useState } from 'react';
import { X, Briefcase, Sparkles, Star } from 'lucide-react';
import { useJobs } from '../context/JobContext';
import type { JobStatus, WorkMode, JobType } from '../types/job';
import { parseJobDescriptionText } from '../utils/helpers';

export const JobFormModal: React.FC = () => {
  const { isAddModalOpen, setIsAddModalOpen, addJob, setSelectedJob } = useJobs();

  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('Remote');
  const [workMode, setWorkMode] = useState<WorkMode>('remote');
  const [jobType, setJobType] = useState<JobType>('full-time');
  const [status, setStatus] = useState<JobStatus>('wishlist');
  const [dateApplied, setDateApplied] = useState('');
  const [salaryMin, setSalaryMin] = useState<string>('');
  const [salaryMax, setSalaryMax] = useState<string>('');
  const [salaryCurrency, setSalaryCurrency] = useState('USD');
  const [url, setUrl] = useState('');
  const [source, setSource] = useState('LinkedIn');
  const [resumeVersion, setResumeVersion] = useState('');
  const [keySkillsInput, setKeySkillsInput] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [priority, setPriority] = useState<1 | 2 | 3 | 4 | 5>(3);

  if (!isAddModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !role.trim()) return;

    const keySkills = keySkillsInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const newJob = await addJob({
      company: company.trim(),
      role: role.trim(),
      location: location.trim() || 'Remote',
      workMode,
      jobType,
      status,
      dateApplied: (status === 'applied' && !dateApplied) ? new Date().toISOString().split('T')[0] : dateApplied || undefined,
      salaryMin: salaryMin ? parseFloat(salaryMin) : undefined,
      salaryMax: salaryMax ? parseFloat(salaryMax) : undefined,
      salaryCurrency,
      salaryPeriod: 'year',
      url: url.trim() || undefined,
      source: source.trim() || 'Direct',
      jobDescription: jobDescription.trim() || `Position for ${role} at ${company}.`,
      keySkills,
      matchedSkills: [],
      resumeVersion: resumeVersion.trim() || undefined,
      interviewRounds: [],
      notes: notes.trim(),
      priority,
      tags: [workMode.toUpperCase(), jobType.toUpperCase()]
    });

    setIsAddModalOpen(false);
    setSelectedJob(newJob);
  };

  const handleAutoExtractJD = () => {
    if (!jobDescription) return;
    const parsed = parseJobDescriptionText(jobDescription);
    if (parsed.company && !company) setCompany(parsed.company);
    if (parsed.role && !role) setRole(parsed.role);
    if (parsed.workMode) setWorkMode(parsed.workMode);
    if (parsed.salaryMin && !salaryMin) setSalaryMin(parsed.salaryMin.toString());
    if (parsed.salaryMax && !salaryMax) setSalaryMax(parsed.salaryMax.toString());
    if (parsed.keySkills && parsed.keySkills.length > 0 && !keySkillsInput) {
      setKeySkillsInput(parsed.keySkills.join(', '));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-2xl max-h-[92vh] bg-[#090e15] border border-rose-500/20 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-white/[0.08] bg-[#0d141e]/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Add New Job Application</h2>
              <p className="text-xs text-slate-400">Fill in role details or paste the job description below</p>
            </div>
          </div>

          <button
            onClick={() => setIsAddModalOpen(false)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs">
          
          {/* Row 1: Company & Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Company Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Google, Stripe, OpenAI"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0d141e] border border-white/[0.08] text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Job Title / Role *</label>
              <input
                type="text"
                required
                placeholder="e.g. Senior Frontend Engineer"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0d141e] border border-white/[0.08] text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          {/* Row 2: Status & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Initial Pipeline Stage</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as JobStatus)}
                className="w-full px-3 py-2 rounded-xl bg-[#0d141e] border border-white/[0.08] text-white focus:outline-none focus:border-rose-500"
              >
                <option value="wishlist">Wishlist / Saved (Planning to apply)</option>
                <option value="applied">Applied (Submitted)</option>
                <option value="oa">Online Assessment / Take-Home</option>
                <option value="interview">Interviewing</option>
                <option value="offer">Offer Received 🎉</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Priority / Excitement</label>
              <div className="flex items-center gap-1.5 py-1">
                {([1, 2, 3, 4, 5] as const).map(num => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setPriority(num)}
                    className="p-1 hover:scale-110 transition"
                  >
                    <Star className={`w-5 h-5 ${num <= priority ? 'fill-amber-400 text-amber-400' : 'text-slate-700'}`} />
                  </button>
                ))}
                <span className="text-slate-400 ml-2 font-medium">({priority}/5)</span>
              </div>
            </div>
          </div>

          {/* Row 3: Location, Work Mode & Job Type */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Location</label>
              <input
                type="text"
                placeholder="e.g. San Francisco / Remote"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0d141e] border border-white/[0.08] text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Work Mode</label>
              <select
                value={workMode}
                onChange={(e) => setWorkMode(e.target.value as WorkMode)}
                className="w-full px-3 py-2 rounded-xl bg-[#0d141e] border border-white/[0.08] text-white focus:outline-none focus:border-rose-500"
              >
                <option value="remote">Remote (Worldwide/US)</option>
                <option value="hybrid">Hybrid</option>
                <option value="onsite">On-Site</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Job Type</label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value as JobType)}
                className="w-full px-3 py-2 rounded-xl bg-[#0d141e] border border-white/[0.08] text-white focus:outline-none focus:border-rose-500"
              >
                <option value="full-time">Full-Time</option>
                <option value="contract">Contract / Freelance</option>
                <option value="internship">Internship</option>
                <option value="part-time">Part-Time</option>
              </select>
            </div>
          </div>

          {/* Row 4: Salary & Currency */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Min Salary / Year</label>
              <input
                type="number"
                placeholder="e.g. 140000"
                value={salaryMin}
                onChange={(e) => setSalaryMin(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0d141e] border border-white/[0.08] text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Max Salary / Year</label>
              <input
                type="number"
                placeholder="e.g. 180000"
                value={salaryMax}
                onChange={(e) => setSalaryMax(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0d141e] border border-white/[0.08] text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Currency</label>
              <select
                value={salaryCurrency}
                onChange={(e) => setSalaryCurrency(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0d141e] border border-white/[0.08] text-white focus:outline-none focus:border-rose-500"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
                <option value="CAD">CAD (CA$)</option>
              </select>
            </div>
          </div>

          {/* Row 5: URL, Source & Resume version */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Posting URL</label>
              <input
                type="url"
                placeholder="https://..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0d141e] border border-white/[0.08] text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Job Board / Source</label>
              <input
                type="text"
                placeholder="e.g. LinkedIn, Referral, Indeed"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0d141e] border border-white/[0.08] text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Resume File Tag</label>
              <input
                type="text"
                placeholder="e.g. Resume_React_v2.pdf"
                value={resumeVersion}
                onChange={(e) => setResumeVersion(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0d141e] border border-white/[0.08] text-white focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          {/* Applied Date Field */}
          {status !== 'wishlist' && (
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Date Applied</label>
              <input
                type="date"
                value={dateApplied}
                onChange={(e) => setDateApplied(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0d141e] border border-white/[0.08] text-white focus:outline-none focus:border-rose-500"
              />
            </div>
          )}

          {/* Key Skills */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Key Skills (Comma separated)
            </label>
            <input
              type="text"
              placeholder="e.g. React, TypeScript, GraphQL, Tailwind, Node.js"
              value={keySkillsInput}
              onChange={(e) => setKeySkillsInput(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#0d141e] border border-white/[0.08] text-white focus:outline-none focus:border-rose-500"
            />
          </div>

          {/* Job Description (JD) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-slate-300">
                Job Description (JD)
              </label>
              {jobDescription && (
                <button
                  type="button"
                  onClick={handleAutoExtractJD}
                  className="text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Auto-fill fields from JD</span>
                </button>
              )}
            </div>
            <textarea
              rows={5}
              placeholder="Paste full job description here to keep a permanent archive..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full p-3 rounded-xl bg-[#0d141e] border border-white/[0.08] text-slate-200 focus:outline-none focus:border-rose-500 font-sans"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Personal Prep & Strategy Notes
            </label>
            <textarea
              rows={2}
              placeholder="Personal notes, referral info, salary strategy..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3 rounded-xl bg-[#0d141e] border border-white/[0.08] text-slate-200 focus:outline-none focus:border-rose-500 font-sans"
            />
          </div>

          {/* Footer Submit */}
          <div className="flex justify-end gap-3 pt-3 border-t border-white/[0.08]">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#ff2d55] to-[#ff477e] hover:from-[#ff1a47] hover:to-[#ff3864] text-white font-bold shadow-lg shadow-rose-500/25 transition"
            >
              Save to Pipeline & DB
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
