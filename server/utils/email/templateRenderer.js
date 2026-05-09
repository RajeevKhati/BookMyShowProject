const fs = require("fs");
const path = require("path");

/** Swap `#{key}` placeholders in HTML with values from `creds`. */
function replaceContent(content, creds) {
  Object.keys(creds).forEach(function (key) {
    const token = `#{${key}}`;
    content = content.split(token).join(String(creds[key] ?? ""));
  });
  return content;
}

/** Default subject when caller does not pass `mailMeta.subject`. */
function defaultSubject() {
  return "Mail from ScalerShows";
}

/**
 * Plain-text fallback for clients that want a non-HTML part (OTP vs ticket email).
 */
function inferPlainText(creds) {
  if (creds.otp != null && creds.name != null) {
    return `Hi ${creds.name} this your reset otp ${creds.otp}`;
  }
  if (creds.movie != null) {
    return `Hi ${creds.name || "there"}, ticket details for ${creds.movie}.`;
  }
  return `Hello ${creds.name || "there"}`;
}

/**
 * Read template from `utils/email_templates/`, merge creds, return envelope for any provider.
 */
async function buildMessageFromTemplate(
  templateName,
  receiverEmail,
  creds,
  mailMeta = {}
) {
  const templatePath = path.join(
    __dirname,
    "..",
    "email_templates",
    templateName
  );
  const raw = await fs.promises.readFile(templatePath, "utf-8");
  const html = replaceContent(raw, creds);
  const subject = mailMeta.subject ?? defaultSubject();
  const text = mailMeta.text ?? inferPlainText(creds);
  return { to: receiverEmail, subject, html, text };
}

module.exports = { buildMessageFromTemplate };
