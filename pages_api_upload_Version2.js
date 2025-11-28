// File upload endpoint (multer).
// Accepts multipart form-data with field 'file' and metadata { userId, purpose }
// If S3 configured, uploads to S3; otherwise stores in public/uploads and records entry in DB.

import nextConnect from "next-connect";
import multer from "multer";
import { uploadFileBuffer } from "../../lib/s3";
import { getDB } from "../../lib/db";

export const config = {
  api: { bodyParser: false },
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

const handler = nextConnect();

handler.use(upload.single("file"));

handler.post(async (req, res) => {
  try {
    const { originalname, buffer, mimetype } = req.file;
    const { userId, purpose } = req.body;

    const result = await uploadFileBuffer({ buffer, filename: originalname, contentType: mimetype });

    const db = await getDB();
    await db.read();
    const record = {
      id: Date.now().toString(),
      userId,
      purpose,
      filename: originalname,
      storedAt: new Date().toISOString(),
      location: result.url,
    };
    db.data.uploads.push(record);
    await db.write();

    return res.status(200).json({ ok: true, upload: record });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Upload failed." });
  }
});

export default handler;