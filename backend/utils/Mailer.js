const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
const { GoogleOAuth2Client } = require('./GoogleAuth');
const handlebars = require('handlebars');

async function sendMail(mailOptions) {
    try {
        const accessToken = await GoogleOAuth2Client.getAccessToken()
        
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

module.exports = { sendMail };