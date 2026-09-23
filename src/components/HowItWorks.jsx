import { howItWorksSteps } from '../data/mockData';

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-28 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="text-center mb-16">
          <p className="section-label">Process</p>
          <h2 className="section-title">How NyayaSaar Works</h2>
          <p className="section-sub mt-4 max-w-xl mx-auto">
            From raw legal document to actionable clarity in four simple steps.
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {howItWorksSteps.map((step, idx) => (
            <div
              key={step.number}
              className="group relative bg-[#0d0f1a]/80 backdrop-blur-xl rounded-2xl border border-white/[0.08] p-6 hover:border-violet-500/30 hover:bg-[#121524]/90 hover:-translate-y-1 transition-all duration-300 shadow-xl"
            >
              {/* Step number */}
              <div className="text-4xl font-extrabold text-white/[0.07] group-hover:text-violet-400/30 transition-colors mb-4 leading-none select-none font-outfit">
                {step.number}
              </div>

              {/* Connector line (not on last item) */}
              {idx < howItWorksSteps.length - 1 && (
                <div className="hidden lg:block absolute top-10 -right-3 w-6 border-t-2 border-dashed border-white/10 z-10" />
              )}

              <h3 className="text-base font-bold text-white mb-2 group-hover:text-violet-300 transition-colors">
                {step.title}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
