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
  ExternalLink
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

  const handleSaveJD = () => {
    updateJob(selectedJob.id, { jobDescription: editedJD });
    setIsEditingJD(false);
  };

  const handleAddRoundSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roundName || !roundDate) return;

    addInterviewRound(selectedJob.id, {
      name: roundName,
      date: roundDate,
      time: roundTime || undefined,
      interviewer: roundInterviewer || undefined,
      format: roundFormat,
      notes: roundNotes || undefined,
      questionsAsked: [],
      status: 'scheduled'
    });

    // Reset round form
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 bg-slate-900/60 flex items-start justify-between gap-4 shrink-0">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-lg shadow-lg shrink-0">
              {selectedJob.company.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-xl font-bold text-white">{selectedJob.role}</h2>
                <div className="flex items-center text-amber-400 text-xs">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => updateJob(selectedJob.id, { priority: (i + 1) as any })}
                      className="p-0.5 hover:scale-125 transition"
                      title={`Set Priority ${i + 1}`}
                    >
                      <Star className={`w-3.5 h-3.5 ${i < selectedJob.priority ? 'fill-amber-400 text-amber-400' : 'text-slate-700'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-slate-300">
                <span className="font-semibold text-slate-200">{selectedJob.company}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  {selectedJob.location} ({selectedJob.workMode})
                </span>
                <span>•</span>
                <span className="text-emerald-400 font-semibold">
                  {formatSalary(selectedJob.salaryMin, selectedJob.salaryMax, selectedJob.salaryCurrency, selectedJob.salaryPeriod)}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons & Close */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSharingJob(selectedJob);
                setIsShareModalOpen(true);
              }}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
              title="Share job summary"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {selectedJob.url && (
              <a
                href={selectedJob.url}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400 hover:text-blue-300 transition"
                title="Open job URL"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}

            <button
              onClick={() => setSelectedJob(null)}
              className="p-2 rounded-lg bg-slate-800 hover:bg-rose-900/50 text-slate-400 hover:text-rose-400 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Status Bar & Quick Transition */}
        <div className="px-6 py-2.5 bg-slate-900/40 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Current Pipeline Stage:</span>
            <select
              value={selectedJob.status}
              onChange={(e) => updateJobStatus(selectedJob.id, e.target.value as JobStatus)}
              aria-label={`Current Pipeline Stage for ${selectedJob.role}`}
              className={`font-semibold px-3 py-1 rounded-full border bg-slate-900 cursor-pointer focus:outline-none ${config.badgeBg}`}
            >
              {Object.entries(STATUS_CONFIG).map(([key, item]) => (
                <option key={key} value={key} className="bg-slate-900 text-slate-200">
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 text-slate-400">
            {selectedJob.dateApplied && (
              <span>Applied on: <strong className="text-slate-200">{formatDate(selectedJob.dateApplied)}</strong></span>
            )}
            {selectedJob.resumeVersion && (
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                Resume: {selectedJob.resumeVersion}
              </span>
            )}
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="flex border-b border-slate-800 px-6 bg-slate-950 shrink-0 text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('jd')}
            className={`py-3 px-4 font-semibold border-b-2 transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'jd'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Job Description & Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('skills')}
            className={`py-3 px-4 font-semibold border-b-2 transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'skills'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Skills Match ({selectedJob.matchedSkills?.length || 0}/{selectedJob.keySkills?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('interviews')}
            className={`py-3 px-4 font-semibold border-b-2 transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'interviews'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Interview Rounds ({selectedJob.interviewRounds?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('contacts')}
            className={`py-3 px-4 font-semibold border-b-2 transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'contacts'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Referrals & Contacts</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`py-3 px-4 font-semibold border-b-2 transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'history'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>History</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: Job Description */}
          {activeTab === 'jd' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-400" />
                  <span>Job Description (JD)</span>
                </h3>

                {isEditingJD ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsEditingJD(false)}
                      className="px-3 py-1 text-xs rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveJD}
                      className="px-3 py-1 text-xs rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" />
                      <span>Save JD</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setEditedJD(selectedJob.jobDescription || '');
                      setIsEditingJD(true);
                    }}
                    className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300"
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
                  rows={14}
                  className="w-full p-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs font-mono focus:outline-none focus:border-indigo-500 leading-relaxed"
                  placeholder="Paste or type full job description here..."
                />
              ) : (
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-300 leading-relaxed whitespace-pre-wrap font-sans max-h-[380px] overflow-y-auto">
                  {selectedJob.jobDescription || 'No job description added yet. Click Edit JD to paste the full requirements.'}
                </div>
              )}

              {/* Notes Field */}
              <div className="pt-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Personal Strategy & Interview Notes
                </label>
                <textarea
                  value={selectedJob.notes}
                  onChange={(e) => updateJob(selectedJob.id, { notes: e.target.value })}
                  rows={3}
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
                  placeholder="Write your personal notes, prep focus, salary negotiation plans, etc..."
                />
              </div>
            </div>
          )}

          {/* TAB 2: Skills Match Checklist */}
          {activeTab === 'skills' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-semibold text-white">Skills Match Analysis</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Check off the skills you match with to calculate your qualification score for this JD.
                </p>
              </div>

              {/* Match Score Meter */}
              {selectedJob.keySkills.length > 0 && (
                <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-300">Match Percentage</span>
                    <span className="text-indigo-400">
                      {Math.round(((selectedJob.matchedSkills?.length || 0) / selectedJob.keySkills.length) * 100)}% Match
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300"
                      style={{ width: `${((selectedJob.matchedSkills?.length || 0) / selectedJob.keySkills.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}

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
                          ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                          : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center ${
                          isMatched ? 'bg-emerald-500 text-slate-950 font-bold' : 'border border-slate-700'
                        }`}>
                          {isMatched && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <span className="text-xs font-medium">{skill}</span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSkill(skill);
                        }}
                        className="text-slate-500 hover:text-rose-400 p-1"
                        title="Remove skill"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Add New Skill Form */}
              <form onSubmit={handleAddNewSkill} className="flex gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Add another required skill (e.g. AWS, Next.js, GraphQL)..."
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white"
                >
                  Add Skill
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: Interview Rounds */}
          {activeTab === 'interviews' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">Interview Timeline & Rounds</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Log recruiter calls, coding assessments, system design, and onsite stages.
                  </p>
                </div>

                <button
                  onClick={() => setShowAddRound(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Log Round</span>
                </button>
              </div>

              {/* Add Round Form */}
              {showAddRound && (
                <form onSubmit={handleAddRoundSubmit} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-slate-200">New Interview Stage</h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Round Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Technical Coding Screen"
                        value={roundName}
                        onChange={(e) => setRoundName(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Date *</label>
                      <input
                        type="date"
                        required
                        value={roundDate}
                        onChange={(e) => setRoundDate(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Time (Optional)</label>
                      <input
                        type="time"
                        value={roundTime}
                        onChange={(e) => setRoundTime(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Format</label>
                      <select
                        value={roundFormat}
                        onChange={(e) => setRoundFormat(e.target.value as any)}
                        className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                      >
                        <option value="video">Video Call (Zoom/Google Meet)</option>
                        <option value="phone">Phone Call</option>
                        <option value="take-home">Take-Home / OA</option>
                        <option value="onsite">On-Site Office</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] text-slate-400 mb-1">Interviewer Name / Role</label>
                      <input
                        type="text"
                        placeholder="e.g. John Doe (VP Engineering)"
                        value={roundInterviewer}
                        onChange={(e) => setRoundInterviewer(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] text-slate-400 mb-1">Prep Notes & Key Topics</label>
                      <textarea
                        rows={2}
                        placeholder="Topics to study, questions asked, behavioral stories..."
                        value={roundNotes}
                        onChange={(e) => setRoundNotes(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddRound(false)}
                      className="px-3 py-1.5 text-xs rounded-lg bg-slate-800 text-slate-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 text-white"
                    >
                      Save Stage
                    </button>
                  </div>
                </form>
              )}

              {/* Rounds List */}
              {(!selectedJob.interviewRounds || selectedJob.interviewRounds.length === 0) ? (
                <div className="p-8 text-center border border-dashed border-slate-800 rounded-xl">
                  <p className="text-xs text-slate-400">No interview rounds recorded for this job.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedJob.interviewRounds.map((round, idx) => (
                    <div
                      key={round.id}
                      className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-300">
                              {idx + 1}
                            </span>
                            <h4 className="font-semibold text-white text-xs">{round.name}</h4>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 capitalize">
                              {round.format}
                            </span>
                          </div>

                          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-3">
                            <span>📅 {formatDate(round.date)} {round.time && `at ${round.time}`}</span>
                            {round.interviewer && <span>👤 {round.interviewer}</span>}
                          </div>
                        </div>

                        {/* Status Switcher & Delete */}
                        <div className="flex items-center gap-2">
                          <select
                            value={round.status}
                            onChange={(e) => updateInterviewRound(selectedJob.id, round.id, { status: e.target.value as any })}
                            aria-label={`Status for ${round.name}`}
                            className={`text-[10px] font-bold px-2 py-1 rounded-lg border bg-slate-950 focus:outline-none ${
                              round.status === 'passed'
                                ? 'text-emerald-400 border-emerald-500/40 bg-emerald-950/20'
                                : round.status === 'failed'
                                ? 'text-rose-400 border-rose-500/40 bg-rose-950/20'
                                : 'text-purple-400 border-purple-500/40 bg-purple-950/20'
                            }`}
                          >
                            <option value="scheduled">Scheduled</option>
                            <option value="passed">Passed ✅</option>
                            <option value="failed">Failed ❌</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>

                          <button
                            onClick={() => deleteInterviewRound(selectedJob.id, round.id)}
                            className="p-1 text-slate-500 hover:text-rose-400"
                            title="Delete round"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {round.notes && (
                        <div className="mt-2 text-xs text-slate-300 bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/60">
                          {round.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Referrals & Contacts */}
          {activeTab === 'contacts' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Recruiter Contact */}
                <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-blue-400" />
                    <span>Recruiter / Talent Partner</span>
                  </h4>

                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Recruiter Name"
                      value={selectedJob.recruiterContact?.name || ''}
                      onChange={(e) => updateJob(selectedJob.id, {
                        recruiterContact: { ...(selectedJob.recruiterContact || { name: '' }), name: e.target.value }
                      })}
                      className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white"
                    />

                    <input
                      type="email"
                      placeholder="Recruiter Email"
                      value={selectedJob.recruiterContact?.email || ''}
                      onChange={(e) => updateJob(selectedJob.id, {
                        recruiterContact: { ...(selectedJob.recruiterContact || { name: '' }), email: e.target.value }
                      })}
                      className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white"
                    />

                    <input
                      type="url"
                      placeholder="LinkedIn Profile URL"
                      value={selectedJob.recruiterContact?.linkedin || ''}
                      onChange={(e) => updateJob(selectedJob.id, {
                        recruiterContact: { ...(selectedJob.recruiterContact || { name: '' }), linkedin: e.target.value }
                      })}
                      className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white"
                    />
                  </div>
                </div>

                {/* Internal Referral */}
                <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Internal Referral Contact</span>
                  </h4>

                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Referrer Name"
                      value={selectedJob.referralContact?.name || ''}
                      onChange={(e) => updateJob(selectedJob.id, {
                        referralContact: { ...(selectedJob.referralContact || { name: '' }), name: e.target.value }
                      })}
                      className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white"
                    />

                    <input
                      type="email"
                      placeholder="Referrer Email"
                      value={selectedJob.referralContact?.email || ''}
                      onChange={(e) => updateJob(selectedJob.id, {
                        referralContact: { ...(selectedJob.referralContact || { name: '' }), email: e.target.value }
                      })}
                      className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white"
                    />

                    <input
                      type="url"
                      placeholder="LinkedIn Profile URL"
                      value={selectedJob.referralContact?.linkedin || ''}
                      onChange={(e) => updateJob(selectedJob.id, {
                        referralContact: { ...(selectedJob.referralContact || { name: '' }), linkedin: e.target.value }
                      })}
                      className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white"
                    />
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 5: Timeline History */}
          {activeTab === 'history' && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-white">Application Event Log</h3>
              
              <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                {selectedJob.history?.map((event, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-indigo-500 ring-4 ring-slate-950"></div>
                    <div className="text-xs font-semibold text-slate-200">
                      {event.date} · <span className="uppercase text-indigo-400">{event.status}</span>
                    </div>
                    {event.note && (
                      <p className="text-xs text-slate-400 mt-0.5">{event.note}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between text-xs shrink-0">
          <button
            onClick={() => {
              if (confirm(`Permanently delete ${selectedJob.role} at ${selectedJob.company}?`)) {
                deleteJob(selectedJob.id);
              }
            }}
            className="text-rose-400 hover:text-rose-300 font-medium"
          >
            Delete Application
          </button>

          <button
            onClick={() => setSelectedJob(null)}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
