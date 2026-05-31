/**
 * Gmail transport via Nodemailer (SMTP).
 * Expects GMAIL_USER + GMAIL_APP_PASSWORD; factory validates before constructing.
 *
 * Use a Google App Password (not your account password):
 * https://myaccount.google.com/apppasswords
 */
const nodemailer = require("nodemailer");

class GmailNodemailerProvider {
  constructor() {
    const user = process.env.GMAIL_USER;
    const pass = (process.env.GMAIL_APP_PASSWORD || "").replace(/\s/g, "");

    if (!user || !pass) {
      throw new Error(
        "GMAIL_USER and GMAIL_APP_PASSWORD are required when EMAIL_PROVIDER=gmail."
      );
    }

    this.defaultFrom = user;
    this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: { user, pass },
    });
  }

  async send({ from, to, subject, html, text }) {
    await this.transporter.sendMail({
      from: from || `"CineVault" <${this.defaultFrom}>`,
      to,
      subject,
      html,
      text,
    });
    console.log("email sent (Gmail SMTP)");
  }
}

module.exports = GmailNodemailerProvider;
