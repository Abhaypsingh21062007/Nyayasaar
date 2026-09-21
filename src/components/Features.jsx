import { FileText, AlertTriangle, MessageSquare, GitCompare } from 'lucide-react';
import { features } from '../data/mockData';

const iconMap = {
  FileText,
  AlertTriangle,
  MessageSquare,
  GitCompare,
};

const iconColors = [
  'bg-blue-50 text-blue-600',
  'bg-amber-50 text-amber-600',
  'bg-violet-50 text-violet-600',
  'bg-teal-50 text-teal-600',
];

export default function Features() {
  return (
    <section id="features" className="py-20 md:py-28 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="text-center mb-14">
          <p className="section-label mb-3">Capabilities</p>
          <h2 className="section-title">Everything you need to understand your document</h2>
          <p className="section-sub mt-4 max-w-xl mx-auto">
            NyayaSaar gives you a complete toolkit for navigating legal documents with confidence.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => {
            const Icon = iconMap[feat.icon];
            return (
              <div
                key={feat.title}
                className="bg-white rounded-xl border border-slate-100 shadow-card p-6 hover:border-blue-100 hover:shadow-card-md transition-all duration-200 group"
              >
                {/* Icon */}
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${iconColors[idx]}`}>
                  <Icon className="w-5 h-5" />
                </div>

                <h3 className="text-sm font-bold text-slate-900 mb-2">{feat.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{feat.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
