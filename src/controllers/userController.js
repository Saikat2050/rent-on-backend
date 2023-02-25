const User = require('../models/userModel');
const message = require('../util/message.json');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const helper = require('../util/helper')
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

            // create encrypted password
            req.body.password = await bcrypt.hash(req.body.password, parseInt(saltRounds))
            const user = await User.insertMany([req.body])

            return res.status(200).json({ Status: "Success", Message: message.USERCREATED, Data: user })
        }
        catch (err) {
            console.log("Some Error Occurred: ", err.message)
            return res.status(400).json({ Status: "Error", Message: err.message })
        }
    }

    async signIn(req, res) {
        try {
            const emailExists = await User.findOne({
                email: req.body.email,
                isDeleted: false
            })
            if (!emailExists)
                return res.status(400).json({ Status: "Error", Message: message.USERNOTEXISTS })

            if (!emailExists.isVerified)
                return res.status(400).json({ Status: "Error", Message: message.USERNOTVERIFIED })

            const checkPassword = await bcrypt.compare(req.body.password, emailExists.password)

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
            const emailExists = await User.findOne({
                email: req.body.email,
                isDeleted: false
            })
            if (!emailExists)
                return res.status(400).json({ Status: "Error", Message: message.USERNOTEXISTS })

            const otp = Math.floor((Math.random() * 9000) + 1000);

            const token = jwt.sign({ otp: otp }, process.env.SECRET, { expiresIn: 600 });

            await User.findOneAndUpdate(
                { email: req.body.email, isDeleted: false },
                { $set: { verificationCode: token } }
            )

            const data = await helper.sendMail(req.body.email, {otp: otp})
            // const data = otp

            return res.status(200).json({ Status: "Success", Message: message.MAILSENT, data: data })
        }
        catch (err) {
            console.log("Some Error Occurred: ", err.message)
            return res.status(400).json({ Status: "Error", Message: err.message })
        }
    }

    async verifyOtp(req, res) {
        try {
            const emailExists = await User.findOne({
                email: req.body.email,
                isDeleted: false
            })
            if (!emailExists)
                return res.status(400).json({ Status: "Error", Message: message.USERNOTEXISTS })

            const decoded = await jwt.verify(emailExists.verificationCode, process.env.SECRET)
            if (!decoded)
                return res.status(401).json({ Status: "Error", Message: message.OTPMISMATCH })

            if (parseInt(decoded.otp) !== parseInt(req.body.otp))
                return res.status(401).json({ Status: "Error", Message: message.OTPMISMATCH })

            await User.findOneAndUpdate(
                { email: req.body.email, isDeleted: false },
                { $set: { isVerified: true } }
            )

            return res.status(200).json({ Status: "Success", Message: message.OTPVERIFIED })
        }
        catch (err) {
            console.log("Some Error Occurred: ", err.message)
            return res.status(400).json({ Status: "Error", Message: err.message })
        }
    }
}

module.exports = new UserController()