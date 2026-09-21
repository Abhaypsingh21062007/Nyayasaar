import { Scale } from 'lucide-react';

const footerLinks = [
  { label: 'Privacy', href: '#' },
  { label: 'Disclaimer', href: '#' },
  { label: 'Contact', href: '#' },
];

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">

          {/* Brand */}
          <div className="flex flex-col items-center sm:items-start gap-1.5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center">
                <Scale className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-base font-bold text-slate-900 tracking-tight">
                Nyaya<span className="text-blue-600">Saar</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 italic">Legal information, made understandable.</p>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-6">
            {footerLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-slate-400 hover:text-slate-700 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Bottom line */}
        <div className="mt-8 pt-6 border-t border-slate-50 text-center">
          <p className="text-xs text-slate-300">
            © {new Date().getFullYear()} NyayaSaar. All rights reserved. &nbsp;·&nbsp; Not legal advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
