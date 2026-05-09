/**
 * SendGrid transport via Nodemailer (SMTP).
 * Expects SENDGRID_API_KEY; factory validates before constructing this class.
 */
const nodemailer = require("nodemailer");

class SendGridNodemailerProvider {
  async send({ from, to, subject, html, text }) {
    const pass = process.env.SENDGRID_API_KEY;
    const transporter = nodemailer.createTransport({
      host: "smtp.sendgrid.net",
      port: 587,
      auth: { user: "apikey", pass },
    });
    await transporter.sendMail({ from, to, subject, html, text });
    console.log("email sent (SendGrid SMTP)");
  }
}

module.exports = SendGridNodemailerProvider;
