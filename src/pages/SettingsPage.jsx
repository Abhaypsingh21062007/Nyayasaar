import { useState, useEffect } from 'react';
import {
  Settings,
  Shield,
  Cpu,
  Database,
  CheckCircle2,
  XCircle,
  Loader2,
  RefreshCw,
  Sparkles,
  Server,
  Clock,
  Info,
} from 'lucide-react';

function StatusBadge({ ok, label }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${
        ok
          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
          : 'bg-amber-50 text-amber-800 border-amber-200'
      }`}
    >
      {ok ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
      {label}
    </span>
  );
}

function StatusRow({ icon: Icon, iconColor, label, children }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
      <div className="flex items-center gap-2.5 text-sm font-medium text-slate-700">
        <Icon className={`w-4 h-4 ${iconColor}`} />
        {label}
      </div>
      <div>{children}</div>
    </div>
  );
}

export default function SettingsPage() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      setHealth(data);
    } catch (err) {
      setError('Could not reach the NyayaSaar backend server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  const formatUptime = (seconds) => {
    if (!seconds) return '—';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
            Configuration
          </span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Settings
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          View system status and configuration for NyayaSaar.
        </p>
      </div>

      {/* System Status Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <Server className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">System Status</h2>
              <p className="text-xs text-slate-500">Backend API health check</p>
            </div>
          </div>
          <button
            type="button"
            onClick={fetchHealth}
            disabled={loading}
            className="p-2 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-40"
            title="Refresh status"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="px-6 py-2">
          {loading && !health && (
            <div className="py-8 flex flex-col items-center gap-3 text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin" />
              <p className="text-xs font-medium">Checking system status…</p>
            </div>
          )}

          {error && (
            <div className="py-6 flex flex-col items-center gap-2 text-red-600">
              <XCircle className="w-6 h-6" />
              <p className="text-xs font-medium text-center">{error}</p>
              <button onClick={fetchHealth} className="text-xs text-blue-600 hover:text-blue-800 font-bold mt-1">
                Retry
              </button>
            </div>
          )}

          {health && (
            <div>
              <StatusRow icon={Cpu} iconColor="text-blue-500" label="Server Status">
                <StatusBadge ok={health.status === 'ok'} label={health.status === 'ok' ? 'Online' : 'Error'} />
              </StatusRow>

              <StatusRow icon={Sparkles} iconColor="text-violet-500" label="Gemini AI">
                <StatusBadge
                  ok={health.geminiConfigured}
                  label={health.geminiConfigured ? 'Configured' : 'Not Configured'}
                />
              </StatusRow>

              <StatusRow icon={Database} iconColor="text-emerald-500" label="RAG Pipeline">
                <StatusBadge
                  ok={health.ragEnabled}
                  label={health.ragEnabled ? 'Active' : 'Inactive (No API Key)'}
                />
              </StatusRow>

              <StatusRow icon={Database} iconColor="text-indigo-500" label="Indexed Documents">
                <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full">
                  {health.indexedDocuments ?? 0}
                </span>
              </StatusRow>

              <StatusRow icon={Cpu} iconColor="text-slate-400" label="Embedding Model">
                <span className="text-xs font-mono text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                  {health.embeddingModel || 'text-embedding-004'}
                </span>
              </StatusRow>

              <StatusRow icon={Clock} iconColor="text-amber-500" label="Server Uptime">
                <span className="text-xs font-bold text-slate-700">
                  {formatUptime(health.uptime)}
                </span>
              </StatusRow>

              <StatusRow icon={Info} iconColor="text-slate-400" label="Version">
                <span className="text-xs font-mono text-slate-600">
                  {health.version || '1.0.0'}
                </span>
              </StatusRow>
            </div>
          )}
        </div>
      </div>

      {/* Configuration Guide */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
            <Settings className="w-4 h-4 text-amber-600" />
          </div>
          <h2 className="text-sm font-bold text-slate-900">Configuration Guide</h2>
        </div>

        <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <p className="font-bold text-slate-800 mb-1">🔑 Gemini API Key</p>
            <p>
              Add your <code className="text-blue-600 bg-blue-50 px-1 py-0.5 rounded">GEMINI_API_KEY</code> to the{' '}
              <code className="text-blue-600 bg-blue-50 px-1 py-0.5 rounded">.env</code> file for real AI analysis,
              chat, and RAG embeddings.{' '}
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline font-bold"
              >
                Get a key →
              </a>
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <p className="font-bold text-slate-800 mb-1">🧠 RAG Pipeline</p>
            <p>
              The RAG (Retrieval-Augmented Generation) pipeline automatically activates when
              a Gemini API key is configured. Documents are chunked, embedded, and stored in-memory
              for semantic search during Q&A.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <p className="font-bold text-slate-800 mb-1">🎭 Demo Mode</p>
            <p>
              Without an API key, NyayaSaar works in Demo Mode with pre-configured sample
              responses. This is great for showcasing the product without any external dependencies.
            </p>
          </div>
        </div>
      </div>

      {/* Legal Disclaimer */}
      <div className="flex items-start gap-3 p-5 bg-slate-50 border border-slate-200/90 rounded-2xl">
        <Shield className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-bold text-slate-700 mb-0.5">Legal Disclaimer</p>
          <p className="text-xs text-slate-500 leading-relaxed">
            NyayaSaar provides general legal information and document assistance, not professional
            legal advice. Always consult a qualified legal professional before making decisions
            based on AI-generated analysis.
          </p>
        </div>
      </div>
    </div>
  );
}
