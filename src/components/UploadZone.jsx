import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UploadCloud,
  FileText,
  CheckCircle,
  AlertTriangle,
  Loader2,
  X,
  RefreshCw,
  ArrowRight,
  Copy,
  Check,
  Layers,
  FileCheck2,
  AlertCircle,
  MessageSquare,
} from 'lucide-react';

function formatBytes(bytes) {
  if (!bytes) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

/* ── State sub-components ──────────────────────────────────────────────── */

function EmptyState({ dragActive, onDrop, onDragOver, onDragLeave, onFileChange, inputRef }) {
  return (
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      className={`flex flex-col items-center justify-center gap-4 py-16 px-8 rounded-2xl border-2 border-dashed transition-all duration-200
        ${dragActive
          ? 'border-slate-800 bg-slate-100 scale-[1.01]'
          : 'border-slate-200 bg-white hover:border-slate-400 hover:bg-slate-50'
        }`}
    >
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${dragActive ? 'bg-slate-200' : 'bg-slate-50 border border-slate-100 shadow-sm'}`}>
        <UploadCloud className={`w-7 h-7 ${dragActive ? 'text-slate-900' : 'text-slate-400'}`} />
      </div>

      <div className="text-center">
        <p className="text-base font-semibold text-slate-700 mb-1">
          {dragActive ? 'Drop your document here' : 'Drag & drop your legal document here'}
        </p>
        <p className="text-sm text-slate-400">or choose a PDF from your device</p>
      </div>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="btn-primary"
      >
        Choose Document
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="hidden"
        onChange={onFileChange}
      />

      <div className="flex items-center gap-4 text-xs text-slate-400">
        <span className="flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-blue-500" /> PDF only
        </span>
        <span className="w-px h-3 bg-slate-200" />
        <span>Maximum 10 MB</span>
      </div>
    </div>
  );
}

function SelectedState({ file, onRemove, onUpload }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-card overflow-hidden">
      <div className="flex items-center gap-4 px-6 py-5 border-b border-slate-100 bg-slate-50">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <FileText className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-800 truncate">{file.name}</p>
          <p className="text-xs text-slate-400">{formatBytes(file.size)}</p>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
          title="Remove selected file"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="px-6 py-5 flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={onUpload}
          className="btn-primary flex-1 justify-center py-2.5"
        >
          <UploadCloud className="w-4 h-4" /> Upload & Extract Text
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="btn-secondary justify-center"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function ProgressState({ label }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white shadow-card p-10 flex flex-col items-center gap-5 text-center">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-blue-50 border border-blue-100 text-blue-600">
        <Loader2 className="w-7 h-7 animate-spin" />
      </div>
      <div>
        <p className="text-base font-semibold text-slate-800 mb-1">{label}</p>
        <p className="text-sm text-slate-400">Parsing pages and extracting text cleanly…</p>
      </div>
    </div>
  );
}

function CompletedState({ data, onReset, onContinue, onAsk }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (data?.text) {
      navigator.clipboard.writeText(data.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="rounded-2xl border border-emerald-100 bg-white shadow-card overflow-hidden">
      {/* Success banner */}
      <div className="px-6 py-4 bg-emerald-50 border-b border-emerald-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5 text-emerald-800">
          <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span className="text-sm font-bold">Document uploaded successfully.</span>
        </div>
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
          Extracted
        </span>
      </div>

      <div className="p-6 space-y-6">
        {/* Document metadata summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <p className="text-xs text-slate-400 font-medium">File Name</p>
            <p className="text-sm font-semibold text-slate-800 truncate mt-0.5" title={data?.fileName}>
              {data?.fileName}
            </p>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <p className="text-xs text-slate-400 font-medium">File Size</p>
            <p className="text-sm font-semibold text-slate-800 mt-0.5">
              {formatBytes(data?.fileSize)}
            </p>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <p className="text-xs text-slate-400 font-medium">Pages</p>
            <p className="text-sm font-semibold text-slate-800 mt-0.5 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              {data?.pageCount || 0} {data?.pageCount === 1 ? 'page' : 'pages'}
            </p>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <p className="text-xs text-slate-400 font-medium">Words</p>
            <p className="text-sm font-semibold text-slate-800 mt-0.5">
              {data?.wordCount ? data.wordCount.toLocaleString() : 0}
            </p>
          </div>
        </div>

        {/* Warning if empty text */}
        {data?.warning && (
          <div className="flex items-start gap-2.5 p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <span>{data.warning}</span>
          </div>
        )}

        {/* Extracted text preview container */}
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-semibold text-slate-700">Extracted Text Preview</span>
            </div>

            <button
              type="button"
              onClick={handleCopy}
              disabled={!data?.text}
              className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 bg-white px-2.5 py-1 rounded border border-slate-200 hover:bg-slate-100 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          <div className="p-4 bg-slate-50/50 max-h-52 overflow-y-auto font-mono text-xs text-slate-800 leading-relaxed whitespace-pre-wrap select-text">
            {data?.text ? (
              data.text
            ) : (
              <span className="text-slate-400 italic">No extractable text found in this PDF document.</span>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={onContinue}
            className="btn-primary flex-1 justify-center py-2.5"
          >
            Continue to Analysis <ArrowRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onAsk}
            className="btn-secondary text-blue-700 hover:bg-blue-50 hover:border-blue-200 justify-center py-2.5"
          >
            <MessageSquare className="w-4 h-4 text-blue-600" /> Ask NyayaSaar
          </button>
          <button
            type="button"
            onClick={onReset}
            className="btn-secondary justify-center"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Upload Another
          </button>
        </div>
      </div>
    </div>
  );
}

function ErrorState({ message, onReset }) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50/70 shadow-card p-8 flex flex-col items-center gap-4 text-center">
      <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center">
        <AlertTriangle className="w-7 h-7 text-red-600" />
      </div>
      <div>
        <p className="text-base font-bold text-slate-900 mb-1">Document Error</p>
        <p className="text-sm text-red-700 max-w-md leading-relaxed">{message}</p>
      </div>
      <button
        type="button"
        onClick={onReset}
        className="btn-primary bg-red-600 hover:bg-red-700 mt-2"
      >
        <RefreshCw className="w-4 h-4" /> Try Again
      </button>
    </div>
  );
}

/* ── Main UploadZone component ─────────────────────────────────────────── */

export default function UploadZone() {
  const navigate = useNavigate();
  const [state, setState] = useState('empty'); // 'empty' | 'selected' | 'uploading' | 'completed' | 'error'
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [uploadedData, setUploadedData] = useState(null);
  const inputRef = useRef(null);

  const MAX_MB = 10;

  const validateFile = (f) => {
    if (!f) return 'No file selected.';

    // Check extension and mime type
    const isPdf =
      f.type === 'application/pdf' ||
      f.name.toLowerCase().endsWith('.pdf');

    if (!isPdf) {
      return 'Invalid file type. Only PDF documents (.pdf) are supported.';
    }

    if (f.size === 0) {
      return 'The selected PDF file is empty (0 bytes).';
    }

    if (f.size > MAX_MB * 1024 * 1024) {
      return `File size (${formatBytes(f.size)}) exceeds the maximum ${MAX_MB} MB limit.`;
    }

    return null;
  };

  const selectFile = useCallback((f) => {
    const err = validateFile(f);
    if (err) {
      setErrorMsg(err);
      setState('error');
      return;
    }
    setFile(f);
    setErrorMsg('');
    setState('selected');
  }, []);

  const handleFileChange = (e) => selectFile(e.target.files?.[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    selectFile(e.dataTransfer.files?.[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => setDragActive(false);

  const reset = () => {
    setState('empty');
    setFile(null);
    setErrorMsg('');
    setUploadedData(null);
    setDragActive(false);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleUpload = async () => {
    if (!file) return;

    setState('uploading');
    setErrorMsg('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 413) {
          throw new Error('File size exceeds the 10 MB limit. Please select a smaller document.');
        }
        if (data.error) {
          throw new Error(data.error);
        }
        if (response.status >= 500) {
          throw new Error('Server error while parsing the PDF. Please try again later.');
        }
        throw new Error('Could not process the document. Please try again.');
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to extract text from document.');
      }

      setUploadedData(data);
      try {
        sessionStorage.setItem('nyayasaar_active_document', JSON.stringify(data));
        
        // Save metadata to Documents Vault in localStorage
        const vaultDoc = {
          id: data.id,
          fileName: data.fileName,
          fileSize: data.fileSize,
          pageCount: data.pageCount,
          uploadedAt: new Date().toISOString()
        };
        const existingDocsStr = localStorage.getItem('nyayasaar_documents');
        const existingDocs = existingDocsStr ? JSON.parse(existingDocsStr) : [];
        existingDocs.push(vaultDoc);
        localStorage.setItem('nyayasaar_documents', JSON.stringify(existingDocs));
      } catch {
        // Safe fallback
      }
      setState('completed');
    } catch (err) {
      setErrorMsg(err.message || 'An error occurred during document upload.');
      setState('error');
    }
  };

  const handleContinue = () => {
    navigate('/analysis', {
      state: {
        document: uploadedData,
      },
    });
  };

  const handleAsk = () => {
    navigate('/ask', {
      state: {
        document: uploadedData,
      },
    });
  };

  if (state === 'empty') {
    return (
      <EmptyState
        dragActive={dragActive}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onFileChange={handleFileChange}
        inputRef={inputRef}
      />
    );
  }

  if (state === 'selected') {
    return <SelectedState file={file} onRemove={reset} onUpload={handleUpload} />;
  }

  if (state === 'uploading') {
    return <ProgressState label="Uploading & extracting text…" />;
  }

  if (state === 'completed') {
    return (
      <CompletedState
        data={uploadedData}
        onReset={reset}
        onContinue={handleContinue}
        onAsk={handleAsk}
      />
    );
  }

  if (state === 'error') {
    return <ErrorState message={errorMsg} onReset={reset} />;
  }

  return null;
}
