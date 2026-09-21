import { howItWorksSteps } from '../data/mockData';

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="text-center mb-14">
          <p className="section-label mb-3">Process</p>
          <h2 className="section-title">How NyayaSaar Works</h2>
          <p className="section-sub mt-4 max-w-xl mx-auto">
            From upload to insight in four simple steps.
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {howItWorksSteps.map((step, idx) => (
            <div
              key={step.number}
              className="group relative bg-white rounded-xl border border-slate-100 shadow-card p-6 hover:border-blue-200 hover:shadow-card-md transition-all duration-200"
            >
              {/* Step number */}
              <div className="text-4xl font-extrabold text-slate-100 group-hover:text-blue-100 transition-colors mb-4 leading-none select-none">
                {step.number}
              </div>

              {/* Connector line (not on last item) */}
              {idx < howItWorksSteps.length - 1 && (
                <div className="hidden lg:block absolute top-10 -right-3 w-6 border-t-2 border-dashed border-slate-200 z-10" />
              )}

              <h3 className="text-base font-bold text-slate-900 mb-2">{step.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
