const moment = require('moment')
const message = require('../util/message.json')
const Items = require('../models/itemsModel')
const Defaulter = require('../models/defaulterModel')
const Aggrement = require('../models/aggrementModel')
const Payment = require('../models/paymentModel')
const History = require('../models/historyModel')

class transactionController {
    constructor() {
        this.itemBuy = this.itemBuy.bind(this)
    }

    async itemBuy(req, res) {
        try {
            const iFDefaulter = await Defaulter.findById(req.user._id)
            if (iFDefaulter)
                return res.status(400).json({ Status: "Error", Message: message.DEFAULTER })

            const itemData = await Items.findById(req.body.itemId)
            
            await Aggrement.insertMany([{
                itemId: itemData._id,
                to: req.user._id,
                from: itemData.userId,
                purchaseAt: moment().format(),
                rentFrequency: itemData.rentFrequency,
                rentAmount: itemData.price
            }])

            await Items.findByIdAndUpdate(
                itemData._id,
                { $set: {
                    sold: true
                }
            })

            const nextRentDate = /* need to calculated */
            
            await History.insertMany([{
                itemId: itemData._id,
                to: req.user._id,
                from: itemData.userId,
                purchaseAt: moment().format(),
                lastRentPaid: moment().format(),
                nextRentOn: nextRentDate,

            }])
        }
        catch (err) {
            console.log("Some Error Occurred: ", err.message)
            return res.status(400).json({ Status: "Error", Message: err.message })
        }
    }
}

module.exports = new transactionController()