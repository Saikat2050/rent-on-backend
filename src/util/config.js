const nodemailer = require("nodemailer");
// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: process.env.SMTP,
    auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASS
    },
});

module.exports = transporter