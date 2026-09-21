import { useState } from 'react';
import {
  Scale,
  User,
  Copy,
  Check,
  AlertCircle,
  Sparkles,
  Info,
} from 'lucide-react';
import SourceCard from './SourceCard';

export default function MessageBubble({ message, onRetry }) {
  const [copied, setCopied] = useState(false);

  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';

  const handleCopy = () => {
    if (message.content) {
      navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isUser) {
    return (
      <div className="flex justify-end gap-3 max-w-4xl mx-auto px-4 sm:px-6 my-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
        <div className="flex flex-col items-end max-w-[85%] sm:max-w-[75%]">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 shadow-md shadow-blue-500/10 text-sm font-medium leading-relaxed select-text">
            {message.content}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 px-1">
            {message.timestamp || 'Just now'}
          </span>
        </div>
        <div className="w-8 h-8 rounded-xl bg-slate-200 border border-slate-300 flex items-center justify-center flex-shrink-0 text-slate-700 shadow-xs">
          <User className="w-4 h-4" />
        </div>
      </div>
    );
  }

  if (isAssistant) {
    const hasSources = Array.isArray(message.sources) && message.sources.length > 0;

    return (
      <div className="flex justify-start gap-3 max-w-4xl mx-auto px-4 sm:px-6 my-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
        {/* Assistant Avatar */}
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 flex items-center justify-center flex-shrink-0 text-white shadow-md shadow-blue-500/15">
          <Scale className="w-4 h-4" strokeWidth={2.2} />
        </div>

        {/* Assistant Content Container */}
        <div className="flex flex-col items-start max-w-[90%] sm:max-w-[85%] space-y-3">
          {/* Main Answer Card */}
          <div className="bg-white border border-slate-200/90 rounded-2xl rounded-tl-sm p-4 sm:p-5 shadow-card w-full text-slate-800 text-sm leading-relaxed space-y-3">
            {/* Header info / demo indicator */}
            <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-900 tracking-tight">
                  NyayaSaar
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  Document Response
                </span>
              </div>

              {message.isDemo && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                  <Info className="w-3 h-3 text-amber-600" />
                  Demo Mode
                </span>
              )}
            </div>

            {/* Answer Text */}
            <div className="text-slate-800 leading-relaxed font-sans whitespace-pre-line select-text text-sm sm:text-[15px]">
              {message.content}
            </div>

            {/* Sources Section */}
            {hasSources && (
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <Sparkles className="w-3 h-3 text-blue-500" />
                  <span>Document Sources ({message.sources.length})</span>
                </div>
                <div className="space-y-2.5">
                  {message.sources.map((src, idx) => (
                    <SourceCard key={idx} source={src} index={idx} />
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Actions Bar */}
            <div className="flex items-center justify-between pt-2 text-xs text-slate-400 border-t border-slate-100/70">
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-slate-900 transition-colors py-0.5"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-700 font-semibold">Copied answer</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy answer</span>
                  </>
                )}
              </button>

              <span className="text-[10px]">
                {message.timestamp || 'Just now'}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error bubble
  if (message.error) {
    return (
      <div className="flex justify-start gap-3 max-w-4xl mx-auto px-4 sm:px-6 my-4">
        <div className="w-8 h-8 rounded-xl bg-red-100 border border-red-200 flex items-center justify-center flex-shrink-0 text-red-600">
          <AlertCircle className="w-4 h-4" />
        </div>
        <div className="bg-red-50 border border-red-200 rounded-2xl rounded-tl-sm p-4 max-w-[85%] text-xs text-red-800 space-y-2">
          <p className="font-bold text-red-900">Unable to generate answer</p>
          <p>{message.content || 'An error occurred while communicating with the server.'}</p>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-2 text-xs font-bold text-red-700 underline hover:text-red-900"
            >
              Try asking again
            </button>
          )}
        </div>
      </div>
    );
  }

  return null;
}
