import { FileText, AlertTriangle, MessageSquare, GitCompare } from 'lucide-react';
import { features } from '../data/mockData';

const iconMap = {
  FileText,
  AlertTriangle,
  MessageSquare,
  GitCompare,
};

const iconStyles = [
  { bg: 'bg-blue-500/10 text-blue-400 border-blue-500/20', hover: 'group-hover:border-blue-500/40' },
  { bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20', hover: 'group-hover:border-amber-500/40' },
  { bg: 'bg-violet-500/10 text-violet-400 border-violet-500/20', hover: 'group-hover:border-violet-500/40' },
  { bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', hover: 'group-hover:border-emerald-500/40' },
];

export default function Features() {
  return (
    <section id="features" className="py-20 md:py-28 bg-[#0a0c16]/60 border-y border-white/[0.06] relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="text-center mb-16">
          <p className="section-label">Capabilities</p>
          <h2 className="section-title">Everything you need to understand your document</h2>
          <p className="section-sub mt-4 max-w-xl mx-auto">
            NyayaSaar gives you a complete intelligence suite for navigating legal documents with confidence.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => {
            const Icon = iconMap[feat.icon];
            const style = iconStyles[idx];
            return (
              <div
                key={feat.title}
                className="bg-[#0d0f1a]/80 backdrop-blur-xl rounded-2xl border border-white/[0.08] p-6 hover:border-violet-500/30 hover:bg-[#121524]/90 hover:-translate-y-1 transition-all duration-300 shadow-xl group"
              >
                {/* Icon */}
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-5 border ${style.bg} ${style.hover} transition-all`}>
                  <Icon className="w-5 h-5" />
                </div>

                <h3 className="text-base font-bold text-white mb-2 group-hover:text-violet-300 transition-colors">
                  {feat.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">{feat.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
