const User = require('../models/userModel')
const message = require('../util/message.json')

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
                roleId: userData.roleId }
            })
        }
        catch(err) {
            console.log("Some Error Occurred: ", err.message)
            return res.status(400).json({Status: "Error", Message: err.message})
        }
    }

    async updateProfile (req, res) {
        try{
            const userData = await User.findById(req.user._id)
            if(!userData || userData.isDeleted == true)
                return res.status(400).json({Status: "Error", Message: message.USERNOTEXISTS})

            if(req.body?.email)
                req.body.isVerified = false

            if(req.body?.password)
                req.body.password = await bcrypt.hash(req.body.password, parseInt(process.env.SALTROUND))

            await User.findByIdAndUpdate(
                userData._id,
                { $set: req.body }
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
                req.user._id,
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