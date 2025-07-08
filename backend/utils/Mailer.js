const fs = require('fs')
const nodemailer = require('nodemailer');
const path = require('path')
const hbs = require("nodemailer-express-handlebars")
const { GoogleOAuth2Client } = require('./GoogleAuth')
const handlebars = require("handlebars")
// const transport = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER, // your app's email
//     pass: process.env.EMAIL_PASS, // your app's app password
//   },
// });

// exports.sendMail = async (to, subject, text, replyTo) => {
//   await transporter.sendMail({
//     from: process.env.EMAIL_USER,
//     to,
//     subject,
//     text,
//     replyTo, // optional: set to inviter's email if you want
//   });
// };

async function sendMail(mailOptions) {
    try {
        const accessToken = await GoogleOAuth2Client.getAccessToken()
        console.log(accessToken)
        const transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: "marga18nins@gmail.com",
                clientId: process.env.GMAIL_API_CLIENT_ID,
                clientSecret: process.env.GMAIL_API_CLIENT_SECRET,
                refreshToken: process.env.GMAIL_API_REFRESH_TOKEN,
                accessToken: accessToken.token, 
            },
        })

        // const handlebarOptions = {
        //     viewEngine: {
        //         partialsDir: path.resolve(__dirname, "../views/"),
        //         defaultLayout: false,
        //     },
        //     viewPath: path.resolve(__dirname, "../views/"),
        // }

        // transport.use("compile", hbs(handlebarOptions))
        if (mailOptions.template) {
            const templatePath = path.resolve(__dirname, "../views/", `${mailOptions.template}.handlebars`)
            const templateSource = fs.readFileSync(templatePath, 'utf8')
            const template = handlebars.compile(templateSource)
            mailOptions.html = template(mailOptions.context || {})
        }

        const result = await transport.sendMail(mailOptions)
        return result
    } catch (error) {
        console.log(error)
        return error
    }
}
module.exports = {sendMail}