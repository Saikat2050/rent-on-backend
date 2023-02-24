const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const mongoosePaginate = require('mongoose-paginate-v2');

const Schema = mongoose.Schema;

const aggrementSchema = new Schema(
    {
        itemId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Items'
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
        purchaseAt: { type: Date, required: true, default: Date.now },
        itemReturnedDate: { type: Date },
        rentFrequency: { type: String, enum: ['daily', 'weekly', 'monthly', 'quarterly', 'half-yearly', 'yearly'], required: true },
        rentAmount: { type: Number, required: true },
        isDeleted: {type: Boolean, default: false}
    },  
    { timestamps: true }
);
aggrementSchema.plugin(uniqueValidator);
aggrementSchema.plugin(mongoosePaginate);

const Aggrement = mongoose.model("Aggrement", aggrementSchema);
module.exports = Aggrement;