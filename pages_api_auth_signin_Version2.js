// Sign in: { email, password } => returns a simple JWT token (prototype)
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getDB } from "../../../lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Missing email or password." });

  const db = await getDB();
  await db.read();

  const user = db.data.users.find(u => u.email === email.toLowerCase());
  if (!user) return res.status(401).json({ error: "Invalid credentials." });
  if (!user.verified) return res.status(403).json({ error: "Email not verified." });

  const ok = bcrypt.compareSync(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials." });

  const token = jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });

  return res.status(200).json({ ok: true, token, user: { id: user.id, fullName: user.fullName, email: user.email } });
}