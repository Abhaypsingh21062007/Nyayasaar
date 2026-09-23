import UploadZone from '../components/UploadZone';
import { ShieldCheck, Sparkles, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DEMO_DOCUMENT } from '../data/mockData';

export default function UploadPage() {
  const navigate = useNavigate();

  const handleTryDemo = () => {
    navigate('/analysis', { state: { document: DEMO_DOCUMENT, demo: true } });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-8 animate-in fade-in duration-200">

      {/* ── Page header ─────────────────────────────────────── */}
      <div>
        <p className="section-label">Step 1 of 1</p>
        <h1 className="text-2xl font-extrabold text-white mb-2 tracking-tight">
          Analyze a Legal Document
        </h1>
        <p className="text-slate-400 leading-relaxed text-sm">
          Upload any PDF contract and let NyayaSaar help you understand it in plain language.
        </p>
      </div>

      {/* ── Try Demo Banner ──────────────────────────────────── */}
      <button
        onClick={handleTryDemo}
        className="w-full group relative overflow-hidden rounded-2xl px-6 py-5 text-left transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.99]"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.09)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.border = '1px solid rgba(139,92,246,0.35)';
          e.currentTarget.style.background = 'rgba(124,58,237,0.06)';
          e.currentTarget.style.boxShadow = '0 8px 30px rgba(124,58,237,0.12)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.border = '1px solid rgba(255,255,255,0.09)';
          e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', boxShadow: '0 4px 15px rgba(124,58,237,0.4)' }}
          >
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white mb-0.5">✨ Try Demo — No Upload Needed</p>
            <p className="text-xs text-slate-400">
              Experience the full NyayaSaar analysis flow with a pre-loaded Rental Agreement.
            </p>
          </div>
          <span
            className="text-xs font-bold text-violet-300 px-3 py-1.5 rounded-full flex-shrink-0 group-hover:text-white transition-colors"
            style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)' }}
          >
            Try Now →
          </span>
        </div>
      </button>

      {/* ── Upload zone ──────────────────────────────────────── */}
      <UploadZone />

      {/* ── Trust note ───────────────────────────────────────── */}
      <div
        className="flex items-start gap-3 p-4 rounded-xl"
        style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)' }}
      >
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(16,185,129,0.1)' }}>
          <Lock className="w-4 h-4 text-emerald-400" />
        </div>
        <div>
          <p className="text-sm font-semibold text-emerald-300 mb-0.5">Your document stays private</p>
          <p className="text-xs text-slate-500 leading-relaxed">
            Documents are only used for analysis and are not stored permanently.
            NyayaSaar provides general legal information, not professional legal advice.
          </p>
        </div>
      </div>
    </div>
  );
}
