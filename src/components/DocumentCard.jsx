import { FileText, AlertTriangle, CheckCircle, Calendar, FileStack, ChevronRight } from 'lucide-react';

const statusConfig = {
  analyzed: {
    label: 'Analyzed',
    icon: CheckCircle,
    style: { background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', color: '#34d399' },
  },
  processing: {
    label: 'Processing',
    icon: FileStack,
    style: { background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)', color: '#60a5fa' },
  },
  error: {
    label: 'Error',
    icon: AlertTriangle,
    style: { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171' },
  },
};

export default function DocumentCard({ doc, onOpen }) {
  const st = statusConfig[doc.status] ?? statusConfig.analyzed;
  const StatusIcon = st.icon;

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 group"
      style={{
        background: 'rgba(255,255,255,0.035)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.border = '1px solid rgba(139,92,246,0.25)';
        e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.3), 0 0 20px rgba(124,58,237,0.1)';
        e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.border = '1px solid rgba(255,255,255,0.07)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.background = 'rgba(255,255,255,0.035)';
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-3"
        style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}
        >
          <FileText className="w-4 h-4 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-200 truncate">{doc.name}</p>
          <p className="text-xs text-slate-500">{doc.pages} pages</p>
        </div>
      </div>

      {/* Body */}
      <div className="px-4 py-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-600">Type</span>
          <span className="text-xs font-medium text-slate-300">{doc.type}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-600">Uploaded</span>
          <span className="flex items-center gap-1 text-xs font-medium text-slate-400">
            <Calendar className="w-3 h-3 text-slate-600" /> {doc.uploadedAt}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-600">Status</span>
          <span
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
            style={st.style}
          >
            <StatusIcon className="w-3 h-3" /> {st.label}
          </span>
        </div>
        {doc.attentionCount > 0 && (
          <div className="flex items-center gap-1.5 pt-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs text-amber-400 font-medium">
              {doc.attentionCount} clause{doc.attentionCount > 1 ? 's' : ''} need attention
            </span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 pb-4">
        <button
          onClick={() => onOpen?.(doc)}
          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-violet-300 transition-all duration-200 hover:text-white"
          style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(124,58,237,0.25)';
            e.currentTarget.style.boxShadow = '0 0 12px rgba(124,58,237,0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(124,58,237,0.12)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          Open Analysis <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
