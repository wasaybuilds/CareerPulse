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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-lg bg-[#161b22] border border-zinc-800 rounded-xl shadow-2xl flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 bg-[#0d1117]/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Share Summary</h2>
              <p className="text-[11px] text-zinc-400">Formatted update for Telegram, WhatsApp or Discord</p>
            </div>
          </div>

          <button
            onClick={() => {
              setIsShareModalOpen(false);
              setSharingJob(null);
            }}
            className="p-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3 text-xs">
          <textarea
            rows={10}
            readOnly
            value={summaryText}
            className="w-full p-3 rounded-lg bg-[#0d1117] border border-zinc-800 text-zinc-200 text-xs font-mono focus:outline-none leading-relaxed"
          />

          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setIsShareModalOpen(false);
                setSharingJob(null);
              }}
              className="px-3.5 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 font-medium"
            >
              Close
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-sm transition"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
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
