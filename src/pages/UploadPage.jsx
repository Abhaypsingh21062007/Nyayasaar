import UploadZone from '../components/UploadZone';
import { ShieldCheck, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DEMO_DOCUMENT } from '../data/mockData';

export default function UploadPage() {
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
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-8 animate-in fade-in duration-200">

      {/* ── Page header ───────────────────────────── */}
      <div>
        <p className="section-label mb-2">Step 1 of 1</p>
        <h1 className="text-2xl font-extrabold text-slate-900 mb-2">
          Analyze a Legal Document
        </h1>
        <p className="text-slate-500 leading-relaxed">
          Upload a document and let NyayaSaar help you understand it.
        </p>
      </div>

      {/* ── Try Demo Banner ───────────────────────── */}
      <button
        onClick={handleTryDemo}
        className="w-full group relative overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 bg-white px-6 py-5 text-left transition-all duration-200 hover:border-slate-400 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.99]"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-md flex-shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-display font-bold text-slate-900 mb-0.5">
              ✨ Try Demo — No Upload Needed
            </p>
            <p className="text-xs text-slate-500">
              Experience the full NyayaSaar analysis flow with a pre-loaded Rental Agreement.
              See AI analysis, important clauses, explanations, and Q&A.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200 flex-shrink-0 group-hover:bg-slate-900 group-hover:text-white transition-colors">
            Try Now →
          </span>
        </div>
      </button>

      {/* ── Upload zone ───────────────────────────── */}
      <UploadZone />

      {/* ── Trust note ────────────────────────────── */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl">
        <ShieldCheck className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-slate-800 mb-0.5">Your document stays private</p>
          <p className="text-xs text-slate-500 leading-relaxed">
            Documents are only used for analysis and are not stored permanently.
            NyayaSaar provides general legal information, not professional legal advice.
          </p>
        </div>
      </div>
    </div>
  );
}
