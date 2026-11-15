import nodemailer from "nodemailer";

export const runtime = "nodejs";

const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 3;

// In-memory rate limiting per client IP
function checkRateLimit(ip) {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  const recent = timestamps.filter((time) => now - time < RATE_LIMIT_WINDOW_MS);

  if (recent.length >= MAX_REQUESTS_PER_WINDOW) {
    rateLimitMap.set(ip, recent);
    return true;
  }

  recent.push(now);
  rateLimitMap.set(ip, recent);

  // Periodic map cleanup
  if (rateLimitMap.size > 1000) {
    for (const [key, times] of rateLimitMap.entries()) {
      const validTimes = times.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
      if (validTimes.length === 0) {
        rateLimitMap.delete(key);
      } else {
        rateLimitMap.set(key, validTimes);
      }
    }
  }

  return false;
}

// Secure HTML escaping to prevent injection in generated emails
function escapeHtml(str) {
  if (typeof str !== "string") return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(request) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    if (checkRateLimit(ip)) {
      return Response.json(
        {
          success: false,
          message: "Too many messages sent. Please wait 10 minutes before trying again.",
        },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return Response.json(
        { success: false, message: "Invalid request payload." },
        { status: 400 }
      );
    }

    // Honeypot check: if filled, silently succeed without sending email
    const honeypot = body.website || body.honeypot;
    if (honeypot && String(honeypot).trim().length > 0) {
      return Response.json({ success: true }, { status: 200 });
    }

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const subject = typeof body.subject === "string" ? body.subject.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";

    // Validation
    if (name.length < 2 || name.length > 80) {
      return Response.json(
        { success: false, message: "Name must be between 2 and 80 characters." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json(
        { success: false, message: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (subject.length < 1 || subject.length > 150) {
      return Response.json(
        { success: false, message: "Subject must be between 1 and 150 characters." },
        { status: 400 }
      );
    }

    if (message.length < 10 || message.length > 3000) {
      return Response.json(
        { success: false, message: "Message must be between 10 and 3000 characters." },
        { status: 400 }
      );
    }

    // SMTP configuration
    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
    const smtpPort = parseInt(process.env.SMTP_PORT || "465", 10);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const contactTo = process.env.CONTACT_TO_EMAIL;

    if (!smtpUser || !smtpPass || !contactTo) {
      console.error(
        "Contact form SMTP configuration missing. Required: SMTP_USER, SMTP_PASS, CONTACT_TO_EMAIL"
      );
      return Response.json(
        { success: false, message: "Contact form is not configured." },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const plainText = `New Portfolio Contact Message
--------------------------------
Name: ${name}
Email: ${email}
Subject: ${subject}
Date: ${new Date().toISOString()}

Message:
${message}
`;

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Portfolio Message</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; padding: 24px; color: #1e293b;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
    <div style="background: #2D8CFF; padding: 20px 24px; color: #ffffff;">
      <h2 style="margin: 0; font-size: 20px; font-weight: 700;">New Portfolio Message</h2>
      <p style="margin: 4px 0 0; font-size: 14px; opacity: 0.9;">From your website contact form</p>
    </div>
    <div style="padding: 24px;">
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr>
          <td style="padding: 8px 0; font-size: 13px; font-weight: 600; color: #64748b; width: 80px;">Name:</td>
          <td style="padding: 8px 0; font-size: 15px; font-weight: 600; color: #0f172a;">${escapeHtml(name)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-size: 13px; font-weight: 600; color: #64748b;">Email:</td>
          <td style="padding: 8px 0; font-size: 15px; color: #0f172a;"><a href="mailto:${escapeHtml(email)}" style="color: #2D8CFF; text-decoration: none;">${escapeHtml(email)}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-size: 13px; font-weight: 600; color: #64748b;">Subject:</td>
          <td style="padding: 8px 0; font-size: 15px; color: #0f172a;">${escapeHtml(subject)}</td>
        </tr>
      </table>
      <div style="border-top: 1px solid #e2e8f0; padding-top: 16px;">
        <p style="margin: 0 0 8px; font-size: 13px; font-weight: 600; color: #64748b;">Message:</p>
        <div style="background: #f1f5f9; padding: 16px; border-radius: 12px; font-size: 14px; line-height: 1.6; color: #334155; white-space: pre-wrap;">${escapeHtml(message)}</div>
      </div>
    </div>
  </div>
</body>
</html>
`;

    await transporter.sendMail({
      from: `"Portfolio Contact" <${smtpUser}>`,
      to: contactTo,
      replyTo: email,
      subject: `New Portfolio Message: ${subject}`,
      text: plainText,
      html: htmlContent,
    });

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Nodemailer send error:", error?.message || error);
    return Response.json(
      { success: false, message: "Failed to send message. Please try again later." },
      { status: 500 }
    );
  }
}

