import { FileText, ArrowRight, Layers, Sparkles } from 'lucide-react';

export default function ComparisonTable({
  differences = [],
  docAName = 'Document A',
  docBName = 'Document B',
}) {
  if (!differences || differences.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-2xl border border-slate-200">
        No significant differences detected between the documents.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-card overflow-hidden">
      {/* Table Title Bar */}
      <div className="px-6 py-4.5 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">
              Side-by-Side Clause Comparison
            </h3>
            <p className="text-xs text-slate-500">
              Comparing {differences.length} key areas between both agreements
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
          <Sparkles className="w-3.5 h-3.5 text-blue-500" />
          AI Term Extraction
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-100/60 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th className="py-3.5 px-6 w-1/4 min-w-[160px]">Clause / Area</th>
              <th className="py-3.5 px-6 w-[37.5%] min-w-[220px]">
                <div className="flex items-center gap-1.5 text-blue-700">
                  <FileText className="w-3.5 h-3.5" />
                  <span className="truncate" title={docAName}>
                    Document A (Original)
                  </span>
                </div>
              </th>
              <th className="py-3.5 px-6 w-[37.5%] min-w-[220px]">
                <div className="flex items-center gap-1.5 text-violet-700">
                  <FileText className="w-3.5 h-3.5" />
                  <span className="truncate" title={docBName}>
                    Document B (Modified)
                  </span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {differences.map((diff, index) => {
              const isEven = index % 2 === 0;
              return (
                <tr
                  key={index}
                  className={`hover:bg-blue-50/30 transition-colors ${
                    isEven ? 'bg-white' : 'bg-slate-50/40'
                  }`}
                >
                  {/* Topic / Area */}
                  <td className="py-4 px-6 align-top font-bold text-slate-900">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                      <span>{diff.topic}</span>
                    </div>
                  </td>

                  {/* Document A Value */}
                  <td className="py-4 px-6 align-top text-slate-700 font-medium">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 leading-relaxed select-text">
                      {diff.documentA || '—'}
                    </div>
                  </td>

                  {/* Document B Value */}
                  <td className="py-4 px-6 align-top text-slate-900 font-semibold">
                    <div className="p-2.5 rounded-xl bg-violet-50/60 border border-violet-200/80 text-violet-950 leading-relaxed select-text flex items-start gap-2">
                      <ArrowRight className="w-4 h-4 text-violet-500 flex-shrink-0 mt-0.5" />
                      <span>{diff.documentB || '—'}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
