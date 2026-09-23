import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#07080f] text-slate-100 selection:bg-violet-500/30 selection:text-violet-200 relative overflow-hidden">
      {/* Ambient background glow orbs */}
      <div className="fixed -top-40 -left-40 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed top-1/2 -right-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed -bottom-40 left-1/3 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <a href="#main-content" className="skip-to-content">
        Skip to content
      </a>
      <Navbar />
      <main id="main-content" className="flex-1 relative z-10">{children}</main>
      <Footer />
    </div>
  );
}
