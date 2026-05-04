/**
 * Email Service — Sends transactional emails via Viktor Spaces API or Resend
 * 
 * F1: Confirmation emails for bookings & subscribers
 * F2: Newsletter delivery
 * 
 * Uses Convex actions (since we need to call external APIs)
 */
import { v } from "convex/values";
import { action, internalAction, mutation, query } from "./_generated/server";

declare const process: { env: Record<string, string | undefined> };

// ─── Internal email sender ───
async function sendEmailViaAPI(to: string, subject: string, html: string, text: string) {
  // Try Resend first (if RESEND_API_KEY is set)
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${resendKey}` },
      body: JSON.stringify({
        from: process.env.FROM_EMAIL || "3GMG <noreply@updates.3gmg.com>",
        to: [to],
        subject,
        html,
        text,
      }),
    });
    if (res.ok) return { success: true };
    const err = await res.text();
    throw new Error(`Resend error: ${err}`);
  }

  // Fallback: Viktor Spaces API
  const apiUrl = process.env.VIKTOR_SPACES_API_URL;
  const projectName = process.env.VIKTOR_SPACES_PROJECT_NAME;
  const projectSecret = process.env.VIKTOR_SPACES_PROJECT_SECRET;
  if (apiUrl && projectName && projectSecret) {
    const res = await fetch(`${apiUrl}/api/viktor-spaces/send-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        project_name: projectName,
        project_secret: projectSecret,
        to_email: to,
        subject,
        html_content: html,
        text_content: text,
        email_type: "transactional",
      }),
    });
    if (res.ok) return { success: true };
    const err = await res.text();
    throw new Error(`Viktor Spaces email error: ${err}`);
  }

  // No email provider configured — log and skip silently
  console.log(`[Email skipped — no provider configured] To: ${to}, Subject: ${subject}`);
  return { success: false, reason: "No email provider configured" };
}

// ─── Brand template ───
function brandedEmail(heading: string, body: string) {
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0; padding:0; background:#0a0a0a; font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:600px; margin:0 auto; padding:32px 24px;">
    <div style="text-align:center; margin-bottom:32px;">
      <h1 style="color:#D4A843; font-size:28px; letter-spacing:4px; margin:0;">3GMG</h1>
      <p style="color:#888078; font-size:11px; letter-spacing:3px; margin:4px 0 0;">MEADOWBROOK MONTRELL</p>
    </div>
    <div style="background:#141414; border:1px solid rgba(212,168,67,0.15); border-radius:8px; padding:32px;">
      <h2 style="color:#f0ece4; font-size:20px; margin:0 0 16px;">${heading}</h2>
      <div style="color:#c8c0b0; font-size:15px; line-height:1.6;">
        ${body}
      </div>
    </div>
    <div style="text-align:center; margin-top:24px; padding-top:24px; border-top:1px solid rgba(212,168,67,0.1);">
      <p style="color:#888078; font-size:11px; letter-spacing:2px;">
        3GMG Media &bull; Fort Worth, TX &bull; <a href="https://inquisitive-mandazi-d6afda.netlify.app" style="color:#D4A843;">Visit Website</a>
      </p>
      <p style="color:#555; font-size:10px; margin-top:8px;">The Hood's Paparazzi &bull; Make It Make Sense Podcast</p>
    </div>
  </div>
</body>
</html>`;
  return html;
}

// ─── F1: Booking Confirmation Email ───
export const sendBookingConfirmation = action({
  args: {
    guestName: v.string(),
    email: v.string(),
    topic: v.string(),
    preferredDate: v.string(),
  },
  handler: async (_ctx, args) => {
    const html = brandedEmail(
      "Booking Request Received 🎤",
      `<p>What's good <strong>${args.guestName}</strong>!</p>
       <p>Your booking request has been received. Here's what we got:</p>
       <div style="background:#0a0a0a; border-left:3px solid #D4A843; padding:16px; margin:16px 0; border-radius:0 4px 4px 0;">
         <p style="margin:0; color:#D4A843; font-size:13px; letter-spacing:1px;">TOPIC</p>
         <p style="margin:4px 0 12px; color:#f0ece4;">${args.topic}</p>
         <p style="margin:0; color:#D4A843; font-size:13px; letter-spacing:1px;">PREFERRED DATE</p>
         <p style="margin:4px 0 0; color:#f0ece4;">${args.preferredDate}</p>
       </div>
       <p>Montrell will review your request and reach out to confirm details. Stay tuned!</p>
       <p style="color:#888078; font-size:13px; margin-top:24px;">— 3GMG Team</p>`
    );
    const text = `Booking Request Received!\n\nHey ${args.guestName}! Your booking request for "${args.topic}" on ${args.preferredDate} has been received. Montrell will review and reach out soon.\n\n— 3GMG Team`;
    return await sendEmailViaAPI(args.email, "Booking Request Received — 3GMG", html, text);
  },
});

// ─── F1: Subscriber Welcome Email ───
export const sendSubscriberWelcome = action({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
  },
  handler: async (_ctx, args) => {
    const name = args.name || "fam";
    const html = brandedEmail(
      "Welcome to the 3GMG Family 🔥",
      `<p>What's good ${name}!</p>
       <p>You're officially plugged in. Here's what you can expect:</p>
       <ul style="color:#c8c0b0; padding-left:20px;">
         <li>🎙️ New episode alerts from <em>Make It Make Sense</em></li>
         <li>📸 Behind-the-scenes content from the streets of Fort Worth</li>
         <li>🔥 Exclusive drops, interviews, and merch announcements</li>
       </ul>
       <p style="margin-top:20px;">
         <a href="https://inquisitive-mandazi-d6afda.netlify.app/library" 
            style="display:inline-block; background:#D4A843; color:#0a0a0a; padding:12px 28px; text-decoration:none; font-weight:bold; border-radius:4px; letter-spacing:1px;">
           WATCH LATEST EPISODES
         </a>
       </p>
       <p style="color:#888078; font-size:13px; margin-top:24px;">— Meadowbrook Montrell 📍 Fort Worth, TX</p>`
    );
    const text = `Welcome to the 3GMG Family!\n\nHey ${name}! You're officially plugged in. Expect new episode alerts, behind-the-scenes content, and exclusive drops.\n\nWatch latest: https://inquisitive-mandazi-d6afda.netlify.app/library\n\n— Meadowbrook Montrell`;
    return await sendEmailViaAPI(args.email, "Welcome to 3GMG 🔥", html, text);
  },
});

// ─── F2: Newsletter Send ───
export const sendNewsletter = action({
  args: {
    subject: v.string(),
    heading: v.string(),
    body: v.string(),
    subscriberEmails: v.array(v.string()),
  },
  handler: async (_ctx, args) => {
    const html = brandedEmail(args.heading, args.body);
    const text = `${args.heading}\n\n${args.body.replace(/<[^>]*>/g, "")}\n\n— 3GMG Team`;
    
    let sent = 0;
    let failed = 0;
    for (const email of args.subscriberEmails) {
      try {
        await sendEmailViaAPI(email, args.subject, html, text);
        sent++;
      } catch (e) {
        failed++;
        console.error(`Failed to send to ${email}:`, e);
      }
      // Small delay to avoid rate limits
      if (sent % 10 === 0) await new Promise((r) => setTimeout(r, 500));
    }
    return { sent, failed, total: args.subscriberEmails.length };
  },
});

// ─── Get all subscriber emails (for newsletter send) ───
export const getSubscriberEmails = query({
  args: {},
  handler: async (ctx) => {
    const subs = await ctx.db.query("subscribers").collect();
    return subs.map((s: any) => s.email).filter(Boolean);
  },
});
