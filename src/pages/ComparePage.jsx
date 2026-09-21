import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GitCompare,
  Sparkles,
  Shield,
  RotateCcw,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import CompareUploadCard from '../components/compare/CompareUploadCard';
import ComparisonTable from '../components/compare/ComparisonTable';
import WhatChangedSection from '../components/compare/WhatChangedSection';

const SAMPLE_A = {
  id: 'sample-a',
  documentId: 'sample-a',
  fileName: 'Rental Agreement (Original).pdf',
  fileSize: 124500,
  pageCount: 3,
  wordCount: 420,
  text: `RESIDENTIAL RENTAL AGREEMENT
Clause 1: Property - Flat 402, Green Valley Apartments.
Clause 2: Term - Eleven (11) months fixed term.
Clause 3: Rent - INR 25,000 per month due on 5th.
Clause 4: Security Deposit - INR 75,000 interest-free deposit.
Clause 6: Maintenance - Minor repairs under INR 1,000 borne by Tenant.
Clause 8: Termination - Either party may terminate with 30 days written notice.
Clause 9: Late payment - No explicit weekly penalty specified.`,
  isSample: true,
};

const SAMPLE_B = {
  id: 'sample-b',
  documentId: 'sample-b',
  fileName: 'Rental Agreement (Revised).pdf',
  fileSize: 135000,
  pageCount: 3,
  wordCount: 460,
  text: `REVISED RESIDENTIAL RENTAL AGREEMENT
Clause 1: Property - Flat 402, Green Valley Apartments.
Clause 2: Term - Twelve (12) months fixed term with 6-month lock-in period.
Clause 3: Rent - INR 25,000 per month due on 5th. Late fee INR 500 per week.
Clause 4: Security Deposit - INR 85,000 interest-free deposit.
Clause 6: Maintenance - Tenant covers all repairs up to INR 3,000.
Clause 8: Termination - Sixty (60) days prior written notice required.
Clause 9: Renewal - Automatic 10% rent escalation upon renewal.`,
  isSample: true,
};

const COMPARISON_STEPS = [
  'Extracting terms from Document A…',
  'Extracting terms from Document B…',
  'Analyzing differences across clauses…',
  'Generating plain-language explanations…',
];

export default function ComparePage() {
  const navigate = useNavigate();

  // Document states
  const [docA, setDocA] = useState(null);
  const [docB, setDocB] = useState(null);

  // Upload loading/error states
  const [loadingA, setLoadingA] = useState(false);
  const [loadingB, setLoadingB] = useState(false);
  const [errorA, setErrorA] = useState(null);
  const [errorB, setErrorB] = useState(null);

  // Comparison execution states
  const [comparing, setComparing] = useState(false);
  const [compareStepIndex, setCompareStepIndex] = useState(0);
  const [compareResult, setCompareResult] = useState(null);
  const [compareError, setCompareError] = useState(null);

  // Validate PDF file
  const validatePdf = (file) => {
    if (!file) return 'No file selected.';
    const isPdf =
      file.type === 'application/pdf' ||
      file.name.toLowerCase().endsWith('.pdf');
    if (!isPdf) {
      return 'Invalid file type. Only PDF documents (.pdf) are supported.';
    }
    if (file.size === 0) {
      return 'The selected file is empty (0 bytes).';
    }
    if (file.size > 10 * 1024 * 1024) {
      return 'File exceeds maximum limit of 10 MB. Please upload a smaller PDF.';
    }
    return null;
  };

  // Upload file helper
  const handleUpload = useCallback(
    async (file, docType) => {
      const err = validatePdf(file);
      if (err) {
        if (docType === 'A') setErrorA(err);
        else setErrorB(err);
        return;
      }

      if (docType === 'A') {
        setLoadingA(true);
        setErrorA(null);
      } else {
        setLoadingB(true);
        setErrorB(null);
      }

      try {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/documents/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Failed to extract text from PDF.');
        }

        if (docType === 'A') {
          setDocA(data);
        } else {
          setDocB(data);
        }
      } catch (uploadErr) {
        if (docType === 'A') {
          setErrorA(uploadErr.message || 'Error uploading Document A.');
        } else {
          setErrorB(uploadErr.message || 'Error uploading Document B.');
        }
      } finally {
        if (docType === 'A') setLoadingA(false);
        else setLoadingB(false);
      }
    },
    []
  );

  // 1-Click Load Sample Documents
  const handleLoadSamples = () => {
    setDocA(SAMPLE_A);
    setDocB(SAMPLE_B);
    setErrorA(null);
    setErrorB(null);
    setCompareError(null);
    setCompareResult(null);
  };

  // Reset all
  const handleReset = () => {
    setDocA(null);
    setDocB(null);
    setErrorA(null);
    setErrorB(null);
    setCompareResult(null);
    setCompareError(null);
  };

  // Trigger AI Comparison
  const handleRunComparison = async () => {
    if (!docA || !docB) {
      setCompareError('Please provide both Document A and Document B to compare.');
      return;
    }

    setComparing(true);
    setCompareError(null);
    setCompareStepIndex(0);

    // Step cycle animation
    const interval = setInterval(() => {
      setCompareStepIndex((i) => (i + 1) % COMPARISON_STEPS.length);
    }, 1200);

    try {
      const response = await fetch('/api/documents/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentAId: docA.documentId || docA.id,
          documentBId: docB.documentId || docB.id,
          documentA: {
            text: docA.text,
            fileName: docA.fileName,
          },
          documentB: {
            text: docB.text,
            fileName: docB.fileName,
          },
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Comparison failed. Please try again.');
      }

      setCompareResult(data);
    } catch (err) {
      console.error('[ComparePage Error]', err);
      setCompareError(
        err.message || 'An unexpected error occurred during document comparison.'
      );
    } finally {
      clearInterval(interval);
      setComparing(false);
    }
  };

  const isReadyToCompare = Boolean(docA && docB) && !loadingA && !loadingB && !comparing;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* ── Page Heading & Controls ─────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-widest text-violet-600">
              AI Document Diff
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200">
              Side-by-Side
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Compare Legal Documents
          </h1>
          <p className="text-sm sm:text-base text-slate-500 mt-1">
            Understand what changed between two documents.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {(!docA || !docB) && (
            <button
              type="button"
              onClick={handleLoadSamples}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-violet-50 border border-violet-200 text-violet-800 hover:bg-violet-100 text-xs font-bold transition-all shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-violet-600" />
              Try Sample Documents (1-Click)
            </button>
          )}

          {(docA || docB || compareResult) && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-xs font-semibold transition-all shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* ── Dual Upload Cards (Document A & Document B) ─────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <CompareUploadCard
          label="DOCUMENT A"
          subtitle="Upload first document (e.g. Original Agreement)"
          document={docA}
          onUploadFile={(file) => handleUpload(file, 'A')}
          onRemove={() => {
            setDocA(null);
            setCompareResult(null);
          }}
          loading={loadingA}
          error={errorA}
          badgeColor="blue"
        />

        <CompareUploadCard
          label="DOCUMENT B"
          subtitle="Upload second document (e.g. Revised Agreement)"
          document={docB}
          onUploadFile={(file) => handleUpload(file, 'B')}
          onRemove={() => {
            setDocB(null);
            setCompareResult(null);
          }}
          loading={loadingB}
          error={errorB}
          badgeColor="violet"
        />
      </div>

      {/* ── Primary Compare Trigger Action ──────────────────────────────────── */}
      {!compareResult && (
        <div className="flex flex-col items-center justify-center gap-3 pt-2">
          <button
            type="button"
            disabled={!isReadyToCompare}
            onClick={handleRunComparison}
            className={`inline-flex items-center gap-2.5 px-8 py-3.5 rounded-2xl text-sm font-extrabold shadow-md transition-all duration-200 ${
              isReadyToCompare
                ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white shadow-blue-500/25 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] cursor-pointer'
                : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
            }`}
          >
            {comparing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Comparing Documents...</span>
              </>
            ) : (
              <>
                <GitCompare className="w-5 h-5" />
                <span>Compare Documents</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {!isReadyToCompare && !comparing && (
            <p className="text-xs text-slate-400 text-center">
              Please upload or load both Document A and Document B to run comparison.
            </p>
          )}

          {/* Comparing Step Animation */}
          {comparing && (
            <div className="bg-white rounded-2xl border border-blue-100 shadow-card p-4 max-w-sm w-full text-center space-y-2 animate-in fade-in">
              <p className="text-xs font-bold text-slate-700">
                NyayaSaar is comparing documents…
              </p>
              <div className="flex items-center justify-center gap-2 text-xs font-semibold text-blue-600">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>{COMPARISON_STEPS[compareStepIndex]}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Error Banner ────────────────────────────────────────────────────── */}
      {compareError && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-900 text-xs sm:text-sm animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold">Comparison Error</p>
            <p className="mt-0.5 text-red-800">{compareError}</p>
          </div>
          <button
            type="button"
            onClick={handleRunComparison}
            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs transition-colors flex-shrink-0"
          >
            Try Again
          </button>
        </div>
      )}

      {/* ── Comparison Results Section ──────────────────────────────────────── */}
      {compareResult && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-300">
          {/* Quick Header Bar for Results */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Comparison Complete
                </h2>
                <p className="text-xs text-slate-500">
                  {compareResult.differences?.length || 0} differences identified between{' '}
                  <span className="font-semibold text-slate-700">{docA?.fileName}</span> and{' '}
                  <span className="font-semibold text-slate-700">{docB?.fileName}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  navigate('/ask', {
                    state: {
                      document: docB || docA,
                    },
                  })
                }
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 text-xs font-bold transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Ask NyayaSaar
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                Compare Another
              </button>
            </div>
          </div>

          {/* 1. Comparison Table */}
          <ComparisonTable
            differences={compareResult.differences}
            docAName={docA?.fileName}
            docBName={docB?.fileName}
          />

          {/* 2. "What Changed?" Explanations */}
          <WhatChangedSection
            summary={compareResult.summary}
            differences={compareResult.differences}
            isDemo={compareResult._isDemo}
          />
        </div>
      )}

      {/* ── Legal Disclaimer (Permanently Visible) ──────────────────────────── */}
      <div className="flex items-start gap-3 p-5 bg-slate-50 border border-slate-200/90 rounded-2xl">
        <Shield className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-bold text-slate-700 mb-0.5">Legal Disclaimer</p>
          <p className="text-xs text-slate-500 leading-relaxed">
            NyayaSaar provides general legal information and comparative summaries between
            document terms. It does not declare one document legally superior or safer, and is
            not a substitute for professional legal counsel. Always consult a qualified advocate
            before signing or agreeing to modified contracts.
          </p>
        </div>
      </div>
    </div>
  );
}
