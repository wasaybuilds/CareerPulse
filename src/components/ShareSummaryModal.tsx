import React, { useState } from 'react';
import { Share2, X, Copy, Check } from 'lucide-react';
import { useJobs } from '../context/JobContext';
import { generateShareableSummary, formatSalary, STATUS_CONFIG } from '../utils/helpers';

export const ShareSummaryModal: React.FC = () => {
  const { isShareModalOpen, setIsShareModalOpen, sharingJob, setSharingJob } = useJobs();
  const [copied, setCopied] = useState(false);

  if (!isShareModalOpen || !sharingJob) return null;

  const summaryText = generateShareableSummary(sharingJob);
  const config = STATUS_CONFIG[sharingJob.status];

  const handleCopy = () => {
    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-lg bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Share Application Summary</h2>
              <p className="text-xs text-slate-400">Copy formatted update for Telegram, WhatsApp, or Slack groups</p>
            </div>
          </div>

          <button
            onClick={() => {
              setIsShareModalOpen(false);
              setSharingJob(null);
            }}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Card Body */}
        <div className="p-5 sm:p-6 space-y-4 text-xs">
          
          {/* Visual Snapshot Card */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-white text-sm">{sharingJob.role}</h3>
                <p className="text-slate-400 font-medium">{sharingJob.company} · {sharingJob.location}</p>
              </div>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${config.badgeBg}`}>
                {config.label}
              </span>
            </div>

            <div className="text-emerald-400 font-semibold text-xs">
              💰 {formatSalary(sharingJob.salaryMin, sharingJob.salaryMax, sharingJob.salaryCurrency, sharingJob.salaryPeriod)}
            </div>

            {sharingJob.keySkills && sharingJob.keySkills.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-1">
                {sharingJob.keySkills.map((s, i) => (
                  <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Formatted Text Box */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Formatted Group Message:
            </label>
            <textarea
              readOnly
              rows={8}
              value={summaryText}
              className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-mono text-[11px] leading-relaxed select-all"
            />
          </div>

          {/* Copy Button */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-lg shadow-emerald-600/30 transition w-full justify-center"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy for Chat / Group</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
