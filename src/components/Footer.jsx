import { Scale } from 'lucide-react';

const footerLinks = [
  { label: 'Privacy', href: '#' },
  { label: 'Disclaimer', href: '#' },
  { label: 'Contact', href: '#' },
];

export default function Footer() {
  return (
    <footer className="bg-[#05060b] border-t border-white/[0.06] py-12 relative z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">

          {/* Brand */}
          <div className="flex flex-col items-center sm:items-start gap-1.5">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md shadow-violet-500/20">
                <Scale className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                Nyaya<span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">Saar</span>
              </span>
            </div>
            <p className="text-xs text-slate-500">Legal information, made understandable.</p>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-6">
            {footerLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-slate-400 hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Bottom line */}
        <div className="mt-8 pt-6 border-t border-white/[0.04] text-center">
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} NyayaSaar. All rights reserved. &nbsp;·&nbsp; Not legal advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
