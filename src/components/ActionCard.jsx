import { useNavigate } from 'react-router-dom';
import { ScanText, GitCompare, MessageSquare, ArrowRight } from 'lucide-react';

const iconMap = { ScanText, GitCompare, MessageSquare };

const colorMap = {
  blue: {
    iconGrad: 'linear-gradient(135deg, #2563eb, #4f46e5)',
    glow: 'rgba(79,70,229,0.3)',
    border: 'rgba(79,70,229,0.25)',
    arrow: 'text-indigo-400',
    hoverBorder: 'rgba(79,70,229,0.4)',
  },
  violet: {
    iconGrad: 'linear-gradient(135deg, #7c3aed, #a855f7)',
    glow: 'rgba(124,58,237,0.3)',
    border: 'rgba(124,58,237,0.25)',
    arrow: 'text-violet-400',
    hoverBorder: 'rgba(124,58,237,0.4)',
  },
  teal: {
    iconGrad: 'linear-gradient(135deg, #0d9488, #06b6d4)',
    glow: 'rgba(13,148,136,0.3)',
    border: 'rgba(13,148,136,0.25)',
    arrow: 'text-teal-400',
    hoverBorder: 'rgba(13,148,136,0.4)',
  },
};

export default function ActionCard({ icon, title, description, path, color = 'blue' }) {
  const navigate = useNavigate();
  const Icon = iconMap[icon] ?? ScanText;
  const c = colorMap[color] ?? colorMap.blue;

  return (
    <button
      onClick={() => navigate(path)}
      className="group w-full text-left rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1"
      style={{
        background: 'rgba(255,255,255,0.035)',
        border: `1px solid ${c.border}`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.border = `1px solid ${c.hoverBorder}`;
        e.currentTarget.style.boxShadow = `0 8px 30px rgba(0,0,0,0.3), 0 0 20px ${c.glow}`;
        e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.border = `1px solid ${c.border}`;
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.background = 'rgba(255,255,255,0.035)';
      }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
        style={{ background: c.iconGrad, boxShadow: `0 4px 12px ${c.glow}` }}
      >
        <Icon className="w-5 h-5 text-white" />
      </div>
      <h3 className="text-sm font-bold text-slate-100 mb-1">{title}</h3>
      <p className="text-xs text-slate-500 leading-relaxed mb-3">{description}</p>
      <div className={`flex items-center gap-1 text-xs font-semibold ${c.arrow}`}>
        Get started <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
      </div>
    </button>
  );
}
