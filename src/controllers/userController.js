const User = require('../models/userModel');
const message = require('../util/message.json');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const helper = require('../util/helper');
const saltRounds = process.env.SALTROUND;

class UserController {
    constructor() {
        this.signUp = this.signUp.bind(this)
        this.signIn = this.signIn.bind(this)
        this.sendOtp = this.sendOtp.bind(this)
        this.verifyOtp = this.verifyOtp.bind(this)
    }

    async signUp(req, res) {
        try {
            const emailExists = await User.findOne({
                email: req.body.email,
                isDeleted: false
            })
            if (emailExists)
                return res.status(400).json({ Status: "Error", Message: message.USEREXISTS })

            const { name, email, mobile, address, roleId } = req.body
            // create encrypted password
            const password = await bcrypt.hash(req.body.password, parseInt(saltRounds))
            const user = await User.insertMany([{
                name: name,
                email: email,
                password: password,
                mobile: parseInt(mobile),
                address: address,
                roleId: parseInt(roleId)
            }])

            return res.status(200).json({ Status: "Success", Message: message.USERCREATED, Data: user })
        }
        catch (err) {
            console.log("Some Error Occurred: ", err.message)
            return res.status(400).json({ Status: "Error", Message: err.message })
        }
    }

    async signIn(req, res) {
        try {
            const { email, password } = req.body

            const emailExists = await User.findOne({
                email: email,
                isDeleted: false
            })
            if (!emailExists)
                return res.status(400).json({ Status: "Error", Message: message.USERNOTEXISTS })

            if (!emailExists.isVerified)
                return res.status(400).json({ Status: "Error", Message: message.USERNOTVERIFIED })

            const checkPassword = await bcrypt.compare(password, emailExists.password)

            if (!checkPassword)
                return res.status(401).json({ Status: "Error", Message: message.MISMATCH })

            const token = jwt.sign({ _id: emailExists._id, email: emailExists.email, roleId: emailExists.roleId }, process.env.SECRET, { expiresIn: '1h' });

            return res.status(200).json({
                Status: "Success", Message: message.USERLOGGEDIN, Data: {
                    name: emailExists.name,
                    email: emailExists.email,
                    accessToken: token,
                    address: emailExists.address,
                    roleId: emailExists.roleId
                }
            })
        }
        catch (err) {
            console.log("Some Error Occurred: ", err.message)
            return res.status(400).json({ Status: "Error", Message: err.message })
        }
    }

    async sendOtp(req, res) {
        try {
            const { email } = req.body

            const emailExists = await User.findOne({
                email: email,
                isDeleted: false
            })
            if (!emailExists)
                return res.status(400).json({ Status: "Error", Message: message.USERNOTEXISTS })

            const otp = Math.floor((Math.random() * 9000) + 1000);

            const token = jwt.sign({ otp: otp }, process.env.SECRET, { expiresIn: 60 });

            await User.findByIdAndUpdate(
                emailExists._id,
                { $set: { verificationCode: token } }
            )

            const mailData = {
                subject: "One Time Password",
                body: `OTP for user ${email} is ${otp}`
            }
            const data = helper.sendMail(email, mailData)
            // const data = otp

            return res.status(200).json({ Status: "Success", Message: message.MAILSENT })
        }
        catch (err) {
            console.log("Some Error Occurred: ", err.message)
            return res.status(400).json({ Status: "Error", Message: err.message })
        }
    }

    async verifyOtp(req, res) {
        try {
            const { email, otp } = req.body
            const emailExists = await User.findOne({
                email: email,
                isDeleted: false
            })
            if (!emailExists)
                return res.status(400).json({ Status: "Error", Message: message.USERNOTEXISTS })

            const decoded = await jwt.verify(emailExists.verificationCode, process.env.SECRET)
            if (!decoded)
                return res.status(401).json({ Status: "Error", Message: message.OTPMISMATCH })

            if (parseInt(decoded.otp) !== parseInt(otp))
                return res.status(401).json({ Status: "Error", Message: message.OTPMISMATCH })

            await User.findByIdAndUpdate(
                emailExists._id,
                { $set: { isVerified: true } }
            )

            return res.status(200).json({ Status: "Success", Message: message.OTPVERIFIED })
        }
        catch (err) {
            console.log("Some Error Occurred: ", err.message)
            return res.status(400).json({ Status: "Error", Message: (err.message === 'jwt expired') ? message.OTPEXPIRED : err.message })
        }
    }
}

module.exports = new UserController()