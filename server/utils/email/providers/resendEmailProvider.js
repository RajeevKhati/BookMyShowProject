/**
 * Resend HTTP API (`resend` npm package).
 * API key comes from factory (`RESEND_API_KEY`).
 */
const { Resend } = require("resend");

class ResendEmailProvider {
  constructor(apiKey) {
    this.client = new Resend(apiKey);
  }

  async send({ from, to, subject, html, text }) {
    const payload = {
      from,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
    };
    if (text) payload.text = text;

    const result = await this.client.emails.send(payload);
    if (result.error) {
      const err = result.error;
      throw new Error(
        typeof err === "string" ? err : err.message || JSON.stringify(err)
      );
    }
    console.log("email sent (Resend)", result.data?.id ?? "");
  }
}

module.exports = ResendEmailProvider;
