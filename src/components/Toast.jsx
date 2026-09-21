import { CheckCircle2, XCircle, Info, X } from 'lucide-react';

const VARIANTS = {
  success: {
    icon: CheckCircle2,
    bg: 'bg-emerald-50 border-emerald-200',
    iconColor: 'text-emerald-600',
    textColor: 'text-emerald-900',
  },
  error: {
    icon: XCircle,
    bg: 'bg-red-50 border-red-200',
    iconColor: 'text-red-600',
    textColor: 'text-red-900',
  },
  info: {
    icon: Info,
    bg: 'bg-blue-50 border-blue-200',
    iconColor: 'text-blue-600',
    textColor: 'text-blue-900',
  },
};

function ToastItem({ toast, onDismiss }) {
  const variant = VARIANTS[toast.type] || VARIANTS.info;
  const Icon = variant.icon;

  return (
    <div
      className={`flex items-start gap-2.5 px-4 py-3 rounded-xl border shadow-lg backdrop-blur-sm max-w-sm w-full
        ${variant.bg} toast-slide-in`}
      role="alert"
    >
      <Icon className={`w-4.5 h-4.5 flex-shrink-0 mt-0.5 ${variant.iconColor}`} />
      <p className={`text-sm font-medium flex-1 ${variant.textColor}`}>{toast.message}</p>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="p-0.5 rounded-md hover:bg-black/5 text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0"
        aria-label="Dismiss notification"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

/**
 * ToastContainer — renders stacked toast notifications at top-right.
 * Pass toasts array and dismiss function from useToast() hook.
 */
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
