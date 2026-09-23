import { FileText, AlertTriangle, CheckCircle, ChevronRight, Sparkles, Clock, Shield } from 'lucide-react';
import { mockDocument } from '../data/mockData';

/* ── Left: document viewer panel ───────────────────────── */
function DocumentPanel() {
  return (
    <div className="bg-[#0d0f1a]/90 backdrop-blur-2xl rounded-2xl border border-white/[0.08] shadow-2xl overflow-hidden h-full flex flex-col">

      {/* Top bar */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.07] bg-white/[0.02]">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
        </div>
        <div className="flex items-center gap-2 ml-2">
          <FileText className="w-4 h-4 text-violet-400" />
          <span className="text-xs font-semibold text-slate-200">{mockDocument.name}</span>
        </div>
      </div>

      {/* Document meta */}
      <div className="grid grid-cols-2 gap-4 p-5 border-b border-white/[0.06]">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-slate-500 mb-0.5 font-medium">Document Type</p>
          <p className="text-xs sm:text-sm font-semibold text-slate-200">{mockDocument.type}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wider text-slate-500 mb-0.5 font-medium">Duration</p>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <p className="text-xs sm:text-sm font-semibold text-slate-200">{mockDocument.duration}</p>
          </div>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wider text-slate-500 mb-0.5 font-medium">Security Deposit</p>
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-slate-400" />
            <p className="text-xs sm:text-sm font-semibold text-slate-200">{mockDocument.deposit}</p>
          </div>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wider text-slate-500 mb-0.5 font-medium">Status</p>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-[11px] font-semibold">
            <CheckCircle className="w-3 h-3" /> Analyzed
          </span>
        </div>
      </div>

      {/* Mock doc lines */}
      <div className="flex-1 p-5 overflow-hidden">
        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-3">Document Preview</p>
        <div className="space-y-2.5">
          {[100, 90, 95, 70, 85, 80, 60, 75].map((w, i) => (
            <div
              key={i}
              className="h-2 rounded-full bg-white/[0.06]"
              style={{ width: `${w}%` }}
            />
          ))}
          {/* Highlighted section */}
          <div className="h-2 rounded-full bg-amber-400/40 w-4/5" />
          <div className="h-2 rounded-full bg-amber-400/40 w-3/5" />
          {[85, 70, 90].map((w, i) => (
            <div key={`b${i}`} className="h-2 rounded-full bg-white/[0.06]" style={{ width: `${w}%` }} />
          ))}
        </div>
      </div>

      {/* Attention footer */}
      <div className="px-5 pb-5">
        <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-amber-300">Attention Points</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {mockDocument.attentionPoints.map((point) => (
              <span
                key={point}
                className="px-2.5 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium rounded-full"
              >
                {point}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Right: AI analysis panel ───────────────────────────── */
function AIPanel() {
  return (
    <div className="bg-[#0d0f1a]/90 backdrop-blur-2xl rounded-2xl border border-white/[0.08] shadow-2xl overflow-hidden h-full flex flex-col">

      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-4 border-b border-white/[0.07] bg-white/[0.02]">
        <Sparkles className="w-4 h-4 text-violet-400" />
        <span className="text-xs font-semibold text-slate-200">AI Analysis Breakdown</span>
      </div>

      {/* Summary */}
      <div className="p-5 border-b border-white/[0.06]">
        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-2">Summary</p>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{mockDocument.summary}</p>
      </div>

      {/* Clauses */}
      <div className="p-5 flex-1 overflow-hidden">
        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-3">Key Clauses</p>
        <div className="space-y-3">
          {mockDocument.clauses.map((clause) => (
            <div
              key={clause.title}
              className={`rounded-xl border p-3.5 transition-colors ${
                clause.tag === 'Attention'
                  ? 'bg-amber-500/5 border-amber-500/20'
                  : 'bg-white/[0.02] border-white/[0.06]'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <span className="text-xs sm:text-sm font-semibold text-slate-200">{clause.title}</span>
                <span
                  className={`flex-shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    clause.tag === 'Attention'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-white/[0.06] text-slate-400'
                  }`}
                >
                  {clause.tag}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{clause.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Ask AI row */}
      <div className="px-5 pb-5">
        <div className="flex items-center gap-2 p-3 bg-violet-600/10 border border-violet-500/20 rounded-xl cursor-pointer hover:bg-violet-600/20 transition-all group">
          <div className="flex-1 text-xs text-slate-300 font-medium">Ask a question about this document…</div>
          <ChevronRight className="w-4 h-4 text-violet-400 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </div>
  );
}

/* ── Product Preview section ────────────────────────────── */
export default function ProductPreview() {
  return (
    <section className="py-20 md:py-28 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="text-center mb-16">
          <p className="section-label">Product Preview</p>
          <h2 className="section-title">See NyayaSaar in action</h2>
          <p className="section-sub mt-4 max-w-xl mx-auto">
            Upload any document and instantly get a structured, AI-powered view of everything inside.
          </p>
        </div>

        {/* Dashboard layout */}
        <div className="grid lg:grid-cols-2 gap-6">
          <DocumentPanel />
          <AIPanel />
        </div>
      </div>
    </section>
  );
}
