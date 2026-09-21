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
  CheckCircle2,
  Sparkles,
  ExternalLink,
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
        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group
         ${isActive
           ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm'
           : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
         }`
      }
    >
      {({ isActive }) => (
        <>
          <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`} />
          <span>{item.label}</span>
          {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-60" />}
        </>
      )}
    </NavLink>
  );
}

/* ── Modal Dialog ────────────────────────────────────────────── */
function Modal({ isOpen, onClose, title, icon: Icon, iconColor = 'text-slate-900', iconBg = 'bg-slate-100', children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBg}`}>
              <Icon className={`w-4 h-4 ${iconColor}`} />
            </div>
            <h3 className="text-base font-bold text-slate-900">{title}</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6 text-sm text-slate-600 leading-relaxed max-h-[70vh] overflow-y-auto space-y-4">
          {children}
        </div>
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Sidebar content (shared between desktop + mobile) ── */
function SidebarContent({ onClose, onOpenHelp, onOpenDisclaimer }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-slate-100 flex-shrink-0">
        <button
          onClick={() => { navigate('/'); onClose?.(); }}
          className="flex items-center gap-2 group"
        >
          <div className="w-7 h-7 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-md flex items-center justify-center shadow-sm group-hover:opacity-90 transition-opacity">
            <Scale className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-base font-extrabold text-slate-900 tracking-tight">
            Nyaya<span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">Saar</span>
          </span>
        </button>
        {/* Close button (mobile only) */}
        {onClose && (
          <button onClick={onClose} aria-label="Close" className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 md:hidden">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {sidebarNavItems.map((item) => (
          <NavItem key={item.path} item={item} onClick={onClose} />
        ))}
      </nav>

      {/* Bottom utility links */}
      <div className="px-3 pb-4 border-t border-slate-100 pt-4 space-y-1">
        <button
          onClick={() => { onOpenHelp(); onClose?.(); }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
        >
          <HelpCircle className="w-4 h-4 text-slate-400" /> Help & Features
        </button>
        <button
          onClick={() => { onOpenDisclaimer(); onClose?.(); }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
        >
          <AlertCircle className="w-4 h-4 text-slate-400" /> Legal Disclaimer
        </button>
      </div>
    </div>
  );
}

/**
 * Sidebar — renders:
 *   - Desktop: fixed left column (w-60)
 *   - Mobile: slide-in drawer triggered by hamburger in DashboardLayout
 */
export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [disclaimerOpen, setDisclaimerOpen] = useState(false);

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside className="hidden md:flex flex-col w-60 flex-shrink-0 bg-white border-r border-slate-100 h-screen sticky top-0">
        <SidebarContent
          onOpenHelp={() => setHelpOpen(true)}
          onOpenDisclaimer={() => setDisclaimerOpen(true)}
        />
      </aside>

      {/* ── Mobile hamburger trigger (injected by DashboardLayout header) ── */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-3.5 left-4 z-40 p-2 rounded-lg bg-white border border-slate-200 shadow-sm text-slate-600 hover:bg-slate-50"
        aria-label="Open sidebar"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* ── Mobile drawer overlay ── */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer */}
          <aside className="relative w-64 bg-white h-full shadow-2xl flex flex-col">
            <SidebarContent
              onClose={() => setMobileOpen(false)}
              onOpenHelp={() => setHelpOpen(true)}
              onOpenDisclaimer={() => setDisclaimerOpen(true)}
            />
          </aside>
        </div>
      )}

      {/* ── Help Modal ── */}
      <Modal
        isOpen={helpOpen}
        onClose={() => setHelpOpen(false)}
        title="NyayaSaar Quick Guide"
        icon={HelpCircle}
        iconBg="bg-slate-100"
        iconColor="text-slate-900"
      >
        <div className="space-y-4">
          <p className="text-slate-600 text-xs">
            NyayaSaar simplifies complex legal documents into plain, understandable terms. Here is how each module works:
          </p>

          <div className="space-y-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <div className="flex items-center gap-2 font-bold text-xs text-slate-800">
                <ScanText className="w-3.5 h-3.5 text-slate-900" />
                <span>1. Analyze Document</span>
              </div>
              <p className="text-xs text-slate-500">
                Upload any PDF contract. NyayaSaar extracts key parties, dates, financial commitments, and high-attention clauses.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <div className="flex items-center gap-2 font-bold text-xs text-slate-800">
                <Sparkles className="w-3.5 h-3.5 text-slate-900" />
                <span>2. Legal Language Simplifier</span>
              </div>
              <p className="text-xs text-slate-500">
                Click any clause card in the analysis view to translate dense legalese into straightforward plain English with actionable context.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <div className="flex items-center gap-2 font-bold text-xs text-slate-800">
                <MessageSquare className="w-3.5 h-3.5 text-slate-900" />
                <span>3. Ask NyayaSaar (RAG)</span>
              </div>
              <p className="text-xs text-slate-500">
                Ask specific questions about your agreement. NyayaSaar uses a semantic retrieval pipeline with cosine similarity to return answers grounded strictly in retrieved clauses.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <div className="flex items-center gap-2 font-bold text-xs text-slate-800">
                <GitCompare className="w-3.5 h-3.5 text-slate-900" />
                <span>4. Compare Documents</span>
              </div>
              <p className="text-xs text-slate-500">
                Upload two agreements side-by-side to detect added, modified, or removed clauses with impact analysis.
              </p>
            </div>
          </div>
        </div>
      </Modal>

      {/* ── Legal Disclaimer Modal ── */}
      <Modal
        isOpen={disclaimerOpen}
        onClose={() => setDisclaimerOpen(false)}
        title="Legal Disclaimer & Privacy Notice"
        icon={ShieldCheck}
        iconBg="bg-amber-50"
        iconColor="text-amber-600"
      >
        <div className="space-y-3.5 text-xs text-slate-600">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 font-medium">
            NyayaSaar provides general legal information and document assistance. It does not provide formal legal advice or legal representation.
          </div>

          <div>
            <h4 className="font-bold text-slate-800 mb-1">1. Not Legal Advice</h4>
            <p>
              The explanations, summaries, and answers generated by NyayaSaar are for educational and informational purposes only. No attorney-client relationship is created by using this software.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-800 mb-1">2. Verification Required</h4>
            <p>
              AI interpretations can occasionally make mistakes or miss nuance in localized jurisdictions. Always consult a qualified attorney before executing binding contracts.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-800 mb-1">3. Document Privacy</h4>
            <p>
              Uploaded documents are processed in-memory for session analysis and chunk retrieval. Files are not permanently stored on disk.
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
}
