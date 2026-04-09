// ============================================================
// PlaceIQ — Admin Home Page
// Placement stats, at-risk students, branch analytics
// ============================================================

import React, { useEffect } from 'react';
import { Shield, Users, TrendingUp, AlertTriangle, BarChart3, Target, GraduationCap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import useStore from '../store/useStore.js';
import { fetchAdminDashboard } from '../services/api.js';

const PIE_COLORS = ['#10b981', '#6366f1', '#ef4444'];

export default function AdminHome() {
  const { adminDashboard, setAdminDashboard } = useStore();

  useEffect(() => {
    fetchAdminDashboard().then(setAdminDashboard).catch(console.error);
  }, []);

  if (!adminDashboard) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-surface-200/30">Loading admin intelligence...</div>
      </div>
    );
  }

  const { forecast, atRisk, branchAnalytics } = adminDashboard;

  const distributionData = [
    { name: 'High Ready (≥70)', value: forecast.distribution.highReady },
    { name: 'Mid Ready (45-69)', value: forecast.distribution.midReady },
    { name: 'Low Ready (<45)', value: forecast.distribution.lowReady },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Admin Intelligence Dashboard</h2>
            <p className="text-sm text-surface-200/50">Placement analytics and at-risk detection</p>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Students" value={forecast.totalStudents} color="text-blue-400" />
        <StatCard icon={TrendingUp} label="Avg Readiness" value={`${forecast.averageReadiness}%`} color="text-primary-400" />
        <StatCard icon={Target} label="Est. Placements" value={forecast.estimatedPlacements} color="text-emerald-400" />
        <StatCard icon={GraduationCap} label="Placement Rate" value={`${forecast.placementRate}%`} color="text-purple-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Branch Analytics Chart */}
        <div className="glass-card p-6">
          <h3 className="section-title flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary-400" />
            Branch Analytics
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={branchAnalytics} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis type="category" dataKey="branch" width={120} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#f8fafc' }}
                />
                <Bar dataKey="avgReadiness" fill="#6366f1" radius={[0, 6, 6, 0]} name="Avg Readiness" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Readiness Distribution Pie */}
        <div className="glass-card p-6">
          <h3 className="section-title flex items-center gap-2">
            <Target className="w-5 h-5 text-primary-400" />
            Readiness Distribution
          </h3>
          <div className="h-64 flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%" cy="50%"
                  innerRadius={60} outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {distributionData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#f8fafc' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 flex-shrink-0">
              {distributionData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                  <span className="text-surface-200/60">{d.name}</span>
                  <span className="font-bold text-white ml-1">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* At-Risk Students */}
      <div className="glass-card p-6">
        <h3 className="section-title flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-400" />
          At-Risk Students
          <span className="badge-critical ml-2">{atRisk.atRisk.length} students</span>
          <span className="text-xs text-surface-200/30 ml-auto">Threshold: ≤{atRisk.threshold} readiness</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-surface-200/40 border-b border-white/5">
                <th className="pb-3 font-medium">Student</th>
                <th className="pb-3 font-medium">Branch</th>
                <th className="pb-3 font-medium">CGPA</th>
                <th className="pb-3 font-medium">Readiness</th>
                <th className="pb-3 font-medium">Key Weakness</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {atRisk.atRisk.map((s) => {
                const weakest = Object.entries(s.breakdown)
                  .map(([key, val]) => ({ key, score: val.score || val.avgRelevance || 0 }))
                  .sort((a, b) => a.score - b.score)[0];

                return (
                  <tr key={s.id} className="text-surface-200/70 hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 font-medium text-white">{s.name}</td>
                    <td className="py-3">{s.branch}</td>
                    <td className="py-3">{s.cgpa}</td>
                    <td className="py-3">
                      <span className={`font-bold ${s.readinessScore < 30 ? 'text-red-400' : 'text-amber-400'}`}>
                        {s.readinessScore}
                      </span>/100
                    </td>
                    <td className="py-3">
                      <span className="badge-warning">{weakest?.key}: {weakest?.score}%</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Mini Stat Card
function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="glass-card-hover p-5">
      <div className="flex items-center gap-3">
        <Icon className={`w-5 h-5 ${color}`} />
        <div>
          <div className="stat-value">{value}</div>
          <div className="text-xs text-surface-200/40 mt-0.5">{label}</div>
        </div>
      </div>
    </div>
  );
}
