// Verify code: accepts { email, code }
// On success, marks user.verified = true

import { getDB } from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { email, code } = req.body;
  if (!email || !code) return res.status(400).json({ error: "Missing email or code." });

  const db = await getDB();
  await db.read();

  const entry = db.data.verificationCodes.find(v => v.email === email.toLowerCase() && v.code === code);
  if (!entry) return res.status(400).json({ error: "Invalid code." });
  if (Date.now() > entry.expiresAt) return res.status(400).json({ error: "Code expired." });

  // mark user verified
  const user = db.data.users.find(u => u.email === email.toLowerCase());
  if (!user) return res.status(404).json({ error: "User not found." });
  user.verified = true;

  // remove code entry
  db.data.verificationCodes = db.data.verificationCodes.filter(v => !(v.email === email.toLowerCase() && v.code === code));
  await db.write();

  return res.status(200).json({ ok: true, message: "Email verified." });
}