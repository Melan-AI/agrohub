// S3 upload helper (optional). If S3_* env vars not provided, backend saves files locally.

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import { join } from "path";

const S3_BUCKET = process.env.S3_BUCKET;
let s3Client = null;
if (S3_BUCKET) {
  s3Client = new S3Client({
    region: process.env.S3_REGION,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
  });
}

async function uploadFileBuffer({ buffer, filename, contentType = "application/octet-stream" }) {
  if (s3Client) {
    const key = `uploads/${Date.now()}_${filename}`;
    const command = new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    });
    await s3Client.send(command);
    return { url: `s3://${S3_BUCKET}/${key}`, key };
  } else {
    const outDir = join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    const outPath = join(outDir, `${Date.now()}_${filename}`);
    fs.writeFileSync(outPath, buffer);
    return { url: `/uploads/${outPath.split("public/uploads/").pop()}`, path: outPath };
  }
}

export { uploadFileBuffer };