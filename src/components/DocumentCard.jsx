import { FileText, AlertTriangle, CheckCircle, Calendar, FileStack, ChevronRight } from 'lucide-react';

const statusConfig = {
  analyzed: {
    label: 'Analyzed',
    icon: CheckCircle,
    className: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  },
  processing: {
    label: 'Processing',
    icon: FileStack,
    className: 'bg-blue-50 text-blue-700 border-blue-100',
  },
  error: {
    label: 'Error',
    icon: AlertTriangle,
    className: 'bg-red-50 text-red-700 border-red-100',
  },
};

/**
 * DocumentCard — shows a single document entry in list / grid views.
 * Props: doc { id, name, type, uploadedAt, status, attentionCount, pages }
 *        onOpen — callback when "Open" is clicked
 */
export default function DocumentCard({ doc, onOpen }) {
  const st = statusConfig[doc.status] ?? statusConfig.analyzed;
  const StatusIcon = st.icon;

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-card hover:border-blue-100 hover:shadow-card-md transition-all duration-200 overflow-hidden">
      {/* Header strip */}
      <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 border-b border-slate-100">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <FileText className="w-4 h-4 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-800 truncate">{doc.name}</p>
          <p className="text-xs text-slate-400">{doc.pages} pages</p>
        </div>
      </div>

      {/* Body */}
      <div className="px-4 py-3 space-y-2">
        {/* Type */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400">Type</span>
          <span className="text-xs font-medium text-slate-700">{doc.type}</span>
        </div>

        {/* Upload date */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400">Uploaded</span>
          <span className="flex items-center gap-1 text-xs font-medium text-slate-600">
            <Calendar className="w-3 h-3 text-slate-300" /> {doc.uploadedAt}
          </span>
        </div>

        {/* Status */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400">Status</span>
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-semibold ${st.className}`}>
            <StatusIcon className="w-3 h-3" /> {st.label}
          </span>
        </div>

        {/* Attention count */}
        {doc.attentionCount > 0 && (
          <div className="flex items-center gap-1.5 pt-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs text-amber-600 font-medium">
              {doc.attentionCount} clause{doc.attentionCount > 1 ? 's' : ''} need attention
            </span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 pb-4">
        <button
          onClick={() => onOpen?.(doc)}
          className="w-full flex items-center justify-center gap-1.5 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-blue-600 transition-colors"
        >
          Open Analysis <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
