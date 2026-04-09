// ============================================================
// PlaceIQ — Action Plan Panel
// Displays prioritized actions from the Action Planner agent
// ============================================================

import React from 'react';
import { ListTodo, AlertTriangle, ArrowUp, Minus, ArrowDown } from 'lucide-react';

const priorityConfig = {
  critical: { color: 'border-l-red-500 bg-red-500/5', icon: AlertTriangle, iconColor: 'text-red-400', label: 'CRITICAL' },
  high: { color: 'border-l-amber-500 bg-amber-500/5', icon: ArrowUp, iconColor: 'text-amber-400', label: 'HIGH' },
  medium: { color: 'border-l-blue-500 bg-blue-500/5', icon: Minus, iconColor: 'text-blue-400', label: 'MEDIUM' },
  low: { color: 'border-l-surface-700 bg-white/[0.02]', icon: ArrowDown, iconColor: 'text-surface-200/50', label: 'LOW' },
};

export default function ActionPlan({ actions }) {
  if (!actions || actions.length === 0) return null;

  return (
    <div className="glass-card p-6 animate-slide-up">
      <h3 className="section-title flex items-center gap-2">
        <ListTodo className="w-5 h-5 text-primary-400" />
        Action Plan
        <span className="text-xs font-normal text-surface-200/50 ml-auto">{actions.length} actions</span>
      </h3>

      <div className="space-y-2.5">
        {actions.map((action, i) => {
          const config = priorityConfig[action.priority] || priorityConfig.low;
          const Icon = config.icon;

          return (
            <div
              key={i}
              className={`border-l-2 ${config.color} rounded-r-xl px-4 py-3 transition-all duration-200 hover:bg-white/5`}
            >
              <div className="flex items-start gap-3">
                <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${config.iconColor}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-bold tracking-wider text-surface-200/40">{config.label}</span>
                    <span className="text-[10px] text-surface-200/30">•</span>
                    <span className="text-[10px] text-surface-200/30">{action.category}</span>
                  </div>
                  <p className="text-sm text-surface-200/80 leading-relaxed">{action.action}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
