/**
 * Factory + singleton: picks implementation (Strategy) once per process.
 *
 * Selection order:
 *   1. EMAIL_PROVIDER=resend | sendgrid (explicit)
 *   2. If unset: RESEND_API_KEY → Resend
 *   3. Else: SENDGRID_API_KEY → SendGrid + Nodemailer
 */
const SendGridNodemailerProvider = require("./providers/sendGridNodemailerProvider");
const ResendEmailProvider = require("./providers/resendEmailProvider");

function resolveProviderType() {
  const explicit = (process.env.EMAIL_PROVIDER || "").toLowerCase().trim();
  if (explicit === "sendgrid" || explicit === "smtp") return "sendgrid";
  if (explicit === "resend") return "resend";
  if (process.env.RESEND_API_KEY) return "resend";
  if (process.env.SENDGRID_API_KEY) return "sendgrid";
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

  throw new Error(
    "No email provider configured. Set RESEND_API_KEY or SENDGRID_API_KEY, or EMAIL_PROVIDER=resend|sendgrid."
  );
}

/** Clear cached provider (e.g. tests or env hot-reload). */
function resetEmailProviderCache() {
  singleton = null;
}

module.exports = { getEmailProvider, resolveProviderType, resetEmailProviderCache };
