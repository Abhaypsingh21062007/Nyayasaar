import { GoogleGenAI } from '@google/genai';
import { config } from '../config/index.js';

/* ─── Prompt ───────────────────────────────────────────────────────────────── */

function buildPrompt(text, metadata = {}) {
  const truncated = text.length > 15000 ? text.slice(0, 15000) + '\n\n[... text truncated for analysis ...]' : text;

  return `You are a helpful legal document assistant for NyayaSaar, an Indian legal information service.

IMPORTANT DISCLAIMER GUIDELINES:
- Do NOT make definitive legal or illegal declarations.
- Use neutral, informational language: "requires attention", "important clause", "review carefully", "may affect your rights", "consult a lawyer before signing".
- This is general legal information, not professional legal advice.

Analyze the following legal document text and extract structured information.

Document metadata:
- File name: ${metadata.fileName || 'Unknown'}
- Pages: ${metadata.pageCount || 'Unknown'}

Document text:
---
${truncated}
---

Return ONLY a valid JSON object (no markdown, no code fences, no extra text) in exactly this schema:
{
  "documentType": "Brief type of legal document (e.g., Rental Agreement, Employment Contract, NDA)",
  "summary": "2-4 sentence plain-language overview of what this document is about and its key purpose",
  "parties": ["Party 1 name or role", "Party 2 name or role"],
  "importantDates": ["Date 1 description", "Date 2 description"],
  "financialTerms": ["Financial term 1", "Financial term 2"],
  "importantClauses": [
    {
      "title": "Short clause title",
      "category": "Category such as: Termination | Payment | Liability | Confidentiality | Governing Law | Notice | Renewal | Restriction",
      "description": "2-3 sentence plain-language explanation of what this clause means for you. Use language like 'this clause requires attention because...' or 'review carefully as...'",
      "importance": "high",
      "page": null
    }
  ],
  "attentionPoints": [
    "Point 1: Brief description of something that requires attention before signing",
    "Point 2: ..."
  ]
}

Rules:
- importantClauses importance must be one of: "high", "medium", or "low".
- attentionPoints should be brief 1-2 sentence summaries.
- If a field has no relevant information, use an empty array [] or empty string "".
- Extract 3-7 important clauses and 3-5 attention points if present in the document.
- Do not fabricate information not present in the document.
- Respond ONLY with the JSON object.`;
}

/* ─── Mock fallback analysis (used when API key is not configured) ─────────── */

function buildMockAnalysis(_metadata = {}) {
  return {
    documentType: 'Rental Agreement (Demo)',
    summary:
      'This is a demo analysis shown because the Gemini API key is not yet configured. Add your GEMINI_API_KEY to the .env file to enable real AI analysis. The document appears to be a standard residential rental agreement containing terms about rent, security deposit, and termination.',
    parties: ['Landlord (Property Owner)', 'Tenant (Occupant)'],
    importantDates: [
      'Commencement date: Review carefully before signing',
      'Notice period: 30 days prior written notice required',
    ],
    financialTerms: [
      'Monthly rent amount: Refer to the agreement for exact figure',
      'Security deposit: Typically 2-3 months rent',
      'Late payment penalty: Review carefully',
    ],
    importantClauses: [
      {
        title: 'Termination Clause',
        category: 'Termination',
        description:
          'This clause requires attention because it outlines the conditions under which either party can end the agreement. Review carefully to understand your rights and obligations if you need to exit the lease early.',
        originalText:
          'Either party may terminate this agreement by providing thirty (30) days prior written notice to the other party. In the event of default or breach of any terms herein, the non-defaulting party may terminate immediately without prejudice to any other remedies available under law.',
        importance: 'high',
        page: 2,
      },
      {
        title: 'Security Deposit Terms',
        category: 'Payment',
        description:
          'This clause is important as it governs the conditions for refund of your security deposit. Review carefully to understand what deductions may be made and the timeline for refund.',
        originalText:
          'The Tenant shall deposit with the Landlord an interest-free refundable security deposit. Said deposit shall be refunded within thirty (30) days following the peaceful handover of possession, subject to deductions for unpaid utilities or property damages beyond normal wear and tear.',
        importance: 'high',
        page: 1,
      },
      {
        title: 'Maintenance Responsibilities',
        category: 'Liability',
        description:
          'This clause outlines who is responsible for repairs and maintenance. Review carefully to understand your obligations as a tenant and what the landlord is required to maintain.',
        originalText:
          'The Tenant shall keep the premises in good and clean condition. Routine minor repairs under ₹1,000 shall be the responsibility of the Tenant, while major structural repairs shall be borne by the Landlord upon written notice.',
        importance: 'medium',
        page: 1,
      },
    ],
    attentionPoints: [
      'Configure your GEMINI_API_KEY in the .env file to enable real AI-powered document analysis.',
      'This is a demonstration placeholder. Your actual document has not been analyzed by AI.',
      'Real analysis will extract specific clauses, dates, and terms from your uploaded PDF.',
    ],
    _isDemo: true,
  };
}

/* ─── Clause Simplifier Prompts & Fallback ─────────────────────────────────── */

function buildClausePrompt(clauseInput, documentText, metadata = {}) {
  const truncated =
    documentText.length > 15000
      ? documentText.slice(0, 15000) + '\n\n[... document text truncated ...]'
      : documentText;

  return `You are an Indian legal document assistant for NyayaSaar, providing general legal information to everyday citizens.

CRITICAL SAFETY & TONE RULES:
- You must NOT say: "This is definitely illegal."
- You must NOT say: "This is definitely enforceable."
- You must NOT say: "You will definitely win."
- INSTEAD USE neutral, informational phrases:
  * "This clause states..."
  * "This may require attention..."
  * "Consider reviewing this clause..."
- If the information is insufficient or context is missing, explicitly state so.
- Provide objective, neutral, informative explanations. Do not give formal legal advice or guarantees.

TASK:
A user has selected the following clause or topic to inspect:
"${clauseInput}"

From the document text below:
1. Extract the verbatim or closest original clause text from the document.
2. Provide a clear, simple explanation in everyday language (2-3 sentences).
3. Provide a neutral explanation of why this clause matters / what it concerns.
4. Identify the page number if indicated by pagination markers (e.g., "Page 1", "-- 1 of 2 --"), otherwise return null.

Document metadata:
- File name: ${metadata.fileName || 'Unknown'}
- Total pages: ${metadata.pageCount || 'Unknown'}

Document text:
---
${truncated}
---

Return ONLY a valid JSON object (no markdown formatting, no code fences) in exactly this schema:
{
  "originalText": "Exact original clause text from the document",
  "simpleExplanation": "Simple everyday explanation starting with 'This clause states...'",
  "whyItMatters": "Neutral explanation starting with 'This may require attention because...' or 'Consider reviewing this clause regarding...'",
  "page": null
}

Rules:
- "page" must be a number (e.g. 1, 2) if detected from pagination in the text, otherwise null.
- If the clause cannot be located in the text, state: "The provided document text does not contain sufficient information to fully verify this clause."
- Respond ONLY with the JSON object.`;
}

function buildMockClauseExplanation(clauseInput, _metadata = {}) {
  const lower = String(clauseInput || '').toLowerCase();

  if (lower.includes('termination')) {
    return {
      originalText:
        'Either party may terminate this agreement by providing thirty (30) days prior written notice to the other party. In the event of default or breach of any terms herein, the non-defaulting party may terminate immediately without prejudice to any other remedies available under law.',
      simpleExplanation:
        'This clause states how and when this agreement can be brought to an end. It requires either you or the other party to give at least 30 days written notice before ending the agreement, unless one party breaks the agreement terms, which allows immediate termination.',
      whyItMatters:
        'This may require attention because it defines your exit options, notice obligations, and timeline if you need to leave. Consider reviewing this clause to ensure the 30-day notice period fits your practical requirements before signing.',
      page: 2,
      _isDemo: true,
    };
  }

  if (lower.includes('deposit') || lower.includes('security') || lower.includes('payment')) {
    return {
      originalText:
        'The Tenant shall deposit with the Landlord an interest-free refundable security deposit. Said deposit shall be refunded within thirty (30) days following the peaceful handover of possession, subject to deductions for unpaid utilities or property damages beyond normal wear and tear.',
      simpleExplanation:
        'This clause states that you must provide a refundable security deposit with no interest paid on it. The deposit will be returned within 30 days after you move out, minus any deductions for unpaid bills or physical damage to the property.',
      whyItMatters:
        'This may require attention because it governs how much money is tied up and under what conditions deductions can be made. Consider reviewing this clause to clarify what constitutes normal wear and tear versus deductible damages.',
      page: 1,
      _isDemo: true,
    };
  }

  if (lower.includes('maintenance') || lower.includes('repair') || lower.includes('liability')) {
    return {
      originalText:
        'The Tenant shall keep the premises in good and clean condition. Routine minor repairs under ₹1,000 shall be the responsibility of the Tenant, while major structural repairs shall be borne by the Landlord upon written notice.',
      simpleExplanation:
        'This clause states who pays for fixes and maintenance around the property. You are responsible for keeping the space clean and handling minor day-to-day repairs, while the landlord covers structural repairs.',
      whyItMatters:
        'This may require attention because unclear repair clauses often cause disputes upon move-out. Consider reviewing this clause to understand where minor maintenance ends and structural repairs begin.',
      page: 1,
      _isDemo: true,
    };
  }

  return {
    originalText:
      `Excerpt pertaining to "${clauseInput}": The parties agree to adhere strictly to the terms, conditions, and stipulations outlined herein pertaining to rights, obligations, and compliance.`,
    simpleExplanation:
      `This clause states the specific obligations and rules agreed upon by both parties regarding ${clauseInput}. It outlines what each party is expected to do in everyday terms.`,
    whyItMatters:
      `This may require attention because it sets binding expectations for both sides. Consider reviewing this clause carefully to confirm that all responsibilities align with your understanding before signing.`,
    page: null,
    _isDemo: true,
  };
}

/* ─── AI Service ────────────────────────────────────────────────────────────── */

/**
 * Analyzes legal document text using Gemini AI.
 * Falls back to demo analysis if API key is not configured.
 *
 * @param {string} text - Cleaned extracted PDF text
 * @param {{ fileName?: string, pageCount?: number }} metadata
 * @returns {Promise<object>} Structured analysis result
 */
export async function analyzeDocumentText(text, metadata = {}) {
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    const err = new Error('Document text is empty or missing. Cannot perform analysis.');
    err.statusCode = 400;
    err.code = 'EMPTY_DOCUMENT_TEXT';
    throw err;
  }

  // If no API key configured, return a helpful demo/fallback
  if (!config.geminiApiKey || config.geminiApiKey === 'your_gemini_api_key_here') {
    console.warn('[NyayaSaar AI] No GEMINI_API_KEY configured — returning demo analysis.');
    return { ...buildMockAnalysis(metadata), _isDemo: true };
  }

  const ai = new GoogleGenAI({ apiKey: config.geminiApiKey });

  try {
    const response = await ai.models.generateContent({
      model: config.geminiModel,
      contents: buildPrompt(text, metadata),
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
        maxOutputTokens: 4096,
      },
    });

    const rawText = response.text;
    if (!rawText) {
      throw new Error('Empty response received from Gemini API.');
    }

    // Strip markdown code fences if the model wraps its JSON anyway
    const cleaned = rawText
      .trim()
      .replace(/^```(?:json)?\n?/i, '')
      .replace(/\n?```$/i, '')
      .trim();

    let analysis;
    try {
      analysis = JSON.parse(cleaned);
    } catch {
      console.error('[NyayaSaar AI] JSON parse failed. Raw response:', rawText.slice(0, 300));
      const err = new Error('AI returned an invalid response format. Please try again.');
      err.statusCode = 502;
      err.code = 'AI_PARSE_ERROR';
      throw err;
    }

    // Validate and normalize the required fields
    return {
      documentType: String(analysis.documentType || ''),
      summary: String(analysis.summary || ''),
      parties: Array.isArray(analysis.parties) ? analysis.parties : [],
      importantDates: Array.isArray(analysis.importantDates) ? analysis.importantDates : [],
      financialTerms: Array.isArray(analysis.financialTerms) ? analysis.financialTerms : [],
      importantClauses: Array.isArray(analysis.importantClauses)
        ? analysis.importantClauses.map((c) => ({
            title: String(c.title || ''),
            category: String(c.category || ''),
            description: String(c.description || ''),
            originalText: String(c.originalText || ''),
            importance: ['high', 'medium', 'low'].includes(c.importance)
              ? c.importance
              : 'medium',
            page: c.page ?? null,
          }))
        : [],
      attentionPoints: Array.isArray(analysis.attentionPoints) ? analysis.attentionPoints : [],
      _isDemo: false,
    };
  } catch (err) {
    // Handle known Gemini API errors or fallback gracefully
    console.warn('[NyayaSaar AI] Gemini call failed or model unavailable:', err.message);
    return { ...buildMockAnalysis(metadata), _isDemo: true };
  }
}

/**
 * Explains an individual clause in simple everyday language using Gemini AI.
 * Adheres strictly to legal safety guidelines:
 * - Never claims something is definitively illegal, enforceable, or guaranteed to win.
 * - Uses neutral phrasing: "This clause states...", "This may require attention...", "Consider reviewing this clause...".
 * - States if information is insufficient.
 * Falls back to demo mode if no API key is configured.
 *
 * @param {string} clauseInput - The clause text, title, or query
 * @param {string} documentText - Full extracted text of the document
 * @param {{ fileName?: string, pageCount?: number }} metadata
 * @returns {Promise<{ originalText: string, simpleExplanation: string, whyItMatters: string, page: number|null, _isDemo?: boolean }>}
 */
export async function explainClauseService(clauseInput, documentText = '', metadata = {}) {
  if (!clauseInput || typeof clauseInput !== 'string' || !clauseInput.trim()) {
    const err = new Error('A valid clause string must be provided.');
    err.statusCode = 400;
    err.code = 'INVALID_CLAUSE_INPUT';
    throw err;
  }

  // If no API key configured, return mock explanation conforming to requirements
  if (!config.geminiApiKey || config.geminiApiKey === 'your_gemini_api_key_here') {
    return { ...buildMockClauseExplanation(clauseInput.trim(), metadata), _isDemo: true };
  }

  const ai = new GoogleGenAI({ apiKey: config.geminiApiKey });

  try {
    const response = await ai.models.generateContent({
      model: config.geminiModel,
      contents: buildClausePrompt(clauseInput.trim(), documentText, metadata),
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
        maxOutputTokens: 2048,
      },
    });

    const rawText = response.text;
    if (!rawText) {
      throw new Error('Empty response received from Gemini API.');
    }

    const cleaned = rawText
      .trim()
      .replace(/^```(?:json)?\n?/i, '')
      .replace(/\n?```$/i, '')
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      console.error('[NyayaSaar AI] Clause JSON parse failed:', rawText.slice(0, 300));
      const err = new Error('AI returned an invalid response format for clause explanation.');
      err.statusCode = 502;
      err.code = 'AI_PARSE_ERROR';
      throw err;
    }

    return {
      originalText: String(parsed.originalText || clauseInput),
      simpleExplanation: String(
        parsed.simpleExplanation || 'This clause states the terms agreed upon by the parties.'
      ),
      whyItMatters: String(
        parsed.whyItMatters ||
          'This may require attention because it defines legal rights and obligations. Consider reviewing this clause with a legal professional.'
      ),
      page: typeof parsed.page === 'number' ? parsed.page : null,
      _isDemo: false,
    };
  } catch (err) {
    if (err.statusCode && err.statusCode < 500) throw err;
    console.warn('[NyayaSaar AI] Clause explanation error — falling back to mock:', err.message);
    return { ...buildMockClauseExplanation(clauseInput.trim(), metadata), _isDemo: true };
  }
}

/* ─── Chat with Document Prompts & Fallback ────────────────────────────────── */

function buildChatPrompt(question, documentText, metadata = {}) {
  const truncated =
    documentText.length > 20000
      ? documentText.slice(0, 20000) + '\n\n[... document text truncated for length ...]'
      : documentText;

  return `You are NyayaSaar AI, an Indian legal document assistant that helps everyday citizens understand their legal documents.

CRITICAL RULES & GUIDELINES:
1. PRIORITIZE THE UPLOADED DOCUMENT: Base your answer strictly on the facts, terms, and clauses found in the document text provided below.
2. MISSING INFORMATION: If the answer cannot be found in the document or there is no relevant information, you MUST return:
   "I couldn't find this information in the uploaded document."
   In this case, sources must be an empty array [].
3. DO NOT INVENT CLAUSES OR NUMBERS: Do NOT make up clause numbers, page numbers, or terms that are not in the document.
4. DO NOT PRETEND UNSUPPORTED INFORMATION CAME FROM THE DOCUMENT.
5. DISTINGUISH GENERAL LEGAL INFO: If you provide any helpful general Indian legal context in addition to what is in the document, clearly label it separately from document-specific information (e.g., using "According to your document:" and "General legal context:").
6. LEGAL DISCLAIMER & NEUTRAL TONE:
   - Do NOT declare actions definitely legal or illegal.
   - Do NOT guarantee legal outcomes or court victories.
   - Use neutral phrasing: "This agreement specifies...", "Under the terms of this document...", "Consider reviewing...".
   - State that NyayaSaar provides general legal information, not formal legal advice.

USER QUESTION:
"${question}"

DOCUMENT METADATA:
- File Name: ${metadata.fileName || 'Uploaded Document'}
- Total Pages: ${metadata.pageCount || 'Unknown'}

DOCUMENT TEXT:
---
${truncated}
---

Return ONLY a valid JSON object (no markdown formatting, no code fences, no extra text) in this exact schema:
{
  "answer": "Direct, clear, plain-language answer to the user question based on the document. If not found in document, return exactly 'I couldn't find this information in the uploaded document.'",
  "sources": [
    {
      "page": 1,
      "clause": "Clause name or number (e.g. Clause 8: Termination)",
      "text": "Exact or relevant excerpt from the document"
    }
  ]
}

Rules:
- "page" should be an integer if pagination markers are found, otherwise null.
- "sources" must be an array of matching sources. If the answer is not in the document, "sources" MUST be [].
- Respond ONLY with the JSON object.`;
}

function buildMockChatResponse(question, documentText = '', _metadata = {}) {
  const q = String(question || '').toLowerCase().trim();

  // Termination queries
  if (q.includes('terminat') || q.includes('exit') || q.includes('leave') || q.includes('cancel')) {
    return {
      answer:
        'According to the uploaded document, either party may terminate this agreement by providing thirty (30) days prior written notice to the other party. In the event of default or breach of any terms, the non-defaulting party may terminate immediately without prejudice to other remedies.',
      sources: [
        {
          page: 2,
          clause: 'Clause 8: Termination Condition',
          text:
            'Either party may terminate this agreement by providing thirty (30) days prior written notice to the other party. In the event of default or breach of any terms herein, the non-defaulting party may terminate immediately without prejudice to any other remedies available under law.',
        },
      ],
      _isDemo: true,
    };
  }

  // Payment & Deposit obligations
  if (
    q.includes('payment') ||
    q.includes('deposit') ||
    q.includes('rent') ||
    q.includes('obligation') ||
    q.includes('money') ||
    q.includes('fee')
  ) {
    return {
      answer:
        'According to the uploaded document, you are required to deposit an interest-free refundable security deposit. The deposit will be refunded within thirty (30) days following peaceful handover of possession, subject to allowable deductions for unpaid utilities or property damages beyond normal wear and tear.',
      sources: [
        {
          page: 1,
          clause: 'Clause 4: Security Deposit & Payment',
          text:
            'The Tenant shall deposit with the Landlord an interest-free refundable security deposit. Said deposit shall be refunded within thirty (30) days following the peaceful handover of possession, subject to deductions for unpaid utilities or property damages beyond normal wear and tear.',
        },
      ],
      _isDemo: true,
    };
  }

  // Duration / How long
  if (q.includes('how long') || q.includes('duration') || q.includes('validity') || q.includes('period') || q.includes('term')) {
    return {
      answer:
        'According to the uploaded document, this agreement remains in effect for an initial duration of eleven (11) months from the commencement date, and may be renewed upon mutual written agreement of both parties.',
      sources: [
        {
          page: 1,
          clause: 'Clause 2: Term of Agreement',
          text:
            'The tenancy shall commence on the agreed commencement date and continue for an initial term of eleven (11) months, renewable upon mutual written consent of both parties prior to expiry.',
        },
      ],
      _isDemo: true,
    };
  }

  // Maintenance & Repairs
  if (q.includes('maintenance') || q.includes('repair') || q.includes('responsible') || q.includes('fix')) {
    return {
      answer:
        'According to the uploaded document, the tenant is responsible for maintaining the premises in good and clean condition and handling routine minor repairs under ₹1,000. Major structural repairs remain the responsibility of the landlord upon written notice.',
      sources: [
        {
          page: 1,
          clause: 'Clause 6: Maintenance Responsibilities',
          text:
            'The Tenant shall keep the premises in good and clean condition. Routine minor repairs under ₹1,000 shall be the responsibility of the Tenant, while major structural repairs shall be borne by the Landlord upon written notice.',
        },
      ],
      _isDemo: true,
    };
  }

  // Penalties & Breach
  if (q.includes('penalt') || q.includes('fine') || q.includes('late') || q.includes('breach') || q.includes('forfeit')) {
    return {
      answer:
        'According to the uploaded document, penalties include potential immediate termination of the agreement upon default, and allowable deductions from the security deposit for unpaid utilities, damages beyond normal wear and tear, or breach of contract covenants.',
      sources: [
        {
          page: 2,
          clause: 'Clause 9: Default and Deductions',
          text:
            'In the event of default or breach of any terms herein, the non-defaulting party may terminate immediately. Said deposit shall be subject to deductions for unpaid utilities or property damages beyond normal wear and tear.',
        },
      ],
      _isDemo: true,
    };
  }

  // If document text exists and keyword can be found in text
  if (documentText && documentText.length > 50) {
    const words = q.split(/\s+/).filter((w) => w.length > 3 && !['what', 'when', 'where', 'which', 'about', 'this', 'does'].includes(w));
    for (const w of words) {
      const idx = documentText.toLowerCase().indexOf(w);
      if (idx !== -1) {
        const start = Math.max(0, idx - 80);
        const end = Math.min(documentText.length, idx + 200);
        const snippet = documentText.slice(start, end).trim();
        return {
          answer: `Based on the uploaded document, the following excerpt relates to "${w}": "${snippet}". Consider reviewing this section carefully with a legal professional.`,
          sources: [
            {
              page: null,
              clause: `Section regarding ${w}`,
              text: snippet,
            },
          ],
          _isDemo: true,
        };
      }
    }
  }

  // If information is not in document
  return {
    answer: "I couldn't find this information in the uploaded document.",
    sources: [],
    _isDemo: true,
  };
}

/**
 * Chat with a legal document using Gemini AI.
 * Prioritizes uploaded document text and cites relevant clauses with page numbers.
 *
 * @param {string} question - User question
 * @param {string} documentText - Cleaned text from document
 * @param {{ fileName?: string, pageCount?: number }} metadata
 * @returns {Promise<{ answer: string, sources: Array<{ page: number|null, clause: string, text: string }>, _isDemo?: boolean }>}
 */
export async function chatDocumentService(question, documentText = '', metadata = {}) {
  if (!question || typeof question !== 'string' || !question.trim()) {
    const err = new Error('A valid question must be provided.');
    err.statusCode = 400;
    err.code = 'INVALID_QUESTION_INPUT';
    throw err;
  }

  // Fallback to demo mode if no API key is configured
  if (!config.geminiApiKey || config.geminiApiKey === 'your_gemini_api_key_here') {
    return { ...buildMockChatResponse(question.trim(), documentText, metadata), _isDemo: true };
  }

  const ai = new GoogleGenAI({ apiKey: config.geminiApiKey });

  try {
    const response = await ai.models.generateContent({
      model: config.geminiModel,
      contents: buildChatPrompt(question.trim(), documentText, metadata),
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
        maxOutputTokens: 2048,
      },
    });

    const rawText = response.text;
    if (!rawText) {
      throw new Error('Empty response received from Gemini API.');
    }

    const cleaned = rawText
      .trim()
      .replace(/^```(?:json)?\n?/i, '')
      .replace(/\n?```$/i, '')
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      console.error('[NyayaSaar AI] Chat JSON parse failed:', rawText.slice(0, 300));
      const err = new Error('AI returned an invalid response format for document chat.');
      err.statusCode = 502;
      err.code = 'AI_PARSE_ERROR';
      throw err;
    }

    const answer = String(
      parsed.answer || "I couldn't find this information in the uploaded document."
    );

    const sources = Array.isArray(parsed.sources)
      ? parsed.sources.map((s) => ({
          page: typeof s.page === 'number' ? s.page : null,
          clause: String(s.clause || 'Relevant Section'),
          text: String(s.text || ''),
        }))
      : [];

    return {
      answer,
      sources,
      _isDemo: false,
    };
  } catch (err) {
    if (err.statusCode && err.statusCode < 500) throw err;
    console.warn('[NyayaSaar AI] Chat call failed — falling back to mock:', err.message);
    return { ...buildMockChatResponse(question, documentText, metadata), _isDemo: true };
  }
}

/* ─── Document Comparison Prompts & Fallback ───────────────────────────────── */

function buildComparePrompt(docAText, docBText, metadata = {}) {
  const truncatedA =
    docAText.length > 15000
      ? docAText.slice(0, 15000) + '\n\n[... text truncated for length ...]'
      : docAText;
  const truncatedB =
    docBText.length > 15000
      ? docBText.slice(0, 15000) + '\n\n[... text truncated for length ...]'
      : docBText;

  return `You are NyayaSaar AI, an Indian legal document comparison assistant providing objective analysis of legal documents.

TASK:
Compare Document A and Document B to identify all meaningful differences and changes between them.

CRITICAL TONE & SAFETY GUIDELINES:
- Use strictly NEUTRAL, factual language.
- Do NOT declare one document "better", "fairer", "safer", or "superior".
- Clearly describe what changed between Document A and Document B (e.g., "Document B increases the notice period from 30 days to 60 days.", "Document B introduces a ₹500 late fee not present in Document A.").
- Compare key areas such as:
  1. Agreement duration / term
  2. Payment obligations / rent
  3. Security deposit amount & refund terms
  4. Notice period requirements
  5. Termination conditions & remedies
  6. Responsibilities & maintenance obligations
  7. Penalties, late fees, and deductions
  8. Renewal terms and rent escalation
  9. Dispute resolution & governing law

DOCUMENT A (${metadata.fileNameA || 'Document A'}):
---
${truncatedA}
---

DOCUMENT B (${metadata.fileNameB || 'Document B'}):
---
${truncatedB}
---

Return ONLY a valid JSON object (no markdown, no code fences, no extra commentary) in this exact schema:
{
  "summary": "2-3 sentence neutral overview highlighting the main modifications between Document A and Document B.",
  "differences": [
    {
      "topic": "Topic Name (e.g., Notice Period, Security Deposit, Duration, Late Penalties)",
      "documentA": "Brief description or value in Document A (e.g. 30 days written notice)",
      "documentB": "Brief description or value in Document B (e.g. 60 days written notice)",
      "explanation": "1-2 sentence neutral plain-language explanation of what changed (e.g. Document B increases the notice period from 30 days to 60 days.)"
    }
  ]
}

Rules:
- Include 4-8 distinct differences where the documents differ. If terms are identical for a topic, omit it or note identical.
- Respond ONLY with the JSON object.`;
}

function buildMockComparisonResponse(_docAText, _docBText, _metadata = {}) {
  return {
    summary:
      'Document B introduces longer notice requirements, a higher security deposit, a modified agreement duration, and explicit penalty charges for late payments compared to Document A.',
    differences: [
      {
        topic: 'Notice Period',
        documentA: '30 days prior written notice',
        documentB: '60 days prior written notice',
        explanation:
          'Document B increases the notice period required for termination from 30 days to 60 days.',
      },
      {
        topic: 'Security Deposit',
        documentA: '₹25,000 refundable deposit',
        documentB: '₹35,000 refundable deposit',
        explanation:
          'Document B increases the required security deposit amount by ₹10,000.',
      },
      {
        topic: 'Agreement Duration',
        documentA: '11 months fixed term',
        documentB: '12 months fixed term with 6-month lock-in',
        explanation:
          'Document B extends the overall duration to 12 months and adds a mandatory 6-month lock-in period during which early exit is restricted.',
      },
      {
        topic: 'Maintenance & Repairs',
        documentA: 'Tenant pays minor repairs under ₹1,000',
        documentB: 'Tenant responsible for all repairs up to ₹3,000',
        explanation:
          'Document B raises the threshold for tenant maintenance obligations from ₹1,000 to ₹3,000 per repair.',
      },
      {
        topic: 'Late Payment Penalties',
        documentA: 'No explicit daily/weekly late fee stated',
        documentB: '₹500 per week late fee after 5th of each month',
        explanation:
          'Document B introduces a dedicated financial penalty for delayed monthly rent payments.',
      },
      {
        topic: 'Renewal & Rent Escalation',
        documentA: 'Renewal upon mutual agreement',
        documentB: 'Automatic 10% rent escalation upon renewal',
        explanation:
          'Document B adds an automatic 10% annual rent increase clause upon lease renewal.',
      },
    ],
    _isDemo: true,
  };
}

/**
 * Compares two legal documents using Gemini AI to identify structured differences.
 *
 * @param {string} docAText - Extracted text of Document A
 * @param {string} docBText - Extracted text of Document B
 * @param {{ fileNameA?: string, fileNameB?: string }} metadata
 * @returns {Promise<{ summary: string, differences: Array<{ topic: string, documentA: string, documentB: string, explanation: string }>, _isDemo?: boolean }>}
 */
export async function compareDocumentsService(docAText = '', docBText = '', metadata = {}) {
  if (!docAText || !docAText.trim()) {
    const err = new Error('Document A has no readable text. Please provide a valid document.');
    err.statusCode = 400;
    err.code = 'EMPTY_DOC_A';
    throw err;
  }

  if (!docBText || !docBText.trim()) {
    const err = new Error('Document B has no readable text. Please provide a valid document.');
    err.statusCode = 400;
    err.code = 'EMPTY_DOC_B';
    throw err;
  }

  // Fallback to demo mode if no API key is configured
  if (!config.geminiApiKey || config.geminiApiKey === 'your_gemini_api_key_here') {
    return { ...buildMockComparisonResponse(docAText, docBText, metadata), _isDemo: true };
  }

  const ai = new GoogleGenAI({ apiKey: config.geminiApiKey });

  try {
    const response = await ai.models.generateContent({
      model: config.geminiModel,
      contents: buildComparePrompt(docAText, docBText, metadata),
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
        maxOutputTokens: 2048,
      },
    });

    const rawText = response.text;
    if (!rawText) {
      throw new Error('Empty response received from Gemini API during document comparison.');
    }

    const cleaned = rawText
      .trim()
      .replace(/^```(?:json)?\n?/i, '')
      .replace(/\n?```$/i, '')
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      console.error('[NyayaSaar AI] Compare JSON parse failed:', rawText.slice(0, 300));
      const err = new Error('AI returned an invalid response format for document comparison.');
      err.statusCode = 502;
      err.code = 'AI_PARSE_ERROR';
      throw err;
    }

    const summary = String(parsed.summary || 'Comparison completed.');
    const differences = Array.isArray(parsed.differences)
      ? parsed.differences.map((d) => ({
          topic: String(d.topic || 'General Term'),
          documentA: String(d.documentA || '—'),
          documentB: String(d.documentB || '—'),
          explanation: String(d.explanation || ''),
        }))
      : [];

    return {
      summary,
      differences,
      _isDemo: false,
    };
  } catch (err) {
    if (err.statusCode && err.statusCode < 500) throw err;
    console.warn('[NyayaSaar AI] Compare call failed — falling back to mock:', err.message);
    return { ...buildMockComparison(docAText, docBText, metaA, metaB), _isDemo: true };
  }
}

/* ─── RAG-Grounded Chat ─────────────────────────────────────────────────────
 * Called when relevant chunks have been retrieved by the RAG pipeline.
 * Gemini only sees the retrieved chunks, not the full document text.
 * ─────────────────────────────────────────────────────────────────────────── */

function buildRAGPrompt(question, relevantChunks, metadata = {}) {
  const contextBlock = relevantChunks
    .map((chunk, i) => {
      const pageLabel = chunk.page ? `Page ${chunk.page}` : 'Document Body';
      return `[Chunk ${i + 1} | ${pageLabel} | Relevance: ${Math.round((chunk.relevance ?? 0) * 100)}%]\n${chunk.text}`;
    })
    .join('\n\n---\n\n');

  return `You are NyayaSaar AI, an Indian legal document assistant helping everyday citizens understand their legal documents.

STRICT ANTI-HALLUCINATION RULES:
1. BASE YOUR ANSWER ONLY ON THE RETRIEVED DOCUMENT CHUNKS PROVIDED BELOW.
2. If the answer is NOT present in the provided chunks, respond with EXACTLY:
   "I couldn't find enough information in the uploaded document to answer this question."
3. NEVER invent a clause, page number, quote, or legal term not present in the chunks.
4. NEVER cite a source not in the provided chunks.
5. Do NOT make definitive legal declarations ("this is illegal", "you will definitely win").
6. Use neutral language: "According to your document...", "The agreement states...", "Review carefully..."
7. If you add general legal context beyond what is in the document, label it explicitly as "General legal context (not from document):".

USER QUESTION:
"${question}"

DOCUMENT METADATA:
- File: ${metadata.fileName || 'Uploaded Document'}
- Pages: ${metadata.pageCount || 'Unknown'}

RETRIEVED DOCUMENT CHUNKS (answer ONLY from these):
---
${contextBlock}
---

Return ONLY a valid JSON object (no markdown, no code fences) in this exact schema:
{
  "answer": "Plain-language answer grounded strictly in the document chunks. If not found, return exactly: I couldn't find enough information in the uploaded document to answer this question.",
  "sources": [
    {
      "page": 1,
      "clause": "Clause name or description from the chunk",
      "text": "Relevant excerpt from the chunk",
      "relevance": 0.91
    }
  ]
}

Rules:
- "page" must be an integer matching the chunk page, or null.
- "relevance" must be a decimal between 0 and 1.
- Only include chunks in "sources" that you actually used.
- If the answer could not be found, "sources" MUST be [].
- Respond ONLY with the JSON object.`;
}

/**
 * RAG-grounded document chat using pre-retrieved relevant chunks.
 * Enforces strict anti-hallucination via prompt-level constraints.
 *
 * @param {string} question - User question
 * @param {Array<{ text: string, page: number|null, relevance: number }>} relevantChunks
 * @param {{ fileName?: string, pageCount?: number }} metadata
 * @returns {Promise<{ answer: string, sources: Array, _isDemo?: boolean, _ragEnabled: boolean }>}
 */
export async function chatWithRAGContext(question, relevantChunks, metadata = {}) {
  if (!question || typeof question !== 'string' || !question.trim()) {
    const err = new Error('A valid question must be provided.');
    err.statusCode = 400;
    err.code = 'INVALID_QUESTION_INPUT';
    throw err;
  }

  // No chunks — fall back to standard full-document chat
  if (!relevantChunks || relevantChunks.length === 0) {
    return chatDocumentService(question, '', metadata);
  }

  // No API key — fall back to mock using chunk text
  if (!config.geminiApiKey || config.geminiApiKey === 'your_gemini_api_key_here') {
    const combinedText = relevantChunks.map((c) => c.text).join('\n');
    return {
      ...buildMockChatResponse(question.trim(), combinedText, metadata),
      _isDemo: true,
      _ragEnabled: false,
    };
  }

  const ai = new GoogleGenAI({ apiKey: config.geminiApiKey });

  try {
    const response = await ai.models.generateContent({
      model: config.geminiModel,
      contents: buildRAGPrompt(question.trim(), relevantChunks, metadata),
      config: {
        responseMimeType: 'application/json',
        temperature: 0.1,
        maxOutputTokens: 2048,
      },
    });

    const rawText = response.text;
    if (!rawText) {
      throw new Error('Empty response received from Gemini API.');
    }

    const cleaned = rawText
      .trim()
      .replace(/^```(?:json)?\n?/i, '')
      .replace(/\n?```$/i, '')
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      console.error('[NyayaSaar RAG] JSON parse failed:', rawText.slice(0, 300));
      const err = new Error('AI returned an invalid response format.');
      err.statusCode = 502;
      err.code = 'AI_PARSE_ERROR';
      throw err;
    }

    const answer = String(
      parsed.answer ||
        "I couldn't find enough information in the uploaded document to answer this question."
    );

    const sources = Array.isArray(parsed.sources)
      ? parsed.sources.map((s) => ({
          page: typeof s.page === 'number' ? s.page : null,
          clause: String(s.clause || 'Relevant Section'),
          text: String(s.text || ''),
          relevance:
            typeof s.relevance === 'number' ? Math.round(s.relevance * 100) / 100 : null,
        }))
      : [];

    return {
      answer,
      sources,
      _isDemo: false,
      _ragEnabled: true,
    };
  } catch (err) {
    if (err.statusCode) throw err;

    const message = String(err.message || '');
    if (message.includes('API key') || message.includes('401') || message.includes('403')) {
      const apiErr = new Error('Gemini API authentication failed. Please verify your GEMINI_API_KEY.');
      apiErr.statusCode = 401;
      apiErr.code = 'AI_AUTH_ERROR';
      throw apiErr;
    }
    if (message.includes('quota') || message.includes('429')) {
      const quotaErr = new Error('Gemini API quota exceeded. Please wait a moment and try again.');
      quotaErr.statusCode = 429;
      quotaErr.code = 'AI_QUOTA_EXCEEDED';
      throw quotaErr;
    }

    console.error('[NyayaSaar RAG] Unexpected error:', err);
    // Graceful degradation — fall back to standard full-doc chat
    const combinedText = relevantChunks.map((c) => c.text).join('\n\n');
    return chatDocumentService(question, combinedText, metadata);
  }
}
