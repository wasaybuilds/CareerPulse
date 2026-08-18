import React, { useState, useEffect } from 'react';
import { Sparkles, X, Check, Link2 } from 'lucide-react';
import { useJobs } from '../context/JobContext';
import { parseJobDescriptionText } from '../utils/helpers';
import type { JobStatus, WorkMode } from '../types/job';

export const SmartPasteModal: React.FC = () => {
  const { isSmartPasteOpen, setIsSmartPasteOpen, addJob, setSelectedJob } = useJobs();
  const [rawText, setRawText] = useState('');
  const [parsedData, setParsedData] = useState<any | null>(null);

  // Reset modal state every time it opens
  useEffect(() => {
    if (isSmartPasteOpen) {
      setRawText('');
      setParsedData(null);
    }
  }, [isSmartPasteOpen]);

  if (!isSmartPasteOpen) return null;

  const handleParse = () => {
    if (!rawText.trim()) return;
    const result = parseJobDescriptionText(rawText);

    // Extract URL if present in raw text
    const urlMatch = rawText.match(/https?:\/\/[^\s]+/i);

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
      url: urlMatch ? urlMatch[0] : '',
      jobDescription: rawText.trim()
    });
  };

  const handleSave = async () => {
    if (!parsedData) return;

    let formattedUrl = parsedData.url?.trim();
    if (formattedUrl && !formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`;
    }

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
      url: formattedUrl || undefined,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
      <div 
        className="relative w-full max-w-2xl max-h-[92vh] bg-white border border-slate-200 rounded-2xl shadow-xl flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Smart JD Auto-Extractor</h2>
              <p className="text-[11px] text-slate-500">Paste any raw job posting text or email to auto-fill</p>
            </div>
          </div>

          <button
            onClick={() => {
              setIsSmartPasteOpen(false);
              setParsedData(null);
            }}
            className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-400 hover:text-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs bg-slate-50/30">
          
          {!parsedData ? (
            <div className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
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
                  className="w-full p-3.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-mono focus:outline-none focus:border-indigo-500 leading-relaxed shadow-2xs"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  disabled={!rawText.trim()}
                  onClick={handleParse}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold shadow-sm shadow-indigo-200 transition"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Extract Job Details</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Job Details Extracted Successfully!</span>
                </div>
                <button
                  onClick={() => setParsedData(null)}
                  className="text-xs text-slate-500 hover:text-slate-800 underline font-medium"
                >
                  Edit raw text
                </button>
              </div>

              {/* Extracted Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Company</label>
                  <input
                    type="text"
                    value={parsedData.company}
                    onChange={(e) => setParsedData({ ...parsedData, company: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1">Role Title</label>
                  <input
                    type="text"
                    value={parsedData.role}
                    onChange={(e) => setParsedData({ ...parsedData, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1">Work Mode</label>
                  <select
                    value={parsedData.workMode}
                    onChange={(e) => setParsedData({ ...parsedData, workMode: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 font-semibold"
                  >
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="onsite">On-Site</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1">Stage</label>
                  <select
                    value={parsedData.status}
                    onChange={(e) => setParsedData({ ...parsedData, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 font-semibold"
                  >
                    <option value="wishlist">Wishlist (Planning to apply)</option>
                    <option value="applied">Applied</option>
                    <option value="oa">Assessment (OA)</option>
                    <option value="interview">Interviewing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1">Min Salary</label>
                  <input
                    type="number"
                    value={parsedData.salaryMin || ''}
                    onChange={(e) => setParsedData({ ...parsedData, salaryMin: parseFloat(e.target.value) || undefined })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1">Max Salary</label>
                  <input
                    type="number"
                    value={parsedData.salaryMax || ''}
                    onChange={(e) => setParsedData({ ...parsedData, salaryMax: parseFloat(e.target.value) || undefined })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 font-bold"
                  />
                </div>
              </div>

              {/* Job URL Field */}
              <div>
                <label className="block text-slate-600 font-bold mb-1 flex items-center gap-1.5">
                  <Link2 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Job Application URL / Posting Link</span>
                </label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/jobs/view/... or careers site link"
                  value={parsedData.url || ''}
                  onChange={(e) => setParsedData({ ...parsedData, url: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Detected Skills */}
              <div>
                <label className="block text-slate-600 font-bold mb-1">Detected Skills:</label>
                <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-white border border-slate-200">
                  {parsedData.keySkills.length === 0 ? (
                    <span className="text-slate-400">No skills detected automatically</span>
                  ) : (
                    parsedData.keySkills.map((s: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-800 font-bold text-xs border border-indigo-100"
                      >
                        {s}
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setParsedData(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-sm shadow-indigo-200"
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
