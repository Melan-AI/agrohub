// Register: accepts { fullName, email, password, houseAddress }
// Stores user in prototype DB with status 'pending' and sends verification code via email.

import bcrypt from "bcryptjs";
import { getDB } from "../../../lib/db";
import { nanoid } from "nanoid";
import { sendVerificationEmail } from "../../../lib/email";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { fullName, email, password, houseAddress } = req.body;
  if (!fullName || !email || !password || !houseAddress) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  const db = await getDB();
  await db.read();

  const existing = db.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) return res.status(409).json({ error: "Email already registered." });

  const hashed = bcrypt.hashSync(password, 10);
  const userId = nanoid(10);
  const user = {
    id: userId,
    fullName,
    email: email.toLowerCase(),
    passwordHash: hashed,
    houseAddress,
    createdAt: new Date().toISOString(),
    verified: false,
  };

  db.data.users.push(user);

  // create verification code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  db.data.verificationCodes.push({
    email: user.email,
    code,
    expiresAt: Date.now() + 15 * 60 * 1000, // 15 minutes
  });

  await db.write();

  // send email (async)
  try {
    await sendVerificationEmail(user.email, code);
  } catch (err) {
    console.error("Email send error:", err);
    // still return success for prototype but warn
    return res.status(500).json({ error: "Failed to send verification email (check SMTP settings)." });
  }

  return res.status(200).json({ ok: true, message: "Verification code sent to email." });
}