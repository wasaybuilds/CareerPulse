import React from 'react';
import { 
  TrendingUp, 
  Award, 
  Clock, 
  Building2, 
  Layers, 
  PieChart as PieChartIcon,
  Sparkles
} from 'lucide-react';
import { useJobs } from '../context/JobContext';

export const AnalyticsDashboard: React.FC = () => {
  const { jobs, metrics } = useJobs();

  // Calculate Source breakdown
  const sourceCounts: Record<string, number> = {};
  jobs.forEach(j => {
    const s = j.source || 'Direct / Other';
    sourceCounts[s] = (sourceCounts[s] || 0) + 1;
  });

  // Calculate Work mode breakdown
  const workModeCounts = {
    remote: jobs.filter(j => j.workMode === 'remote').length,
    hybrid: jobs.filter(j => j.workMode === 'hybrid').length,
    onsite: jobs.filter(j => j.workMode === 'onsite').length
  };

  // Top skills count
  const skillCounts: Record<string, number> = {};
  jobs.forEach(j => {
    j.keySkills?.forEach(s => {
      skillCounts[s] = (skillCounts[s] || 0) + 1;
    });
  });
  const topSkills = Object.entries(skillCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  // Funnel steps
  const funnelSteps = [
    { label: 'Wishlist / Saved', count: metrics.wishlist + metrics.applied + metrics.oa + metrics.interview + metrics.offer + metrics.rejected, color: 'bg-indigo-500' },
    { label: 'Submitted (Applied)', count: metrics.applied + metrics.oa + metrics.interview + metrics.offer + metrics.rejected, color: 'bg-blue-500' },
    { label: 'Assessments (OA)', count: metrics.oa + metrics.interview + metrics.offer, color: 'bg-amber-500' },
    { label: 'Interviews Reached', count: metrics.interview + metrics.offer, color: 'bg-purple-500' },
    { label: 'Offers Received', count: metrics.offer, color: 'bg-emerald-500' }
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1 */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Total Tracked</p>
            <h3 className="text-2xl font-bold text-white mt-1">{metrics.total}</h3>
            <p className="text-[11px] text-slate-400 mt-1">
              {metrics.activeApplications} currently active
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2 */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Response Rate</p>
            <h3 className="text-2xl font-bold text-purple-400 mt-1">{metrics.responseRate}%</h3>
            <p className="text-[11px] text-slate-400 mt-1">
              {metrics.oa + metrics.interview + metrics.offer + metrics.rejected} replies from {metrics.total - metrics.wishlist} apps
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3 */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Interviews Active</p>
            <h3 className="text-2xl font-bold text-amber-400 mt-1">{metrics.interview}</h3>
            <p className="text-[11px] text-slate-400 mt-1">
              {metrics.oa} technical assessments
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4 */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-emerald-500/30 bg-emerald-950/10 flex items-center justify-between">
          <div>
            <p className="text-xs text-emerald-400 font-medium">Offers Received</p>
            <h3 className="text-2xl font-bold text-emerald-400 mt-1">{metrics.offer}</h3>
            <p className="text-[11px] text-slate-400 mt-1">
              {metrics.offerRate}% conversion from applied
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Award className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Conversion Funnel & Stage Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Funnel Box */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-200 text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              <span>Application Pipeline Conversion Funnel</span>
            </h3>
            <span className="text-xs text-slate-400">End-to-End Progression</span>
          </div>

          <div className="space-y-3.5 pt-2">
            {funnelSteps.map((step, idx) => {
              const maxCount = Math.max(funnelSteps[0].count, 1);
              const percentage = Math.round((step.count / maxCount) * 100);
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-300">{step.label}</span>
                    <span className="text-slate-400">{step.count} ({percentage}%)</span>
                  </div>
                  <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${step.color} rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Work Mode & Location Distribution */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-4">
          <h3 className="font-semibold text-slate-200 text-sm flex items-center gap-2">
            <Building2 className="w-4 h-4 text-purple-400" />
            <span>Work Mode Breakdown</span>
          </h3>

          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Remote</span>
                <span className="font-semibold">{workModeCounts.remote} ({jobs.length > 0 ? Math.round((workModeCounts.remote / jobs.length) * 100) : 0}%)</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${jobs.length > 0 ? (workModeCounts.remote / jobs.length) * 100 : 0}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Hybrid</span>
                <span className="font-semibold">{workModeCounts.hybrid} ({jobs.length > 0 ? Math.round((workModeCounts.hybrid / jobs.length) * 100) : 0}%)</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: `${jobs.length > 0 ? (workModeCounts.hybrid / jobs.length) * 100 : 0}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>On-Site</span>
                <span className="font-semibold">{workModeCounts.onsite} ({jobs.length > 0 ? Math.round((workModeCounts.onsite / jobs.length) * 100) : 0}%)</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${jobs.length > 0 ? (workModeCounts.onsite / jobs.length) * 100 : 0}%` }}></div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Sources & Top Skills In-Demand */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Sources */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-4">
          <h3 className="font-semibold text-slate-200 text-sm flex items-center gap-2">
            <PieChartIcon className="w-4 h-4 text-emerald-400" />
            <span>Application Sources</span>
          </h3>

          <div className="grid grid-cols-2 gap-3 pt-2">
            {Object.entries(sourceCounts).map(([source, count], i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/70 flex items-center justify-between">
                <span className="text-xs text-slate-300 font-medium truncate">{source}</span>
                <span className="text-xs font-bold text-white px-2 py-0.5 rounded-md bg-slate-800">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Demanded Skills in Tracked Jobs */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-4">
          <h3 className="font-semibold text-slate-200 text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Top Skills Demanded in Target Jobs</span>
          </h3>

          <div className="flex flex-wrap gap-2 pt-2">
            {topSkills.map(([skill, count], i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-200 text-xs hover:border-indigo-500/40 transition"
              >
                <span className="font-medium">{skill}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-indigo-500/20 text-indigo-300 font-bold">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
