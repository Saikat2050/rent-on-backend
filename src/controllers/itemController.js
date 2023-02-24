const message = require('../util/message.json')
const Items = require('../models/itemsModel')
const Defaulter = require('../models/defaulterModel')

class itemController {
    constructor() {
        this.itemCreate = this.itemCreate.bind(this)
        this.itemList = this.itemList.bind(this)
        this.itemUpdate = this.itemUpdate.bind(this)
        this.itemDelete = this.itemDelete.bind(this)
    }

    async itemCreate(req, res) {
        try {
            if (parseInt(req.user.roleId) !== 2 && parseInt(req.user.roleId) !== 4)
                return res.status(401).json({ Status: "Error", Message: message.SELLERROLE })

            const iFDefaulter = await Defaulter.findById(req.user._id)
            if (iFDefaulter)
                return res.status(400).json({ Status: "Error", Message: message.DEFAULTER })

            const items = []
            for (let item of req.body.items)
                items.push({
                    itemName: item.itemName,
                    description: item.description ?? null,
                    userId: req.user._id,
                    quantity: item.quantity ?? 1,
                    rentFrequency: item.rentFrequency,
                    price: item.price
                })

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
            const filter = req.body.filter
            const sort = req.body.sort ?? { createdAt: 1 }
            const pageSize = req.body.pageSize ?? 10
            const page = req.body.page ?? 1

            const iFDefaulter = await Defaulter.findById(req.user._id)
            if (iFDefaulter)
                return res.status(400).json({ Status: "Error", Message: message.DEFAULTER })
            
            const data = await Items.find(filter).skip(pageSize * page).limit(pageSize)
            const total = await Items.find(filter).count()

            return res.status(200).json({Status: "Success", Message: message.DATALIST, Total: total, Data: data})
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

            const dataExist = Items.findById(id)
            if (!dataExist || dataExist.isDeleted == true)
                return res.status(400).json({ Status: "Error", Message: message.DATAMISSING })

            await Items.findByIdAndUpdate(
                dataExist._id,
                { $set: inputData }
            )
            return res.status(200).json({ Status: "Success", Message: message.DATAUPDATE })
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

            const dataExist = Items.findById(req.body.id)
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
}

module.exports = new itemController()