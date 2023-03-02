const moment = require('moment')
const message = require('../util/message.json')
const Items = require('../models/itemsModel')
const Defaulter = require('../models/defaulterModel')
const Aggrement = require('../models/aggrementModel')
const Payment = require('../models/paymentModel')
const Paystr = require('../models/paymentStructureModel')

class transactionController {
    constructor() {
        this.itemBuy = this.itemBuy.bind(this)
    }

    async itemBuy(req, res) {
        try {
            let { itemId, from, to } = req.body

            from = from ? moment(from).format() : moment().format()
            to = moment(to).format()

            let nextRentOn = null
            let value = null
            let unit = null
            const paystructure = []

            const iFDefaulter = await Defaulter.findOne({
                userId: req.user._id,
                isDeleted: false
            })
            if (iFDefaulter)
                return res.status(400).json({ Status: "Error", Message: message.DEFAULTER })

            const itemData = await Items.findOne({
                _id: req.body.itemId,
                isDeleted: false
            })
            if (!itemData)
                return res.status(400).json({ Status: "Error", Message: message.DATAMISSING })

            switch(itemData.rentFrequency){
                case 'daily':
                    value = 1
                    unit = 'days'
                    break;
                case 'weekly':
                    value = 7
                    unit = 'days'
                    break;
                case 'monthly':
                    value = 1
                    unit = 'months'
                    break;
                case 'quarterly':
                    value = 3
                    unit = 'months'
                    break;
                case 'half-yearly':
                    value = 6
                    unit = 'months'
                    break;
                default:
                    value = 1
                    unit = 'years'
                    break;
            }
            let nextDate = from
            for(let i = 0; ; i++) {
                nextDate = moment(nextDate).add(value, unit).format()
                if(nextDate >= to)
                    break;
                
                paystructure.push({
                    itemId: itemData._id,
                    userId: itemData.userId,
                    paymentDates: nextDate
                })
            }
            //payment struncture
            const paystr = await Paystr.insertMany(paystructure)
            
            const newAggrement = await Aggrement.insertMany([{
                itemId: itemData._id,
                to: req.user._id,
                from: itemData.userId,
                purchaseAt: moment().format(),
                rentFrequency: itemData.rentFrequency,
                lastRentPaid: moment().format(),
                nextRentOn: paystructure[0].paymentDates, 
                rentAmount: itemData.price
            }])

            const itemUpdate = await Items.findOneAndUpdate(
                {
                    _id: itemData._id,
                    isDeleted: false
                },
                { $set: {
                    sold: true
                }
            })
        
            return res.status(200).json({ Status: "Success", Message: message.ITEMSOLD })
        }
        catch (err) {
            console.log("Some Error Occurred: ", err.message)
            return res.status(400).json({ Status: "Error", Message: err.message })
        }
    }
}

module.exports = new transactionController()