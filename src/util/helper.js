const nodemailer = require("nodemailer");

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: process.env.SMTP,
    auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASS
    },
});

const sendMail = async (mailId, data) => {
    try {
        let info = await transporter.sendMail({
            from: `"Rent On Support" <${process.env.EMAIL_ID}>`, // sender address
            to: mailId, // list of receivers
            subject: "One Time Password", // Subject line
            text: `OTP for user ${mailId} is ${data.otp}`, // plain text body
            // html: "<b>Hello world?</b>"
        });

        return info.messageId;
    }
    catch (err) {
        console.log("Some Error Occurred", err)
        return err
    }
}

module.exports = {
    sendMail
}