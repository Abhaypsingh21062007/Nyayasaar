import { ArrowUpRight, HelpCircle, ShieldAlert, Clock, Wrench, CreditCard } from 'lucide-react';

function renderQuestionIcon(question = '') {
  const q = question.toLowerCase();
  if (q.includes('payment') || q.includes('money')) return <CreditCard className="w-4 h-4" />;
  if (q.includes('long') || q.includes('time') || q.includes('duration')) return <Clock className="w-4 h-4" />;
  if (q.includes('maintenance') || q.includes('repair')) return <Wrench className="w-4 h-4" />;
  if (q.includes('penalty') || q.includes('penalties') || q.includes('termination')) return <ShieldAlert className="w-4 h-4" />;
  return <HelpCircle className="w-4 h-4" />;
}

export default function SuggestedQuestion({ question, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(question)}
      className="group relative flex items-center justify-between gap-3 text-left w-full p-3.5 sm:p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/40 hover:shadow-md transition-all duration-200 cursor-pointer"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
          {renderQuestionIcon(question)}
        </div>
        <span className="text-xs sm:text-sm font-semibold text-slate-800 group-hover:text-blue-900 transition-colors line-clamp-2">
          {question}
        </span>
      </div>

      <div className="w-6 h-6 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center flex-shrink-0 text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600 group-hover:border-blue-200 transition-colors">
        <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
    </button>
  );
}
