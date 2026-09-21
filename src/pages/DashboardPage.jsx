import { recentDocuments, dashboardActions, DEMO_DOCUMENT } from '../data/mockData';
import ActionCard from '../components/ActionCard';
import DocumentCard from '../components/DocumentCard';
import { ArrowRight, FileStack, Sparkles, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/* ── Greeting helper ─────────────────────────────── */
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

/* ── Stat badge ──────────────────────────────────── */
function StatBadge({ label, value, color }) {
  const colors = {
    blue:   'bg-blue-50 text-blue-700 border-blue-100',
    amber:  'bg-amber-50 text-amber-700 border-amber-100',
    emerald:'bg-emerald-50 text-emerald-700 border-emerald-100',
  };
  return (
    <div className={`flex flex-col items-center px-5 py-3 rounded-xl border text-center ${colors[color]}`}>
      <span className="text-xl font-extrabold leading-none">{value}</span>
      <span className="text-xs font-medium mt-0.5 opacity-80">{label}</span>
    </div>
  );
}

export default function DashboardPage() {
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-in fade-in duration-200">

      {/* ── Header ────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            {getGreeting()} 👋
          </h1>
          <p className="text-slate-500 mt-1">What would you like to understand today?</p>
        </div>

        {/* Quick stats */}
        <div className="flex gap-3">
          <StatBadge value="3" label="Documents" color="blue" />
          <StatBadge value="10" label="Clauses flagged" color="amber" />
          <StatBadge value="3" label="Analyzed" color="emerald" />
        </div>
      </div>

      {/* ── Try Demo Banner ─────────────────────────────────────────────── */}
      <button
        onClick={handleTryDemo}
        className="w-full group relative overflow-hidden rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-6 py-5 text-left transition-all duration-200 hover:shadow-xl hover:shadow-blue-600/15 hover:-translate-y-0.5 active:scale-[0.99]"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.15),transparent_60%)] pointer-events-none" />
        <div className="flex items-center gap-4 relative">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white flex-shrink-0 border border-white/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-extrabold text-white mb-0.5">
              ✨ Try Demo — Experience NyayaSaar Instantly
            </p>
            <p className="text-xs text-blue-100">
              See the full analysis flow with a sample Rental Agreement. No upload needed.
            </p>
          </div>
          <span className="text-xs font-bold text-blue-600 bg-white px-4 py-2 rounded-full flex-shrink-0 shadow-sm group-hover:shadow-md transition-shadow">
            Try Now →
          </span>
        </div>
      </button>

      {/* ── Action cards ──────────────────────────── */}
      <section>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">
          Quick Actions
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {dashboardActions.map((action) => (
            <ActionCard key={action.title} {...action} />
          ))}
        </div>
      </section>

      {/* ── Recent documents ──────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Recent Documents
          </p>
          <button
            onClick={() => navigate('/documents')}
            className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            View all <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentDocuments.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 rounded-2xl border border-dashed border-slate-200 bg-slate-50">
            <FileStack className="w-10 h-10 text-slate-300" />
            <p className="text-sm text-slate-400">No documents yet. Upload one to get started.</p>
            <button onClick={() => navigate('/upload')} className="btn-primary text-xs py-2 px-4">
              Analyze a Document
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentDocuments.map((doc) => (
              <DocumentCard
                key={doc.id}
                doc={doc}
                onOpen={() => navigate('/upload')}
              />
            ))}
          </div>
        )}
      </section>

      {/* ── Disclaimer ────────────────────────────── */}
      <div className="flex items-start gap-3 p-4 bg-slate-50 border border-slate-200/90 rounded-xl">
        <Shield className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
        <p className="text-[11px] text-slate-500 leading-relaxed">
          NyayaSaar provides general legal information and document assistance, not professional
          legal advice.
        </p>
      </div>
    </div>
  );
}
