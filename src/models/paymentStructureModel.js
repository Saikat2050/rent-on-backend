const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const mongoosePaginate = require('mongoose-paginate-v2');

const Schema = mongoose.Schema;

const paystrSchema = new Schema(
    {
        aggrementId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Aggrement'
        },
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        paymentDates: { type: Date, required: true },
        isDeleted: {type: Boolean, default: false}
    },  
    { timestamps: true }
);
paystrSchema.plugin(uniqueValidator);
paystrSchema.plugin(mongoosePaginate);

const Paystr = mongoose.model("Paystr", paystrSchema);
module.exports = Paystr;