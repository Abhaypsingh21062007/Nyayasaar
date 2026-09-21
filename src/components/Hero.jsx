import { Link, useNavigate } from 'react-router-dom';
import {
  CheckCircle,
  AlertTriangle,
  FileText,
  Sparkles,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { DEMO_DOCUMENT } from '../data/mockData';

/* ── Small reusable pieces ─────────────────────────────── */
function StatusPill({ icon: Icon, color, text }) {
  const colors = {
    green: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-100',
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
      className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
        active
          ? 'bg-slate-900 text-white shadow-sm'
          : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
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
      {/* Decorative shadow card behind */}
      <div className="absolute inset-0 translate-y-3 translate-x-3 bg-slate-200/50 rounded-2xl" />

      {/* Main card */}
      <div className="relative bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 bg-slate-50/50">
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center flex-shrink-0">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">Rental Agreement.pdf</p>
            <p className="text-xs text-slate-400">Uploaded just now</p>
          </div>
        </div>

        {/* AI Analysis label */}
        <div className="flex items-center gap-2 px-4 pt-4 pb-2">
          <Sparkles className="w-3.5 h-3.5 text-slate-900" />
          <span className="text-xs font-semibold uppercase tracking-widest text-slate-900">AI Analysis</span>
        </div>

        {/* Tab bar */}
        <div className="flex items-center gap-1 px-4 pb-3">
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
        <div className="mx-4 mb-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
          <p className="text-xs font-semibold text-slate-700 mb-1">Summary</p>
          <p className="text-xs text-slate-500 leading-relaxed">
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
              className="flex items-center justify-between p-2.5 rounded-lg border border-amber-100 bg-amber-50/60"
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                <span className="text-xs font-medium text-slate-700">{item.label}</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            </div>
          ))}
        </div>

        {/* CTA inside widget */}
        <div className="px-4 pb-4">
          <button
            onClick={onTryDemo}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 transition-colors shadow-sm"
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
      {/* Colorful gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-cyan-50 -z-10" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-violet-200/30 rounded-full blur-3xl -z-10" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-cyan-200/30 rounded-full blur-3xl -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left column */}
          <div className="flex flex-col gap-6">
            {/* Badge */}
            <div className="inline-flex w-fit items-center gap-2 px-3 py-1.5 bg-violet-100 border border-violet-200 rounded-full">
              <span className="text-violet-600 text-xs font-bold">✦</span>
              <span className="text-xs font-semibold text-violet-700">
                AI-powered legal document assistance
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight">
              Understand Legal Information.{' '}
              <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">Without the Legal Jargon.</span>
            </h1>

            {/* Sub-text */}
            <p className="text-lg text-slate-500 leading-relaxed max-w-lg">
              NyayaSaar helps you understand legal documents, identify important clauses,
              compare agreements, and ask questions — all in simple language.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-3">
              <Link to="/upload" className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold rounded-xl hover:from-violet-700 hover:to-indigo-700 active:scale-[0.98] transition-all duration-200 shadow-md shadow-violet-300/40">
                Analyze a Document <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                type="button"
                onClick={handleTryDemo}
                className="btn-secondary"
              >
                Try Demo
              </button>
            </div>

            {/* Disclaimer */}
            <p className="text-xs text-slate-400 mt-1 max-w-md leading-relaxed">
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
