const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // your app's email
    pass: process.env.EMAIL_PASS, // your app's app password
  },
});

exports.sendMail = async (to, subject, text, replyTo) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
    replyTo, // optional: set to inviter's email if you want
  });
};