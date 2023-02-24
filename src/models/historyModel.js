const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const historySchema = new Schema(
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
        lastRentPaid: { type: Date, required: true },
        nextRentOn: { type: Date, required: true, default: Date.now },
        itemReturned: { type: Boolean, required: true, default: false },
        isOverTimed: {
            type: Boolean,
            required: true,
            default: false
        },
        reason: { type: String },
        isDeleted: {type: Boolean, default: false}
    },  
    { timestamps: true }
);
historySchema.plugin(uniqueValidator);

const History = mongoose.model("History", historySchema);
module.exports = History;