/* eslint-disable object-shorthand */
/* eslint-disable require-jsdoc */

const nodemailer = require('nodemailer');
require('dotenv').config();

export default async function main(receiver, subject, text, context) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRETE
    }
  });

  const info = await transporter
    .sendMail({
      from: {
        name: 'Barefoot',
        address: process.env.FROM_EMAIL
      },
      to: receiver,
      subject: subject,
      text: text,
      html: context,
      auth: {
        user: process.env.FROM_EMAIL,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN,
        accessToken: process.env.GMAIL_ACCESS_TOKEN,
        expires: 1484314697598
      }
    })
    .catch((error) => {
      throw Error(error);
    });

  console.log('Message sent: %s', info.messageId);

  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

  return info;
}
