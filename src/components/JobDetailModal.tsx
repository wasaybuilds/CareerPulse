import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Share2, 
  Plus, 
  Clock, 
  User, 
  FileText, 
  Sparkles, 
  Edit3, 
  Trash2, 
  Check, 
  Star, 
  History,
  ExternalLink,
  Link2,
  Copy
} from 'lucide-react';
import { useJobs } from '../context/JobContext';
import type { JobStatus } from '../types/job';
import { formatSalary, formatDate, STATUS_CONFIG } from '../utils/helpers';

export const JobDetailModal: React.FC = () => {
  const { 
    selectedJob, 
    setSelectedJob, 
    updateJob, 
    updateJobStatus, 
    addInterviewRound, 
    updateInterviewRound, 
    deleteInterviewRound, 
    deleteJob,
    setSharingJob,
    setIsShareModalOpen
  } = useJobs();

  const [activeTab, setActiveTab] = useState<'jd' | 'skills' | 'interviews' | 'contacts' | 'history'>('jd');
  const [isEditingJD, setIsEditingJD] = useState(false);
  const [editedJD, setEditedJD] = useState('');
  
  // Job URL editing state
  const [isEditingURL, setIsEditingURL] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  // New interview round form state
  const [showAddRound, setShowAddRound] = useState(false);
  const [roundName, setRoundName] = useState('');
  const [roundDate, setRoundDate] = useState('');
  const [roundTime, setRoundTime] = useState('');
  const [roundInterviewer, setRoundInterviewer] = useState('');
  const [roundFormat, setRoundFormat] = useState<'video' | 'phone' | 'onsite' | 'take-home'>('video');
  const [roundNotes, setRoundNotes] = useState('');
  const [newSkillInput, setNewSkillInput] = useState('');

  if (!selectedJob) return null;

  const config = STATUS_CONFIG[selectedJob.status];

  const handleSaveJD = async () => {
    await updateJob(selectedJob.id, { jobDescription: editedJD });
    setIsEditingJD(false);
  };

  const handleSaveURL = async () => {
    let formattedUrl = urlInput.trim();
    if (formattedUrl && !formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`;
    }
    await updateJob(selectedJob.id, { url: formattedUrl || undefined });
    setIsEditingURL(false);
  };

  const handleCopyLink = () => {
    if (selectedJob.url) {
      navigator.clipboard.writeText(selectedJob.url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleAddRoundSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roundName || !roundDate) return;

    await addInterviewRound(selectedJob.id, {
      name: roundName,
      date: roundDate,
      time: roundTime || undefined,
      interviewer: roundInterviewer || undefined,
      format: roundFormat,
      notes: roundNotes || undefined,
      questionsAsked: [],
      status: 'scheduled'
    });

    setRoundName('');
    setRoundDate('');
    setRoundTime('');
    setRoundInterviewer('');
    setRoundNotes('');
    setShowAddRound(false);
  };

  const toggleSkillMatch = (skill: string) => {
    const currentMatched = selectedJob.matchedSkills || [];
    let updated: string[];
    if (currentMatched.includes(skill)) {
      updated = currentMatched.filter(s => s !== skill);
    } else {
      updated = [...currentMatched, skill];
    }
    updateJob(selectedJob.id, { matchedSkills: updated });
  };

  const handleAddNewSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillInput.trim()) return;
    const trimmed = newSkillInput.trim();
    const updatedSkills = Array.from(new Set([...selectedJob.keySkills, trimmed]));
    updateJob(selectedJob.id, { keySkills: updatedSkills });
    setNewSkillInput('');
  };

  const removeSkill = (skillToRemove: string) => {
    const updatedKeySkills = selectedJob.keySkills.filter(s => s !== skillToRemove);
    const updatedMatchedSkills = (selectedJob.matchedSkills || []).filter(s => s !== skillToRemove);
    updateJob(selectedJob.id, {
      keySkills: updatedKeySkills,
      matchedSkills: updatedMatchedSkills
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] bg-white border border-slate-200 rounded-2xl shadow-xl flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50/70 flex items-start justify-between gap-3 shrink-0">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-base font-bold text-slate-900">{selectedJob.role}</h2>
              <div className="flex items-center text-amber-500 text-xs">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => updateJob(selectedJob.id, { priority: (i + 1) as any })}
                    className="p-0.5"
                    title={`Set Priority ${i + 1}`}
                  >
                    <Star className={`w-3.5 h-3.5 ${i < selectedJob.priority ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 mt-1 text-xs text-slate-600">
              <span className="font-bold text-slate-900">{selectedJob.company}</span>
              <span>•</span>
              <span className="flex items-center gap-1 font-medium">
                <MapPin className="w-3 h-3 text-slate-400" />
                {selectedJob.location} ({selectedJob.workMode})
              </span>
              <span>•</span>
              <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {formatSalary(selectedJob.salaryMin, selectedJob.salaryMax, selectedJob.salaryCurrency, selectedJob.salaryPeriod)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                setSharingJob(selectedJob);
                setIsShareModalOpen(true);
              }}
              className="p-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 transition"
              title="Share summary"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>

            {selectedJob.url && (
              <a
                href={selectedJob.url}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-blue-600 transition"
                title="Open job URL"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            <button
              onClick={() => setSelectedJob(null)}
              className="p-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-400 hover:text-slate-700 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stage Switcher Bar */}
        <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Pipeline Stage:</span>
            <select
              value={selectedJob.status}
              onChange={(e) => updateJobStatus(selectedJob.id, e.target.value as JobStatus)}
              aria-label={`Current Pipeline Stage for ${selectedJob.role}`}
              className={`font-semibold px-2.5 py-1 rounded-md border cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500 ${config.badgeBg}`}
            >
              {Object.entries(STATUS_CONFIG).map(([key, item]) => (
                <option key={key} value={key} className="bg-white text-slate-800 font-medium">
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 text-slate-500 text-[11px] font-medium">
            {selectedJob.dateApplied && (
              <span>Applied: <strong className="text-slate-800">{formatDate(selectedJob.dateApplied)}</strong></span>
            )}
            {selectedJob.resumeVersion && (
              <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 font-semibold">
                Resume: {selectedJob.resumeVersion}
              </span>
            )}
          </div>
        </div>

        {/* Dedicated Job Link URL Bar */}
        <div className="px-5 py-2 bg-indigo-50/40 border-b border-slate-200 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Link2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span className="text-slate-600 font-semibold shrink-0">Job Link:</span>

            {isEditingURL ? (
              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                <input
                  type="url"
                  placeholder="https://linkedin.com/jobs/view/... or careers site link"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="flex-1 px-2.5 py-1 text-xs rounded-md bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-indigo-500"
                  autoFocus
                />
                <button
                  onClick={handleSaveURL}
                  className="px-2.5 py-1 rounded-md bg-indigo-600 text-white font-bold hover:bg-indigo-700 text-xs shrink-0"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditingURL(false)}
                  className="px-2 py-1 rounded-md bg-slate-200 text-slate-700 font-medium text-xs shrink-0"
                >
                  Cancel
                </button>
              </div>
            ) : selectedJob.url ? (
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <a
                  href={selectedJob.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-600 hover:text-indigo-800 font-semibold underline truncate max-w-md"
                  title={selectedJob.url}
                >
                  {selectedJob.url}
                </a>

                <button
                  onClick={handleCopyLink}
                  className="p-1 text-slate-500 hover:text-slate-800 rounded hover:bg-slate-200/60"
                  title="Copy URL"
                >
                  {copiedLink ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                </button>

                <button
                  onClick={() => {
                    setUrlInput(selectedJob.url || '');
                    setIsEditingURL(true);
                  }}
                  className="text-[11px] text-slate-500 hover:text-slate-800 font-medium underline shrink-0"
                >
                  Edit
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setUrlInput('');
                  setIsEditingURL(true);
                }}
                className="text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-1 text-xs"
              >
                <Plus className="w-3 h-3" />
                <span>Add Job Application Link</span>
              </button>
            )}
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="flex border-b border-slate-200 px-5 bg-white shrink-0 text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('jd')}
            className={`py-3 px-3.5 font-semibold border-b-2 transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'jd'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Job Description</span>
          </button>

          <button
            onClick={() => setActiveTab('skills')}
            className={`py-3 px-3.5 font-semibold border-b-2 transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'skills'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Skills Match ({selectedJob.matchedSkills?.length || 0}/{selectedJob.keySkills?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('interviews')}
            className={`py-3 px-3.5 font-semibold border-b-2 transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'interviews'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Interviews ({selectedJob.interviewRounds?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('contacts')}
            className={`py-3 px-3.5 font-semibold border-b-2 transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'contacts'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Contacts</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`py-3 px-3.5 font-semibold border-b-2 transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'history'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>History</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs bg-slate-50/40">
          
          {/* TAB 1: Job Description */}
          {activeTab === 'jd' && (
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">Job Description Details</span>

                {isEditingJD ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsEditingJD(false)}
                      className="px-2.5 py-1 text-xs rounded-md bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveJD}
                      className="px-3 py-1 text-xs rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-700 flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" />
                      <span>Save</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setEditedJD(selectedJob.jobDescription || '');
                      setIsEditingJD(true);
                    }}
                    className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 font-semibold"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Edit JD</span>
                  </button>
                )}
              </div>

              {isEditingJD ? (
                <textarea
                  value={editedJD}
                  onChange={(e) => setEditedJD(e.target.value)}
                  rows={12}
                  className="w-full p-3.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-mono focus:outline-none focus:border-indigo-500 leading-relaxed shadow-2xs"
                />
              ) : (
                <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 leading-relaxed whitespace-pre-wrap font-sans max-h-[350px] overflow-y-auto shadow-2xs">
                  {selectedJob.jobDescription || 'No job description provided.'}
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="block text-slate-700 mb-1 font-semibold">
                  Personal Notes & Strategy
                </label>
                <textarea
                  value={selectedJob.notes}
                  onChange={(e) => updateJob(selectedJob.id, { notes: e.target.value })}
                  rows={2}
                  className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-indigo-500 shadow-2xs"
                  placeholder="Notes, interview tips, salary strategy..."
                />
              </div>
            </div>
          )}

          {/* TAB 2: Skills Match */}
          {activeTab === 'skills' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-white p-3.5 rounded-xl border border-slate-200">
                <span className="text-slate-600 font-medium">JD Skill Matching Score:</span>
                <span className="font-bold text-indigo-600 text-sm">
                  {selectedJob.keySkills.length > 0 ? Math.round(((selectedJob.matchedSkills?.length || 0) / selectedJob.keySkills.length) * 100) : 0}% Match
                </span>
              </div>

              {/* Skills Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {selectedJob.keySkills.map(skill => {
                  const isMatched = selectedJob.matchedSkills?.includes(skill);
                  return (
                    <div
                      key={skill}
                      onClick={() => toggleSkillMatch(skill)}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition select-none ${
                        isMatched
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-2xs font-semibold'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 shadow-2xs'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-4 h-4 rounded flex items-center justify-center ${
                          isMatched ? 'bg-emerald-600 text-white font-bold' : 'border border-slate-300 bg-white'
                        }`}>
                          {isMatched && <Check className="w-3 h-3" />}
                        </div>
                        <span className="text-xs">{skill}</span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSkill(skill);
                        }}
                        className="text-slate-400 hover:text-rose-600 p-0.5"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Add Skill */}
              <form onSubmit={handleAddNewSkill} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add another required skill..."
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs rounded-xl bg-white border border-slate-200 text-slate-800 focus:outline-none focus:border-indigo-500 shadow-2xs"
                />
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                >
                  Add Skill
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: Interviews */}
          {activeTab === 'interviews' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">Interview Timeline</span>
                <button
                  onClick={() => setShowAddRound(true)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Log Round</span>
                </button>
              </div>

              {showAddRound && (
                <form onSubmit={handleAddRoundSubmit} className="p-4 rounded-xl bg-white border border-slate-200 space-y-3 shadow-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-600 font-semibold mb-1">Round Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. System Design Interview"
                        value={roundName}
                        onChange={(e) => setRoundName(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-600 font-semibold mb-1">Date *</label>
                      <input
                        type="date"
                        required
                        value={roundDate}
                        onChange={(e) => setRoundDate(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-600 font-semibold mb-1">Time (Optional)</label>
                      <input
                        type="time"
                        value={roundTime}
                        onChange={(e) => setRoundTime(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-600 font-semibold mb-1">Format</label>
                      <select
                        value={roundFormat}
                        onChange={(e) => setRoundFormat(e.target.value as any)}
                        className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-500"
                      >
                        <option value="video">Video Call (Zoom/Meet)</option>
                        <option value="phone">Phone Call</option>
                        <option value="take-home">Take-Home Assessment</option>
                        <option value="onsite">On-Site</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowAddRound(false)}
                      className="px-3 py-1.5 text-xs rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                      Save Round
                    </button>
                  </div>
                </form>
              )}

              {/* Rounds List */}
              {(!selectedJob.interviewRounds || selectedJob.interviewRounds.length === 0) ? (
                <div className="p-8 rounded-xl bg-white border border-slate-200 text-center text-slate-500">
                  No interview stages recorded yet.
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedJob.interviewRounds.map((round) => (
                    <div
                      key={round.id}
                      className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between shadow-2xs"
                    >
                      <div>
                        <div className="font-bold text-slate-900">{round.name}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5 font-medium">
                          📅 {formatDate(round.date)} {round.time && `at ${round.time}`}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={round.status}
                          onChange={(e) => updateInterviewRound(selectedJob.id, round.id, { status: e.target.value as any })}
                          aria-label={`Status for ${round.name}`}
                          className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none"
                        >
                          <option value="scheduled">Scheduled</option>
                          <option value="passed">Passed</option>
                          <option value="failed">Failed</option>
                          <option value="completed">Completed</option>
                        </select>

                        <button
                          onClick={() => deleteInterviewRound(selectedJob.id, round.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Contacts */}
          {activeTab === 'contacts' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2.5 shadow-2xs">
                <h4 className="font-bold text-slate-900">Recruiter Contact</h4>
                <input
                  type="text"
                  placeholder="Recruiter Name"
                  value={selectedJob.recruiterContact?.name || ''}
                  onChange={(e) => updateJob(selectedJob.id, {
                    recruiterContact: { ...(selectedJob.recruiterContact || { name: '' }), name: e.target.value }
                  })}
                  className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 border border-slate-200 text-slate-900"
                />
                <input
                  type="email"
                  placeholder="Recruiter Email"
                  value={selectedJob.recruiterContact?.email || ''}
                  onChange={(e) => updateJob(selectedJob.id, {
                    recruiterContact: { ...(selectedJob.recruiterContact || { name: '' }), email: e.target.value }
                  })}
                  className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 border border-slate-200 text-slate-900"
                />
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2.5 shadow-2xs">
                <h4 className="font-bold text-slate-900">Internal Referral</h4>
                <input
                  type="text"
                  placeholder="Referrer Name"
                  value={selectedJob.referralContact?.name || ''}
                  onChange={(e) => updateJob(selectedJob.id, {
                    referralContact: { ...(selectedJob.referralContact || { name: '' }), name: e.target.value }
                  })}
                  className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 border border-slate-200 text-slate-900"
                />
                <input
                  type="email"
                  placeholder="Referrer Email"
                  value={selectedJob.referralContact?.email || ''}
                  onChange={(e) => updateJob(selectedJob.id, {
                    referralContact: { ...(selectedJob.referralContact || { name: '' }), email: e.target.value }
                  })}
                  className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 border border-slate-200 text-slate-900"
                />
              </div>
            </div>
          )}

          {/* TAB 5: History */}
          {activeTab === 'history' && (
            <div className="space-y-2">
              {selectedJob.history?.map((event, idx) => (
                <div key={idx} className="text-xs p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between shadow-2xs">
                  <span className="text-slate-800 font-medium">{event.date} — <strong className="text-indigo-600 uppercase font-bold">{event.status}</strong></span>
                  {event.note && <span className="text-slate-500 italic">{event.note}</span>}
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between text-xs shrink-0">
          <button
            onClick={() => {
              if (confirm(`Delete application for ${selectedJob.role} at ${selectedJob.company}?`)) {
                deleteJob(selectedJob.id);
              }
            }}
            className="text-rose-600 hover:text-rose-700 font-bold"
          >
            Delete Application
          </button>

          <button
            onClick={() => setSelectedJob(null)}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
