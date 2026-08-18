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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-3xl max-h-[92vh] bg-[#090e15] border border-rose-500/20 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-white/[0.08] bg-[#0d141e]/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Smart JD Paste & Auto-Extractor</h2>
              <p className="text-xs text-slate-400">Paste any raw job description or email to extract details instantly</p>
            </div>
          </div>

          <button
            onClick={() => {
              setIsSmartPasteOpen(false);
              setParsedData(null);
            }}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs">
          
          {!parsedData ? (
            <div className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-300 mb-1.5">
                  Paste Raw Job Posting / JD Text:
                </label>
                <textarea
                  rows={12}
                  placeholder={`Paste full job description from LinkedIn, Indeed, Telegram, WhatsApp, or email...
Example:
Senior React Engineer at Stripe
Location: San Francisco / Remote
Compensation: $160,000 - $210,000 / year
Requirements: React, TypeScript, GraphQL, Next.js, Node.js`}
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  className="w-full p-4 rounded-xl bg-[#0d141e] border border-white/[0.08] text-slate-200 text-xs font-mono focus:outline-none focus:border-rose-500 leading-relaxed"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  disabled={!rawText.trim()}
                  onClick={handleParse}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff2d55] to-[#ff477e] hover:from-[#ff1a47] hover:to-[#ff3864] disabled:opacity-50 text-white font-bold shadow-lg shadow-rose-500/25 transition"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Extract Job Fields</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-300 font-semibold">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Job Details Successfully Extracted!</span>
                </div>
                <button
                  onClick={() => setParsedData(null)}
                  className="text-xs text-slate-400 hover:text-slate-200 underline"
                >
                  Edit Raw Text
                </button>
              </div>

              {/* Extracted Fields Preview Form */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Company</label>
                  <input
                    type="text"
                    value={parsedData.company}
                    onChange={(e) => setParsedData({ ...parsedData, company: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0d141e] border border-white/[0.08] text-white font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Role Title</label>
                  <input
                    type="text"
                    value={parsedData.role}
                    onChange={(e) => setParsedData({ ...parsedData, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0d141e] border border-white/[0.08] text-white font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Work Mode</label>
                  <select
                    value={parsedData.workMode}
                    onChange={(e) => setParsedData({ ...parsedData, workMode: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0d141e] border border-white/[0.08] text-white"
                  >
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="onsite">On-Site</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Pipeline Stage</label>
                  <select
                    value={parsedData.status}
                    onChange={(e) => setParsedData({ ...parsedData, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0d141e] border border-white/[0.08] text-white"
                  >
                    <option value="wishlist">Wishlist / Saved</option>
                    <option value="applied">Applied</option>
                    <option value="oa">Assessment (OA)</option>
                    <option value="interview">Interviewing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Estimated Min Salary</label>
                  <input
                    type="number"
                    value={parsedData.salaryMin || ''}
                    onChange={(e) => setParsedData({ ...parsedData, salaryMin: parseFloat(e.target.value) || undefined })}
                    placeholder="Min salary"
                    className="w-full px-3 py-2 rounded-xl bg-[#0d141e] border border-white/[0.08] text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Estimated Max Salary</label>
                  <input
                    type="number"
                    value={parsedData.salaryMax || ''}
                    onChange={(e) => setParsedData({ ...parsedData, salaryMax: parseFloat(e.target.value) || undefined })}
                    placeholder="Max salary"
                    className="w-full px-3 py-2 rounded-xl bg-[#0d141e] border border-white/[0.08] text-white"
                  />
                </div>
              </div>

              {/* Detected Skills */}
              <div>
                <label className="block text-slate-400 font-medium mb-1">Detected Tech Skills:</label>
                <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-[#0d141e] border border-white/[0.08]">
                  {parsedData.keySkills.length === 0 ? (
                    <span className="text-slate-500">No specific skills detected automatically</span>
                  ) : (
                    parsedData.keySkills.map((s: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-lg bg-rose-500/15 text-rose-300 border border-rose-500/30 text-[11px] font-medium"
                      >
                        {s}
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setParsedData(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-medium"
                >
                  Back to Text
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#ff2d55] to-[#ff477e] hover:from-[#ff1a47] hover:to-[#ff3864] text-white font-bold shadow-lg shadow-rose-500/25 transition"
                >
                  Save to Pipeline & DB
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
