const sgMail = require("@sendgrid/mail");
const config = require("../config/config");
const Token = require("../models/token.model");
const crypto = require("crypto");

const verificationApi = `${config.serverUrl}:${config.port}/api/verify`;
function sendEmail(to, url) {
    sgMail.setApiKey(config.sgApiKey);
    const msg = {
        to,
        from: "vaibhavsisodiya2@gmail.com",
        subject: "<do-not-reply> email verificatin",
        text: `click on the link to verify email ${url}`
    };
    sgMail.send(msg);
}

function generateVerificationToken(email) {
    const key = crypto.randomBytes(20).toString("hex");
    Token.findOneAndUpdate(
        { email },
        { email, key },
        { upsert: true },
        (err, token) => {
            if (err) return false;
            sendEmail(email, `${verificationApi}/${email}/${key}`);
            return true;
        }
    );
}
module.exports = { sendEmail, generateVerificationToken };
