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

  const allEvents: { job: JobApplication; round: InterviewRound }[] = [];
  jobs.forEach(job => {
    job.interviewRounds?.forEach(round => {
      allEvents.push({ job, round });
    });
  });

  allEvents.sort((a, b) => new Date(a.round.date).getTime() - new Date(b.round.date).getTime());

  const upcomingEvents = allEvents.filter(e => e.round.status === 'scheduled');
  const pastEvents = allEvents.filter(e => e.round.status !== 'scheduled');

  const getFormatIcon = (format?: string) => {
    switch (format) {
      case 'video':
        return <Video className="w-3.5 h-3.5 text-indigo-400" />;
      case 'phone':
        return <Phone className="w-3.5 h-3.5 text-cyan-400" />;
      case 'take-home':
        return <FileCode className="w-3.5 h-3.5 text-amber-400" />;
      default:
        return <Building2 className="w-3.5 h-3.5 text-zinc-400" />;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-4xl mx-auto space-y-5">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-indigo-400" />
            <span>Interview Schedule & Deadlines</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Upcoming rounds, screenings, and take-home deadlines
          </p>
        </div>

        <div className="px-2.5 py-1 rounded-md bg-[#161b22] border border-zinc-800 text-zinc-300 text-xs font-semibold">
          {upcomingEvents.length} Scheduled
        </div>
      </div>

      {/* Upcoming */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5">
          <Clock className="w-3 h-3 text-indigo-400" />
          <span>Upcoming</span>
        </h3>

        {upcomingEvents.length === 0 ? (
          <div className="p-8 rounded-xl bg-[#161b22] border border-zinc-800 text-center">
            <p className="text-xs font-medium text-zinc-400">No interviews currently scheduled</p>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              Add upcoming rounds inside any job details modal.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2.5">
            {upcomingEvents.map(({ job, round }) => (
              <div
                key={round.id}
                onClick={() => setSelectedJob(job)}
                className="p-3.5 rounded-xl bg-[#161b22] border border-zinc-800/80 hover:border-zinc-700 transition cursor-pointer flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#0d1117] border border-zinc-800 flex items-center justify-center shrink-0">
                    {getFormatIcon(round.format)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-zinc-100 text-xs hover:text-indigo-400 transition">
                        {round.name}
                      </h4>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 capitalize">
                        {round.format || 'Interview'}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      <strong className="text-zinc-300">{job.role}</strong> at <strong className="text-zinc-300">{job.company}</strong>
                    </p>
                    {round.interviewer && (
                      <p className="text-[11px] text-zinc-500 mt-0.5">
                        Interviewer: <span className="text-zinc-400">{round.interviewer}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex sm:flex-col sm:items-end justify-between items-center shrink-0">
                  <span className="text-xs font-semibold text-zinc-200">
                    {formatDate(round.date)} {round.time && `at ${round.time}`}
                  </span>
                  <span className="text-[10px] text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 mt-0.5">
                    Scheduled
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Past Completed */}
      {pastEvents.length > 0 && (
        <div className="space-y-2.5 pt-3">
          <h3 className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>Past History</span>
          </h3>

          <div className="grid grid-cols-1 gap-2">
            {pastEvents.map(({ job, round }) => (
              <div
                key={round.id}
                onClick={() => setSelectedJob(job)}
                className="p-3 rounded-lg bg-[#161b22]/60 border border-zinc-800/60 hover:bg-[#161b22] transition cursor-pointer flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded bg-[#0d1117] border border-zinc-800 flex items-center justify-center shrink-0">
                    {getFormatIcon(round.format)}
                  </div>
                  <div>
                    <div className="font-medium text-zinc-300">
                      {round.name} · <span className="text-zinc-500">{job.company}</span>
                    </div>
                    <div className="text-[10px] text-zinc-500">
                      {formatDate(round.date)}
                    </div>
                  </div>
                </div>

                <span className={`text-[10px] font-medium px-2 py-0.2 rounded border ${
                  round.status === 'passed'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : round.status === 'failed'
                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                }`}>
                  {round.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
