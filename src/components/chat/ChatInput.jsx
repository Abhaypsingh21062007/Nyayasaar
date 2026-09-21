import { useRef, useEffect } from 'react';
import { Send, Loader2, Sparkles } from 'lucide-react';

export default function ChatInput({
  value,
  onChange,
  onSend,
  loading = false,
  disabled = false,
  placeholder = 'Ask questions about your uploaded document...',
  inputRef: externalInputRef,
}) {
  const localRef = useRef(null);
  const textareaRef = externalInputRef || localRef;

  // Auto-grow textarea height based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        140
      )}px`;
    }
  }, [value, textareaRef]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !loading && !disabled) {
        onSend();
      }
    }
  };

  const isSendActive = Boolean(value.trim()) && !loading && !disabled;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (isSendActive) onSend();
      }}
      className="relative flex items-end gap-2 bg-white border border-slate-300/90 rounded-2xl p-2 shadow-card-md focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all"
    >
      <div className="pl-2.5 pb-2 text-slate-400 hidden sm:flex">
        <Sparkles className="w-4 h-4 text-blue-500/80" />
      </div>

      <textarea
        ref={textareaRef}
        rows={1}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled || loading}
        placeholder={placeholder}
        className="w-full resize-none bg-transparent py-1.5 px-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none max-h-36 overflow-y-auto leading-relaxed"
      />

      <button
        type="submit"
        disabled={!isSendActive}
        className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 ${
          isSendActive
            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 hover:scale-105 active:scale-95'
            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
        }`}
        aria-label="Send message"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
        ) : (
          <Send className="w-4 h-4" />
        )}
      </button>
    </form>
  );
}
