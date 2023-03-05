const User = require('../models/userModel')
const message = require('../util/message.json')
const bcrypt = require('bcrypt');

class profileController {
    constructor() {
        this.getProfile = this.getProfile.bind(this)
        this.updateProfile = this.updateProfile.bind(this)
        this.deleteProfile = this.deleteProfile.bind(this)
    }

    async getProfile (req, res) {
        try{
            const userData = await User.findById(req.user._id)
            if(!userData || userData.isDeleted == true)
                return res.status(400).json({Status: "Error", Message: message.USERNOTEXISTS})

            return res.status(200).json({Status: "Success", Data: { name: userData.name,
                email: userData.email,
                mobile: userData.mobile,
                address: userData.address,
                roleId: userData.roleId,
                gender: userData.gender,
                age: userData.age }
            })
        }
        catch(err) {
            console.log("Some Error Occurred: ", err.message)
            return res.status(400).json({Status: "Error", Message: err.message})
        }
    }

    async updateProfile (req, res) {
        try{
            const { email, name, mobile, gender, age, address, roleId } = req.body
            let password = req.body.password
            let isVerified = true

            const userData = await User.findById(req.user._id)
            if(!userData || userData.isDeleted == true)
                return res.status(400).json({Status: "Error", Message: message.USERNOTEXISTS})

            if(roleId) {
                if(parseInt(roleId) === 1)
                    return res.status(401).json({ Status: "Error", Message: message.ADMINFORBIDDEN })

                if(parseInt(roleId) !== 2 && parseInt(roleId) !== 3 && parseInt(roleId) !== 4)
                    return res.status(401).json({ Status: "Error", Message: message.ROLENOTFOUND })
            }

            if(email || password || roleId)
                isVerified = false

            if(password)
                password = await bcrypt.hash(req.body.password, parseInt(process.env.SALTROUND))

            const dataUpdated = {
                email: email ?? userData.email,
                password: password ?? userData.password,
                name: name ?? userData.name,
                mobile: (mobile || userData.mobile) ? parseInt(mobile ?? userData.mobile): null,
                address: address ?? userData.address,
                roleId: parseInt(roleId ?? userData.roleId),
                isVerified: isVerified
            }

            await User.findByIdAndUpdate(
                userData._id,
                { $set: dataUpdated }
            )

            return res.status(200).json({Status: "Success", Message: message.USERUPDATED })
        }
        catch(err) {
            console.log("Some Error Occurred: ", err.message)
            return res.status(400).json({Status: "Error", Message: err.message})
        }
    }

    async deleteProfile (req, res) {
        try{
            const userData = await User.findById(req.user._id)
            if(!userData || userData.isDeleted == true)
                return res.status(400).json({Status: "Error", Message: message.USERNOTEXISTS})

            await User.findByIdAndUpdate(
                userData._id,
                { $set: { isDeleted: true } }
            ) 

            return res.status(200).json({Status: "Success", Message: message.USERDELETED})
        }
        catch(err) {
            console.log("Some Error Occurred: ", err.message)
            return res.status(400).json({Status: "Error", Message: err.message})
        }
    } 
}

module.exports = new profileController()