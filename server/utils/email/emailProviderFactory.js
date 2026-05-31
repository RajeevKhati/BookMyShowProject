/**
 * Factory + singleton: picks implementation (Strategy) once per process.
 *
 * Selection order:
 *   1. EMAIL_PROVIDER=gmail | resend | sendgrid | smtp (explicit)
 *   2. If unset: RESEND_API_KEY → Resend
 *   3. Else: SENDGRID_API_KEY → SendGrid + Nodemailer
 *   4. Else: GMAIL_USER + GMAIL_APP_PASSWORD → Gmail + Nodemailer
 */
const SendGridNodemailerProvider = require("./providers/sendGridNodemailerProvider");
const ResendEmailProvider = require("./providers/resendEmailProvider");
const GmailNodemailerProvider = require("./providers/gmailNodemailerProvider");

function resolveProviderType() {
  const explicit = (process.env.EMAIL_PROVIDER || "").toLowerCase().trim();
  if (explicit === "gmail") return "gmail";
  if (explicit === "sendgrid" || explicit === "smtp") return "sendgrid";
  if (explicit === "resend") return "resend";
  if (process.env.RESEND_API_KEY) return "resend";
  if (process.env.SENDGRID_API_KEY) return "sendgrid";
  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) return "gmail";
  return null;
}

let singleton = null;

function getEmailProvider() {
  if (singleton) return singleton;

  const type = resolveProviderType();

  if (type === "resend") {
    const key = process.env.RESEND_API_KEY;
    if (!key) {
      throw new Error(
        "RESEND_API_KEY is required when EMAIL_PROVIDER=resend or Resend is auto-selected."
      );
    }
    singleton = new ResendEmailProvider(key);
    return singleton;
  }

  if (type === "sendgrid") {
    if (!process.env.SENDGRID_API_KEY) {
      throw new Error(
        "SENDGRID_API_KEY is required when EMAIL_PROVIDER=sendgrid or SendGrid is auto-selected."
      );
    }
    singleton = new SendGridNodemailerProvider();
    return singleton;
  }

  if (type === "gmail") {
    singleton = new GmailNodemailerProvider();
    return singleton;
  }

  throw new Error(
    "No email provider configured. Set RESEND_API_KEY, SENDGRID_API_KEY, or GMAIL_USER + GMAIL_APP_PASSWORD, or EMAIL_PROVIDER=gmail|resend|sendgrid."
  );
}

/** Clear cached provider (e.g. tests or env hot-reload). */
function resetEmailProviderCache() {
  singleton = null;
}

module.exports = { getEmailProvider, resolveProviderType, resetEmailProviderCache };
