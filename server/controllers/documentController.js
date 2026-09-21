import { extractTextFromPdfBuffer } from '../services/pdfService.js';
import {
  analyzeDocumentText,
  explainClauseService,
  chatDocumentService,
  chatWithRAGContext,
  compareDocumentsService,
} from '../services/aiService.js';
import { buildDocumentIndex, retrieveRelevantChunks } from '../services/ragService.js';
import { tempStore } from '../utils/tempStore.js';
import { vectorStore } from '../utils/vectorStore.js';
import { sanitizeFilename, sanitizePromptInput } from '../utils/sanitizer.js';
import { queryCache } from '../utils/cache.js';

// Sample fallback text for testing demo documents
const SAMPLE_DOCUMENT_TEXT = `RESIDENTIAL RENTAL AGREEMENT
This Rental Agreement is made and entered into on 1st October 2026, by and between the Landlord and the Tenant.
Clause 1: Property - The Landlord agrees to let out the residential apartment located at Flat 402, Green Valley Apartments.
Clause 2: Term of Agreement - The tenancy shall commence on 1st November 2026 and continue for an initial fixed term of eleven (11) months.
Clause 3: Rent - The Tenant agrees to pay monthly rent of INR 25,000 on or before the 5th day of each calendar month.
Clause 4: Security Deposit - The Tenant shall deposit with the Landlord an interest-free refundable security deposit of INR 75,000. Said deposit shall be refunded within thirty (30) days following peaceful handover of possession, subject to deductions for unpaid utilities or property damages beyond normal wear and tear.
Clause 5: Utility Bills - The Tenant shall pay all electricity, water, gas, and internet charges incurred during the tenancy period.
Clause 6: Maintenance Responsibilities - The Tenant shall keep the premises in good and clean condition. Routine minor repairs under INR 1,000 shall be the responsibility of the Tenant, while major structural repairs shall be borne by the Landlord upon written notice.
Clause 7: Restrictions - The Tenant shall not sublet or assign the premises without prior written permission of the Landlord.
Clause 8: Termination Condition - Either party may terminate this agreement by providing thirty (30) days prior written notice to the other party. In the event of default or breach of any terms herein, the non-defaulting party may terminate immediately without prejudice to any other remedies available under law.
Clause 9: Default and Deductions - In the event of default or breach of any covenants, applicable late charges and damages may be assessed against the security deposit.`;

const SAMPLE_DOCUMENT_B_TEXT = `REVISED RESIDENTIAL RENTAL AGREEMENT
This Revised Rental Agreement is made and entered into on 1st October 2026, by and between the Landlord and the Tenant.
Clause 1: Property - The Landlord agrees to let out the residential apartment located at Flat 402, Green Valley Apartments.
Clause 2: Term of Agreement - The tenancy shall commence on 1st November 2026 and continue for a fixed term of twelve (12) months with a mandatory 6-month lock-in period.
Clause 3: Rent - The Tenant agrees to pay monthly rent of INR 25,000 on or before the 5th day of each calendar month. Late payment after the 5th shall incur a penalty of INR 500 per week.
Clause 4: Security Deposit - The Tenant shall deposit with the Landlord an interest-free refundable security deposit of INR 85,000. Said deposit shall be refunded within thirty (30) days following peaceful handover of possession, subject to deductions for damages.
Clause 5: Utility Bills - The Tenant shall pay all electricity, water, gas, and high-speed internet charges incurred during the tenancy period.
Clause 6: Maintenance Responsibilities - The Tenant shall keep the premises in good and clean condition and bear the cost of all repairs up to INR 3,000 per instance. Major structural repairs exceeding INR 3,000 shall be borne by the Landlord upon written notice.
Clause 7: Restrictions - The Tenant shall not sublet or assign the premises without prior written permission of the Landlord.
Clause 8: Termination Condition - Either party may terminate this agreement after the lock-in period by providing sixty (60) days prior written notice to the other party.
Clause 9: Renewal - This agreement may be renewed for another year with an automatic 10% rent escalation.`;

/* ─── Helper: build RAG index asynchronously ──────────────────────────────── */

/**
 * Kicks off RAG indexing for a document in the background.
 * Does NOT block the upload response — index is built asynchronously.
 */
async function indexDocumentAsync(documentId, text, pageCount) {
  try {
    const embedded = await buildDocumentIndex(text, pageCount);
    vectorStore.save(documentId, embedded);
    console.log(`[RAG] Index built for document ${documentId} (${embedded.length} chunks)`);
  } catch (err) {
    console.warn(`[RAG] Indexing failed for ${documentId}:`, err.message);
    // Non-fatal: chat will fall back to full-text mode
  }
}

/* ─── Controllers ─────────────────────────────────────────────────────────── */

export async function uploadDocument(req, res, next) {
  try {
    if (!req.file) {
      const err = new Error('No PDF file provided. Please choose a PDF document to upload.');
      err.statusCode = 400;
      err.code = 'NO_FILE_PROVIDED';
      throw err;
    }

    let { buffer, originalname, size, mimetype } = req.file;

    // Sanitize filename to prevent directory traversal
    originalname = sanitizeFilename(originalname);

    // Extract & clean text from buffer
    const { text, pageCount, wordCount, charCount, isEmpty, warning } =
      await extractTextFromPdfBuffer(buffer, originalname);

    // Save in ephemeral session store
    const record = tempStore.save({
      fileName: originalname,
      fileSize: size,
      mimetype,
      pageCount,
      wordCount,
      charCount,
      text,
      isEmpty,
    });

    // Kick off RAG indexing in background (non-blocking)
    if (text && text.trim().length > 50) {
      indexDocumentAsync(record.id, text, pageCount);
    }

    return res.status(200).json({
      success: true,
      documentId: record.id,
      fileName: originalname,
      fileSize: size,
      pageCount,
      wordCount,
      charCount,
      text,
      warning,
      _ragIndexing: true, // hint to client that RAG index is building
    });
  } catch (error) {
    next(error);
  }
}

export function getDocumentById(req, res, next) {
  try {
    const { id } = req.params;
    const document = tempStore.get(id);

    if (!document) {
      // Check if demo ID requested
      if (id === 'demo' || id === 'sample' || id === 'sample-doc' || id === 'sample-a' || id.startsWith('doc-')) {
        return res.status(200).json({
          success: true,
          document: {
            id,
            fileName: 'Rental Agreement (Original).pdf',
            fileSize: 124500,
            pageCount: 3,
            wordCount: 420,
            charCount: 2600,
            text: SAMPLE_DOCUMENT_TEXT,
            isSample: true,
          },
        });
      }

      if (id === 'sample-b') {
        return res.status(200).json({
          success: true,
          document: {
            id,
            fileName: 'Rental Agreement (Revised).pdf',
            fileSize: 135000,
            pageCount: 3,
            wordCount: 460,
            charCount: 2850,
            text: SAMPLE_DOCUMENT_B_TEXT,
            isSample: true,
          },
        });
      }

      return res.status(404).json({
        success: false,
        error: 'Document not found or temporary session expired.',
        code: 'DOCUMENT_NOT_FOUND',
      });
    }

    return res.status(200).json({
      success: true,
      document,
    });
  } catch (error) {
    next(error);
  }
}

export async function analyzeDocument(req, res, next) {
  try {
    const { id } = req.params;

    // Try to load document from session store
    let record = tempStore.get(id);
    if (!record) {
      if (id === 'demo' || id === 'sample' || id === 'sample-doc' || id === 'sample-a' || id.startsWith('doc-')) {
        record = {
          id,
          fileName: 'Rental Agreement (Sample).pdf',
          fileSize: 124500,
          pageCount: 3,
          wordCount: 420,
          charCount: 2600,
          text: SAMPLE_DOCUMENT_TEXT,
        };
      } else if (id === 'sample-b') {
        record = {
          id,
          fileName: 'Rental Agreement (Revised).pdf',
          fileSize: 135000,
          pageCount: 3,
          wordCount: 460,
          charCount: 2850,
          text: SAMPLE_DOCUMENT_B_TEXT,
        };
      } else {
        const err = new Error(
          'Document not found or session expired. Please re-upload the document.'
        );
        err.statusCode = 404;
        err.code = 'DOCUMENT_NOT_FOUND';
        throw err;
      }
    }

    // Use cached analysis if already done (avoid double AI calls)
    if (record.analysis) {
      return res.status(200).json({
        success: true,
        analysis: record.analysis,
        cached: true,
      });
    }

    // Perform AI analysis
    const analysis = await analyzeDocumentText(record.text, {
      fileName: record.fileName,
      pageCount: record.pageCount,
    });

    // Cache the analysis result back in the temp store record if in store
    if (tempStore.get(id)) {
      record.analysis = analysis;
      tempStore.store.set(id, record);
    }

    return res.status(200).json({
      success: true,
      analysis,
      cached: false,
    });
  } catch (error) {
    next(error);
  }
}

export async function explainClause(req, res, next) {
  try {
    const { id } = req.params;
    const { clause } = req.body;

    if (!clause || typeof clause !== 'string' || !clause.trim()) {
      const err = new Error('A valid clause string must be provided in the request body.');
      err.statusCode = 400;
      err.code = 'INVALID_CLAUSE_INPUT';
      throw err;
    }

    let record = tempStore.get(id);
    if (!record) {
      if (id === 'demo' || id === 'sample' || id === 'sample-doc' || id === 'sample-a' || id.startsWith('doc-')) {
        record = {
          id,
          fileName: 'Rental Agreement (Sample).pdf',
          pageCount: 3,
          text: SAMPLE_DOCUMENT_TEXT,
        };
      } else if (id === 'sample-b') {
        record = {
          id,
          fileName: 'Rental Agreement (Revised).pdf',
          pageCount: 3,
          text: SAMPLE_DOCUMENT_B_TEXT,
        };
      } else {
        const err = new Error(
          'Document not found or temporary session expired. Please re-upload the document.'
        );
        err.statusCode = 404;
        err.code = 'DOCUMENT_NOT_FOUND';
        throw err;
      }
    }

    const { sanitized: safeClause, flagged } = sanitizePromptInput(clause.trim());

    if (flagged) {
      console.warn(`[Security] Prompt injection detected in explainClause for document ${id}`);
    }

    const cacheKey = queryCache.createKey('explain', { id, clause: safeClause });
    const cachedResult = queryCache.get(cacheKey);
    if (cachedResult) {
      return res.status(200).json({
        success: true,
        ...cachedResult,
        cached: true,
      });
    }

    const result = await explainClauseService(safeClause, record.text, {
      fileName: record.fileName,
      pageCount: record.pageCount,
    });

    const responsePayload = {
      originalText: result.originalText,
      simpleExplanation: result.simpleExplanation,
      whyItMatters: result.whyItMatters,
      page: result.page ?? null,
      _isDemo: Boolean(result._isDemo),
    };

    if (!result._isDemo) {
      queryCache.set(cacheKey, responsePayload);
    }

    return res.status(200).json({
      success: true,
      ...responsePayload,
      cached: false,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Chat with document — RAG-enhanced.
 * Route: POST /api/documents/:id/chat
 * Body: { "question": "..." }
 */
export async function chatDocument(req, res, next) {
  try {
    const { id } = req.params;
    const { question } = req.body;

    if (!question || typeof question !== 'string' || !question.trim()) {
      const err = new Error('A valid question string must be provided in the request body.');
      err.statusCode = 400;
      err.code = 'INVALID_QUESTION_INPUT';
      throw err;
    }

    let record = tempStore.get(id);
    if (!record) {
      if (id === 'demo' || id === 'sample' || id === 'sample-doc' || id === 'sample-a' || id.startsWith('doc-')) {
        record = {
          id,
          fileName: 'Rental Agreement (Sample).pdf',
          pageCount: 3,
          text: SAMPLE_DOCUMENT_TEXT,
        };
      } else if (id === 'sample-b') {
        record = {
          id,
          fileName: 'Rental Agreement (Revised).pdf',
          pageCount: 3,
          text: SAMPLE_DOCUMENT_B_TEXT,
        };
      } else {
        const err = new Error(
          'Document not found or temporary session expired. Please re-upload the document.'
        );
        err.statusCode = 404;
        err.code = 'DOCUMENT_NOT_FOUND';
        throw err;
      }
    }

    const { sanitized: safeQuestion, flagged } = sanitizePromptInput(question.trim());

    if (flagged) {
      console.warn(`[Security] Prompt injection detected in chatDocument for document ${id}`);
    }

    const cacheKey = queryCache.createKey('chat', { id, question: safeQuestion });
    const cachedResult = queryCache.get(cacheKey);
    if (cachedResult) {
      return res.status(200).json({
        success: true,
        ...cachedResult,
        cached: true,
      });
    }

    const metadata = { fileName: record.fileName, pageCount: record.pageCount };

    // ── RAG Path ──────────────────────────────────────────────────────────────
    const embeddedChunks = vectorStore.get(id);

    let resultPayload = null;

    if (embeddedChunks && embeddedChunks.length > 0) {
      // Retrieve most relevant chunks via cosine/TF-IDF similarity
      const relevantChunks = await retrieveRelevantChunks(safeQuestion, embeddedChunks, 5);

      if (relevantChunks.length > 0) {
        const result = await chatWithRAGContext(safeQuestion, relevantChunks, metadata);
        resultPayload = {
          answer: result.answer,
          sources: result.sources || [],
          _isDemo: Boolean(result._isDemo),
          _ragEnabled: true,
        };
      }
    }

    if (!resultPayload) {
      // ── Fallback: full-document chat (no RAG index available yet) ─────────────
      console.log(`[Chat] No RAG index for ${id}, falling back to full-doc chat`);
      const result = await chatDocumentService(safeQuestion, record.text || '', metadata);
      resultPayload = {
        answer: result.answer,
        sources: result.sources || [],
        _isDemo: Boolean(result._isDemo),
        _ragEnabled: false,
      };
    }

    if (!resultPayload._isDemo) {
      queryCache.set(cacheKey, resultPayload);
    }

    return res.status(200).json({
      success: true,
      ...resultPayload,
      cached: false,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Compare two legal documents.
 * Route: POST /api/documents/compare
 */
export async function compareDocuments(req, res, next) {
  try {
    const {
      documentA,
      documentB,
      documentAId,
      documentBId,
      docA: aliasDocA,
      docB: aliasDocB,
      docAId: aliasDocAId,
      docBId: aliasDocBId,
    } = req.body;

    const inputA = documentA ?? aliasDocA;
    const inputB = documentB ?? aliasDocB;
    const inputAId = documentAId ?? aliasDocAId;
    const inputBId = documentBId ?? aliasDocBId;

    // Helper to resolve text and metadata for a document input
    const resolveDoc = (docInput, docId, fallbackLabel, fallbackSampleText) => {
      // Direct string text
      if (typeof docInput === 'string' && docInput.trim()) {
        return { text: docInput.trim(), fileName: fallbackLabel };
      }

      // Object with text
      if (docInput && typeof docInput.text === 'string' && docInput.text.trim()) {
        return {
          text: docInput.text.trim(),
          fileName: docInput.fileName || fallbackLabel,
        };
      }

      // If documentId provided, look up in tempStore
      const idToSearch = docId || docInput?.documentId || docInput?.id;
      if (idToSearch) {
        const record = tempStore.get(idToSearch);
        if (record && record.text) {
          return {
            text: record.text,
            fileName: record.fileName || fallbackLabel,
          };
        }

        // Demo IDs
        if (
          idToSearch === 'demo' ||
          idToSearch === 'sample' ||
          idToSearch === 'sample-a' ||
          idToSearch === 'sample-doc' ||
          idToSearch.startsWith('doc-1')
        ) {
          return {
            text: SAMPLE_DOCUMENT_TEXT,
            fileName: 'Rental Agreement (Original).pdf',
          };
        }

        if (idToSearch === 'sample-b' || idToSearch.startsWith('doc-2')) {
          return {
            text: SAMPLE_DOCUMENT_B_TEXT,
            fileName: 'Rental Agreement (Revised).pdf',
          };
        }
      }

      if (fallbackSampleText) {
        return { text: fallbackSampleText, fileName: fallbackLabel };
      }

      return null;
    };

    const docA = resolveDoc(inputA, inputAId, 'Document A', null);
    const docB = resolveDoc(inputB, inputBId, 'Document B', null);

    if (!docA || !docA.text) {
      const err = new Error(
        'Document A is missing or contains no extractable text. Please upload Document A.'
      );
      err.statusCode = 400;
      err.code = 'MISSING_DOC_A';
      throw err;
    }

    if (!docB || !docB.text) {
      const err = new Error(
        'Document B is missing or contains no extractable text. Please upload Document B.'
      );
      err.statusCode = 400;
      err.code = 'MISSING_DOC_B';
      throw err;
    }

    const cacheKey = queryCache.createKey('compare', { textA: docA.text, textB: docB.text });
    const cachedResult = queryCache.get(cacheKey);
    if (cachedResult) {
      return res.status(200).json({
        success: true,
        ...cachedResult,
        cached: true,
      });
    }

    const result = await compareDocumentsService(docA.text, docB.text, {
      fileNameA: docA.fileName,
      fileNameB: docB.fileName,
    });

    const responsePayload = {
      summary: result.summary,
      differences: result.differences,
      _isDemo: Boolean(result._isDemo),
    };

    if (!result._isDemo) {
      queryCache.set(cacheKey, responsePayload);
    }

    return res.status(200).json({
      success: true,
      ...responsePayload,
      cached: false,
    });
  } catch (error) {
    next(error);
  }
}
