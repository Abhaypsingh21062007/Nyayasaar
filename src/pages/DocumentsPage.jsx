import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, FolderOpen, ChevronRight, Layers, Trash2, Sparkles, Upload } from 'lucide-react';

function formatBytes(bytes) {
  if (!bytes) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

export default function DocumentsPage() {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('nyayasaar_documents');
      if (stored) {
        setDocuments(JSON.parse(stored).reverse());
      }
    } catch (err) {
      console.error('Failed to parse documents from localStorage', err);
    }
  }, []);

  const handleDelete = (id) => {
    const updated = documents.filter((doc) => doc.id !== id);
    setDocuments(updated);
    try {
      localStorage.setItem('nyayasaar_documents', JSON.stringify(updated.reverse()));
    } catch (err) {
      console.error('Failed to update localStorage', err);
    }
  };

  const handleOpen = () => {
    alert('In this demo, documents are stored in-memory per session. To analyze again, please re-upload.');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in duration-200">
      <div>
        <p className="section-label mb-2">Vault</p>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 tracking-tight">
          My <span className="gradient-text">Documents</span>
        </h1>
        <p className="text-slate-400 leading-relaxed text-sm">
          Recent documents you've uploaded for intelligence analysis.
        </p>
      </div>

      {documents.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.08] bg-[#0d0f1a]/60 backdrop-blur-xl flex flex-col items-center justify-center p-12 text-center shadow-xl">
          <div className="w-16 h-16 bg-violet-600/10 rounded-2xl flex items-center justify-center shadow-inner mb-4 border border-violet-500/20">
            <FolderOpen className="w-8 h-8 text-violet-400" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">No documents yet</h3>
          <p className="text-sm text-slate-400 max-w-sm mb-6">
            Upload your first legal document to begin analyzing clauses and chatting with AI.
          </p>
          <button
            onClick={() => navigate('/upload')}
            className="btn-primary"
          >
            <Upload className="w-4 h-4" /> Upload Document
          </button>
        </div>
      ) : (
        <div className="bg-[#0d0f1a]/80 backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden">
          <ul className="divide-y divide-white/[0.06]">
            {documents.map((doc) => (
              <li key={doc.id} className="p-4 sm:p-5 hover:bg-white/[0.03] transition-colors group flex items-center justify-between gap-4">
                <div className="flex items-start gap-4 overflow-hidden">
                  <div className="w-10 h-10 bg-violet-600/15 text-violet-400 border border-violet-500/25 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-slate-100 truncate mb-1" title={doc.fileName}>
                      {doc.fileName}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                      <span>{formatBytes(doc.fileSize)}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-600" />
                      <span className="flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5" />
                        {doc.pageCount} pages
                      </span>
                      <span className="w-1 h-1 rounded-full bg-slate-600" />
                      <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDelete(doc.id)}
                    aria-label="Delete document"
                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleOpen(doc.id)}
                    className="p-2 text-slate-400 hover:text-violet-400 hover:bg-violet-500/10 rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
