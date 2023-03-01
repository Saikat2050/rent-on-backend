const moment = require("moment")
const Paystr = require('../models/paymentStructureModel')
const User = require('../models/userModel')
const Defaulter = require('../models/defaulterModel')

const Cronjob = async() => {
try {
    console.log("Crom job called")
    const today = moment().format();

    //send mail to those who have payment due date today
    const PaymentArr = Paystr.find({
        paymentDates: {$lte: today},
        isDeleted: false
    })

    const mailData = {
        subject: "Payment Remainder",
        body: `Hi sir/mam,
Your Payment is due till today. Please clear your dues at earliest to enjoy our servies uninterruptedly
        
Best Regards
Team Rent On
`
}

    const date1 = moment().subtract(5, 'days').format()
    const date2 = moment().subtract(15, 'days').format()
    const date3 = moment().subtract(25, 'days').format()

    if (PaymentArr && PaymentArr.length) {
        for (let paymentData of PaymentArr) {
            const userData = await User.findById(paymentData.userId)
            const data = helper.sendMail(userData.email, mailData)

            //rating if payment is missed
            if (paymentData.paymentDates < date3) {
                await User.findByIdAndUpdate(
                    userData._id,
                    { $set: { rating: 4.4 } }
                )
            } else if (paymentData.paymentDates < date2) {
                await User.findByIdAndUpdate(
                    userData._id,
                    { $set: { rating: 6.6 } }
                )
            } else if (paymentData.paymentDates < date1) {
                await User.findByIdAndUpdate(
                    userData._id,
                    { $set: { rating: 8.3 } }
                )
            }

            //defaulter list
            const isDefaulter = await User.findById(userData._id)
            const alreadyDefaulter = await Defaulter.findOne({
                userId: userData._id
            })
            if (isDefaulter.rating < 6 && !alreadyDefaulter) {
                await Defaulter.insertMany([{
                    userId: userData._id,
                    roleId: isDefaulter.roleId,
                    aggrementId: paymentData.aggrementId,
                    reason: "Failed to payment multiple times"
                }])
            }
        }
    }
    console.log("Cron job end")
}
catch (err) {
    console.log("ERROR IN CRON", err.message)
}
}

module.exports = Cronjob