# AgroHub — Next.js Backend (Prototype)

This Next.js backend adds:

- Email verification & account endpoints
- File uploads (S3 or local)
- LLM proxying to Google Gemini (Vertex AI) with server-side prompt templates for:
  - Health-safe recommendations & diet timetables
  - Escrow/payment breakdowns
  - Seller verification guidance
  - General support / FAQ answers
- Chat endpoint for the AgroHub Intelligent Agent which always uses “Agroexplorers” and “seller” in responses

Security / production notes:
- Store secrets in environment variables or a secrets manager.
- Replace the prototype JSON DB (lowdb) with a relational DB (Postgres + Prisma).
- Store uploaded medical reports in encrypted object storage (S3) and restrict access.
- Use Google service account keys (GOOGLE_APPLICATION_CREDENTIALS) or Workload Identity on GCP for Vertex AI access.
- Run LLM calls server-side only.

How to run (prototype):
1. Copy `.env.example` to `.env.local` and fill values.
2. npm install
3. npm run dev
4. Server endpoints are at `/api/*` (Next.js API routes).

Endpoints
- POST /api/auth/register — submit registration with email, fullName, password (password stored hashed in prototype) and houseAddress; triggers verification code via email.
- POST /api/auth/verify — submit email + code to finalize registration.
- POST /api/auth/signin — email + password sign-in (returns basic session token in prototype).
- POST /api/upload — multipart upload (medical reports) — supports S3 if configured, else stores in /uploads.
- POST /api/llm/chat — server-side chat proxy to Gemini. Payload: { userId, message, lang } — server will enrich prompt with user wellness data and product list and call Gemini.

Prompt templates
- See lib/prompts.js for templates and examples for: diet timetables, health-safe filtering, escrow explanations, seller guidance, and multilingual support.

Next steps I can implement for you (pick one or more):
- Swap lowdb for Postgres + Prisma and add migrations.
- Harden auth (JWT + refresh tokens, or NextAuth).
- Add rate-limiting, request logging, and usage billing for LLM calls.
- Implement server-side streaming responses from Gemini.
