import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  Upload, 
  X, 
  Check, 
  Trash2,
  FileJson,
  RotateCcw
} from 'lucide-react';
import { useJobs } from '../context/JobContext';
import { exportToCSV, parseCSVToJobs } from '../utils/helpers';

export const ImportExportModal: React.FC = () => {
  const { 
    jobs, 
    isImportExportOpen, 
    setIsImportExportOpen, 
    importJobs, 
    clearAllData,
    resetToSampleData
  } = useJobs();

  const [importText, setImportText] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!isImportExportOpen) return null;

  const handleExportCSV = () => {
    const csvData = exportToCSV(jobs);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `careerpulse_job_tracker_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJSON = () => {
    const jsonData = JSON.stringify(jobs, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `careerpulse_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportCSVText = () => {
    if (!importText.trim()) return;
    try {
      if (importText.trim().startsWith('[')) {
        // JSON format
        const parsed = JSON.parse(importText);
        if (Array.isArray(parsed)) {
          const count = importJobs(parsed);
          setImportStatus(`Successfully imported ${count} jobs from JSON!`);
          setImportText('');
          return;
        }
      }

      // CSV format
      const parsedJobs = parseCSVToJobs(importText);
      if (parsedJobs.length === 0) {
        setImportStatus('No valid job rows found in the pasted data. Check column headers.');
        return;
      }
      const count = importJobs(parsedJobs);
      setImportStatus(`Successfully imported ${count} jobs from CSV!`);
      setImportText('');
    } catch (err: any) {
      setImportStatus(`Import error: ${err.message || 'Invalid format'}`);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setImportText(content);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-2xl max-h-[92vh] bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Import & Export Applications</h2>
              <p className="text-xs text-slate-400">Seamless integration with Google Sheets, Excel & JSON backups</p>
            </div>
          </div>

          <button
            onClick={() => setIsImportExportOpen(false)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 text-xs">
          
          {/* Export Options */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-2">Export Data</h3>
            <p className="text-slate-400 mb-3">Download your entire job pipeline to open in Excel, Google Sheets, or keep as an offline backup.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleExportCSV}
                className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 hover:bg-slate-800/80 transition flex items-center gap-3 text-left"
              >
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <Download className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-200">Export as CSV</h4>
                  <p className="text-[11px] text-slate-400">Compatible with Google Sheets & Excel</p>
                </div>
              </button>

              <button
                onClick={handleExportJSON}
                className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 hover:bg-slate-800/80 transition flex items-center gap-3 text-left"
              >
                <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                  <FileJson className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-200">Export Full JSON</h4>
                  <p className="text-[11px] text-slate-400">Complete raw database backup</p>
                </div>
              </button>
            </div>
          </div>

          <div className="h-px bg-slate-800"></div>

          {/* Import Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">Import from Spreadsheet / CSV / JSON</h3>
                <p className="text-slate-400 mt-0.5">Upload a CSV file or paste raw CSV lines below</p>
              </div>

              <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer font-medium">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload File</span>
                <input
                  type="file"
                  accept=".csv,.json,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <textarea
              rows={5}
              placeholder={`Paste CSV data here with headers:
Company,Role,Status,Location,Salary Min,Salary Max,URL,Notes
Stripe,Staff Engineer,applied,San Francisco,180000,240000,https://...`}
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-mono text-[11px] focus:outline-none focus:border-indigo-500"
            />

            {importStatus && (
              <div className="p-3 rounded-xl bg-slate-900 border border-indigo-500/30 text-indigo-300 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{importStatus}</span>
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="button"
                disabled={!importText.trim()}
                onClick={handleImportCSVText}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold shadow-md transition"
              >
                Import Jobs
              </button>
            </div>
          </div>

          <div className="h-px bg-slate-800"></div>

          {/* Danger Zone / Reset */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                if (confirm('Are you sure you want to delete ALL tracked jobs? This cannot be undone.')) {
                  clearAllData();
                  setIsImportExportOpen(false);
                }
              }}
              className="flex items-center gap-1.5 text-rose-400 hover:text-rose-300 font-medium"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All Data</span>
            </button>

            <button
              type="button"
              onClick={() => {
                resetToSampleData();
                setIsImportExportOpen(false);
              }}
              className="flex items-center gap-1.5 text-slate-400 hover:text-slate-200"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reload Sample Jobs</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
