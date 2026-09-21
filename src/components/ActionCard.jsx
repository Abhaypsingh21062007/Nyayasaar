import { useNavigate } from 'react-router-dom';
import {
  ScanText,
  GitCompare,
  MessageSquare,
  ArrowRight,
} from 'lucide-react';

const iconMap = { ScanText, GitCompare, MessageSquare };

const colorMap = {
  blue: {
    bg: 'bg-blue-50',
    icon: 'bg-blue-600 text-white',
    hover: 'hover:border-blue-200 hover:shadow-blue-50/60',
    arrow: 'text-blue-500',
  },
  violet: {
    bg: 'bg-violet-50',
    icon: 'bg-violet-600 text-white',
    hover: 'hover:border-violet-200 hover:shadow-violet-50/60',
    arrow: 'text-violet-500',
  },
  teal: {
    bg: 'bg-teal-50',
    icon: 'bg-teal-600 text-white',
    hover: 'hover:border-teal-200 hover:shadow-teal-50/60',
    arrow: 'text-teal-500',
  },
};

/**
 * ActionCard — large clickable card for primary dashboard actions.
 * Props: icon, title, description, path, color
 */
export default function ActionCard({ icon, title, description, path, color = 'blue' }) {
  const navigate = useNavigate();
  const Icon = iconMap[icon] ?? ScanText;
  const c = colorMap[color] ?? colorMap.blue;

  return (
    <button
      onClick={() => navigate(path)}
      className={`group w-full text-left bg-white rounded-xl border border-slate-100 shadow-card
                  p-5 hover:shadow-card-md transition-all duration-200 ${c.hover}`}
    >
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${c.icon}`}>
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="text-sm font-bold text-slate-900 mb-1">{title}</h3>
      <p className="text-xs text-slate-500 leading-relaxed mb-3">{description}</p>
      <div className={`flex items-center gap-1 text-xs font-semibold ${c.arrow}`}>
        Get started <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
      </div>
    </button>
  );
}
