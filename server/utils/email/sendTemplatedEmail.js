const { buildMessageFromTemplate } = require("./templateRenderer");
const { getEmailProvider } = require("./emailProviderFactory");

/** Fallback From when EMAIL_FROM is unset (Resend sandbox). */
const DEFAULT_FROM = "onboarding@resend.dev";

function resolveFromAddress() {
  if (process.env.EMAIL_FROM) return process.env.EMAIL_FROM;
  if (process.env.GMAIL_USER) {
    return `"CineVault" <${process.env.GMAIL_USER}>`;
  }
  return DEFAULT_FROM;
}

/**
 * Facade used everywhere as `emailHelper(...)`: build HTML/text/subject, pick provider, send.
 */
async function sendTemplatedEmail(templateName, receiverEmail, creds) {
  const envelope = await buildMessageFromTemplate(
    templateName,
    receiverEmail,
    creds,
  );
  const from = resolveFromAddress();
  const provider = getEmailProvider();
  await provider.send({
    ...envelope,
    from,
    to: receiverEmail,
  });
}

module.exports = sendTemplatedEmail;
