// ============================================================
// PlaceIQ — Alerts Panel
// Real-time alerts from the Event & Alert Engine
// ============================================================

import React from 'react';
import { Bell, AlertTriangle, Clock, FileWarning, Activity } from 'lucide-react';

const alertIcons = {
  urgent_deadline: Clock,
  inactivity_nudge: Activity,
  low_resume: FileWarning,
  low_readiness: AlertTriangle,
  new_match: Bell,
};

const severityColors = {
  critical: 'border-red-500/30 bg-red-500/5',
  warning: 'border-amber-500/30 bg-amber-500/5',
  info: 'border-blue-500/30 bg-blue-500/5',
};

export default function AlertsPanel({ alerts }) {
  if (!alerts || alerts.length === 0) {
    return (
      <div className="glass-card p-6 animate-fade-in">
        <h3 className="section-title flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary-400" />
          Alerts
        </h3>
        <div className="text-center py-8 text-surface-200/30">
          <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
          <p className="text-sm">No active alerts</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 animate-fade-in">
      <h3 className="section-title flex items-center gap-2">
        <Bell className="w-5 h-5 text-primary-400" />
        Alerts
        <span className="badge-critical ml-auto">{alerts.length}</span>
      </h3>

      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
        {alerts.slice(0, 10).map((alert, i) => {
          const Icon = alertIcons[alert.type] || Bell;
          const colorClass = severityColors[alert.severity] || severityColors.info;

          return (
            <div
              key={i}
              className={`border rounded-xl px-4 py-3 ${colorClass} transition-all duration-200 hover:bg-white/5`}
            >
              <div className="flex items-start gap-3">
                <Icon className="w-4 h-4 mt-0.5 flex-shrink-0 text-surface-200/70" />
                <p className="text-sm text-surface-200/80 leading-relaxed">{alert.message}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
