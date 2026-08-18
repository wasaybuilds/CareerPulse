import React from 'react';
import { 
  TrendingUp, 
  Building2, 
  PieChart as PieChartIcon,
  Sparkles
} from 'lucide-react';
import { useJobs } from '../context/JobContext';

export const AnalyticsDashboard: React.FC = () => {
  const { jobs, metrics } = useJobs();

  // Calculate Source breakdown
  const sourceCounts: Record<string, number> = {};
  jobs.forEach(j => {
    const s = j.source || 'Direct';
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
    { label: 'Wishlist / Saved', count: metrics.wishlist + metrics.applied + metrics.oa + metrics.interview + metrics.offer + metrics.rejected, color: 'bg-slate-400' },
    { label: 'Submitted (Applied)', count: metrics.applied + metrics.oa + metrics.interview + metrics.offer + metrics.rejected, color: 'bg-blue-500' },
    { label: 'Assessments (OA)', count: metrics.oa + metrics.interview + metrics.offer, color: 'bg-amber-500' },
    { label: 'Interviews Reached', count: metrics.interview + metrics.offer, color: 'bg-indigo-600' },
    { label: 'Offers Received', count: metrics.offer, color: 'bg-emerald-500' }
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-6xl mx-auto space-y-5">
      
      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1 */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total Tracked</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">{metrics.total}</h3>
          <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
            {metrics.activeApplications} active pipeline
          </p>
        </div>

        {/* Card 2 */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Response Rate</p>
          <h3 className="text-2xl font-bold text-indigo-600 mt-1">{metrics.responseRate}%</h3>
          <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
            {metrics.oa + metrics.interview + metrics.offer + metrics.rejected} responses received
          </p>
        </div>

        {/* Card 3 */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Active Interviews</p>
          <h3 className="text-2xl font-bold text-amber-600 mt-1">{metrics.interview}</h3>
          <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
            {metrics.oa} technical assessments
          </p>
        </div>

        {/* Card 4 */}
        <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 shadow-2xs">
          <p className="text-xs text-emerald-800 font-bold uppercase tracking-wider">Offers Received 🎉</p>
          <h3 className="text-2xl font-bold text-emerald-700 mt-1">{metrics.offer}</h3>
          <p className="text-[11px] text-emerald-600 mt-0.5 font-semibold">
            {metrics.offerRate}% application conversion
          </p>
        </div>

      </div>

      {/* Conversion Funnel & Stage Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Funnel Box */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-800 text-xs flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              <span>Application Pipeline Conversion</span>
            </h3>
          </div>

          <div className="space-y-3.5 pt-1">
            {funnelSteps.map((step, idx) => {
              const maxCount = Math.max(funnelSteps[0].count, 1);
              const percentage = Math.round((step.count / maxCount) * 100);
              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700">{step.label}</span>
                    <span className="text-slate-500">{step.count} ({percentage}%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${step.color} rounded-full transition-all duration-300`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Work Mode Breakdown */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-4">
          <h3 className="font-bold text-slate-800 text-xs flex items-center gap-2 border-b border-slate-100 pb-3">
            <Building2 className="w-4 h-4 text-slate-500" />
            <span>Work Mode Breakdown</span>
          </h3>

          <div className="space-y-3.5 pt-1">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Remote</span>
                <span className="font-bold">{workModeCounts.remote}</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${jobs.length > 0 ? (workModeCounts.remote / jobs.length) * 100 : 0}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Hybrid</span>
                <span className="font-bold">{workModeCounts.hybrid}</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${jobs.length > 0 ? (workModeCounts.hybrid / jobs.length) * 100 : 0}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>On-Site</span>
                <span className="font-bold">{workModeCounts.onsite}</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${jobs.length > 0 ? (workModeCounts.onsite / jobs.length) * 100 : 0}%` }}></div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Sources & Top Skills */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Sources */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3">
          <h3 className="font-bold text-slate-800 text-xs flex items-center gap-2 border-b border-slate-100 pb-2">
            <PieChartIcon className="w-4 h-4 text-slate-500" />
            <span>Application Sources</span>
          </h3>

          <div className="grid grid-cols-2 gap-2 pt-1">
            {Object.entries(sourceCounts).map(([source, count], i) => (
              <div key={i} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-700 font-medium truncate">{source}</span>
                <span className="font-bold text-slate-800 bg-white px-2 py-0.5 rounded-md border border-slate-200 text-[11px] shadow-2xs">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Demanded Skills */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3">
          <h3 className="font-bold text-slate-800 text-xs flex items-center gap-2 border-b border-slate-100 pb-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Top In-Demand Tech Skills</span>
          </h3>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {topSkills.map(([skill, count], i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-50/60 border border-indigo-100 text-indigo-900 text-xs font-semibold"
              >
                <span>{skill}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white text-indigo-700 font-bold border border-indigo-200 shadow-2xs">
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
