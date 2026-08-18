import React from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Video, 
  Phone, 
  Building2, 
  FileCode, 
  CheckCircle2
} from 'lucide-react';
import { useJobs } from '../context/JobContext';
import { formatDate } from '../utils/helpers';
import type { JobApplication, InterviewRound } from '../types/job';

export const CalendarView: React.FC = () => {
  const { jobs, setSelectedJob } = useJobs();

  // Aggregate all interview rounds
  const allEvents: { job: JobApplication; round: InterviewRound }[] = [];
  jobs.forEach(job => {
    job.interviewRounds?.forEach(round => {
      allEvents.push({ job, round });
    });
  });

  // Sort events by date
  allEvents.sort((a, b) => new Date(a.round.date).getTime() - new Date(b.round.date).getTime());

  const upcomingEvents = allEvents.filter(e => e.round.status === 'scheduled');
  const pastEvents = allEvents.filter(e => e.round.status !== 'scheduled');

  const getFormatIcon = (format?: string) => {
    switch (format) {
      case 'video':
        return <Video className="w-4 h-4 text-purple-400" />;
      case 'phone':
        return <Phone className="w-4 h-4 text-blue-400" />;
      case 'take-home':
        return <FileCode className="w-4 h-4 text-amber-400" />;
      default:
        return <Building2 className="w-4 h-4 text-indigo-400" />;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
      
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-indigo-400" />
            <span>Interview Schedule & Deadlines</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Keep track of live coding rounds, take-homes, and recruiter screenings
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold">
          {upcomingEvents.length} Upcoming Scheduled
        </div>
      </div>

      {/* Upcoming Section */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-indigo-400" />
          <span>Upcoming Rounds</span>
        </h3>

        {upcomingEvents.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
            <p className="text-sm font-semibold text-slate-300">No interviews currently scheduled</p>
            <p className="text-xs text-slate-400 mt-1">
              Add upcoming interview rounds directly inside any job card to view countdowns here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {upcomingEvents.map(({ job, round }) => (
              <div
                key={round.id}
                onClick={() => setSelectedJob(job)}
                className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/90 transition cursor-pointer shadow-lg group flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                    {getFormatIcon(round.format)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-white text-sm group-hover:text-indigo-300 transition">
                        {round.name}
                      </h4>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        {round.format || 'Interview'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      <strong className="text-slate-300">{job.role}</strong> at <strong className="text-slate-300">{job.company}</strong>
                    </p>
                    {round.interviewer && (
                      <p className="text-[11px] text-slate-400 mt-1">
                        Interviewer: <span className="text-slate-300">{round.interviewer}</span>
                      </p>
                    )}
                    {round.notes && (
                      <p className="text-xs text-slate-400 mt-1 italic line-clamp-1">
                        "{round.notes}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex sm:flex-col sm:items-end justify-between items-center shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                  <div className="text-right">
                    <span className="text-xs font-bold text-white">
                      {formatDate(round.date)}
                    </span>
                    {round.time && (
                      <span className="text-xs text-slate-400 block font-mono">
                        {round.time}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-indigo-400 font-semibold px-2 py-0.5 rounded bg-indigo-950/50 border border-indigo-500/30 mt-1">
                    Scheduled
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Past Completed Rounds Section */}
      {pastEvents.length > 0 && (
        <div className="space-y-3 pt-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Past Interview History</span>
          </h3>

          <div className="grid grid-cols-1 gap-2.5">
            {pastEvents.map(({ job, round }) => (
              <div
                key={round.id}
                onClick={() => setSelectedJob(job)}
                className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:bg-slate-900/60 transition cursor-pointer flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                    {getFormatIcon(round.format)}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-200">
                      {round.name} · <span className="text-slate-400">{job.company}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {formatDate(round.date)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                    round.status === 'passed'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : round.status === 'failed'
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    {round.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
