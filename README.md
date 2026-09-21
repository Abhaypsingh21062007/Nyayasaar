# NyayaSaar

NyayaSaar is an AI-powered legal document assistant that simplifies complex legal agreements into plain, understandable terms. It allows users to upload PDF contracts, analyzes them to extract key clauses, and provides a conversational interface to ask questions about the document based on Retrieval-Augmented Generation (RAG).

## Project Evaluation Parameters

This project has been extensively optimized and hardened across six core evaluation parameters:

### 1. Testing
- **Setup:** Configured Vitest and Supertest for backend testing.
- **Unit Tests:** Comprehensive unit testing of security middleware (Rate Limiters, Helmet, Sanitization) and core utilities (LRU Caching, Input Sanitization).
- **Integration Tests:** Integration testing for backend API endpoints, including upload endpoints, chat, and explanation features.
- **Scripts:** Easy to use NPM scripts (`npm test`, `npm run test:coverage`) for continuous integration.

### 2. Security
- **Helmet.js:** Added to secure Express HTTP headers and prevent common attacks (XSS, clickjacking).
- **Rate Limiting:** Implemented tiered rate limiting:
  - Global API Limiter (100 req/15 min)
  - Strict Upload Limiter (10 req/hour) to prevent abuse and DoS.
  - AI Route Limiter (20 req/15 min) to prevent prompt spamming and manage quota.
- **Input Sanitization:** 
  - Strict filename sanitization to prevent Path Traversal.
  - Prompt injection detection and input stripping before passing content to the Gemini AI models.
- **Payload Limits:** Configured strict JSON and URL-encoded body limits (1MB).

### 3. Efficiency
- **Backend Caching:** Implemented an in-memory LRU cache with TTL (Time-To-Live) for AI responses, drastically reducing latency and redundant Gemini API calls.
- **Payload Compression:** Added gzip/deflate compression via `compression` middleware to reduce network transfer sizes.
- **Frontend Code Splitting:** Implemented React `lazy` and `Suspense` for route-based chunking.
- **Build Optimization:** Configured `vite.config.js` with Rollup `manualChunks` to split vendor dependencies (`react`, `lucide-react`) from application logic, decreasing initial load time.

### 4. Accessibility (a11y)
- **Keyboard Navigation:** Ensured all interactive elements have visible focus states using `focus-visible` styles.
- **Skip Links:** Added a hidden `skip-to-content` link for screen readers to bypass navigation and jump straight to the main application area.
- **ARIA Labels:** Added semantic `aria-label` tags to icon-only buttons (such as Modals, Sidebar controls) to improve screen reader compatibility.

### 5. Code Quality
- **Dead Code Removal:** Cleaned up unused variables and components (e.g., replaced placeholder pages with fully functional components).
- **Modular Refactoring:** Extracted security and caching configurations into dedicated, testable middleware modules.

### 6. Problem Statement Alignment
- **Feature Completion:** The application faithfully executes on its core mandate of simplifying legal documents.
- **Documents Vault:** Replaced placeholder endpoints with a functioning "My Documents" Vault that tracks upload history and metadata, completing the user journey.

## Getting Started

### Prerequisites
- Node.js (v18+)
- Gemini API Key

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure Environment:
   Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_key
   PORT=5000
   ```

3. Start Development Server:
   ```bash
   npm run dev
   ```

### Testing
Run the test suite using Vitest:
```bash
npm test
```
