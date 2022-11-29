import nodemailer from "nodemailer";

export async function sendEmail(to: string, subject: string, html: string) {
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    to,
    subject,
    html,
  };

  transporter.sendMail(mailOptions, (err, _) => {
    if (err) {
      console.log(err);
      return false;
    }
  });
  return true;
}
