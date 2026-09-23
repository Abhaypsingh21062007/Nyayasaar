import { Link, useNavigate } from 'react-router-dom';
import {
  CheckCircle,
  AlertTriangle,
  FileText,
  Sparkles,
  ChevronRight,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { DEMO_DOCUMENT } from '../data/mockData';

/* ── Small reusable pieces ─────────────────────────────── */
function StatusPill({ icon: Icon, color, text }) {
  const colors = {
    green: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  };
  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${colors[color]}`}>
      <Icon className="w-3.5 h-3.5" />
      {text}
    </div>
  );
}

function MockTabButton({ label, active }) {
  return (
    <button
      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
        active
          ? 'bg-violet-600/30 text-violet-200 border border-violet-500/40 shadow-sm'
          : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
      }`}
    >
      {label}
    </button>
  );
}

/* ── The mock document analysis widget ─────────────────── */
function MockDocumentWidget({ onTryDemo }) {
  return (
    <div className="relative w-full max-w-sm mx-auto lg:mx-0 lg:ml-auto">
      {/* Decorative glow blob behind card */}
      <div className="absolute -inset-1 bg-gradient-to-r from-violet-600/30 to-indigo-600/30 rounded-3xl blur-xl opacity-75 -z-10" />

      {/* Main card */}
      <div className="relative bg-[#0d0f1a]/90 backdrop-blur-2xl rounded-2xl border border-white/[0.1] shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.07] bg-white/[0.02]">
          <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md shadow-violet-500/20">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-100 truncate">Rental Agreement.pdf</p>
            <p className="text-xs text-slate-400">Uploaded just now</p>
          </div>
        </div>

        {/* AI Analysis label */}
        <div className="flex items-center gap-2 px-4 pt-4 pb-2">
          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          <span className="text-[11px] font-bold uppercase tracking-widest text-violet-400">AI Analysis</span>
        </div>

        {/* Tab bar */}
        <div className="flex items-center gap-1.5 px-4 pb-3">
          <MockTabButton label="Document Summary" active={true} />
          <MockTabButton label="Clauses" active={false} />
          <MockTabButton label="Ask AI" active={false} />
        </div>

        {/* Status pills */}
        <div className="flex flex-wrap gap-2 px-4 pb-3">
          <StatusPill icon={CheckCircle} color="green" text="Document analyzed" />
          <StatusPill icon={AlertTriangle} color="amber" text="3 clauses need attention" />
        </div>

        {/* Summary block */}
        <div className="mx-4 mb-3 p-3 bg-white/[0.03] rounded-xl border border-white/[0.06]">
          <p className="text-xs font-semibold text-slate-200 mb-1 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-violet-400" /> Summary
          </p>
          <p className="text-xs text-slate-400 leading-relaxed">
            This is a fixed-term residential rental agreement for 11 months. Three clauses — termination,
            security deposit, and notice period — require your attention.
          </p>
        </div>

        {/* Clause list */}
        <div className="px-4 mb-4 space-y-2">
          {[
            { label: 'Termination Clause', tag: 'Attention' },
            { label: 'Security Deposit', tag: 'Attention' },
            { label: 'Notice Period', tag: 'Attention' },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between p-2.5 rounded-xl border border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 transition-colors"
            >
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span className="text-xs font-medium text-slate-200">{item.label}</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            </div>
          ))}
        </div>

        {/* CTA inside widget */}
        <div className="px-4 pb-4">
          <button
            onClick={onTryDemo}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl transition-all shadow-lg shadow-violet-600/30 active:scale-[0.98]"
          >
            View Full Analysis <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Hero section ───────────────────────────────────────── */
export default function Hero() {
  const navigate = useNavigate();

  const handleTryDemo = () => {
    navigate('/analysis', {
      state: {
        document: DEMO_DOCUMENT,
        demo: true,
      },
    });
  };

  return (
    <section
      id="home"
      className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-600/15 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-indigo-600/15 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left column */}
          <div className="flex flex-col gap-6">
            {/* Badge */}
            <div className="inline-flex w-fit items-center gap-2 px-3 py-1.5 bg-violet-500/10 border border-violet-500/25 rounded-full backdrop-blur-md">
              <span className="text-violet-400 text-xs font-bold">✦</span>
              <span className="text-xs font-semibold text-violet-300">
                AI-Powered Legal Document Intelligence
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold text-white leading-[1.15] tracking-tight">
              Understand Legal Information.{' '}
              <span className="animate-shimmer">Without the Legal Jargon.</span>
            </h1>

            {/* Sub-text */}
            <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-lg">
              NyayaSaar breaks down complex agreements, highlights hidden clauses, compares contract revisions, and answers your questions — instantly in plain language.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link
                to="/upload"
                className="btn-primary py-3 px-6 text-sm shadow-xl shadow-violet-600/30"
              >
                Analyze a Document <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                type="button"
                onClick={handleTryDemo}
                className="btn-secondary py-3 px-6 text-sm"
              >
                Try Interactive Demo
              </button>
            </div>

            {/* Disclaimer */}
            <p className="text-xs text-slate-500 mt-1 max-w-md leading-relaxed">
              NyayaSaar provides general legal information and document assistance,
              not professional legal advice.
            </p>
          </div>

          {/* Right column — mock widget */}
          <MockDocumentWidget onTryDemo={handleTryDemo} />
        </div>
      </div>
    </section>
  );
}
