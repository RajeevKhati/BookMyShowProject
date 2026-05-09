const { buildMessageFromTemplate } = require("./templateRenderer");
const { getEmailProvider } = require("./emailProviderFactory");

/** Fallback From address (legacy); prefer `EMAIL_FROM` for production / Resend. */
const DEFAULT_FROM = "onboarding@resend.dev";

/**
 * Facade used everywhere as `emailHelper(...)`: build HTML/text/subject, pick provider, send.
 */
async function sendTemplatedEmail(templateName, receiverEmail, creds) {
  const envelope = await buildMessageFromTemplate(
    templateName,
    receiverEmail,
    creds,
  );
  const from = process.env.EMAIL_FROM || DEFAULT_FROM;
  const provider = getEmailProvider();
  await provider.send({
    ...envelope,
    from,
    to: "rajeevkhati53196@gmail.com" /** delete this line after testing */,
  });
}

module.exports = sendTemplatedEmail;
