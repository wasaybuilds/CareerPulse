import React, { useState } from 'react';
import { Sparkles, X, Check } from 'lucide-react';
import { useJobs } from '../context/JobContext';
import { parseJobDescriptionText } from '../utils/helpers';
import type { JobStatus, WorkMode } from '../types/job';

export const SmartPasteModal: React.FC = () => {
  const { isSmartPasteOpen, setIsSmartPasteOpen, addJob, setSelectedJob } = useJobs();
  const [rawText, setRawText] = useState('');
  const [parsedData, setParsedData] = useState<any | null>(null);

  if (!isSmartPasteOpen) return null;

  const handleParse = () => {
    if (!rawText.trim()) return;
    const result = parseJobDescriptionText(rawText);
    setParsedData({
      company: result.company || 'Unknown Company',
      role: result.role || 'Software Engineer',
      location: result.location || 'Remote',
      workMode: (result.workMode || 'remote') as WorkMode,
      salaryMin: result.salaryMin,
      salaryMax: result.salaryMax,
      salaryCurrency: result.salaryCurrency || 'USD',
      keySkills: result.keySkills || [],
      status: 'wishlist' as JobStatus,
      jobDescription: rawText.trim()
    });
  };

  const handleSave = async () => {
    if (!parsedData) return;

    const newJob = await addJob({
      company: parsedData.company,
      role: parsedData.role,
      location: parsedData.location,
      workMode: parsedData.workMode,
      jobType: 'full-time',
      status: parsedData.status,
      dateApplied: parsedData.status === 'applied' ? new Date().toISOString().split('T')[0] : undefined,
      salaryMin: parsedData.salaryMin,
      salaryMax: parsedData.salaryMax,
      salaryCurrency: parsedData.salaryCurrency,
      salaryPeriod: 'year',
      source: 'Smart Paste',
      jobDescription: parsedData.jobDescription,
      keySkills: parsedData.keySkills,
      matchedSkills: [],
      interviewRounds: [],
      notes: 'Imported via Smart JD Parser',
      priority: 4,
      tags: ['Smart Extracted']
    });

    setIsSmartPasteOpen(false);
    setRawText('');
    setParsedData(null);
    setSelectedJob(newJob);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-2xl max-h-[92vh] bg-[#161b22] border border-zinc-800 rounded-xl shadow-2xl flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 bg-[#0d1117]/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Smart JD Auto-Extractor</h2>
              <p className="text-[11px] text-zinc-400">Paste any raw job posting text or email</p>
            </div>
          </div>

          <button
            onClick={() => {
              setIsSmartPasteOpen(false);
              setParsedData(null);
            }}
            className="p-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
          
          {!parsedData ? (
            <div className="space-y-3">
              <div>
                <label className="block font-medium text-zinc-300 mb-1">
                  Paste Raw Job Posting / JD Text:
                </label>
                <textarea
                  rows={10}
                  placeholder={`Paste full job description from LinkedIn, Indeed, Telegram, or email...
Example:
Senior React Engineer at Stripe
Location: San Francisco / Remote
Compensation: $160,000 - $210,000 / year
Requirements: React, TypeScript, GraphQL, Next.js, Node.js`}
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  className="w-full p-3 rounded-lg bg-[#0d1117] border border-zinc-800 text-zinc-200 text-xs font-mono focus:outline-none focus:border-indigo-500 leading-relaxed"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  disabled={!rawText.trim()}
                  onClick={handleParse}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold shadow-sm transition"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Extract Details</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3.5">
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-300 font-medium text-xs">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Details extracted from text</span>
                </div>
                <button
                  onClick={() => setParsedData(null)}
                  className="text-xs text-zinc-400 hover:text-zinc-200 underline"
                >
                  Edit text
                </button>
              </div>

              {/* Extracted Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">Company</label>
                  <input
                    type="text"
                    value={parsedData.company}
                    onChange={(e) => setParsedData({ ...parsedData, company: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-[#0d1117] border border-zinc-800 text-white font-medium"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Role Title</label>
                  <input
                    type="text"
                    value={parsedData.role}
                    onChange={(e) => setParsedData({ ...parsedData, role: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-[#0d1117] border border-zinc-800 text-white font-medium"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Work Mode</label>
                  <select
                    value={parsedData.workMode}
                    onChange={(e) => setParsedData({ ...parsedData, workMode: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-[#0d1117] border border-zinc-800 text-white"
                  >
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="onsite">On-Site</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Stage</label>
                  <select
                    value={parsedData.status}
                    onChange={(e) => setParsedData({ ...parsedData, status: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-[#0d1117] border border-zinc-800 text-white"
                  >
                    <option value="wishlist">Wishlist (Saved)</option>
                    <option value="applied">Applied</option>
                    <option value="oa">Assessment (OA)</option>
                    <option value="interview">Interviewing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Min Salary</label>
                  <input
                    type="number"
                    value={parsedData.salaryMin || ''}
                    onChange={(e) => setParsedData({ ...parsedData, salaryMin: parseFloat(e.target.value) || undefined })}
                    className="w-full px-3 py-1.5 rounded-lg bg-[#0d1117] border border-zinc-800 text-white"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Max Salary</label>
                  <input
                    type="number"
                    value={parsedData.salaryMax || ''}
                    onChange={(e) => setParsedData({ ...parsedData, salaryMax: parseFloat(e.target.value) || undefined })}
                    className="w-full px-3 py-1.5 rounded-lg bg-[#0d1117] border border-zinc-800 text-white"
                  />
                </div>
              </div>

              {/* Detected Skills */}
              <div>
                <label className="block text-zinc-400 mb-1">Detected Skills:</label>
                <div className="flex flex-wrap gap-1 p-2.5 rounded-lg bg-[#0d1117] border border-zinc-800">
                  {parsedData.keySkills.length === 0 ? (
                    <span className="text-zinc-500">No skills detected automatically</span>
                  ) : (
                    parsedData.keySkills.map((s: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 text-[11px]"
                      >
                        {s}
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setParsedData(null)}
                  className="px-3.5 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 font-medium"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-sm"
                >
                  Save to Pipeline
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
