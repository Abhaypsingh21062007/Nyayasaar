import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Scale,
  LayoutDashboard,
  FolderOpen,
  ScanText,
  GitCompare,
  MessageSquare,
  Settings,
  HelpCircle,
  AlertCircle,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { sidebarNavItems } from '../data/mockData';

const iconMap = {
  LayoutDashboard,
  FolderOpen,
  ScanText,
  GitCompare,
  MessageSquare,
  Settings,
};

function NavItem({ item, onClick }) {
  const Icon = iconMap[item.icon] ?? LayoutDashboard;
  return (
    <NavLink
      to={item.path}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative
         ${isActive
           ? 'text-white nav-active'
           : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
         }`
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-violet-400 rounded-full" />
          )}
          <Icon
            className={`w-4 h-4 flex-shrink-0 transition-colors ${
              isActive ? 'text-violet-400' : 'text-slate-500 group-hover:text-slate-300'
            }`}
          />
          <span>{item.label}</span>
          {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto text-violet-400/70" />}
        </>
      )}
    </NavLink>
  );
}

/* ── Modal Dialog ────────────────────────────────────────────── */
function Modal({ isOpen, onClose, title, icon: Icon, iconColor = 'text-violet-400', iconBg = 'bg-violet-500/10', children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      <div
        className="relative w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in duration-200"
        style={{
          background: 'rgba(15,17,30,0.95)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(139,92,246,0.15)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBg}`}>
              <Icon className={`w-4 h-4 ${iconColor}`} />
            </div>
            <h3 className="text-base font-bold text-white">{title}</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-500 hover:text-slate-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        {/* Body */}
        <div className="p-6 text-sm text-slate-400 leading-relaxed max-h-[70vh] overflow-y-auto space-y-4">
          {children}
        </div>
        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/[0.06] flex justify-end">
          <button
            onClick={onClose}
            className="btn-primary text-xs py-2 px-4"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Sidebar Content ─────────────────────────────────────────── */
function SidebarContent({ onClose, onOpenHelp, onOpenDisclaimer }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-white/[0.06] flex-shrink-0">
        <button
          onClick={() => { navigate('/'); onClose?.(); }}
          className="flex items-center gap-2.5 group"
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 animate-pulse-glow"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}
          >
            <Scale className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-base font-extrabold tracking-tight">
            <span className="text-slate-100">Nyaya</span>
            <span className="animate-shimmer">Saar</span>
          </span>
        </button>
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-500 md:hidden"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {sidebarNavItems.map((item) => (
          <NavItem key={item.path} item={item} onClick={onClose} />
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-4 border-t border-white/[0.06] pt-3 space-y-0.5">
        <button
          onClick={() => { onOpenHelp(); onClose?.(); }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-all"
        >
          <HelpCircle className="w-4 h-4" /> Help &amp; Features
        </button>
        <button
          onClick={() => { onOpenDisclaimer(); onClose?.(); }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-all"
        >
          <AlertCircle className="w-4 h-4" /> Legal Disclaimer
        </button>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [disclaimerOpen, setDisclaimerOpen] = useState(false);

  return (
    <>
      {/* Desktop */}
      <aside
        className="hidden md:flex flex-col w-60 flex-shrink-0 h-screen sticky top-0"
        style={{
          background: 'rgba(8,9,18,0.95)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <SidebarContent
          onOpenHelp={() => setHelpOpen(true)}
          onOpenDisclaimer={() => setDisclaimerOpen(true)}
        />
      </aside>

      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-3.5 left-4 z-40 p-2 rounded-lg text-slate-400 hover:text-white transition-colors"
        style={{ background: 'rgba(15,17,30,0.9)', border: '1px solid rgba(255,255,255,0.08)' }}
        aria-label="Open sidebar"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside
            className="relative w-64 h-full flex flex-col"
            style={{ background: 'rgba(8,9,18,0.98)', borderRight: '1px solid rgba(255,255,255,0.06)' }}
          >
            <SidebarContent
              onClose={() => setMobileOpen(false)}
              onOpenHelp={() => setHelpOpen(true)}
              onOpenDisclaimer={() => setDisclaimerOpen(true)}
            />
          </aside>
        </div>
      )}

      {/* Help Modal */}
      <Modal
        isOpen={helpOpen}
        onClose={() => setHelpOpen(false)}
        title="NyayaSaar Quick Guide"
        icon={HelpCircle}
        iconBg="bg-violet-500/10"
        iconColor="text-violet-400"
      >
        <div className="space-y-3">
          <p className="text-slate-400 text-xs">
            NyayaSaar simplifies complex legal documents into plain, understandable terms.
          </p>
          {[
            { icon: ScanText, title: '1. Analyze Document', desc: 'Upload any PDF contract. NyayaSaar extracts key parties, dates, financial commitments, and high-attention clauses.' },
            { icon: Sparkles, title: '2. Legal Language Simplifier', desc: 'Click any clause card in the analysis view to translate dense legalese into straightforward plain English.' },
            { icon: MessageSquare, title: '3. Ask NyayaSaar (RAG)', desc: 'Ask specific questions about your agreement. Uses semantic retrieval with cosine similarity grounded in your document.' },
            { icon: GitCompare, title: '4. Compare Documents', desc: 'Upload two agreements side-by-side to detect added, modified, or removed clauses with impact analysis.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="p-3 rounded-xl space-y-1"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div className="flex items-center gap-2 font-bold text-xs text-slate-200">
                <Icon className="w-3.5 h-3.5 text-violet-400" />
                <span>{title}</span>
              </div>
              <p className="text-xs text-slate-500">{desc}</p>
            </div>
          ))}
        </div>
      </Modal>

      {/* Disclaimer Modal */}
      <Modal
        isOpen={disclaimerOpen}
        onClose={() => setDisclaimerOpen(false)}
        title="Legal Disclaimer & Privacy"
        icon={ShieldCheck}
        iconBg="bg-amber-500/10"
        iconColor="text-amber-400"
      >
        <div className="space-y-3.5 text-xs text-slate-400">
          <div className="p-3 rounded-xl" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
            <p className="text-amber-300 font-medium">NyayaSaar provides general legal information only. It does not provide formal legal advice or legal representation.</p>
          </div>
          {[
            { t: '1. Not Legal Advice', d: 'The explanations, summaries, and answers generated by NyayaSaar are for educational and informational purposes only. No attorney-client relationship is created.' },
            { t: '2. Verification Required', d: 'AI interpretations can occasionally make mistakes. Always consult a qualified attorney before executing binding contracts.' },
            { t: '3. Document Privacy', d: 'Uploaded documents are processed in-memory for session analysis. Files are not permanently stored on disk.' },
          ].map(({ t, d }) => (
            <div key={t}>
              <h4 className="font-bold text-slate-300 mb-1">{t}</h4>
              <p>{d}</p>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
}
