import { createContext, useContext } from 'react';
import Sidebar from '../components/Sidebar';
import ToastContainer from '../components/Toast';
import useToast from '../hooks/useToast';

/* ── Toast Context ──────────────────────────────────────────────────────── */
const ToastContext = createContext(null);

export function useAppToast() {
  return useContext(ToastContext);
}

export default function DashboardLayout({ children }) {
  const { toasts, toast, dismiss } = useToast();

  return (
    <ToastContext.Provider value={toast}>
      <a href="#main-content" className="skip-to-content">Skip to content</a>

      {/* Ambient background orbs */}
      <div
        className="fixed top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none z-0 orb-float"
        style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)', filter: 'blur(60px)' }}
      />
      <div
        className="fixed bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, rgba(79,70,229,0.1) 0%, transparent 70%)', filter: 'blur(80px)' }}
      />

      <div className="flex h-screen overflow-hidden relative z-10">
        <Sidebar />

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile top spacer */}
          <div className="md:hidden h-14 flex-shrink-0" />

          <main id="main-content" className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>

      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}
