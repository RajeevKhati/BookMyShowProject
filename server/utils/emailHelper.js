/**
 * Public mail API — thin entry so callers keep using `require("../utils/emailHelper")`.
 *
 * Strategy-style providers live under `./email/` (Gmail, Resend, SendGrid SMTP).
 * Env:
 *   - EMAIL_PROVIDER=gmail | resend | sendgrid (optional override)
 *   - Gmail: GMAIL_USER, GMAIL_APP_PASSWORD
 *   - Resend: RESEND_API_KEY (auto-selected if set and provider unset)
 *   - SendGrid: SENDGRID_API_KEY
 *   - EMAIL_FROM — sender display (recommended for all providers)
 */
module.exports = require("./email/sendTemplatedEmail");
