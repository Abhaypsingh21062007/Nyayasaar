import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Scale,
  Sparkles,
  Shield,
  FileText,
  UploadCloud,
  Loader2,
  CheckCircle2,
  X,
  AlertCircle,
} from 'lucide-react';
import ChatHeader from '../components/chat/ChatHeader';
import MessageBubble from '../components/chat/MessageBubble';
import SuggestedQuestion from '../components/chat/SuggestedQuestion';
import ChatInput from '../components/chat/ChatInput';

const SUGGESTED_QUESTIONS = [
  'What is the termination condition?',
  'What are my payment obligations?',
  'How long is this agreement?',
  'Who is responsible for maintenance?',
  'Are there penalties mentioned?',
];

const SAMPLE_DOCUMENT = {
  documentId: 'sample-doc',
  id: 'sample-doc',
  fileName: 'Rental Agreement (Sample).pdf',
  fileSize: 124500,
  pageCount: 3,
  wordCount: 420,
  charCount: 2600,
  text: `RESIDENTIAL RENTAL AGREEMENT
This Rental Agreement is made and entered into on 1st October 2026, by and between the Landlord and the Tenant.
Clause 1: Property - The Landlord agrees to let out the residential apartment located at Flat 402, Green Valley Apartments.
Clause 2: Term of Agreement - The tenancy shall commence on 1st November 2026 and continue for an initial fixed term of eleven (11) months.
Clause 3: Rent - The Tenant agrees to pay monthly rent of INR 25,000 on or before the 5th day of each calendar month.
Clause 4: Security Deposit - The Tenant shall deposit with the Landlord an interest-free refundable security deposit of INR 75,000. Said deposit shall be refunded within thirty (30) days following peaceful handover of possession, subject to deductions for unpaid utilities or property damages beyond normal wear and tear.
Clause 5: Utility Bills - The Tenant shall pay all electricity, water, gas, and internet charges incurred during the tenancy period.
Clause 6: Maintenance Responsibilities - The Tenant shall keep the premises in good and clean condition. Routine minor repairs under INR 1,000 shall be the responsibility of the Tenant, while major structural repairs shall be borne by the Landlord upon written notice.
Clause 7: Restrictions - The Tenant shall not sublet or assign the premises without prior written permission of the Landlord.
Clause 8: Termination Condition - Either party may terminate this agreement by providing thirty (30) days prior written notice to the other party. In the event of default or breach of any terms herein, the non-defaulting party may terminate immediately without prejudice to any other remedies available under law.
Clause 9: Default and Deductions - In the event of default or breach of any covenants, applicable late charges and damages may be assessed against the security deposit.`,
  isSample: true,
};

export default function AskPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Active document state
  const [activeDoc, setActiveDoc] = useState(() => {
    // 1. Check navigation state
    if (location.state?.document) {
      const doc = location.state.document;
      try {
        sessionStorage.setItem('nyayasaar_active_document', JSON.stringify(doc));
      } catch {
        // Safe fallback
      }
      return doc;
    }
    // 2. Check sessionStorage
    try {
      const saved = sessionStorage.getItem('nyayasaar_active_document');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Safe fallback
    }
    // Default to sample document so the chat is immediately usable and ready
    return SAMPLE_DOCUMENT;
  });

  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [showDocModal, setShowDocModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Scroll to bottom when messages update or when thinking state toggles
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking, scrollToBottom]);

  // Handle setting active document
  const handleSelectDocument = (doc) => {
    setActiveDoc(doc);
    try {
      sessionStorage.setItem('nyayasaar_active_document', JSON.stringify(doc));
    } catch {
      // Safe fallback
    }
    setShowDocModal(false);
    setMessages([]);
  };

  // Putting suggested question into chat input and focusing
  const handleSelectSuggestion = (question) => {
    setInputValue(question);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Uploading a new PDF from modal
  const handleQuickUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setUploadError('Only PDF files are supported.');
      return;
    }

    setUploading(true);
    setUploadError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to upload PDF.');
      }

      handleSelectDocument(data);
    } catch (err) {
      setUploadError(err.message || 'Error uploading document.');
    } finally {
      setUploading(false);
    }
  };

  const msgIdRef = useRef(0);

  // Send message to backend POST /api/documents/:id/chat
  const handleSendMessage = async (textToSend) => {
    const question = (textToSend || inputValue).trim();
    if (!question || isThinking) return;

    const docId = activeDoc?.documentId || activeDoc?.id || 'demo';

    // 1. Add user message
    msgIdRef.current += 1;
    const userMsgId = `user_${msgIdRef.current}`;
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMessage = {
      id: userMsgId,
      role: 'user',
      content: question,
      timestamp: timeStr,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsThinking(true);

    try {
      const response = await fetch(`/api/documents/${docId}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get answer from AI service.');
      }

      msgIdRef.current += 1;
      const assistantMessage = {
        id: `assistant_${msgIdRef.current}`,
        role: 'assistant',
        content: data.answer || "I couldn't find this information in the uploaded document.",
        sources: data.sources || [],
        isDemo: Boolean(data._isDemo),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error('[AskPage Error]', err);
      msgIdRef.current += 1;
      const errorMsg = {
        id: `err_${msgIdRef.current}`,
        role: 'assistant',
        error: true,
        content: err.message || 'An error occurred while answering your question. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-50/50">
      {/* ── Chat Header ──────────────────────────────────────────────────────── */}
      <ChatHeader
        document={activeDoc}
        hasMessages={messages.length > 0}
        onClearChat={() => setMessages([])}
        onSwitchDocument={() => setShowDocModal(true)}
      />

      {/* ── Main Chat Area ─────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-2 sm:px-4 py-6 space-y-4">
        {/* Empty state: Show Welcome banner & Suggested Questions */}
        {messages.length === 0 && (
          <div className="max-w-3xl mx-auto px-4 py-6 space-y-8 animate-in fade-in duration-300">
            {/* Welcome banner */}
            <div className="bg-gradient-to-br from-white to-blue-50/60 border border-blue-100 rounded-3xl p-6 sm:p-8 shadow-card text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-blue-500/20">
                <Scale className="w-7 h-7" />
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-2">
                Ask Questions About Your Legal Document
              </h2>
              <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                NyayaSaar reads your document and provides plain-language answers with direct clause citations and page numbers.
              </p>

              {activeDoc && (
                <div className="mt-5 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/70 border border-blue-200/80 text-xs text-blue-900 font-semibold shadow-xs">
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  <span className="truncate max-w-[200px] sm:max-w-xs">{activeDoc.fileName}</span>
                  {activeDoc.pageCount && <span>• {activeDoc.pageCount} pages</span>}
                  {activeDoc.isSample && (
                    <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.2 rounded-full font-bold">
                      Sample
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Suggested Questions Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                  Suggested Questions
                </p>
                <span className="text-[11px] text-slate-400">
                  Click any question to put into input
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SUGGESTED_QUESTIONS.map((question, i) => (
                  <SuggestedQuestion
                    key={i}
                    question={question}
                    onSelect={handleSelectSuggestion}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Message Bubble History */}
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            onRetry={() => handleSendMessage(messages[messages.length - 2]?.content)}
          />
        ))}

        {/* Typing / Loading State */}
        {isThinking && (
          <div className="flex justify-start gap-3 max-w-4xl mx-auto px-4 sm:px-6 my-4 animate-in fade-in duration-200">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 flex items-center justify-center flex-shrink-0 text-white shadow-md shadow-blue-500/15 animate-pulse">
              <Scale className="w-4 h-4" />
            </div>
            <div className="bg-white border border-blue-200 rounded-2xl rounded-tl-sm p-4 shadow-card flex items-center gap-3">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600 flex-shrink-0" />
              <span className="text-sm font-semibold text-slate-700">
                NyayaSaar is thinking...
              </span>
              <span className="flex gap-1 items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" />
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Fixed Bottom Input Bar & Permanent Disclaimer ───────────────────── */}
      <div className="border-t border-slate-200 bg-white/95 backdrop-blur-md px-4 sm:px-6 py-3 shadow-lg flex-shrink-0">
        <div className="max-w-4xl mx-auto space-y-2">
          {/* Input component */}
          <ChatInput
            value={inputValue}
            onChange={setInputValue}
            onSend={() => handleSendMessage(inputValue)}
            loading={isThinking}
            inputRef={inputRef}
            placeholder="Ask questions about your uploaded document (e.g., What is the notice period?)..."
          />

          {/* Legal Disclaimer - Kept permanently visible */}
          <div className="flex items-center justify-center gap-2 text-center text-[11px] text-slate-400 font-normal pt-1">
            <Shield className="w-3 h-3 text-slate-400 flex-shrink-0" />
            <span>
              NyayaSaar provides general legal information grounded in your document, not formal legal advice.
            </span>
          </div>
        </div>
      </div>

      {/* ── Document Switcher Modal ─────────────────────────────────────────── */}
      {showDocModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">Select Document</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowDocModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {uploadError && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            <div className="space-y-3">
              {/* Option 1: Sample Rental Agreement */}
              <button
                type="button"
                onClick={() => handleSelectDocument(SAMPLE_DOCUMENT)}
                className={`w-full p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
                  activeDoc?.isSample
                    ? 'border-blue-500 bg-blue-50/60 ring-2 ring-blue-100'
                    : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0 mt-0.5">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-sm font-bold text-slate-900 truncate">
                      Residential Rental Agreement (Sample)
                    </p>
                    {activeDoc?.isSample && (
                      <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Standard 11-month lease agreement with deposit & termination clauses.
                  </p>
                </div>
              </button>

              {/* Option 2: Upload new document */}
              <label className="w-full p-4 rounded-xl border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 cursor-pointer flex flex-col items-center justify-center gap-2 text-center transition-all">
                <input
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={handleQuickUpload}
                  className="hidden"
                  disabled={uploading}
                />
                <UploadCloud className={`w-6 h-6 ${uploading ? 'text-blue-500 animate-bounce' : 'text-slate-400'}`} />
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    {uploading ? 'Uploading PDF...' : 'Upload another PDF document'}
                  </p>
                  <p className="text-[11px] text-slate-400">PDF up to 10 MB</p>
                </div>
              </label>

              {/* Option 3: Full Upload Page */}
              <button
                type="button"
                onClick={() => {
                  setShowDocModal(false);
                  navigate('/upload');
                }}
                className="w-full text-center text-xs font-semibold text-blue-600 hover:text-blue-800 py-1"
              >
                Go to Full Upload & Analysis Page →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
