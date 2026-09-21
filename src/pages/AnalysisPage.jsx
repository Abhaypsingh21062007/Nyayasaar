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
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-700',
    dot: 'bg-red-500',
    badgeBg: 'bg-red-100',
  },
  medium: {
    label: 'Medium',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-700',
    dot: 'bg-amber-500',
    badgeBg: 'bg-amber-100',
  },
  low: {
    label: 'Low',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
    dot: 'bg-blue-400',
    badgeBg: 'bg-blue-100',
  },
};

/* ─── Sub-components ──────────────────────────────────────────────────────── */

function SectionLabel({ children }) {
  return (
    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
      {children}
    </p>
  );
}

function InfoCard({ icon: Icon, iconBg, iconColor, title, children }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-5">
      <div className="flex items-center gap-2.5 mb-3">
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${iconBg}`}>
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">{title}</h3>
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
      className={`group cursor-pointer rounded-2xl border ${cfg.border} ${cfg.bg} p-5 transition-all duration-200 hover:shadow-md hover:border-blue-400 hover:-translate-y-0.5`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className={`flex-shrink-0 w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
          <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors truncate">
            {clause.title}
          </h4>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${cfg.border} ${cfg.text} bg-white/80`}>
            {clause.category}
          </span>
          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${cfg.badgeBg} ${cfg.text} border ${cfg.border}`}>
            {attentionText}
          </span>
        </div>
      </div>

      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-3">
        {clause.description}
      </p>

      <div className="flex items-center justify-between text-xs pt-2.5 border-t border-slate-200/60">
        <span className="text-[11px] font-semibold text-blue-600 group-hover:text-blue-700 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          Click to simplify legal language
        </span>
        <span className="text-[11px] font-medium text-slate-400 group-hover:text-slate-800 flex items-center gap-1">
          Inspect Clause <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </div>
  );
}

function AttentionPoint({ text, index }) {
  return (
    <div className="flex items-start gap-3 p-3.5 bg-amber-50 border border-amber-200 rounded-xl">
      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center text-[10px] font-bold text-white mt-0.5">
        {index + 1}
      </div>
      <p className="text-xs text-amber-900 leading-relaxed">{text}</p>
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
    <div className="bg-white rounded-2xl border border-slate-200 shadow-card flex flex-col items-center justify-center gap-6 py-16 px-8 text-center">
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white flex items-center justify-center border border-slate-200 shadow">
          <Loader2 className="w-3 h-3 text-blue-500 animate-spin" />
        </span>
      </div>

      <div>
        <p className="text-lg font-bold text-slate-900 mb-1">
          NyayaSaar is analyzing your document…
        </p>
        <p className="text-sm text-slate-500">This usually takes a few seconds.</p>
      </div>

      <div className="flex flex-col gap-2 w-full max-w-xs">
        {LOADING_STEPS.map((s, i) => {
          const SIcon = s.icon;
          const active = i === stepIndex;
          const done = i < stepIndex;
          return (
            <div
              key={s.label}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 ${
                active
                  ? 'bg-blue-50 border border-blue-200 text-blue-800'
                  : done
                  ? 'text-emerald-600'
                  : 'text-slate-300'
              }`}
            >
              {done ? (
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
              ) : (
                <SIcon className={`w-3.5 h-3.5 flex-shrink-0 ${active ? 'text-blue-500' : 'text-slate-300'}`} />
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
    <div className={`rounded-2xl border p-6 text-center ${isDemo ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200'}`}>
      <div className={`w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center ${isDemo ? 'bg-amber-100' : 'bg-red-100'}`}>
        {isDemo ? (
          <Info className="w-6 h-6 text-amber-600" />
        ) : (
          <AlertTriangle className="w-6 h-6 text-red-600" />
        )}
      </div>
      <p className={`text-sm font-bold mb-1 ${isDemo ? 'text-amber-900' : 'text-red-900'}`}>
        {isDemo ? 'API Key Not Configured' : 'Analysis Failed'}
      </p>
      <p className={`text-xs leading-relaxed mb-4 ${isDemo ? 'text-amber-800' : 'text-red-700'}`}>
        {error?.message || 'An unexpected error occurred during document analysis.'}
      </p>
      <button
        type="button"
        onClick={onRetry}
        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg ${
          isDemo ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'
        } transition-colors`}
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
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 shadow-sm px-3.5 py-1.5 rounded-xl hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-slate-500" />
          Back to Analysis
        </button>

        {/* AI Explanation Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          AI Explanation
        </div>
      </div>

      {/* ── Clause Header Card ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">{clause.title}</h2>
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
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-10 flex flex-col items-center text-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800 mb-1">
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
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center space-y-3">
          <p className="text-sm font-bold text-red-900">Unable to explain clause</p>
          <p className="text-xs text-red-700">{error}</p>
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
          <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-400" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                  Original Legal Language
                </h3>
              </div>
              <button
                type="button"
                onClick={handleCopyOriginal}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg transition-colors"
                title="Copy original legal text"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-semibold">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 font-serif text-xs sm:text-sm text-slate-800 leading-relaxed italic border-l-4 border-l-slate-400">
              "{explanation.originalText || clause.originalText || clause.description}"
            </div>
          </div>

          {/* 2. IN SIMPLE LANGUAGE */}
          <div className="bg-gradient-to-br from-blue-50/80 via-white to-blue-50/40 rounded-2xl border border-blue-200 shadow-card p-6">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-blue-900">
                In Simple Language
              </h3>
            </div>
            <p className="text-sm text-slate-800 font-medium leading-relaxed">
              {explanation.simpleExplanation}
            </p>
          </div>

          {/* 3. WHY THIS MATTERS */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6">
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-4 h-4 text-amber-600" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Why This Matters
              </h3>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              {explanation.whyItMatters}
            </p>
          </div>

          {/* 4. SOURCE */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Layers className="w-4 h-4 text-slate-400" />
              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                  Source
                </h3>
                <p className="text-xs text-slate-600 font-medium mt-0.5">
                  {explanation.page
                    ? `Page ${explanation.page} of uploaded document`
                    : 'Extracted from document content'}
                </p>
              </div>
            </div>
            {explanation.page && (
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
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
            <p className="text-[11px] text-slate-400 italic text-center sm:text-right">
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
        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100">
          <FileText className="w-8 h-8 text-blue-500" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-1">No Document Loaded</h2>
          <p className="text-sm text-slate-500 max-w-xs">
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
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {selectedClause ? 'Back to Analysis' : 'Back to Upload'}
        </button>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => navigate('/ask', { state: { document } })}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 text-xs font-semibold shadow-xs transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
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
          <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 flex items-center gap-3">
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

            <div className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100">
              {[
                { label: 'Pages', value: document.pageCount ?? '—' },
                { label: 'Words', value: document.wordCount ? document.wordCount.toLocaleString() : '—' },
                { label: 'Size', value: formatBytes(document.fileSize) },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col items-center py-3 gap-0.5">
                  <span className="text-sm font-bold text-slate-800">{value}</span>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-wide">{label}</span>
                </div>
              ))}
            </div>

            <div className="px-5 py-4">
              {document.warning && (
                <div className="mb-3 flex items-start gap-2 p-2.5 bg-amber-50 border border-amber-200 rounded-lg">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-amber-800">{document.warning}</p>
                </div>
              )}
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Extracted Text
              </p>
              <div className="relative">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="absolute top-2 right-2 z-10 inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded border border-slate-200 bg-white shadow-sm text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
                >
                  {copied ? (
                    <><Check className="w-3 h-3 text-emerald-600" /> Copied</>
                  ) : (
                    <><Copy className="w-3 h-3" /> Copy</>
                  )}
                </button>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 max-h-64 overflow-y-auto font-mono text-[11px] text-slate-700 leading-relaxed whitespace-pre-wrap select-text">
                  {document.text || <span className="text-slate-400 italic">No extractable text.</span>}
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
                <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-300 rounded-2xl">
                  <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-900">
                    <p className="font-bold text-amber-950 mb-0.5">Demo Analysis Mode</p>
                    <p>
                      Add your <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">GEMINI_API_KEY</code> to{' '}
                      <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">.env</code> and restart the backend to enable real AI analysis.
                      Get a free API key at{' '}
                      <a
                        href="https://aistudio.google.com/app/apikey"
                        target="_blank"
                        rel="noreferrer"
                        className="underline text-amber-800 font-semibold"
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
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-bold px-4 py-2 rounded-full shadow-sm">
                    <Scale className="w-4 h-4" />
                    {analysis.documentType || 'Legal Document'}
                  </div>
                </div>
              </div>

              {/* Top info cards — Parties · Dates · Financial */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <InfoCard icon={Users} iconBg="bg-blue-50" iconColor="text-blue-600" title="Parties Involved">
                  {analysis.parties?.length ? (
                    <ul className="space-y-1.5">
                      {analysis.parties.map((p, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-slate-700">
                          <span className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center text-[9px] font-bold text-blue-700 flex-shrink-0">
                            {i + 1}
                          </span>
                          {p}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-slate-400 italic">Not identified</p>
                  )}
                </InfoCard>

                <InfoCard icon={Calendar} iconBg="bg-violet-50" iconColor="text-violet-600" title="Important Dates">
                  {analysis.importantDates?.length ? (
                    <ul className="space-y-1.5">
                      {analysis.importantDates.map((d, i) => (
                        <li key={i} className="text-xs text-slate-700 leading-snug">{d}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-slate-400 italic">None found</p>
                  )}
                </InfoCard>

                <InfoCard icon={DollarSign} iconBg="bg-emerald-50" iconColor="text-emerald-600" title="Financial Terms">
                  {analysis.financialTerms?.length ? (
                    <ul className="space-y-1.5">
                      {analysis.financialTerms.map((f, i) => (
                        <li key={i} className="text-xs text-slate-700 leading-snug">{f}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-slate-400 italic">None found</p>
                  )}
                </InfoCard>
              </div>

              {/* Summary */}
              {analysis.summary && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-5">
                  <SectionLabel>Document Summary</SectionLabel>
                  <p className="text-sm text-slate-700 leading-relaxed">{analysis.summary}</p>
                </div>
              )}

              {/* Important Clauses with Clickable Cards */}
              {analysis.importantClauses?.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <SectionLabel>
                      Important Clauses ({analysis.importantClauses.length})
                    </SectionLabel>
                    <span className="text-[11px] text-slate-400 font-medium">
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
              <div className="flex items-start gap-3 p-5 bg-slate-50 border border-slate-200 rounded-2xl">
                <Scale className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-slate-700 mb-0.5">Legal Disclaimer</p>
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
            <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-8 flex flex-col items-center gap-4 text-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-slate-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800 mb-1">AI Analysis Not Started</p>
                <p className="text-xs text-slate-500 max-w-xs">
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
