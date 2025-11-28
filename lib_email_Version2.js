// nodemailer wrapper for sending verification codes.
// Configure SMTP in environment variables.

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendVerificationEmail(to, code) {
  const from = process.env.EMAIL_FROM || "AgroHub <no-reply@agrohub.local>";
  const subject = "Your AgroHub verification code";
  const text = `Your AgroHub verification code is: ${code}`;
  const html = `<p>Hello Agroexplorer,</p>
    <p>Your verification code is: <strong>${code}</strong></p>
    <p>This code expires in 15 minutes.</p>
    <p>— AgroHub</p>`;

  const info = await transporter.sendMail({ from, to, subject, text, html });
  return info;
}

export { sendVerificationEmail };