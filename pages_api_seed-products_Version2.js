// Utility endpoint (development only) to seed example products and sample wellness profile.
// NOTE: Remove or protect in production.

import { getDB } from "../../lib/db";

export default async function handler(req, res) {
  if (process.env.NODE_ENV === "production") return res.status(403).end();

  const db = await getDB();
  await db.read();
  db.data.products = [
    { id: "p1", name: "Tomatoes", price: 200, sellerId: "s1", location: "Ilorin", healthApproved: true },
    { id: "p2", name: "Yam Tubers", price: 1200, sellerId: "s2", location: "Kaiama", healthApproved: true },
    { id: "p3", name: "Fresh Pepper", price: 180, sellerId: "s1", location: "Pategi", healthApproved: false },
  ];
  await db.write();
  res.json({ ok: true, seeded: db.data.products });
}