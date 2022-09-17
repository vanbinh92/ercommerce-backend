const nodemailer = require("nodemailer");
require("dotenv").config();

async function sendMail(toEmail, emailSubject, isHtml, emailContent) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.FROM_MAIL,
      pass: process.env.FROM_PWD,
    },
  });
  if (isHtml) {
    // send mail with defined transport object
    await transporter.sendMail({
      from: process.env.FROM_MAIL, // sender address
      to: toEmail, // list of receivers
      subject: emailSubject, // Subject line
      html: emailContent, // plain text body
    });
  }else {
    // send mail with defined transport object
    await transporter.sendMail({
        from: process.env.FROM_MAIL, // sender address
        to: toEmail, // list of receivers
        subject: emailSubject, // Subject line
        text: emailContent, // plain text body
      });
  }
}

module.exports = sendMail;
