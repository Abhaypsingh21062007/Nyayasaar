import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Scale, ArrowRight, Sparkles } from 'lucide-react';
import { navLinks } from '../data/mockData';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#07080f]/80 backdrop-blur-xl border-b border-white/[0.07]">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/25 group-hover:scale-105 transition-transform">
            <Scale className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">
            Nyaya<span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">Saar</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/dashboard"
            className="btn-primary text-xs py-2.5 px-4 shadow-lg shadow-violet-600/30"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Launch App
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0c0e18] border-t border-white/[0.08] px-4 py-5 flex flex-col gap-4 shadow-2xl backdrop-blur-xl">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-slate-300 hover:text-violet-400 transition-colors py-1.5"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <Link
            to="/dashboard"
            className="btn-primary justify-center mt-2"
            onClick={() => setMobileOpen(false)}
          >
            Launch App <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </header>
  );
}
