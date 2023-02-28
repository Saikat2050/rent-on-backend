const nodemailer = require("nodemailer");
const transporter = require("./config")


const sendMail = async (mailId, data) => {
    try {
        
        const info = await transporter.sendMail({
            from: `"Rent On Support" <${process.env.EMAIL_ID}>`, // sender address
            to: mailId, // list of receivers
            subject: data.subject, // Subject line
            text: data.body, // plain text body
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