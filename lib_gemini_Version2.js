// Gemini (Vertex AI) proxy helper.
// This wrapper supports two modes:
// 1) GOOGLE_SERVICE_ACCOUNT: using application default credentials (GOOGLE_APPLICATION_CREDENTIALS env).
// 2) API KEY mode: using GEMINI_API_KEY (not recommended for production).
//
// It calls the Vertex AI text generation endpoint and returns the text output.
// Configure GOOGLE_PROJECT_ID and optionally location (default: us-central1).
//
// Note: This is a prototype. For robust usage, implement retries, rate-limits, and streaming.

import { GoogleAuth } from "google-auth-library";

const DEFAULT_LOCATION = "us-central1";
const PROJECT_ID = process.env.GOOGLE_PROJECT_ID;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const LOCATION = process.env.GEMINI_LOCATION || DEFAULT_LOCATION;

// model examples (adjust as you have access)
const DEFAULT_MODEL = "models/text-bison-001"; // change if you have different model name

async function callGemini({ prompt, temperature = 0.2, maxOutputTokens = 512, model = DEFAULT_MODEL }) {
  if (!PROJECT_ID) throw new Error("GOOGLE_PROJECT_ID env var is required for Gemini calls.");

  const url = `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/${model}:generateText`;

  const body = {
    temperature,
    maxOutputTokens,
    // the API accepts prompt as "instances" or "prompt": using prompt field for compatibility
    instances: [{ content: prompt }],
  };

  // Use API key if provided (less secure)
  if (GEMINI_API_KEY) {
    const res = await fetch(`${url}?key=${encodeURIComponent(GEMINI_API_KEY)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Gemini API error: ${res.status} ${text}`);
    }
    const json = await res.json();
    // Vertex AI generateText responses may contain 'predictions' or 'candidates'
    const candidate = json?.candidates?.[0]?.content || json?.predictions?.[0]?.content || JSON.stringify(json);
    return candidate;
  }

  // Otherwise use GoogleAuth to get a bearer token (service account)
  const auth = new GoogleAuth({
    scopes: ["https://www.googleapis.com/auth/cloud-platform"],
  });
  const client = await auth.getClient();
  const token = await client.getAccessToken();

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token.token || token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gemini API error: ${res.status} ${text}`);
  }
  const json = await res.json();
  const candidate = json?.candidates?.[0]?.content || json?.predictions?.[0]?.content || JSON.stringify(json);
  return candidate;
}

export { callGemini };