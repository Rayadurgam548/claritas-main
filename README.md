# Claritas Backend - AI Legal Document Analyzer

## Overview
Claritas is a production-ready, locally-hosted AI-powered Legal Document Analyzer backend using Node.js, Express.js, and Google's Gemini API. The system supports document upload (`.pdf`, `.docx`, `.txt`), text extraction, secure local storage without a database, AI analysis, document comparison, and a context-aware chat to interrogate documents.

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   Create a `.env` file in the root based on `.env` (already generated for you) and add your actual Gemini API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=3000
   ```

3. **Start the Server**
   ```bash
   node server.js
   ```

## API Documentation

### 1. Document Management

#### POST /api/upload
Uploads a document for analysis.
- **Content-Type**: `multipart/form-data`
- **Body**: 
  - `document`: (File - PDF, DOCX, TXT. Max 5MB).
  - `privacyMode`: (Optional) `true` or `false` (redacts explicit PII like emails, phones, SSN).
- **Response**: JSON array containing `id`, `filename`, `status`, `privacyMode`.

#### GET /api/documents
Retrieves the list of all uploaded and analyzed documents.
- **Response**:
  ```json
  {
    "success": true,
    "count": 1,
    "data": [
      {
        "id": "uuid",
        "filename": "contract.pdf",
        "status": "uploaded | analyzed",
        "privacyMode": false,
        "createdAt": "...",
        "updatedAt": "..."
      }
    ]
  }
  ```

#### DELETE /api/documents/:id
Deletes a document from storage including its raw file, text, and analysis data.

### 2. AI Features

#### POST /api/analyze/:id
Analyzes a previously uploaded document.
- **Response**: Strict JSON containing risk score, key clauses, identified entities, and missing clauses.

#### POST /api/compare
Compares two uploaded documents and highlights differences.
- **Body**:
  ```json
  {
    "docId1": "uuid-of-document-1",
    "docId2": "uuid-of-document-2"
  }
  ```
- **Response**: Strict JSON describing conflicts, clause differences, and which is more pro-client.

#### POST /api/chat
Interact with the analytical intelligence contextually regarding a document. Focuses explicitly on the document context and prevents hallucinated responses.
- **Body**:
  ```json
  {
    "documentId": "uuid-of-document",
    "query": "What are the termination conditions?"
  }
  ```
- **Response**: JSON text with AI's answer.

## Architecture and Security
- **Local Storage System**: Uses `/storage/uploads` and `/storage/data` preventing database overhead. Includes atomic renaming to prevent concurrent write corruption.
- **Validation**: Strict MIME-type evaluation via `multer` to block double extensions, non-conformant file structures, and sizes exceeding limits.
- **AI Retry Mechanisms**: Implements exponential backoff scaling up to 2 retry attempts for potentially timeouting or rate-limited API calls.
