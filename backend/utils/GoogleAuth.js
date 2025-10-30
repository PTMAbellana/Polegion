// console.log('ajsdkad')
// console.log(process.env.GOOGLE_API_REFRESH_TOKEN)
const { google } = require("googleapis")

const GoogleOAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_API_CLIENT_ID,
    process.env.GOOGLE_API_CLIENT_SECRET,
    process.env.GOOGLE_API_REDIRECT_URI
)

GoogleOAuth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_API_REFRESH_TOKEN,
})
module.exports = {GoogleOAuth2Client}