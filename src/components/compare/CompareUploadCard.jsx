import { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  CheckCircle,
  AlertTriangle,
  Loader2,
  X,
  Layers,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

function formatBytes(bytes) {
  if (!bytes) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

export default function CompareUploadCard({
  label = 'DOCUMENT A',
  subtitle = 'Upload first document',
  document = null,
  onUploadFile,
  onRemove,
  loading = false,
  error = null,
}) {
  const [dragActive, setDragActive] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onUploadFile(e.target.files[0]);
    }
  };

  const isDocB = label.includes('B');
  const badgeStyle = isDocB
    ? 'bg-violet-100 text-violet-800 border-violet-200'
    : 'bg-blue-100 text-blue-800 border-blue-200';
  const iconColor = isDocB ? 'text-violet-600' : 'text-blue-600';
  const headerBg = isDocB ? 'from-violet-500/10 to-transparent' : 'from-blue-500/10 to-transparent';

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-card overflow-hidden flex flex-col h-full transition-all duration-200 hover:border-slate-300">
      {/* Card Header */}
      <div className={`px-6 py-4 border-b border-slate-100 bg-gradient-to-r ${headerBg} flex items-center justify-between`}>
        <div className="flex items-center gap-2.5">
          <span className={`text-[11px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md border ${badgeStyle}`}>
            {label}
          </span>
          <span className="text-xs font-semibold text-slate-500">
            {subtitle}
          </span>
        </div>

        {document && (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
            <CheckCircle className="w-3 h-3 text-emerald-600" />
            Ready
          </span>
        )}
      </div>

      {/* Card Body */}
      <div className="p-6 flex-1 flex flex-col justify-center">
        {/* Loading / Extraction State */}
        {loading && (
          <div className="py-12 flex flex-col items-center justify-center gap-3 text-center">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
            <p className="text-sm font-bold text-slate-800">Reading & Extracting Document...</p>
            <p className="text-xs text-slate-400">Parsing PDF text for comparison</p>
          </div>
        )}

        {/* Document Loaded State */}
        {!loading && document && (
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-start gap-3 min-w-0">
                <div className={`w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 shadow-xs ${iconColor}`}>
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate" title={document.fileName}>
                    {document.fileName}
                  </p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap text-xs text-slate-500">
                    <span>{formatBytes(document.fileSize)}</span>
                    {document.pageCount && (
                      <>
                        <span>•</span>
                        <span className="inline-flex items-center gap-1">
                          <Layers className="w-3 h-3 text-slate-400" />
                          {document.pageCount} {document.pageCount === 1 ? 'page' : 'pages'}
                        </span>
                      </>
                    )}
                    {document.wordCount && (
                      <>
                        <span>•</span>
                        <span>{document.wordCount.toLocaleString()} words</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={onRemove}
                className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0"
                title="Remove document"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Expandable Extracted Text Preview */}
            <div className="border border-slate-200/80 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setShowPreview((p) => !p)}
                className="w-full flex items-center justify-between px-3.5 py-2 bg-slate-50 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-blue-500" />
                  Extracted Text Preview
                </span>
                {showPreview ? (
                  <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>
              {showPreview && (
                <div className="p-3 bg-slate-50/50 max-h-40 overflow-y-auto font-mono text-[11px] text-slate-700 leading-relaxed whitespace-pre-wrap select-text border-t border-slate-200/80">
                  {document.text || <span className="text-slate-400 italic">No extractable text.</span>}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline pt-1 inline-block"
            >
              Replace with another document
            </button>
          </div>
        )}

        {/* Empty Dropzone State */}
        {!loading && !document && (
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 sm:p-10 flex flex-col items-center justify-center gap-3 text-center cursor-pointer transition-all duration-200 ${
              dragActive
                ? 'border-blue-500 bg-blue-50/60 scale-[1.01]'
                : 'border-slate-200 bg-slate-50/60 hover:border-blue-400 hover:bg-blue-50/30'
            }`}
          >
            <div className={`w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-sm ${iconColor}`}>
              <UploadCloud className="w-7 h-7" />
            </div>

            <div>
              <p className="text-sm font-bold text-slate-800 mb-0.5">
                {dragActive ? 'Drop PDF here' : `Choose or Drop ${label}`}
              </p>
              <p className="text-xs text-slate-400">PDF documents up to 10 MB</p>
            </div>

            <span className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-xs group-hover:border-blue-300">
              Browse PDF
            </span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mt-4 flex items-start gap-2.5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 animate-in fade-in">
            <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          onChange={handleChange}
          className="hidden"
        />
      </div>
    </div>
  );
}
