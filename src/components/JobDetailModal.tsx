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

  const handleSaveJD = async () => {
    await updateJob(selectedJob.id, { jobDescription: editedJD });
    setIsEditingJD(false);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] bg-[#161b22] border border-zinc-800 rounded-xl shadow-2xl flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-zinc-800/80 bg-[#0d1117]/80 flex items-start justify-between gap-3 shrink-0">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-bold text-white">{selectedJob.role}</h2>
              <div className="flex items-center text-amber-400 text-xs">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => updateJob(selectedJob.id, { priority: (i + 1) as any })}
                    className="p-0.5"
                    title={`Set Priority ${i + 1}`}
                  >
                    <Star className={`w-3 h-3 ${i < selectedJob.priority ? 'fill-amber-400 text-amber-400' : 'text-zinc-700'}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 mt-1 text-xs text-zinc-400">
              <span className="font-semibold text-zinc-200">{selectedJob.company}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-zinc-500" />
                {selectedJob.location} ({selectedJob.workMode})
              </span>
              <span>•</span>
              <span className="text-emerald-400 font-medium">
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
              className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition"
              title="Share summary"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>

            {selectedJob.url && (
              <a
                href={selectedJob.url}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-blue-400 transition"
                title="Open job URL"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            <button
              onClick={() => setSelectedJob(null)}
              className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Stage Switcher Bar */}
        <div className="px-5 py-2 bg-[#0d1117]/50 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-zinc-500">Stage:</span>
            <select
              value={selectedJob.status}
              onChange={(e) => updateJobStatus(selectedJob.id, e.target.value as JobStatus)}
              aria-label={`Current Pipeline Stage for ${selectedJob.role}`}
              className={`font-semibold px-2.5 py-0.5 rounded-md border bg-[#161b22] cursor-pointer focus:outline-none ${config.badgeBg}`}
            >
              {Object.entries(STATUS_CONFIG).map(([key, item]) => (
                <option key={key} value={key} className="bg-[#161b22] text-zinc-200">
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 text-zinc-500 text-[11px]">
            {selectedJob.dateApplied && (
              <span>Applied: <strong className="text-zinc-300">{formatDate(selectedJob.dateApplied)}</strong></span>
            )}
            {selectedJob.resumeVersion && (
              <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                Resume: {selectedJob.resumeVersion}
              </span>
            )}
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="flex border-b border-zinc-800 px-5 bg-[#0d1117] shrink-0 text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('jd')}
            className={`py-2.5 px-3 font-semibold border-b-2 transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'jd'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Job Description</span>
          </button>

          <button
            onClick={() => setActiveTab('skills')}
            className={`py-2.5 px-3 font-semibold border-b-2 transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'skills'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Skills Match ({selectedJob.matchedSkills?.length || 0}/{selectedJob.keySkills?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('interviews')}
            className={`py-2.5 px-3 font-semibold border-b-2 transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'interviews'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Interviews ({selectedJob.interviewRounds?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('contacts')}
            className={`py-2.5 px-3 font-semibold border-b-2 transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'contacts'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Contacts</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`py-2.5 px-3 font-semibold border-b-2 transition flex items-center gap-1.5 shrink-0 ${
              activeTab === 'history'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>History</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          
          {/* TAB 1: Job Description */}
          {activeTab === 'jd' && (
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-zinc-300">Job Description Details</span>

                {isEditingJD ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsEditingJD(false)}
                      className="px-2.5 py-1 text-xs rounded bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveJD}
                      className="px-3 py-1 text-xs rounded bg-indigo-600 text-white font-medium hover:bg-indigo-500 flex items-center gap-1"
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
                  rows={12}
                  className="w-full p-3 rounded-lg bg-[#0d1117] border border-zinc-800 text-zinc-200 text-xs font-mono focus:outline-none focus:border-indigo-500 leading-relaxed"
                />
              ) : (
                <div className="p-3.5 rounded-lg bg-[#0d1117] border border-zinc-800 text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap font-sans max-h-[350px] overflow-y-auto">
                  {selectedJob.jobDescription || 'No job description provided.'}
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="block text-zinc-400 mb-1 font-medium">
                  Personal Notes
                </label>
                <textarea
                  value={selectedJob.notes}
                  onChange={(e) => updateJob(selectedJob.id, { notes: e.target.value })}
                  rows={2}
                  className="w-full p-2.5 rounded-lg bg-[#0d1117] border border-zinc-800 text-zinc-200 text-xs focus:outline-none focus:border-indigo-500"
                  placeholder="Notes, interview tips..."
                />
              </div>
            </div>
          )}

          {/* TAB 2: Skills Match */}
          {activeTab === 'skills' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Match score for this job description:</span>
                <span className="font-semibold text-indigo-400">
                  {selectedJob.keySkills.length > 0 ? Math.round(((selectedJob.matchedSkills?.length || 0) / selectedJob.keySkills.length) * 100) : 0}% Match
                </span>
              </div>

              {/* Skills Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedJob.keySkills.map(skill => {
                  const isMatched = selectedJob.matchedSkills?.includes(skill);
                  return (
                    <div
                      key={skill}
                      onClick={() => toggleSkillMatch(skill)}
                      className={`p-2.5 rounded-lg border flex items-center justify-between cursor-pointer transition select-none ${
                        isMatched
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                          : 'bg-[#0d1117] border-zinc-800 text-zinc-300 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded flex items-center justify-center ${
                          isMatched ? 'bg-emerald-500 text-black font-bold' : 'border border-zinc-700'
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
                        className="text-zinc-500 hover:text-rose-400 p-0.5"
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
                  placeholder="Add required skill..."
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-[#0d1117] border border-zinc-800 text-zinc-200 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white"
                >
                  Add
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: Interviews */}
          {activeTab === 'interviews' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-zinc-300">Interview Timeline</span>
                <button
                  onClick={() => setShowAddRound(true)}
                  className="flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white"
                >
                  <Plus className="w-3 h-3" />
                  <span>Log Round</span>
                </button>
              </div>

              {showAddRound && (
                <form onSubmit={handleAddRoundSubmit} className="p-3.5 rounded-lg bg-[#0d1117] border border-zinc-800 space-y-2.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] text-zinc-500 mb-0.5">Round Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Technical Coding"
                        value={roundName}
                        onChange={(e) => setRoundName(e.target.value)}
                        className="w-full px-2.5 py-1 text-xs rounded bg-[#161b22] border border-zinc-800 text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-zinc-500 mb-0.5">Date *</label>
                      <input
                        type="date"
                        required
                        value={roundDate}
                        onChange={(e) => setRoundDate(e.target.value)}
                        className="w-full px-2.5 py-1 text-xs rounded bg-[#161b22] border border-zinc-800 text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-zinc-500 mb-0.5">Time (Optional)</label>
                      <input
                        type="time"
                        value={roundTime}
                        onChange={(e) => setRoundTime(e.target.value)}
                        className="w-full px-2.5 py-1 text-xs rounded bg-[#161b22] border border-zinc-800 text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-zinc-500 mb-0.5">Format</label>
                      <select
                        value={roundFormat}
                        onChange={(e) => setRoundFormat(e.target.value as any)}
                        className="w-full px-2.5 py-1 text-xs rounded bg-[#161b22] border border-zinc-800 text-white focus:outline-none focus:border-indigo-500"
                      >
                        <option value="video">Video Call</option>
                        <option value="phone">Phone Call</option>
                        <option value="take-home">Take-Home / OA</option>
                        <option value="onsite">On-Site</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowAddRound(false)}
                      className="px-2.5 py-1 text-xs rounded bg-zinc-800 text-zinc-400"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3.5 py-1 text-xs font-semibold rounded bg-indigo-600 text-white"
                    >
                      Save
                    </button>
                  </div>
                </form>
              )}

              {/* Rounds List */}
              {(!selectedJob.interviewRounds || selectedJob.interviewRounds.length === 0) ? (
                <p className="text-zinc-500 text-center py-6">No interview stages recorded yet.</p>
              ) : (
                <div className="space-y-2">
                  {selectedJob.interviewRounds.map((round) => (
                    <div
                      key={round.id}
                      className="p-3 rounded-lg bg-[#0d1117] border border-zinc-800 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-semibold text-zinc-200">{round.name}</div>
                        <div className="text-[11px] text-zinc-500 mt-0.5">
                          📅 {formatDate(round.date)} {round.time && `at ${round.time}`}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={round.status}
                          onChange={(e) => updateInterviewRound(selectedJob.id, round.id, { status: e.target.value as any })}
                          aria-label={`Status for ${round.name}`}
                          className="text-[10px] font-medium px-2 py-0.5 rounded bg-[#161b22] border border-zinc-700 text-zinc-300 focus:outline-none"
                        >
                          <option value="scheduled">Scheduled</option>
                          <option value="passed">Passed</option>
                          <option value="failed">Failed</option>
                          <option value="completed">Completed</option>
                        </select>

                        <button
                          onClick={() => deleteInterviewRound(selectedJob.id, round.id)}
                          className="p-1 text-zinc-500 hover:text-rose-400"
                        >
                          <Trash2 className="w-3 h-3" />
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
              <div className="p-3.5 rounded-lg bg-[#0d1117] border border-zinc-800 space-y-2">
                <h4 className="font-semibold text-zinc-200">Recruiter Contact</h4>
                <input
                  type="text"
                  placeholder="Name"
                  value={selectedJob.recruiterContact?.name || ''}
                  onChange={(e) => updateJob(selectedJob.id, {
                    recruiterContact: { ...(selectedJob.recruiterContact || { name: '' }), name: e.target.value }
                  })}
                  className="w-full px-2.5 py-1 text-xs rounded bg-[#161b22] border border-zinc-800 text-white"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={selectedJob.recruiterContact?.email || ''}
                  onChange={(e) => updateJob(selectedJob.id, {
                    recruiterContact: { ...(selectedJob.recruiterContact || { name: '' }), email: e.target.value }
                  })}
                  className="w-full px-2.5 py-1 text-xs rounded bg-[#161b22] border border-zinc-800 text-white"
                />
              </div>

              <div className="p-3.5 rounded-lg bg-[#0d1117] border border-zinc-800 space-y-2">
                <h4 className="font-semibold text-zinc-200">Internal Referral</h4>
                <input
                  type="text"
                  placeholder="Referrer Name"
                  value={selectedJob.referralContact?.name || ''}
                  onChange={(e) => updateJob(selectedJob.id, {
                    referralContact: { ...(selectedJob.referralContact || { name: '' }), name: e.target.value }
                  })}
                  className="w-full px-2.5 py-1 text-xs rounded bg-[#161b22] border border-zinc-800 text-white"
                />
                <input
                  type="email"
                  placeholder="Referrer Email"
                  value={selectedJob.referralContact?.email || ''}
                  onChange={(e) => updateJob(selectedJob.id, {
                    referralContact: { ...(selectedJob.referralContact || { name: '' }), email: e.target.value }
                  })}
                  className="w-full px-2.5 py-1 text-xs rounded bg-[#161b22] border border-zinc-800 text-white"
                />
              </div>
            </div>
          )}

          {/* TAB 5: History */}
          {activeTab === 'history' && (
            <div className="space-y-2.5">
              {selectedJob.history?.map((event, idx) => (
                <div key={idx} className="text-xs text-zinc-400 p-2 rounded bg-[#0d1117] border border-zinc-800/80 flex items-center justify-between">
                  <span>{event.date} — <strong className="text-zinc-200 uppercase">{event.status}</strong></span>
                  {event.note && <span className="text-zinc-500 italic">{event.note}</span>}
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-zinc-800 bg-[#0d1117]/80 flex items-center justify-between text-xs shrink-0">
          <button
            onClick={() => {
              if (confirm(`Delete application for ${selectedJob.role} at ${selectedJob.company}?`)) {
                deleteJob(selectedJob.id);
              }
            }}
            className="text-rose-400 hover:text-rose-300 font-medium"
          >
            Delete Job
          </button>

          <button
            onClick={() => setSelectedJob(null)}
            className="px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-medium transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
