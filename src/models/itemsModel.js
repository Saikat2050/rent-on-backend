const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const mongoosePaginate = require('mongoose-paginate-v2');

const Schema = mongoose.Schema;

const itemsSchema = new Schema(
    {
        itemName: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        quantity: { type: Number, required: true, default: 1 },
        price: { type: Number, required: true, default: 100 },
        rentFrequency: { type: String, enum: ['daily', 'weekly', 'monthly', 'quarterly', 'half-yearly', 'yearly'], required: true },
        sold: { type: Boolean, required: true, default: false },
        rating: { type: Number, required: true, default: 30},
        isDeleted: {type: Boolean, default: false}
    },  
    { timestamps: true }
);
itemsSchema.plugin(uniqueValidator);
itemsSchema.plugin(mongoosePaginate);

const Items = mongoose.model("Items", itemsSchema);
module.exports = Items;