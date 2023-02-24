const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const paymentSchema = new Schema(
    {
        transactionId: {
            type: String,
            required: true
        },
        from: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        to: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        itemId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Items'
        },
        amount: { type: Number },
        status: { type: Boolean, required: true, default: false },
        remark: { type: String, required: true, default: 'Not Confirmed from Bank yet' },
        mode: {type: String, default: 'UPI'},
        isDeleted: {type: Boolean, default: false}
    },  
    { timestamps: true }
);
paymentSchema.plugin(uniqueValidator);

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;