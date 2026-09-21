/**
 * RiskScoreGauge — Animated circular SVG risk meter for legal documents.
 * Appears at the top of the Analysis page alongside document metadata.
 *
 * Props:
 *  clauses: array of clause objects with .importance ('high' | 'medium' | 'low')
 */
import { useEffect, useState } from 'react';
import { Shield, ShieldAlert, ShieldCheck } from 'lucide-react';

function computeRiskScore(clauses = []) {
  if (!clauses.length) return 0;
  let total = 0;
  clauses.forEach((c) => {
    if (c.importance === 'high')   total += 3;
    else if (c.importance === 'medium') total += 1.5;
    else total += 0.5;
  });
  const maxPossible = clauses.length * 3;
  return Math.round((total / maxPossible) * 100);
}

function getRiskLevel(score) {
  if (score >= 65) return { label: 'High Risk', color: '#ef4444', glow: 'shadow-red-400/40', badge: 'bg-red-100 text-red-700 border-red-200', Icon: ShieldAlert };
  if (score >= 35) return { label: 'Moderate Risk', color: '#f59e0b', glow: 'shadow-amber-400/40', badge: 'bg-amber-100 text-amber-700 border-amber-200', Icon: Shield };
  return { label: 'Low Risk', color: '#10b981', glow: 'shadow-emerald-400/40', badge: 'bg-emerald-100 text-emerald-700 border-emerald-200', Icon: ShieldCheck };
}

export default function RiskScoreGauge({ clauses = [] }) {
  const targetScore = computeRiskScore(clauses);
  const [animScore, setAnimScore] = useState(0);

  useEffect(() => {
    let frame;
    const start = performance.now();
    const duration = 1200;
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimScore(Math.round(eased * targetScore));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [targetScore]);

  const { label, color, glow, badge, Icon } = getRiskLevel(targetScore);

  const size = 120;
  const cx = size / 2;
  const cy = size / 2;
  const r = 46;
  const circumference = 2 * Math.PI * r;
  const arcLen = circumference * 0.75;
  const dashOffset = arcLen - (arcLen * animScore) / 100;

  const highCount  = clauses.filter((c) => c.importance === 'high').length;
  const medCount   = clauses.filter((c) => c.importance === 'medium').length;
  const lowCount   = clauses.filter((c) => c.importance === 'low').length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col items-center gap-3">
      <div className={`relative rounded-full shadow-lg ${glow}`}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke="#f1f5f9"
            strokeWidth={10}
            strokeLinecap="round"
            strokeDasharray={`${arcLen} ${circumference}`}
            strokeDashoffset={0}
            transform={`rotate(135 ${cx} ${cy})`}
          />
          <circle
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={color}
            strokeWidth={10}
            strokeLinecap="round"
            strokeDasharray={`${arcLen} ${circumference}`}
            strokeDashoffset={dashOffset}
            transform={`rotate(135 ${cx} ${cy})`}
            style={{ transition: 'stroke-dashoffset 0.05s linear', filter: `drop-shadow(0 0 6px ${color}60)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-extrabold leading-none" style={{ color }}>{animScore}</span>
          <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mt-0.5">Risk Score</span>
        </div>
      </div>

      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badge}`}>
        <Icon className="w-3.5 h-3.5" />
        {label}
      </span>

      <div className="w-full grid grid-cols-3 gap-1.5 pt-1 border-t border-slate-100">
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-sm font-extrabold text-red-500">{highCount}</span>
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">High</span>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-sm font-extrabold text-amber-500">{medCount}</span>
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Medium</span>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-sm font-extrabold text-emerald-500">{lowCount}</span>
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Low</span>
        </div>
      </div>
    </div>
  );
}
