// ============================================================
// PlaceIQ — Company Matches List
// Shows ranked company matches with scores and tiers
// ============================================================

import React from 'react';
import { Building2, ChevronRight, Clock, Zap, Shield, Target } from 'lucide-react';

const tierConfig = {
  Reach: { class: 'badge-success', icon: Zap, label: 'Strong Match' },
  Match: { class: 'badge-info', icon: Target, label: 'Good Fit' },
  Safety: { class: 'badge-warning', icon: Shield, label: 'Safety Pick' },
};

export default function CompanyMatches({ matches }) {
  if (!matches || matches.length === 0) return null;

  return (
    <div className="glass-card p-6 animate-slide-up">
      <h3 className="section-title flex items-center gap-2">
        <Building2 className="w-5 h-5 text-primary-400" />
        Company Matches
        <span className="text-xs font-normal text-surface-200/50 ml-auto">{matches.length} companies ranked</span>
      </h3>

      <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
        {matches.map((match, i) => {
          const tier = tierConfig[match.tier] || tierConfig.Safety;
          const TierIcon = tier.icon;

          return (
            <div key={match.companyId} className="glass-card-hover p-4 group cursor-pointer">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-surface-200/30 font-mono w-5">#{i + 1}</span>
                    <h4 className="font-semibold text-white truncate">{match.companyName}</h4>
                    <span className={tier.class}>
                      <TierIcon className="w-3 h-3 inline mr-0.5" />
                      {match.tier}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-surface-200/50 ml-7">
                    <span>{match.role}</span>
                    <span>•</span>
                    <span>{match.ctc}</span>
                    <span>•</span>
                    <span className={match.deadlineDays <= 3 ? 'text-red-400 font-semibold' : ''}>
                      <Clock className="w-3 h-3 inline mr-0.5" />
                      {match.deadlineDays}d left
                    </span>
                  </div>
                </div>

                {/* Scores */}
                <div className="flex items-center gap-4 flex-shrink-0 ml-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-primary-400">{match.finalScore}</div>
                    <div className="text-[10px] text-surface-200/40 uppercase">Score</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-surface-200/20 group-hover:text-primary-400 transition-colors" />
                </div>
              </div>

              {/* Skills overlap bar */}
              <div className="mt-3 ml-7">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary-500 to-purple-500 rounded-full transition-all duration-500"
                      style={{ width: `${match.matchScore}%` }}
                    />
                  </div>
                  <span className="text-xs text-surface-200/50 w-8">{match.matchScore}%</span>
                </div>
                {match.overlappingSkills?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {match.overlappingSkills.map(skill => (
                      <span key={skill} className="px-1.5 py-0.5 text-[10px] bg-primary-500/10 text-primary-300 rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* AI Explanation */}
              {match.explanation && (
                <p className="text-xs text-surface-200/50 mt-2 ml-7 italic leading-relaxed line-clamp-2">
                  💡 {match.explanation}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
