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
    { label: 'Wishlist / Saved', count: metrics.wishlist + metrics.applied + metrics.oa + metrics.interview + metrics.offer + metrics.rejected, color: 'bg-zinc-600' },
    { label: 'Submitted (Applied)', count: metrics.applied + metrics.oa + metrics.interview + metrics.offer + metrics.rejected, color: 'bg-blue-500' },
    { label: 'Assessments (OA)', count: metrics.oa + metrics.interview + metrics.offer, color: 'bg-amber-500' },
    { label: 'Interviews Reached', count: metrics.interview + metrics.offer, color: 'bg-indigo-500' },
    { label: 'Offers Received', count: metrics.offer, color: 'bg-emerald-500' }
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-6xl mx-auto space-y-5">
      
      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        {/* Card 1 */}
        <div className="p-4 rounded-xl bg-[#161b22] border border-zinc-800/80">
          <p className="text-xs text-zinc-400 font-medium">Total Applications</p>
          <h3 className="text-2xl font-bold text-white mt-1">{metrics.total}</h3>
          <p className="text-[11px] text-zinc-500 mt-0.5">
            {metrics.activeApplications} active
          </p>
        </div>

        {/* Card 2 */}
        <div className="p-4 rounded-xl bg-[#161b22] border border-zinc-800/80">
          <p className="text-xs text-zinc-400 font-medium">Response Rate</p>
          <h3 className="text-2xl font-bold text-indigo-400 mt-1">{metrics.responseRate}%</h3>
          <p className="text-[11px] text-zinc-500 mt-0.5">
            {metrics.oa + metrics.interview + metrics.offer + metrics.rejected} responses
          </p>
        </div>

        {/* Card 3 */}
        <div className="p-4 rounded-xl bg-[#161b22] border border-zinc-800/80">
          <p className="text-xs text-zinc-400 font-medium">Active Interviews</p>
          <h3 className="text-2xl font-bold text-amber-400 mt-1">{metrics.interview}</h3>
          <p className="text-[11px] text-zinc-500 mt-0.5">
            {metrics.oa} assessments
          </p>
        </div>

        {/* Card 4 */}
        <div className="p-4 rounded-xl bg-[#161b22] border border-emerald-500/30 bg-emerald-950/10">
          <p className="text-xs text-emerald-400 font-medium">Offers</p>
          <h3 className="text-2xl font-bold text-emerald-400 mt-1">{metrics.offer}</h3>
          <p className="text-[11px] text-zinc-400 mt-0.5">
            {metrics.offerRate}% conversion
          </p>
        </div>

      </div>

      {/* Conversion Funnel & Stage Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Funnel Box */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-[#161b22] border border-zinc-800/80 space-y-3.5">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-zinc-200 text-xs flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
              <span>Application Pipeline Conversion</span>
            </h3>
          </div>

          <div className="space-y-3 pt-1">
            {funnelSteps.map((step, idx) => {
              const maxCount = Math.max(funnelSteps[0].count, 1);
              const percentage = Math.round((step.count / maxCount) * 100);
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-zinc-300">{step.label}</span>
                    <span className="text-zinc-400">{step.count} ({percentage}%)</span>
                  </div>
                  <div className="w-full h-2 bg-[#0d1117] rounded-full overflow-hidden">
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

        {/* Work Mode */}
        <div className="p-5 rounded-xl bg-[#161b22] border border-zinc-800/80 space-y-3.5">
          <h3 className="font-semibold text-zinc-200 text-xs flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5 text-zinc-400" />
            <span>Work Mode</span>
          </h3>

          <div className="space-y-3 pt-1">
            <div>
              <div className="flex justify-between text-xs text-zinc-300 mb-1">
                <span>Remote</span>
                <span className="font-semibold">{workModeCounts.remote}</span>
              </div>
              <div className="w-full h-1.5 bg-[#0d1117] rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${jobs.length > 0 ? (workModeCounts.remote / jobs.length) * 100 : 0}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-zinc-300 mb-1">
                <span>Hybrid</span>
                <span className="font-semibold">{workModeCounts.hybrid}</span>
              </div>
              <div className="w-full h-1.5 bg-[#0d1117] rounded-full overflow-hidden">
                <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${jobs.length > 0 ? (workModeCounts.hybrid / jobs.length) * 100 : 0}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-zinc-300 mb-1">
                <span>On-Site</span>
                <span className="font-semibold">{workModeCounts.onsite}</span>
              </div>
              <div className="w-full h-1.5 bg-[#0d1117] rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${jobs.length > 0 ? (workModeCounts.onsite / jobs.length) * 100 : 0}%` }}></div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Sources & Top Skills */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Sources */}
        <div className="p-5 rounded-xl bg-[#161b22] border border-zinc-800/80 space-y-3">
          <h3 className="font-semibold text-zinc-200 text-xs flex items-center gap-2">
            <PieChartIcon className="w-3.5 h-3.5 text-zinc-400" />
            <span>Sources</span>
          </h3>

          <div className="grid grid-cols-2 gap-2 pt-1">
            {Object.entries(sourceCounts).map(([source, count], i) => (
              <div key={i} className="p-2.5 rounded-lg bg-[#0d1117] border border-zinc-800 flex items-center justify-between text-xs">
                <span className="text-zinc-300 truncate">{source}</span>
                <span className="font-bold text-zinc-200 bg-zinc-800 px-1.5 py-0.2 rounded text-[11px]">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Demanded Skills */}
        <div className="p-5 rounded-xl bg-[#161b22] border border-zinc-800/80 space-y-3">
          <h3 className="font-semibold text-zinc-200 text-xs flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Top In-Demand Skills</span>
          </h3>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {topSkills.map(([skill, count], i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0d1117] border border-zinc-800 text-zinc-200 text-xs"
              >
                <span>{skill}</span>
                <span className="text-[10px] px-1 py-0.2 rounded bg-zinc-800 text-zinc-400 font-semibold">
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
