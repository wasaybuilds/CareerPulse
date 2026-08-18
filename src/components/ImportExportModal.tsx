import React, { useState, useRef } from 'react';
import { 
  X, 
  Download, 
  Upload, 
  FileSpreadsheet, 
  FileText, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import { useJobs } from '../context/JobContext';
import { exportToCSV, parseCSVToJobs } from '../utils/helpers';

export const ImportExportModal: React.FC = () => {
  const { isImportExportOpen, setIsImportExportOpen, jobs, importJobs } = useJobs();
  const [importStatus, setImportStatus] = useState<{ count?: number; error?: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isImportExportOpen) return null;

  const handleExportCSV = () => {
    const csvContent = exportToCSV(jobs);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `careerpulse_jobs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJSON = () => {
    const jsonContent = JSON.stringify(jobs, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `careerpulse_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        let importedJobs: any[] = [];

        if (file.name.endsWith('.json')) {
          importedJobs = JSON.parse(text);
        } else if (file.name.endsWith('.csv')) {
          importedJobs = parseCSVToJobs(text);
        } else {
          setImportStatus({ error: 'Please upload a valid .csv or .json file' });
          return;
        }

        if (Array.isArray(importedJobs) && importedJobs.length > 0) {
          importJobs(importedJobs);
          setImportStatus({ count: importedJobs.length });
        } else {
          setImportStatus({ error: 'No valid job records found in file' });
        }
      } catch (err: any) {
        setImportStatus({ error: `Parsing error: ${err.message}` });
      }
    };
    reader.readAsText(file);
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
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Import & Export Applications</h2>
              <p className="text-[11px] text-slate-500">Sync with Google Sheets, Excel or JSON files</p>
            </div>
          </div>

          <button
            onClick={() => {
              setIsImportExportOpen(false);
              setImportStatus(null);
            }}
            className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-400 hover:text-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs bg-slate-50/30">
          
          {/* Status Feedback */}
          {importStatus?.count && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-emerald-800 font-bold">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Successfully imported {importStatus.count} applications!</span>
            </div>
          )}

          {importStatus?.error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-rose-700 font-semibold">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{importStatus.error}</span>
            </div>
          )}

          {/* Export Section */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2.5 shadow-2xs">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Download className="w-4 h-4 text-indigo-600" />
              <span>Export Applications</span>
            </h3>
            <p className="text-slate-500 text-[11px]">
              Download your current pipeline of {jobs.length} jobs to open in Google Sheets or backup.
            </p>

            <div className="flex gap-2 pt-1">
              <button
                onClick={handleExportCSV}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold flex items-center justify-center gap-1.5 transition"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>Export CSV (Sheets)</span>
              </button>

              <button
                onClick={handleExportJSON}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold flex items-center justify-center gap-1.5 transition"
              >
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>Export JSON Backup</span>
              </button>
            </div>
          </div>

          {/* Import Section */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2.5 shadow-2xs">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Upload className="w-4 h-4 text-indigo-600" />
              <span>Import Existing Applications</span>
            </h3>
            <p className="text-slate-500 text-[11px]">
              Upload a previously exported CSV file from sheets or a JSON backup to populate your pipeline.
            </p>

            <input
              type="file"
              ref={fileInputRef}
              accept=".csv,.json"
              onChange={handleFileUpload}
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center justify-center gap-2 shadow-sm shadow-indigo-200 transition"
            >
              <Upload className="w-4 h-4" />
              <span>Upload CSV / JSON File</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
