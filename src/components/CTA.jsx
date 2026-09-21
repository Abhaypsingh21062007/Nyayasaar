import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function CTA() {
  return (
    <section className="py-20 md:py-28 bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-snug tracking-tight mb-4">
          Legal documents shouldn't feel{' '}
          <span className="text-blue-600">impossible to understand.</span>
        </h2>

        {/* Sub text */}
        <p className="text-lg text-slate-500 leading-relaxed mb-8 max-w-xl mx-auto">
          Upload a document and start exploring it with NyayaSaar.
        </p>

        {/* CTA button */}
        <Link to="/upload" className="btn-primary text-base px-6 py-3 inline-flex">
          Analyze Your Document <ArrowRight className="w-5 h-5" />
        </Link>

        {/* Disclaimer */}
        <p className="text-xs text-slate-400 mt-6 max-w-sm mx-auto leading-relaxed">
          NyayaSaar provides general legal information and document assistance,
          not professional legal advice.
        </p>
      </div>
    </section>
  );
}
