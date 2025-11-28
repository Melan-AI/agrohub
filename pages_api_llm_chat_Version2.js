// Chat endpoint: accepts { token (optional), userId, message, lang }
// Server fetches user wellness data, available products (mocked), and crafts a prompt using lib/prompts.js
// Then calls Gemini via lib/gemini.js and returns the text response.
// This endpoint keeps all LLM calls server-side (no client API keys leaked).

import { callGemini } from "../../../lib/gemini";
import { getDB } from "../../../lib/db";
import { dietTimetablePrompt, escrowPrompt, generalSupportPrompt } from "../../../lib/prompts";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { token, userId, message, lang = "en", mode = "general", extra = {} } = req.body;

  // authenticate token optionally (prototype)
  let user = null;
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const db = await getDB();
      await db.read();
      user = db.data.users.find(u => u.id === decoded.sub) || null;
    } catch (err) {
      // token invalid -> continue as guest
      console.warn("Invalid token:", err?.message);
    }
  } else if (userId) {
    const db = await getDB();
    await db.read();
    user = db.data.users.find(u => u.id === userId) || null;
  }

  // Prepare context: wellness and available products
  const db = await getDB();
  await db.read();
  const wellness = user?.wellnessProfile || "No wellness profile on file.";
  // In a real app, fetch products from DB and filter health-approved
  const availableProducts = db.data.products.length ? db.data.products : [
    { id: "p1", name: "Tomatoes", price: 200, sellerId: "s1", healthApproved: true },
    { id: "p2", name: "Yam Tubers", price: 1200, sellerId: "s2", healthApproved: true },
    { id: "p3", name: "Fresh Pepper", price: 180, sellerId: "s1", healthApproved: false },
  ];

  // Choose prompt template based on mode
  let prompt = "";
  if (mode === "diet") {
    prompt = dietTimetablePrompt({ lang, wellness, availableProducts });
  } else if (mode === "escrow") {
    const items = extra.items || [];
    const logistics = extra.logistics || null;
    prompt = escrowPrompt({ lang, items, logistics });
  } else {
    // general support - include last user message
    prompt = generalSupportPrompt({ lang, question: message });
  }

  try {
    const responseText = await callGemini({ prompt, temperature: 0.2 });
    // Ideally parse JSON from response if the prompt requested JSON
    return res.status(200).json({ ok: true, response: responseText });
  } catch (err) {
    console.error("LLM error:", err);
    return res.status(500).json({ error: "LLM error: " + String(err.message) });
  }
}