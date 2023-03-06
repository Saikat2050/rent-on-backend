const message = require('../util/message.json')
const Items = require('../models/itemsModel')
const Defaulter = require('../models/defaulterModel')
const Aggrement = require('../models/aggrementModel')

class itemController {
    constructor() {
        this.itemCreate = this.itemCreate.bind(this)
        this.itemList = this.itemList.bind(this)
        this.itemUpdate = this.itemUpdate.bind(this)
        this.itemDelete = this.itemDelete.bind(this)
        this.getHistory = this.getHistory.bind(this)
    }

    async itemCreate(req, res) {
        try {
            let { items } = req.body
            const fileName = req.file

            if (parseInt(req.user.roleId) !== 2 && parseInt(req.user.roleId) !== 4)
                return res.status(401).json({ Status: "Error", Message: message.SELLERROLE })

            const iFDefaulter = await Defaulter.findOne({
                userId: req.user._id,
                isDeleted: false
            })
            if (iFDefaulter)
                return res.status(400).json({ Status: "Error", Message: message.DEFAULTER })

            items.map(el => el.userId = req.user._id, el.image = fileName ?? null ) 
            // for (let item of req.body.items)
            // //     items.push({
            //         itemName: item.itemName,
            //         description: item.description ?? null,
            //         userId: req.user._id,
            //         quantity: item.quantity ?? 1,
            //         rentFrequency: item.rentFrequency,
            //         price: item.price
            //     })

            const result = await Items.insertMany(items)

            return res.status(200).json({ Status: "Success", Message: message.DATASUCCESS, Data: result })
        }
        catch (err) {
            console.log("Some Error Occurred: ", err.message)
            return res.status(400).json({ Status: "Error", Message: err.message })
        }
    }

    async itemList(req, res) {
        try {
            if (req.body.self) {
                req.body.filter.userId = req.user._id
            }
            let filter = { ...req.body.filter, isDeleted: false }
            const sort = req.body.sort ?? { createdAt: -1 }
            const pageSize = req.body.pageSize ?? 10
            const page = req.body.page ?? 1
            const options = {
                sort: sort,
                offset: pageSize * (page - 1),
                limit: pageSize,
            }

            if(!filter?.userId)
                filter = {...filter, $not: { userId: req.user._id }}
                
            if(filter?.itemName) {
                filter.itemName = new RegExp(filter.itemName, 'i') 
            }

            const iFDefaulter = await Defaulter.findById(req.user._id)
            if (iFDefaulter)
                return res.status(400).json({ Status: "Error", Message: message.DEFAULTER })
            
            const data = await Items.paginate(filter, options)
            const total = await Items.find(filter).count()

            return res.status(200).json({Status: "Success", Message: message.DATALIST, Total: total, Data: data.docs})
        }
        catch (err) {
            console.log("Some Error Occurred: ", err.message)
            return res.status(400).json({ Status: "Error", Message: err.message })
        }
    }

    async itemUpdate(req, res) {
        try {
            const { id, ...inputData } = req.body
            if (parseInt(req.user.roleId) !== 2 && parseInt(req.user.roleId) !== 4)
                return res.status(401).json({ Status: "Error", Message: message.SELLERROLE })

            const dataExist = await Items.findOne({ _id: id, userId: req.user._id })
            if (!dataExist || dataExist.isDeleted == true)
                return res.status(400).json({ Status: "Error", Message: message.DATAMISSING })

            const result = await Items.findByIdAndUpdate(
                dataExist._id,
                { $set: inputData }
            )

            return res.status(200).json({ Status: "Success", Message: message.DATAUPDATE, Data: result })
        }
        catch (err) {
            console.log("Some Error Occurred: ", err.message)
            return res.status(400).json({ Status: "Error", Message: err.message })
        }
    }

    async itemDelete(req, res) {
        try {
            if (parseInt(req.user.roleId) !== 2 && parseInt(req.user.roleId) !== 4)
                return res.status(401).json({ Status: "Error", Message: message.SELLERROLE })

            const dataExist = await Items.findOne({ _id: req.body.id, userId: req.user._id })
            if (!dataExist || dataExist.isDeleted == true)
                return res.status(400).json({ Status: "Error", Message: message.DATAMISSING })

            await Items.findByIdAndUpdate(
                dataExist._id,
                { $set: { isDeleted: true } }
            )
            return res.status(200).json({ Status: "Success", Message: message.DATADELETED })
        }
        catch (err) {
            console.log("Some Error Occurred: ", err.message)
            return res.status(400).json({ Status: "Error", Message: err.message })
        }
    }

    async getHistory(req, res) {
        try {
            const historyData = await Aggrement.paginate({
                $or: [
                    { from: req.user._id },
                    { to: req.user._id }
                ],
                isDeleted: false
            })

            return res.status(200).json({Status: "Success", Message: message.DATALIST, Data: historyData.docs})
        }
        catch (err) {
            console.log("Some Error Occurred: ", err.message)
            return res.status(400).json({ Status: "Error", Message: err.message })
        }
    }
}

module.exports = new itemController()