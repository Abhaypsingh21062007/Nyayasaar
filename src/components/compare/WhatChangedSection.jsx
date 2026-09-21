import { useState } from 'react';
import {
  Sparkles,
  Info,
  CheckCircle,
  Copy,
  Check,
  Scale,
  ArrowRight,
} from 'lucide-react';

function DiffCard({ diff, index }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `${diff.topic}: ${diff.explanation} (Doc A: ${diff.documentA} vs Doc B: ${diff.documentB})`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card p-5 hover:border-blue-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between gap-3">
      <div>
        {/* Top Topic Tag & Copy Button */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-md bg-blue-100 text-blue-700 font-bold text-[11px] flex items-center justify-center">
              {index + 1}
            </span>
            <h4 className="text-sm font-bold text-slate-900">{diff.topic}</h4>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-md hover:bg-slate-100 transition-colors"
            title="Copy this explanation"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Diff Comparison Tag */}
        <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs font-medium mb-3 flex-wrap">
          <span className="text-slate-600 truncate max-w-[140px] sm:max-w-xs">
            {diff.documentA}
          </span>
          <ArrowRight className="w-3 h-3 text-blue-500 flex-shrink-0" />
          <span className="text-violet-900 font-bold truncate max-w-[140px] sm:max-w-xs">
            {diff.documentB}
          </span>
        </div>

        {/* AI Plain Language Explanation */}
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans select-text">
          {diff.explanation}
        </p>
      </div>

      <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
        <Sparkles className="w-3 h-3 text-blue-500" />
        <span>Neutral Informational Note</span>
      </div>
    </div>
  );
}

export default function WhatChangedSection({ summary, differences = [], isDemo = false }) {
  const [copiedSummary, setCopiedSummary] = useState(false);

  const handleCopySummary = () => {
    if (summary) {
      navigator.clipboard.writeText(summary);
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2000);
    }
  };

  return (
    <section className="space-y-6">
      {/* ── Executive Summary Box ───────────────────────────────────────────── */}
      {summary && (
        <div className="bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/50 rounded-3xl border border-blue-200/90 shadow-card p-6 sm:p-7 relative overflow-hidden">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Comparison Summary
                </h3>
                <p className="text-xs text-slate-500">
                  Plain-language overview of the overall changes
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCopySummary}
              className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-xl bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 transition-colors shadow-xs"
            >
              {copiedSummary ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Summary</span>
                </>
              )}
            </button>
          </div>

          <p className="text-sm sm:text-[15px] text-slate-800 leading-relaxed font-medium select-text">
            {summary}
          </p>

          {isDemo && (
            <div className="mt-4 flex items-center gap-2 text-xs text-amber-800 bg-amber-50 border border-amber-200/80 px-3 py-1.5 rounded-xl w-fit">
              <Info className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
              <span>Demo Mode: Configure GEMINI_API_KEY for live custom comparisons.</span>
            </div>
          )}
        </div>
      )}

      {/* ── "What Changed?" Section ────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
              What Changed?
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              AI-generated plain-language explanations of each identified difference
            </p>
          </div>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            {differences.length} changes identified
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {differences.map((diff, idx) => (
            <DiffCard key={idx} diff={diff} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
