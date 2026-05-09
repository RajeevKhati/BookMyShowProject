/**
 * Public mail API — thin entry so callers keep using `require("../utils/emailHelper")`.
 *
 * Strategy-style providers live under `./email/` (Resend vs SendGrid SMTP).
 * Env:
 *   - RESEND_API_KEY / SENDGRID_API_KEY (auto-pick: Resend if RESEND is set)
 *   - EMAIL_PROVIDER=resend | sendgrid (optional override)
 *   - EMAIL_FROM — verified sender (especially for Resend)
 */
module.exports = require("./email/sendTemplatedEmail");
