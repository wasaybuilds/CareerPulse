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
        return <Video className="w-4 h-4 text-indigo-600" />;
      case 'phone':
        return <Phone className="w-4 h-4 text-blue-600" />;
      case 'take-home':
        return <FileCode className="w-4 h-4 text-amber-600" />;
      default:
        return <Building2 className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-4xl mx-auto space-y-5">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-indigo-600" />
            <span>Interview Schedule & Deadlines</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Upcoming interview rounds, coding assessments, and take-home deadlines
          </p>
        </div>

        <div className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
          {upcomingEvents.length} Upcoming
        </div>
      </div>

      {/* Upcoming Section */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-indigo-600" />
          <span>Scheduled Interviews</span>
        </h3>

        {upcomingEvents.length === 0 ? (
          <div className="p-8 rounded-xl bg-white border border-slate-200 text-center shadow-2xs">
            <p className="text-xs font-bold text-slate-700">No interviews currently scheduled</p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Add upcoming rounds inside any job details modal.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {upcomingEvents.map(({ job, round }) => (
              <div
                key={round.id}
                onClick={() => setSelectedJob(job)}
                className="p-4 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md transition cursor-pointer flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                    {getFormatIcon(round.format)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-xs hover:text-indigo-600 transition">
                        {round.name}
                      </h4>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold capitalize border border-slate-200">
                        {round.format || 'Interview'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      <strong className="text-slate-900">{job.role}</strong> at <strong className="text-slate-900">{job.company}</strong>
                    </p>
                    {round.interviewer && (
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Interviewer: <span className="text-slate-700 font-medium">{round.interviewer}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex sm:flex-col sm:items-end justify-between items-center shrink-0">
                  <span className="text-xs font-bold text-slate-800">
                    {formatDate(round.date)} {round.time && `at ${round.time}`}
                  </span>
                  <span className="text-[10px] text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-200 font-bold mt-1">
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
        <div className="space-y-3 pt-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Past Interview History</span>
          </h3>

          <div className="grid grid-cols-1 gap-2">
            {pastEvents.map(({ job, round }) => (
              <div
                key={round.id}
                onClick={() => setSelectedJob(job)}
                className="p-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition cursor-pointer flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                    {getFormatIcon(round.format)}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800">
                      {round.name} · <span className="text-slate-500 font-normal">{job.company}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium">
                      {formatDate(round.date)}
                    </div>
                  </div>
                </div>

                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md border ${
                  round.status === 'passed'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : round.status === 'failed'
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}>
                  {round.status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
