import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function CTA() {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden bg-gradient-to-b from-[#07080f] via-[#0d0f1c] to-[#07080f] border-t border-white/[0.06]">
      {/* Background glow orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-violet-600/15 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">

        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight mb-5">
          Legal documents shouldn't feel{' '}
          <span className="animate-shimmer">impossible to understand.</span>
        </h2>

        {/* Sub text */}
        <p className="text-base sm:text-lg text-slate-400 leading-relaxed mb-8 max-w-xl mx-auto">
          Upload any legal contract, agreement, or notice and experience clear, plain-language insights in seconds.
        </p>

        {/* CTA button */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link to="/upload" className="btn-primary text-sm px-7 py-3.5 shadow-xl shadow-violet-600/30">
            <Sparkles className="w-4 h-4" /> Analyze Your Document <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-slate-500 mt-6 max-w-sm mx-auto leading-relaxed">
          NyayaSaar provides general legal information and document assistance,
          not professional legal advice.
        </p>
      </div>
    </section>
  );
}
