import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, FolderOpen, ChevronRight, Layers, Trash2 } from 'lucide-react';

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
        setDocuments(JSON.parse(stored).reverse()); // newest first
      }
    } catch (err) {
      console.error('Failed to parse documents from localStorage', err);
    }
  }, []);

  const handleDelete = (id) => {
    const updated = documents.filter((doc) => doc.id !== id);
    setDocuments(updated);
    try {
      localStorage.setItem('nyayasaar_documents', JSON.stringify(updated.reverse())); // it was reversed above
    } catch (err) {
      console.error('Failed to update localStorage', err);
    }
  };

  const handleOpen = (docId) => {
    // We only stored metadata. In a real app we would refetch by ID.
    // Here we can navigate to the ask page where RAG might still have it in-memory.
    // Or we show an error if it's expired from memory.
    alert('In this demo, documents are only stored in-memory per session. To analyze again, please re-upload.');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8 animate-in fade-in duration-200">
      <div>
        <p className="section-label mb-2">Vault</p>
        <h1 className="text-2xl font-extrabold text-slate-900 mb-2">My Documents</h1>
        <p className="text-slate-500 leading-relaxed">
          Recent documents you've uploaded for analysis.
        </p>
      </div>

      {documents.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center p-12 text-center">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-card mb-4 border border-slate-100">
            <FolderOpen className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">No documents yet</h3>
          <p className="text-sm text-slate-500 max-w-sm mb-6">
            Upload your first legal document to see it listed here in your vault.
          </p>
          <button
            onClick={() => navigate('/upload')}
            className="btn-primary"
          >
            Upload Document
          </button>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <ul className="divide-y divide-slate-100">
            {documents.map((doc) => (
              <li key={doc.id} className="p-4 sm:p-5 hover:bg-slate-50 transition-colors group flex items-center justify-between gap-4">
                <div className="flex items-start gap-4 overflow-hidden">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-slate-900 truncate mb-1" title={doc.fileName}>
                      {doc.fileName}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                      <span>{formatBytes(doc.fileSize)}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300" />
                      <span className="flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5" />
                        {doc.pageCount} pages
                      </span>
                      <span className="w-1 h-1 rounded-full bg-slate-300" />
                      <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDelete(doc.id)}
                    aria-label="Delete document"
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleOpen(doc.id)}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
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
