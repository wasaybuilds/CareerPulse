import React, { useState } from 'react';
import { X, Copy, Check, Share2 } from 'lucide-react';
import { useJobs } from '../context/JobContext';
import { generateShareableSummary } from '../utils/helpers';

export const ShareSummaryModal: React.FC = () => {
  const { isShareModalOpen, setIsShareModalOpen, sharingJob, setSharingJob } = useJobs();
  const [copied, setCopied] = useState(false);

  if (!isShareModalOpen || !sharingJob) return null;

  const summaryText = generateShareableSummary(sharingJob);

  const handleCopy = () => {
    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
      <div 
        className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-xl flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Share Job Application</h2>
              <p className="text-[11px] text-slate-500">Formatted update for Telegram, WhatsApp or Discord</p>
            </div>
          </div>

          <button
            onClick={() => {
              setIsShareModalOpen(false);
              setSharingJob(null);
            }}
            className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-400 hover:text-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs bg-slate-50/30">
          <textarea
            rows={10}
            readOnly
            value={summaryText}
            className="w-full p-3.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-mono focus:outline-none leading-relaxed shadow-2xs"
          />

          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setIsShareModalOpen(false);
                setSharingJob(null);
              }}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold"
            >
              Close
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-sm shadow-indigo-200 transition"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Summary</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
