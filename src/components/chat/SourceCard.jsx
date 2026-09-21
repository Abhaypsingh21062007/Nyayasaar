import { useState } from 'react';
import {
  FileText,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Layers,
  Sparkles,
  Eye,
  Zap,
} from 'lucide-react';

export default function SourceCard({ source, index = 0 }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!source) return null;

  const handleCopy = (e) => {
    e.stopPropagation();
    if (source.text) {
      navigator.clipboard.writeText(source.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const clauseTitle = source.clause || `Clause Citation #${index + 1}`;
  const pageLabel =
    typeof source.page === 'number'
      ? `Page ${source.page}`
      : source.page
      ? `Page ${source.page}`
      : 'Document Body';

  // Relevance percentage badge
  const relevancePct =
    typeof source.relevance === 'number'
      ? Math.round(source.relevance * (source.relevance > 1 ? 1 : 100))
      : null;

  const relevanceColor =
    relevancePct !== null
      ? relevancePct >= 80
        ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
        : relevancePct >= 50
        ? 'bg-amber-100 text-amber-800 border-amber-200'
        : 'bg-slate-100 text-slate-700 border-slate-200'
      : '';

  return (
    <div className="rounded-xl border border-blue-200/80 bg-blue-50/40 hover:bg-blue-50/70 transition-all duration-200 overflow-hidden shadow-sm">
      {/* Top Source Summary Bar */}
      <div className="p-3.5 flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5 min-w-0">
          <div className="w-6 h-6 rounded-md bg-blue-600/10 border border-blue-200 flex items-center justify-center flex-shrink-0 mt-0.5">
            <FileText className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">
                Source:
              </span>
              <h4 className="text-xs font-bold text-slate-900 truncate" title={clauseTitle}>
                {clauseTitle}
              </h4>
            </div>

            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100/90 text-blue-800 border border-blue-200">
                <Layers className="w-2.5 h-2.5" />
                {pageLabel}
              </span>

              {/* Relevance Score Badge */}
              {relevancePct !== null && (
                <span
                  className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${relevanceColor}`}
                >
                  <Zap className="w-2.5 h-2.5" />
                  {relevancePct}% match
                </span>
              )}
            </div>
          </div>
        </div>

        {/* View Source Button */}
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-white border border-blue-300/80 text-blue-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-xs flex-shrink-0"
        >
          <Eye className="w-3 h-3" />
          <span>{isExpanded ? 'Hide' : 'View Source'}</span>
          {isExpanded ? (
            <ChevronUp className="w-3 h-3" />
          ) : (
            <ChevronDown className="w-3 h-3" />
          )}
        </button>
      </div>

      {/* Expanded Source Text */}
      {isExpanded && (
        <div className="px-3.5 pb-3.5 pt-1 border-t border-blue-200/60 bg-white/70 source-expand">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-blue-500" />
              Verbatim Clause Text
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500 hover:text-slate-800 bg-slate-100/80 hover:bg-slate-200 px-2 py-0.5 rounded transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span className="text-emerald-700">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-slate-400" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 font-serif text-xs text-slate-800 leading-relaxed italic border-l-4 border-l-blue-500 select-text">
            {source.text ? (
              `"${source.text}"`
            ) : (
              <span className="text-slate-400 not-italic">
                Clause text excerpt referenced from document.
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
