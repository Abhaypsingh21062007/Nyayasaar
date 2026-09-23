import { recentDocuments, dashboardActions, DEMO_DOCUMENT } from '../data/mockData';
import ActionCard from '../components/ActionCard';
import DocumentCard from '../components/DocumentCard';
import { ArrowRight, FileStack, Sparkles, Shield, TrendingUp, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function StatCard({ label, value, icon: Icon, color }) {
  const colors = {
    violet: {
      bg: 'rgba(124,58,237,0.08)',
      border: 'rgba(124,58,237,0.2)',
      icon: 'text-violet-400',
      value: 'text-violet-300',
    },
    amber: {
      bg: 'rgba(245,158,11,0.08)',
      border: 'rgba(245,158,11,0.2)',
      icon: 'text-amber-400',
      value: 'text-amber-300',
    },
    emerald: {
      bg: 'rgba(16,185,129,0.08)',
      border: 'rgba(16,185,129,0.2)',
      icon: 'text-emerald-400',
      value: 'text-emerald-300',
    },
  };
  const c = colors[color];
  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 hover:-translate-y-0.5"
      style={{ background: c.bg, border: `1px solid ${c.border}` }}
    >
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0`} style={{ background: c.bg }}>
        <Icon className={`w-4.5 h-4.5 ${c.icon}`} style={{ width: '18px', height: '18px' }} />
      </div>
      <div>
        <p className={`text-xl font-extrabold leading-none ${c.value}`}>{value}</p>
        <p className="text-xs text-slate-500 mt-0.5 font-medium">{label}</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();

  const handleTryDemo = () => {
    navigate('/analysis', { state: { document: DEMO_DOCUMENT, demo: true } });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-in fade-in duration-200">

      {/* ── Header ───────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">
        <div>
          <p className="section-label">{getGreeting()} 👋</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            What would you like to{' '}
            <span className="animate-shimmer">understand</span> today?
          </h1>
          <p className="text-slate-500 mt-2 text-sm">Your AI-powered legal document assistant is ready.</p>
        </div>

        <div className="flex gap-3 flex-shrink-0">
          <StatCard value="3"  label="Documents"     icon={FileStack}   color="violet" />
          <StatCard value="10" label="Clauses flagged" icon={TrendingUp} color="amber"  />
          <StatCard value="3"  label="Analyzed"       icon={Clock}       color="emerald" />
        </div>
      </div>

      {/* ── Try Demo Banner ──────────────────────────────────────── */}
      <button
        onClick={handleTryDemo}
        className="w-full group relative overflow-hidden rounded-2xl px-6 py-5 text-left transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.99]"
        style={{
          background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(79,70,229,0.15), rgba(109,40,217,0.2))',
          border: '1px solid rgba(139,92,246,0.35)',
          boxShadow: '0 4px 30px rgba(124,58,237,0.15)',
        }}
      >
        {/* animated shimmer overlay */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)',
            transform: 'skewX(-20deg)',
          }}
        />
        <div className="flex items-center gap-4 relative">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.35)' }}
          >
            <Sparkles className="w-6 h-6 text-violet-300" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-extrabold text-white mb-0.5">
              ✨ Try Demo — Experience NyayaSaar Instantly
            </p>
            <p className="text-xs text-slate-400">
              See the full analysis flow with a sample Rental Agreement. No upload needed.
            </p>
          </div>
          <span
            className="text-xs font-bold text-violet-300 px-4 py-2 rounded-full flex-shrink-0 group-hover:text-white transition-all"
            style={{ background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.35)' }}
          >
            Try Now →
          </span>
        </div>
      </button>

      {/* ── Quick Actions ────────────────────────────────────────── */}
      <section>
        <p className="section-label">Quick Actions</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {dashboardActions.map((action) => (
            <ActionCard key={action.title} {...action} />
          ))}
        </div>
      </section>

      {/* ── Recent Documents ─────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <p className="section-label mb-0">Recent Documents</p>
          <button
            onClick={() => navigate('/documents')}
            className="flex items-center gap-1 text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors"
          >
            View all <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentDocuments.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center gap-3 py-16 rounded-2xl"
            style={{ border: '1px dashed rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)' }}
          >
            <FileStack className="w-10 h-10 text-slate-600" />
            <p className="text-sm text-slate-500">No documents yet. Upload one to get started.</p>
            <button onClick={() => navigate('/upload')} className="btn-primary text-xs py-2 px-4">
              Analyze a Document
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentDocuments.map((doc) => (
              <DocumentCard key={doc.id} doc={doc} onOpen={() => navigate('/upload')} />
            ))}
          </div>
        )}
      </section>

      {/* ── Disclaimer ───────────────────────────────────────────── */}
      <div
        className="flex items-start gap-3 p-4 rounded-xl"
        style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <Shield className="w-4 h-4 text-slate-600 flex-shrink-0 mt-0.5" />
        <p className="text-[11px] text-slate-600 leading-relaxed">
          NyayaSaar provides general legal information and document assistance, not professional legal advice.
        </p>
      </div>
    </div>
  );
}
