// ============================================================
// PlaceIQ — Student Home Page
// Main dashboard with student selector, analysis trigger, and results
// ============================================================

import React, { useEffect, useState } from 'react';
import { Play, Loader2, User, Sparkles, GraduationCap, Code } from 'lucide-react';
import useStore from '../store/useStore.js';
import { fetchStudents, fetchCompanies, runAnalysis, fetchAlerts } from '../services/api.js';
import { subscribeStudent } from '../services/socket.js';
import SplineHero from '../components/spline/SplineHero.jsx';
import ReadinessCard from '../components/dashboard/ReadinessCard.jsx';
import CompanyMatches from '../components/dashboard/CompanyMatches.jsx';
import ActionPlan from '../components/dashboard/ActionPlan.jsx';
import AlertsPanel from '../components/dashboard/AlertsPanel.jsx';

export default function StudentHome() {
  const {
    students, setStudents,
    selectedStudent, setSelectedStudent,
    companies, setCompanies,
    analysisResult, setAnalysisResult,
    isAnalyzing, setIsAnalyzing,
    alerts
  } = useStore();

  const [localAlerts, setLocalAlerts] = useState([]);

  // Load initial data
  useEffect(() => {
    async function loadData() {
      try {
        const [studs, comps] = await Promise.all([
          fetchStudents(),
          fetchCompanies()
        ]);
        setStudents(studs);
        setCompanies(comps);
        // Auto-select first student
        if (studs.length > 0 && !selectedStudent) {
          setSelectedStudent(studs[0]);
        }
      } catch (err) {
        console.error('Failed to load data:', err);
      }
    }
    loadData();
  }, []);

  // Subscribe to socket alerts when student changes
  useEffect(() => {
    if (selectedStudent) {
      subscribeStudent(selectedStudent.id);
      fetchAlerts(selectedStudent.id).then(setLocalAlerts).catch(() => {});
    }
  }, [selectedStudent]);

  const [error, setError] = useState(null);

  // Run analysis
  async function handleAnalyze() {
    if (!selectedStudent) return;
    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);
    try {
      const result = await runAnalysis(selectedStudent.id);
      if (result.error) {
        setError(result.error);
        setIsAnalyzing(false);
      } else {
        setAnalysisResult(result);
        // Refresh alerts after analysis
        fetchAlerts(selectedStudent.id).then(setLocalAlerts).catch(() => {});
      }
    } catch (err) {
      console.error('Analysis failed:', err);
      setError(err.response?.data?.message || err.message || 'Analysis request failed. Please try again.');
      setIsAnalyzing(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <SplineHero />

      {/* Student Selector + Analyze Button */}
      <div className="glass-card p-6 animate-fade-in">
        <div className="flex flex-col md:flex-row items-start md:items-end gap-4">
          <div className="flex-1 w-full">
            <label className="text-sm font-medium text-surface-200/70 mb-2 block">Select Student</label>
            <select
              value={selectedStudent?.id || ''}
              onChange={(e) => {
                const s = students.find(s => s.id === e.target.value);
                setSelectedStudent(s);
                setAnalysisResult(null);
              }}
              className="w-full bg-surface-900 border border-white/10 text-white rounded-xl px-4 py-3 text-sm
                focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/25 transition-all"
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} — {s.branch} — CGPA: {s.cgpa} — Readiness: {s.readinessScore}
                </option>
              ))}
            </select>
          </div>

          <button onClick={handleAnalyze} disabled={isAnalyzing || !selectedStudent} className="btn-primary flex items-center gap-2 whitespace-nowrap disabled:opacity-50">
            {isAnalyzing ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</>
            ) : (
              <><Play className="w-4 h-4" /> Run AI Analysis</>
            )}
          </button>
        </div>

        {/* Selected student quick stats */}
        {selectedStudent && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-4 border-t border-white/5">
            <div className="flex items-center gap-2 text-sm text-surface-200/60">
              <User className="w-4 h-4" />
              <span>{selectedStudent.name}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-surface-200/60">
              <GraduationCap className="w-4 h-4" />
              <span>Sem {selectedStudent.semester} • CGPA {selectedStudent.cgpa}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-surface-200/60">
              <Code className="w-4 h-4" />
              <span>{selectedStudent.skills?.length || 0} skills</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-surface-200/60">
              <Sparkles className="w-4 h-4" />
              <span>Readiness: {selectedStudent.readinessScore}/100</span>
            </div>
          </div>
        )}
      </div>

      {/* Loading State */}
      {isAnalyzing && (
        <div className="text-center py-16 animate-fade-in">
          <Loader2 className="w-12 h-12 mx-auto mb-4 text-primary-400 animate-spin" />
          <h3 className="text-lg font-medium text-surface-200/70 mb-1">Running AI Pipeline...</h3>
          <p className="text-sm text-surface-200/40">Analyzing resume → Matching companies → Predicting selection → Generating AI assessment</p>
        </div>
      )}

      {/* Error State */}
      {error && !isAnalyzing && (
        <div className="glass-card p-5 border-l-4 border-l-red-500 animate-fade-in">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-red-300 mb-1">Analysis Error</h4>
              <p className="text-sm text-surface-200/70">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* AI Explanation Banner */}
      {analysisResult?.explanation && (
        <div className="glass-card p-5 border-l-4 border-l-primary-500 animate-fade-in">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-primary-300 mb-1">AI Assessment</h4>
              <p className="text-sm text-surface-200/70 leading-relaxed">{analysisResult.explanation}</p>
            </div>
          </div>
          {analysisResult.meta && (
            <div className="flex gap-4 mt-3 ml-8 text-xs text-surface-200/30">
              <span>Pipeline: {analysisResult.meta.pipelineTime}</span>
              <span>Companies evaluated: {analysisResult.meta.totalCompaniesEvaluated}</span>
              <span>Agents: {analysisResult.meta.agentsUsed?.length || 0}</span>
            </div>
          )}
        </div>
      )}

      {/* Dashboard Grid */}
      {analysisResult && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column — Readiness + Action Plan */}
          <div className="space-y-6">
            <ReadinessCard readiness={analysisResult.readiness} />
            <AlertsPanel alerts={[...alerts, ...localAlerts]} />
          </div>

          {/* Center + Right — Matches + Actions */}
          <div className="lg:col-span-2 space-y-6">
            <CompanyMatches matches={analysisResult.matches} />
            <ActionPlan actions={analysisResult.actionPlan} />
          </div>
        </div>
      )}

      {/* Empty state */}
      {!analysisResult && !isAnalyzing && !error && (
        <div className="text-center py-16 text-surface-200/30">
          <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <h3 className="text-lg font-medium mb-1">Select a student and run analysis</h3>
          <p className="text-sm">The agentic AI pipeline will evaluate all company matches</p>
        </div>
      )}
    </div>
  );
}
