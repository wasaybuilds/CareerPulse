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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
      <div 
        className="relative w-full max-w-xl max-h-[92vh] bg-white border border-slate-200 rounded-2xl shadow-xl flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Add New Job Application</h2>
              <p className="text-[11px] text-slate-500">Track and organize this job listing</p>
            </div>
          </div>

          <button
            onClick={() => setIsAddModalOpen(false)}
            className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-400 hover:text-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs bg-slate-50/30">
          
          {/* Row 1: Company & Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Company Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Stripe, OpenAI"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Job Title / Role *</label>
              <input
                type="text"
                required
                placeholder="e.g. Senior Frontend Engineer"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          {/* Row 2: Status & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Initial Stage</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as JobStatus)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-indigo-500 text-xs font-semibold"
              >
                <option value="wishlist">Wishlist (Planning to apply)</option>
                <option value="applied">Applied (Submitted)</option>
                <option value="oa">Assessment (OA / Take-home)</option>
                <option value="interview">Interviewing</option>
                <option value="offer">Offer Received 🎉</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Priority</label>
              <div className="flex items-center gap-1 py-1">
                {([1, 2, 3, 4, 5] as const).map(num => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setPriority(num)}
                    className="p-1"
                  >
                    <Star className={`w-4 h-4 ${num <= priority ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Row 3: Location, Work Mode & Job Type */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Location</label>
              <input
                type="text"
                placeholder="e.g. Remote / NYC"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Work Mode</label>
              <select
                value={workMode}
                onChange={(e) => setWorkMode(e.target.value as WorkMode)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-indigo-500 text-xs font-medium"
              >
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="onsite">On-Site</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Job Type</label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value as JobType)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-indigo-500 text-xs font-medium"
              >
                <option value="full-time">Full-Time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
                <option value="part-time">Part-Time</option>
              </select>
            </div>
          </div>

          {/* Row 4: Salary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Min Salary / Year</label>
              <input
                type="number"
                placeholder="e.g. 140000"
                value={salaryMin}
                onChange={(e) => setSalaryMin(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Max Salary / Year</label>
              <input
                type="number"
                placeholder="e.g. 180000"
                value={salaryMax}
                onChange={(e) => setSalaryMax(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Currency</label>
              <select
                value={salaryCurrency}
                onChange={(e) => setSalaryCurrency(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-indigo-500 text-xs font-medium"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
                <option value="CAD">CAD (CA$)</option>
              </select>
            </div>
          </div>

          {/* Applied Date Field */}
          {status !== 'wishlist' && (
            <div>
              <label className="block font-bold text-slate-700 mb-1">Date Applied</label>
              <input
                type="date"
                value={dateApplied}
                onChange={(e) => setDateApplied(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-indigo-500"
              />
            </div>
          )}

          {/* Row 5: URL, Source & Resume */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Posting URL</label>
              <input
                type="url"
                placeholder="https://..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Source</label>
              <input
                type="text"
                placeholder="LinkedIn, Referral"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Resume File Tag</label>
              <input
                type="text"
                placeholder="Resume_v2.pdf"
                value={resumeVersion}
                onChange={(e) => setResumeVersion(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Key Skills */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Key Skills (Comma separated)
            </label>
            <input
              type="text"
              placeholder="e.g. React, TypeScript, GraphQL, Node.js"
              value={keySkillsInput}
              onChange={(e) => setKeySkillsInput(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Job Description (JD) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-slate-700">
                Job Description
              </label>
              {jobDescription && (
                <button
                  type="button"
                  onClick={handleAutoExtractJD}
                  className="text-indigo-600 hover:text-indigo-700 flex items-center gap-1 font-semibold"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Auto-fill details from JD</span>
                </button>
              )}
            </div>
            <textarea
              rows={4}
              placeholder="Paste full job description..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full p-3 rounded-xl bg-white border border-slate-200 text-slate-800 focus:outline-none focus:border-indigo-500 font-sans text-xs"
            />
          </div>

          {/* Personal Notes */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Personal Notes</label>
            <textarea
              rows={2}
              placeholder="Strategy, contacts, thoughts..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 focus:outline-none focus:border-indigo-500 font-sans text-xs"
            />
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-sm shadow-indigo-200"
            >
              Save Application
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
