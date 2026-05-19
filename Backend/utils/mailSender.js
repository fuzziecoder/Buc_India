import { BrevoClient } from "@getbrevo/brevo";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const client = new BrevoClient({ apiKey: process.env.BREVO_API_KEY });

export const sendOTP = async (email, otp, type) => {
  const subject =
    type === "signup"
      ? "Verify your BUC India Account"
      : "Reset your BUC India Password";
  const actionText =
    type === "signup" ? "signing up" : "resetting your password";

  // Read logo and convert to base64 for embedding (since it's a local file)
  let logoData = "";
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const logoPath = path.join(__dirname, "../../Frontend/public/logo.jpg");
    const bitmap = fs.readFileSync(logoPath);
    logoData = `data:image/jpeg;base64,${new Buffer.from(bitmap).toString("base64")}`;
  } catch (err) {
    console.error("Error reading logo for email:", err.message);
  }

  try {
    await client.transactionalEmails.sendTransacEmail({
      subject: subject,
      sender: {
        name: process.env.BREVO_SENDER_NAME,
        email: process.env.BREVO_SENDER_EMAIL,
      },
      to: [{ email: email }],
      htmlContent: `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        .container { font-family: 'Inter', sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; }
        .header { text-align: center; margin-bottom: 30px; }
        .logo { width: 80px; height: 80px; border-radius: 50%; }
        .content { text-align: center; color: #1e293b; }
        .otp { font-size: 32px; font-weight: 800; color: #3b82f6; letter-spacing: 5px; margin: 24px 0; }
        .footer { text-align: center; font-size: 12px; color: #64748b; margin-top: 40px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          ${logoData ? `<img src="${logoData}" alt="BUC India" class="logo" />` : ""}
          <h1 style="font-size: 24px; margin-top: 10px;">Bikers Unity Calls</h1>
        </div>
        <div class="content">
          <h2>Verification Code</h2>
          <p>You are receiving this email because you are ${actionText} for BUC India.</p>
          <p>Please use the following One-Time Password (OTP) to complete the process:</p>
          <div class="otp">${otp}</div>
          <p>This code is valid for 10 minutes. Please do not share this code with anyone.</p>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} Bikers Unity Calls. All rights reserved.<br/>
          Ride Together, Stand Together.
        </div>
      </div>
    </body>
    </html>
  `,
    });
    return true;
  } catch (error) {
    console.error("Error sending email via Brevo:", error);
    throw error;
  }
};

export const sendRegistrationConfirmation = async ({
  email,
  fullName,
  registrationTypeLabel,
}) => {
  let logoData = "";
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const logoPath = path.join(__dirname, "../../Frontend/public/logo.jpg");
    const bitmap = fs.readFileSync(logoPath);
    logoData = `data:image/jpeg;base64,${Buffer.from(bitmap).toString("base64")}`;
  } catch (err) {
    console.error("Error reading logo for registration email:", err.message);
  }

  const safeName = fullName || "Rider";
  const logoHtml = logoData
    ? `<img src="${logoData}" alt="BUC India" class="logo" />`
    : "";

  const htmlContent = [
    "<!DOCTYPE html><html><head><style>",
    ".container{font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;max-width:600px;margin:auto;padding:24px;border:1px solid #e2e8f0;border-radius:12px;background:#fff}",
    ".header{text-align:center;margin-bottom:28px}",
    ".logo{width:72px;height:72px;border-radius:50%}",
    ".brand{color:#C19A6B;font-size:22px;font-weight:700;margin:12px 0 4px}",
    ".content{color:#1e293b;line-height:1.7}",
    ".highlight{background:#f8fafc;border-left:4px solid #C19A6B;padding:16px 20px;margin:24px 0}",
    ".footer{text-align:center;font-size:12px;color:#64748b;margin-top:36px;padding-top:20px;border-top:1px solid #e2e8f0}",
    "</style></head><body>",
    '<div class="container">',
    '<div class="header">',
    logoHtml,
    '<div class="brand">Bikers Unity Calls — India</div>',
    '<p style="color:#64748b;font-size:14px;margin:0">Ride Together, Stand Together</p>',
    "</div>",
    '<div class="content">',
    `<p>Dear <strong>${safeName}</strong>,</p>`,
    "<p>Thank you for registering with <strong>BUC India</strong>. We have received your submission.</p>",
    '<div class="highlight">',
    `<p style="margin:0 0 8px"><strong>Registration type:</strong> ${registrationTypeLabel}</p>`,
    "<p style=\"margin:0\">Our team will be in touch when relevant events or updates are available.</p>",
    "</div>",
    "<p>If you have questions, reply to this email or contact us through our official channels.</p>",
    "<p style=\"margin-top:24px\">With respect,<br/><strong>The BUC India Team</strong></p>",
    "</div>",
    `<div class="footer">&copy; ${new Date().getFullYear()} Bikers Unity Calls (BUC India). All rights reserved.</div>`,
    "</div></body></html>",
  ].join("");

  try {
    await client.transactionalEmails.sendTransacEmail({
      subject: "BUC India — Registration Confirmed",
      sender: {
        name: process.env.BREVO_SENDER_NAME || "BUC India",
        email: process.env.BREVO_SENDER_EMAIL,
      },
      to: [{ email }],
      htmlContent,
    });
    return true;
  } catch (error) {
    console.error("Error sending registration confirmation email:", error);
    return false;
  }
};
