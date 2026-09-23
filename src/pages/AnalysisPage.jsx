import { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  FileText,
  ArrowLeft,
  ArrowRight,
  UploadCloud,
  Layers,
  Users,
  Calendar,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Copy,
  Check,
  RefreshCw,
  Scale,
  Sparkles,
  Info,
  Loader2,
  BookOpen,
  MessageSquare,
} from 'lucide-react';
import { AnalysisSkeleton } from '../components/Skeleton';
import RiskScoreGauge from '../components/RiskScoreGauge';
import { DEMO_DOCUMENT } from '../data/mockData';

/* ─── Helpers ─────────────────────────────────────────────────────────────── */

function formatBytes(bytes) {
  if (!bytes) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

const IMPORTANCE_CONFIG = {
  high: {
    label: 'High',
    bg: 'bg-red-500/10',
    border: 'border-red-500/25',
    text: 'text-red-400',
    dot: 'bg-red-400',
    badgeBg: 'bg-red-500/20',
  },
  medium: {
    label: 'Medium',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/25',
    text: 'text-amber-400',
    dot: 'bg-amber-400',
    badgeBg: 'bg-amber-500/20',
  },
  low: {
    label: 'Low',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/25',
    text: 'text-blue-400',
    dot: 'bg-blue-400',
    badgeBg: 'bg-blue-500/20',
  },
};

/* ─── Sub-components ──────────────────────────────────────────────────────── */

function SectionLabel({ children }) {
  return (
    <p className="text-[11px] font-bold uppercase tracking-widest text-violet-400 mb-3">
      {children}
    </p>
  );
}

function InfoCard({ icon: Icon, iconBg, iconColor, title, children }) {
  return (
    <div className="bg-[#0d0f1a]/80 backdrop-blur-xl rounded-2xl border border-white/[0.08] shadow-xl p-5">
      <div className="flex items-center gap-2.5 mb-3">
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center border ${iconBg}`}>
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function ClauseCard({ clause, onSelect }) {
  const cfg = IMPORTANCE_CONFIG[clause.importance] || IMPORTANCE_CONFIG.medium;
  const attentionText = `Attention: ${cfg.label}`;

  return (
    <div
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
      className={`group cursor-pointer rounded-2xl border ${cfg.border} ${cfg.bg} p-5 transition-all duration-200 hover:shadow-xl hover:border-violet-500/40 hover:-translate-y-0.5`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className={`flex-shrink-0 w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
          <h4 className="text-sm font-bold text-slate-100 group-hover:text-violet-300 transition-colors truncate">
            {clause.title}
          </h4>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${cfg.border} ${cfg.text} bg-white/[0.04]`}>
            {clause.category}
          </span>
          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${cfg.badgeBg} ${cfg.text} border ${cfg.border}`}>
            {attentionText}
          </span>
        </div>
      </div>

      <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-3">
        {clause.description}
      </p>

      <div className="flex items-center justify-between text-xs pt-2.5 border-t border-white/[0.06]">
        <span className="text-[11px] font-semibold text-violet-400 group-hover:text-violet-300 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          Click to simplify legal language
        </span>
        <span className="text-[11px] font-medium text-slate-500 group-hover:text-slate-300 flex items-center gap-1">
          Inspect Clause <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </div>
  );
}

function AttentionPoint({ text, index }) {
  return (
    <div className="flex items-start gap-3 p-3.5 bg-amber-500/5 border border-amber-500/20 rounded-xl">
      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-[10px] font-bold text-amber-300 mt-0.5">
        {index + 1}
      </div>
      <p className="text-xs text-amber-200/90 leading-relaxed">{text}</p>
    </div>
  );
}

/* ─── Loading state ──────────────────────────────────────────────────────── */

const LOADING_STEPS = [
  { icon: FileText, label: 'Reading document text…' },
  { icon: Sparkles, label: 'Identifying key clauses…' },
  { icon: Scale, label: 'Preparing structured analysis…' },
  { icon: CheckCircle, label: 'Finalizing results…' },
];

function AnalysisLoading() {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setStepIndex((i) => (i + 1) % LOADING_STEPS.length);
    }, 1800);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="bg-[#0d0f1a]/90 backdrop-blur-2xl rounded-2xl border border-white/[0.08] shadow-2xl flex flex-col items-center justify-center gap-6 py-16 px-8 text-center">
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#0d0f1a] flex items-center justify-center border border-white/20 shadow">
          <Loader2 className="w-3 h-3 text-violet-400 animate-spin" />
        </span>
      </div>

      <div>
        <p className="text-lg font-bold text-white mb-1">
          NyayaSaar is analyzing your document…
        </p>
        <p className="text-xs text-slate-400">Extracting legal intelligence and important clauses.</p>
      </div>

      <div className="flex flex-col gap-2 w-full max-w-xs">
        {LOADING_STEPS.map((s, i) => {
          const SIcon = s.icon;
          const active = i === stepIndex;
          const done = i < stepIndex;
          return (
            <div
              key={s.label}
              className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-300 ${
                active
                  ? 'bg-violet-600/15 border border-violet-500/30 text-violet-300'
                  : done
                  ? 'text-emerald-400 bg-emerald-500/5'
                  : 'text-slate-600'
              }`}
            >
              {done ? (
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              ) : (
                <SIcon className={`w-3.5 h-3.5 flex-shrink-0 ${active ? 'text-violet-400 animate-pulse' : 'text-slate-600'}`} />
              )}
              {s.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Error state ─────────────────────────────────────────────────────────── */

function AnalysisError({ error, onRetry }) {
  const isDemo = error?.code === 'NO_API_KEY';
  return (
    <div className={`rounded-2xl border p-8 text-center bg-[#0d0f1a]/90 backdrop-blur-2xl shadow-2xl ${isDemo ? 'border-amber-500/30' : 'border-red-500/30'}`}>
      <div className={`w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center ${isDemo ? 'bg-amber-500/10 border border-amber-500/25' : 'bg-red-500/10 border border-red-500/25'}`}>
        {isDemo ? (
          <Info className="w-7 h-7 text-amber-400" />
        ) : (
          <AlertTriangle className="w-7 h-7 text-red-400" />
        )}
      </div>
      <p className={`text-base font-bold mb-1.5 ${isDemo ? 'text-amber-300' : 'text-red-300'}`}>
        {isDemo ? 'API Key Required for Live AI' : 'Analysis Request Failed'}
      </p>
      <p className="text-xs text-slate-400 leading-relaxed mb-6 max-w-md mx-auto">
        {error?.message || 'An unexpected error occurred during document analysis. Please try again.'}
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="btn-primary py-2.5 px-5 text-xs shadow-lg shadow-violet-600/30"
      >
        <RefreshCw className="w-3.5 h-3.5" /> Try Again
      </button>
    </div>
  );
}

/* ─── Clause Detail Panel (Legal Language Simplifier) ─────────────────────── */

function ClauseDetailPanel({
  clause,
  documentId,
  onBack,
  explanationCache,
  onCacheExplanation,
}) {
  const cacheKey = clause.title || clause.originalText || clause.description;
  const cached = explanationCache[cacheKey];
  const [loading, setLoading] = useState(!cached);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [fetchedExplanation, setFetchedExplanation] = useState(null);
  const explanation = cached || fetchedExplanation;

  const cfg = IMPORTANCE_CONFIG[clause.importance] || IMPORTANCE_CONFIG.medium;
  const attentionText = `Attention: ${cfg.label}`;

  const fetchExplanation = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const clauseInput =
        clause.originalText ||
        `${clause.title}: ${clause.description}`;

      const res = await fetch(`/api/documents/${documentId}/explain-clause`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clause: clauseInput }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Could not explain this clause.');
      }

      const result = {
        originalText: data.originalText || clause.originalText || clause.description,
        simpleExplanation: data.simpleExplanation,
        whyItMatters: data.whyItMatters,
        page: data.page ?? clause.page ?? null,
        _isDemo: data._isDemo,
      };

      setFetchedExplanation(result);
      onCacheExplanation(cacheKey, result);
    } catch (err) {
      setError(err.message || 'Failed to explain clause.');
    } finally {
      setLoading(false);
    }
  }, [cacheKey, clause, documentId, onCacheExplanation]);

  useEffect(() => {
    if (cached) return;

    let cancelled = false;
    const clauseInput = clause.originalText || `${clause.title}: ${clause.description}`;

    fetch(`/api/documents/${documentId}/explain-clause`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clause: clauseInput }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (!data.success) {
          throw new Error(data.error || 'Could not explain this clause.');
        }
        const result = {
          originalText: data.originalText || clause.originalText || clause.description,
          simpleExplanation: data.simpleExplanation,
          whyItMatters: data.whyItMatters,
          page: data.page ?? clause.page ?? null,
          _isDemo: data._isDemo,
        };
        setFetchedExplanation(result);
        onCacheExplanation(cacheKey, result);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message || 'Failed to explain clause.');
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [cached, cacheKey, clause, documentId, onCacheExplanation]);

  const handleCopyOriginal = () => {
    const textToCopy = explanation?.originalText || clause.originalText || clause.description;
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Top navigation bar ── */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white bg-white/[0.04] border border-white/[0.08] shadow-sm px-3.5 py-1.5 rounded-xl hover:bg-white/[0.08] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-slate-400" />
          Back to Analysis
        </button>

        {/* AI Explanation Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-600/15 border border-violet-500/25 text-violet-300 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          AI Explanation
        </div>
      </div>

      {/* ── Clause Header Card ── */}
      <div className="bg-[#0d0f1a]/80 backdrop-blur-xl rounded-2xl border border-white/[0.08] shadow-2xl p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-600/15 border border-violet-500/25 flex items-center justify-center text-violet-400 flex-shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{clause.title}</h2>
              <p className="text-xs text-slate-400 font-medium">{clause.category} Clause</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${cfg.border} ${cfg.badgeBg} ${cfg.text}`}>
              <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
              {attentionText}
            </span>
          </div>
        </div>
      </div>

      {/* ── Loading State ── */}
      {loading && (
        <div className="bg-[#0d0f1a]/80 backdrop-blur-xl rounded-2xl border border-white/[0.08] shadow-2xl p-10 flex flex-col items-center text-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-violet-600/15 border border-violet-500/25 flex items-center justify-center text-violet-400">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">
              Simplifying legal language…
            </p>
            <p className="text-xs text-slate-400">
              Translating complex legal terms into plain everyday language
            </p>
          </div>
        </div>
      )}

      {/* ── Error State ── */}
      {error && !loading && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-center space-y-3">
          <p className="text-sm font-bold text-red-300">Unable to explain clause</p>
          <p className="text-xs text-red-200/80">{error}</p>
          <button
            type="button"
            onClick={fetchExplanation}
            className="btn-secondary text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Try Again
          </button>
        </div>
      )}

      {/* ── Visual Hierarchy: 1. Original text -> 2. Simple explanation -> 3. Why it matters -> 4. Source ── */}
      {!loading && !error && explanation && (
        <div className="space-y-5">
          {/* 1. ORIGINAL LEGAL LANGUAGE */}
          <div className="bg-[#0d0f1a]/80 backdrop-blur-xl rounded-2xl border border-white/[0.08] shadow-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-400" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  Original Legal Language
                </h3>
              </div>
              <button
                type="button"
                onClick={handleCopyOriginal}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] px-2.5 py-1 rounded-lg transition-colors"
                title="Copy original legal text"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300 font-semibold">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] font-serif text-xs sm:text-sm text-slate-300 leading-relaxed italic border-l-4 border-l-violet-500/60">
              "{explanation.originalText || clause.originalText || clause.description}"
            </div>
          </div>

          {/* 2. IN SIMPLE LANGUAGE */}
          <div className="bg-gradient-to-br from-violet-600/10 via-[#0d0f1a]/80 to-indigo-600/10 rounded-2xl border border-violet-500/30 shadow-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-violet-300">
                In Simple Language
              </h3>
            </div>
            <p className="text-sm text-slate-200 font-medium leading-relaxed">
              {explanation.simpleExplanation}
            </p>
          </div>

          {/* 3. WHY THIS MATTERS */}
          <div className="bg-[#0d0f1a]/80 backdrop-blur-xl rounded-2xl border border-white/[0.08] shadow-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Why This Matters
              </h3>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              {explanation.whyItMatters}
            </p>
          </div>

          {/* 4. SOURCE */}
          <div className="bg-[#0d0f1a]/80 backdrop-blur-xl rounded-2xl border border-white/[0.08] shadow-2xl p-5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Layers className="w-4 h-4 text-slate-400" />
              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  Source
                </h3>
                <p className="text-xs text-slate-300 font-medium mt-0.5">
                  {explanation.page
                    ? `Page ${explanation.page} of uploaded document`
                    : 'Extracted from document content'}
                </p>
              </div>
            </div>
            {explanation.page && (
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/[0.04] text-slate-300 border border-white/[0.08]">
                Page {explanation.page}
              </span>
            )}
          </div>

          {/* ── Back to Analysis Button ── */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="button"
              onClick={onBack}
              className="btn-primary w-full sm:w-auto px-6 py-2.5"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Analysis
            </button>
            <p className="text-[11px] text-slate-500 italic text-center sm:text-right">
              NyayaSaar provides general legal information, not formal legal advice.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Main AnalysisPage ───────────────────────────────────────────────────── */

export default function AnalysisPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [document, setDocument] = useState(() => {
    if (location.state?.document) return location.state.document;
    if (location.state?.demo) return DEMO_DOCUMENT;
    try {
      const saved = sessionStorage.getItem('nyayasaar_active_document');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Sync if location.state changes after mount
  useEffect(() => {
    if (location.state?.document) {
      setDocument(location.state.document);
    } else if (location.state?.demo) {
      setDocument(DEMO_DOCUMENT);
    }
  }, [location.state]);

  const [analysisState, setAnalysisState] = useState('idle'); // idle | loading | done | error
  const [analysis, setAnalysis] = useState(null);
  const [analysisError, setAnalysisError] = useState(null);
  const [copied, setCopied] = useState(false);

  // Interactive Legal Language Simplifier state
  const [selectedClause, setSelectedClause] = useState(null);
  const [clauseCache, setClauseCache] = useState({});

  const handleCacheExplanation = useCallback((key, data) => {
    setClauseCache((prev) => ({ ...prev, [key]: data }));
  }, []);

  const runAnalysis = useCallback(async () => {
    if (!document?.documentId) return;

    setAnalysisState('loading');
    setAnalysisError(null);

    try {
      const res = await fetch(`/api/documents/${document.documentId}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw { message: data.error || 'Analysis request failed.', code: data.code };
      }

      setAnalysis(data.analysis);
      setAnalysisState('done');
    } catch (err) {
      setAnalysisError(err);
      setAnalysisState('error');
    }
  }, [document]);

  // Trigger analysis on mount if documentId is present and persist active doc
  const hasDocumentId = Boolean(document?.documentId);
  useEffect(() => {
    if (document) {
      try {
        sessionStorage.setItem('nyayasaar_active_document', JSON.stringify(document));
      } catch {
        // Safe fallback
      }
    }
    if (hasDocumentId) {
      runAnalysis();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasDocumentId, document]);

  const handleCopy = () => {
    if (document?.text) {
      navigator.clipboard.writeText(document.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // No document in state: show helpful prompt
  if (!document) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[60vh] gap-5 px-4 text-center">
        <div className="w-16 h-16 bg-violet-600/10 rounded-2xl flex items-center justify-center border border-violet-500/20">
          <FileText className="w-8 h-8 text-violet-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white mb-1">No Document Loaded</h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xs">
            Upload a PDF document first, then click "Continue to Analysis" to see the AI-powered breakdown.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/upload')}
          className="btn-primary"
        >
          <UploadCloud className="w-4 h-4" /> Upload a Document
        </button>
      </div>
    );
  }

  /* ─── Main two-column layout ───────────────────────────────────────────── */

  return (
    <div className="min-h-full px-4 sm:px-6 lg:px-8 py-8">
      {/* Top nav bar */}
      <div className="max-w-7xl mx-auto flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={() => {
            if (selectedClause) {
              setSelectedClause(null);
            } else {
              navigate('/upload');
            }
          }}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {selectedClause ? 'Back to Analysis' : 'Back to Upload'}
        </button>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => navigate('/ask', { state: { document } })}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-600/15 border border-violet-500/25 text-violet-300 hover:bg-violet-600/25 text-xs font-semibold shadow-xs transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5 text-violet-400" />
            <span>Ask NyayaSaar</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/upload')}
            className="btn-secondary text-xs py-1.5 px-3"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            Upload Another
          </button>
        </div>
      </div>

      {/* Two-column grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-[380px_1fr] gap-6 items-start">

        {/* ── LEFT: Document info & source text ─────────────────────────── */}
        <div className="space-y-4 xl:sticky xl:top-6">
          {/* Document metadata card */}
          <div className="bg-[#0d0f1a]/80 backdrop-blur-xl rounded-2xl border border-white/[0.08] shadow-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-white/[0.07] bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-white truncate" title={document.fileName}>
                  {document.fileName}
                </p>
                <p className="text-xs text-white/70">Legal Document</p>
              </div>
            </div>

            <div className="grid grid-cols-3 divide-x divide-white/[0.06] border-b border-white/[0.06]">
              {[
                { label: 'Pages', value: document.pageCount ?? '—' },
                { label: 'Words', value: document.wordCount ? document.wordCount.toLocaleString() : '—' },
                { label: 'Size', value: formatBytes(document.fileSize) },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col items-center py-3 gap-0.5">
                  <span className="text-sm font-bold text-slate-100">{value}</span>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold tracking-wide">{label}</span>
                </div>
              ))}
            </div>

            <div className="px-5 py-4">
              {document.warning && (
                <div className="mb-3 flex items-start gap-2 p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-amber-300">{document.warning}</p>
                </div>
              )}
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Extracted Text
              </p>
              <div className="relative">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="absolute top-2 right-2 z-10 inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg border border-white/[0.1] bg-[#121524] shadow-sm text-slate-400 hover:text-white transition-colors"
                >
                  {copied ? (
                    <><Check className="w-3 h-3 text-emerald-400" /> Copied</>
                  ) : (
                    <><Copy className="w-3 h-3" /> Copy</>
                  )}
                </button>
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-3 max-h-64 overflow-y-auto font-mono text-[11px] text-slate-300 leading-relaxed whitespace-pre-wrap select-text">
                  {document.text || <span className="text-slate-500 italic">No extractable text.</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Risk Score Gauge — shown when analysis is ready */}
          {analysisState === 'done' && analysis?.clauses && (
            <RiskScoreGauge clauses={analysis.clauses} />
          )}
        </div>

        {/* ── RIGHT: AI Analysis or Clause Detail Panel ─────────────────── */}
        <div className="space-y-5">

          {/* Loading state */}
          {analysisState === 'loading' && (
            <div className="space-y-6">
              <AnalysisLoading />
              <AnalysisSkeleton />
            </div>
          )}

          {/* Error state */}
          {analysisState === 'error' && (
            <AnalysisError error={analysisError} onRetry={runAnalysis} />
          )}

          {/* Detailed Clause Simplifier view */}
          {analysisState === 'done' && selectedClause && (
            <ClauseDetailPanel
              clause={selectedClause}
              documentId={document.documentId}
              onBack={() => setSelectedClause(null)}
              explanationCache={clauseCache}
              onCacheExplanation={handleCacheExplanation}
            />
          )}

          {/* Main Analysis Results view (when no clause is currently selected) */}
          {analysisState === 'done' && analysis && !selectedClause && (
            <>
              {/* Demo banner */}
              {analysis._isDemo && (
                <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/25 rounded-2xl">
                  <Info className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-slate-300">
                    <p className="font-bold text-amber-300 mb-0.5">Demo Analysis Mode</p>
                    <p>
                      Add your <code className="bg-amber-500/20 text-amber-300 px-1 py-0.5 rounded font-mono">GEMINI_API_KEY</code> to{' '}
                      <code className="bg-amber-500/20 text-amber-300 px-1 py-0.5 rounded font-mono">.env</code> (or Vercel Settings) to enable live Gemini AI.
                      Get a key at{' '}
                      <a
                        href="https://aistudio.google.com/app/apikey"
                        target="_blank"
                        rel="noreferrer"
                        className="underline text-amber-400 font-semibold"
                      >
                        Google AI Studio
                      </a>.
                    </p>
                  </div>
                </div>
              )}

              {/* Document type + section label */}
              <div>
                <SectionLabel>AI Analysis</SectionLabel>
                <div className="flex items-center gap-2">
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-full shadow-lg shadow-violet-500/20">
                    <Scale className="w-4 h-4" />
                    {analysis.documentType || 'Legal Document'}
                  </div>
                </div>
              </div>

              {/* Top info cards — Parties · Dates · Financial */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <InfoCard icon={Users} iconBg="bg-blue-500/10 border-blue-500/20" iconColor="text-blue-400" title="Parties Involved">
                  {analysis.parties?.length ? (
                    <ul className="space-y-1.5">
                      {analysis.parties.map((p, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-slate-300">
                          <span className="w-4 h-4 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center text-[9px] font-bold flex-shrink-0">
                            {i + 1}
                          </span>
                          {p}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-slate-500 italic">Not identified</p>
                  )}
                </InfoCard>

                <InfoCard icon={Calendar} iconBg="bg-violet-500/10 border-violet-500/20" iconColor="text-violet-400" title="Important Dates">
                  {analysis.importantDates?.length ? (
                    <ul className="space-y-1.5">
                      {analysis.importantDates.map((d, i) => (
                        <li key={i} className="text-xs text-slate-300 leading-snug">{d}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-slate-500 italic">None found</p>
                  )}
                </InfoCard>

                <InfoCard icon={DollarSign} iconBg="bg-emerald-500/10 border-emerald-500/20" iconColor="text-emerald-400" title="Financial Terms">
                  {analysis.financialTerms?.length ? (
                    <ul className="space-y-1.5">
                      {analysis.financialTerms.map((f, i) => (
                        <li key={i} className="text-xs text-slate-300 leading-snug">{f}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-slate-500 italic">None found</p>
                  )}
                </InfoCard>
              </div>

              {/* Summary */}
              {analysis.summary && (
                <div className="bg-[#0d0f1a]/80 backdrop-blur-xl rounded-2xl border border-white/[0.08] shadow-2xl p-5">
                  <SectionLabel>Document Summary</SectionLabel>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{analysis.summary}</p>
                </div>
              )}

              {/* Important Clauses with Clickable Cards */}
              {analysis.importantClauses?.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <SectionLabel>
                      Important Clauses ({analysis.importantClauses.length})
                    </SectionLabel>
                    <span className="text-[11px] text-slate-500 font-medium">
                      Click any clause to inspect & simplify
                    </span>
                  </div>
                  <div className="space-y-3">
                    {analysis.importantClauses.map((clause, i) => (
                      <ClauseCard
                        key={i}
                        clause={clause}
                        onSelect={() => setSelectedClause(clause)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Attention Points */}
              {analysis.attentionPoints?.length > 0 && (
                <div>
                  <SectionLabel>
                    Attention Points ({analysis.attentionPoints.length})
                  </SectionLabel>
                  <div className="space-y-2.5">
                    {analysis.attentionPoints.map((pt, i) => (
                      <AttentionPoint key={i} text={pt} index={i} />
                    ))}
                  </div>
                </div>
              )}

              {/* Legal Disclaimer */}
              <div className="flex items-start gap-3 p-5 bg-white/[0.02] border border-white/[0.06] rounded-2xl">
                <Scale className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-slate-300 mb-0.5">Legal Disclaimer</p>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    This analysis provides general legal information and is not a substitute for
                    professional legal advice. NyayaSaar does not provide legal advice and is not
                    a law firm. Always consult a qualified lawyer before making decisions based on
                    this analysis.
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Idle state (no document ID — show guidance) */}
          {analysisState === 'idle' && (
            <div className="bg-[#0d0f1a]/80 backdrop-blur-xl rounded-2xl border border-white/[0.08] shadow-2xl p-8 flex flex-col items-center gap-4 text-center">
              <div className="w-14 h-14 rounded-2xl bg-white/[0.04] flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-slate-500" />
              </div>
              <div>
                <p className="text-sm font-bold text-white mb-1">AI Analysis Not Started</p>
                <p className="text-xs text-slate-400 max-w-xs">
                  Upload a PDF from the Upload page and click "Continue to Analysis" to get your AI-powered legal document breakdown.
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/upload')}
                className="btn-primary text-xs"
              >
                <UploadCloud className="w-3.5 h-3.5" /> Upload a Document
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
