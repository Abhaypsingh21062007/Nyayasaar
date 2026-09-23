import { CheckCircle2, XCircle, Info, X } from 'lucide-react';

const VARIANTS = {
  success: {
    icon: CheckCircle2,
    bg: 'rgba(16,185,129,0.1)',
    border: 'rgba(16,185,129,0.25)',
    iconColor: 'text-emerald-400',
    textColor: 'text-emerald-100',
  },
  error: {
    icon: XCircle,
    bg: 'rgba(239,68,68,0.1)',
    border: 'rgba(239,68,68,0.25)',
    iconColor: 'text-red-400',
    textColor: 'text-red-100',
  },
  info: {
    icon: Info,
    bg: 'rgba(59,130,246,0.1)',
    border: 'rgba(59,130,246,0.25)',
    iconColor: 'text-blue-400',
    textColor: 'text-blue-100',
  },
};

function ToastItem({ toast, onDismiss }) {
  const v = VARIANTS[toast.type] || VARIANTS.info;
  const Icon = v.icon;

  return (
    <div
      className="flex items-start gap-2.5 px-4 py-3 rounded-xl max-w-sm w-full toast-slide-in"
      style={{
        background: v.bg,
        border: `1px solid ${v.border}`,
        backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}
      role="alert"
    >
      <Icon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${v.iconColor}`} />
      <p className={`text-sm font-medium flex-1 ${v.textColor}`}>{toast.message}</p>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="p-0.5 rounded-md hover:bg-white/10 text-slate-500 hover:text-slate-300 transition-colors flex-shrink-0"
        aria-label="Dismiss notification"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export default function ToastContainer({ toasts = [], onDismiss }) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2.5 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} onDismiss={onDismiss} />
        </div>
      ))}
    </div>
  );
}
