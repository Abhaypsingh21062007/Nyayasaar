import { FileText, AlertTriangle, CheckCircle, ChevronRight, Sparkles, Clock, Shield } from 'lucide-react';
import { mockDocument } from '../data/mockData';

/* ── Left: document viewer panel ───────────────────────── */
function DocumentPanel() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-card-md overflow-hidden h-full flex flex-col">

      {/* Top bar */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 bg-slate-50">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-300" />
          <span className="w-3 h-3 rounded-full bg-yellow-300" />
          <span className="w-3 h-3 rounded-full bg-green-300" />
        </div>
        <div className="flex items-center gap-2 ml-2">
          <FileText className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-semibold text-slate-700">{mockDocument.name}</span>
        </div>
      </div>

      {/* Document meta */}
      <div className="grid grid-cols-2 gap-4 p-5 border-b border-slate-100">
        <div>
          <p className="text-xs text-slate-400 mb-0.5">Document Type</p>
          <p className="text-sm font-semibold text-slate-800">{mockDocument.type}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400 mb-0.5">Duration</p>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <p className="text-sm font-semibold text-slate-800">{mockDocument.duration}</p>
          </div>
        </div>
        <div>
          <p className="text-xs text-slate-400 mb-0.5">Security Deposit</p>
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-slate-400" />
            <p className="text-sm font-semibold text-slate-800">{mockDocument.deposit}</p>
          </div>
        </div>
        <div>
          <p className="text-xs text-slate-400 mb-0.5">Status</p>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-xs font-semibold">
            <CheckCircle className="w-3 h-3" /> Analyzed
          </span>
        </div>
      </div>

      {/* Mock doc lines */}
      <div className="flex-1 p-5 overflow-hidden">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Document Preview</p>
        <div className="space-y-2">
          {[100, 90, 95, 70, 85, 80, 60, 75].map((w, i) => (
            <div
              key={i}
              className="h-2 rounded-full bg-slate-100"
              style={{ width: `${w}%` }}
            />
          ))}
          {/* Highlighted section */}
          <div className="h-2 rounded-full bg-amber-200 w-4/5" />
          <div className="h-2 rounded-full bg-amber-200 w-3/5" />
          {[85, 70, 90].map((w, i) => (
            <div key={`b${i}`} className="h-2 rounded-full bg-slate-100" style={{ width: `${w}%` }} />
          ))}
        </div>
      </div>

      {/* Attention footer */}
      <div className="px-5 pb-5">
        <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold text-amber-700">Attention Points</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {mockDocument.attentionPoints.map((point) => (
              <span
                key={point}
                className="px-2 py-0.5 bg-white border border-amber-200 text-amber-700 text-xs font-medium rounded-full"
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
    <div className="bg-white rounded-2xl border border-slate-200 shadow-card-md overflow-hidden h-full flex flex-col">

      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100 bg-slate-50">
        <Sparkles className="w-4 h-4 text-blue-500" />
        <span className="text-sm font-semibold text-slate-700">AI Analysis</span>
      </div>

      {/* Summary */}
      <div className="p-5 border-b border-slate-100">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Summary</p>
        <p className="text-sm text-slate-600 leading-relaxed">{mockDocument.summary}</p>
      </div>

      {/* Clauses */}
      <div className="p-5 flex-1 overflow-hidden">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Key Clauses</p>
        <div className="space-y-3">
          {mockDocument.clauses.map((clause) => (
            <div
              key={clause.title}
              className={`rounded-xl border p-4 transition-colors ${
                clause.tag === 'Attention'
                  ? 'bg-amber-50/60 border-amber-100'
                  : 'bg-slate-50 border-slate-100'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <span className="text-sm font-semibold text-slate-800">{clause.title}</span>
                <span
                  className={`flex-shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full ${
                    clause.tag === 'Attention'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {clause.tag}
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">{clause.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Ask AI row */}
      <div className="px-5 pb-5">
        <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-100 rounded-xl cursor-pointer hover:bg-blue-100 transition-colors group">
          <div className="flex-1 text-sm text-slate-400 font-medium">Ask a question about this document…</div>
          <ChevronRight className="w-4 h-4 text-blue-400 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </div>
  );
}

/* ── Product Preview section ────────────────────────────── */
export default function ProductPreview() {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="text-center mb-14">
          <p className="section-label mb-3">Product Preview</p>
          <h2 className="section-title">See NyayaSaar in action</h2>
          <p className="section-sub mt-4 max-w-xl mx-auto">
            Upload a document and instantly get a structured, AI-powered view of what it contains.
          </p>
        </div>

        {/* Dashboard layout */}
        <div className="grid lg:grid-cols-2 gap-5 max-h-[640px]">
          <DocumentPanel />
          <AIPanel />
        </div>
      </div>
    </section>
  );
}
