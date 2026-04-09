// ============================================================
// PlaceIQ — Readiness Score Card
// Displays the 0–100 readiness with animated ring + breakdown
// ============================================================

import React from 'react';
import { TrendingUp, BookOpen, FileText, Users, FolderKanban } from 'lucide-react';

export default function ReadinessCard({ readiness }) {
  if (!readiness) return null;

  const { readinessScore, breakdown } = readiness;
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (readinessScore / 100) * circumference;

  const getColor = (score) => {
    if (score >= 70) return { ring: '#10b981', text: 'text-emerald-400', bg: 'from-emerald-500/20' };
    if (score >= 45) return { ring: '#f59e0b', text: 'text-amber-400', bg: 'from-amber-500/20' };
    return { ring: '#ef4444', text: 'text-red-400', bg: 'from-red-500/20' };
  };

  const color = getColor(readinessScore);

  const breakdownItems = [
    { icon: BookOpen, label: 'CGPA', value: `${breakdown.cgpa.score}%`, raw: breakdown.cgpa.raw },
    { icon: TrendingUp, label: 'Skills', value: `${breakdown.skills.score}%`, raw: `${breakdown.skills.count} matched` },
    { icon: FileText, label: 'Resume', value: `${breakdown.resume.score}%`, raw: '' },
    { icon: Users, label: 'Mock Interviews', value: `${breakdown.mockInterviews.score}%`, raw: `${breakdown.mockInterviews.count} done` },
    { icon: FolderKanban, label: 'Projects', value: `${breakdown.projects.avgRelevance}%`, raw: `${breakdown.projects.count} projects` },
  ];

  return (
    <div className="glass-card p-6 animate-fade-in">
      <h3 className="section-title flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-primary-400" />
        Readiness Score
      </h3>

      <div className="flex items-center gap-8">
        {/* Animated Ring */}
        <div className="relative flex-shrink-0">
          <svg width="130" height="130" className="-rotate-90">
            <circle cx="65" cy="65" r="54" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
            <circle
              cx="65" cy="65" r="54" fill="none"
              stroke={color.ring}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-3xl font-black ${color.text}`}>{readinessScore}</span>
            <span className="text-xs text-surface-200/50">/100</span>
          </div>
        </div>

        {/* Breakdown */}
        <div className="flex-1 space-y-2.5">
          {breakdownItems.map(({ icon: Icon, label, value, raw }) => (
            <div key={label} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-surface-200/70">
                <Icon className="w-3.5 h-3.5" />
                <span>{label}</span>
              </div>
              <div className="flex items-center gap-2">
                {raw && <span className="text-xs text-surface-200/40">{raw}</span>}
                <span className="font-semibold text-white w-10 text-right">{value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
