const nodeMailer = require("nodemailer");

const sendEmail = async (options) => {
  const transpoter = nodeMailer.createTransport({
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });
  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  await transpoter.sendMail(mailOptions);
};
module.exports = nodeMailer;
