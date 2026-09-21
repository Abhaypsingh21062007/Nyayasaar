import {
  Scale,
  FileText,
  RotateCcw,
  UploadCloud,
  Layers,
  Sparkles,
  ChevronDown,
} from 'lucide-react';

export default function ChatHeader({
  document,
  onClearChat,
  onSwitchDocument,
  hasMessages,
}) {
  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-4 sticky top-0 z-20">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Title & Subtitle */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-violet-300/30 flex-shrink-0">
            <Scale className="w-5 h-5" strokeWidth={2.2} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                Ask NyayaSaar
              </h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-100 text-violet-700 border border-violet-200">
                <Sparkles className="w-3 h-3 text-violet-500" />
                AI Grounded
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Ask questions about your uploaded document.
            </p>
          </div>
        </div>

        {/* Active Document Info & Header Actions */}
        <div className="flex items-center flex-wrap gap-2.5">
          {document ? (
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/90 rounded-xl px-3 py-1.5 shadow-sm max-w-full">
              <FileText className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
              <span
                className="text-xs font-semibold text-slate-800 truncate max-w-[140px] sm:max-w-[200px]"
                title={document.fileName || 'Uploaded Document'}
              >
                {document.fileName || 'Uploaded Document'}
              </span>
              {document.pageCount && (
                <span className="hidden sm:inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200/70 text-slate-600">
                  <Layers className="w-2.5 h-2.5" />
                  {document.pageCount}p
                </span>
              )}
              <button
                type="button"
                onClick={onSwitchDocument}
                className="text-[11px] font-bold text-blue-600 hover:text-blue-800 hover:underline ml-1 flex items-center gap-0.5"
                title="Change active document"
              >
                Change <ChevronDown className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onSwitchDocument}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 transition-colors shadow-sm"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              Select Document
            </button>
          )}

          {/* Clear Conversation Action */}
          {hasMessages && (
            <button
              type="button"
              onClick={onClearChat}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-sm"
              title="Reset current conversation"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              Clear
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
