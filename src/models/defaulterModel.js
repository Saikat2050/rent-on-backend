const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const defaulterSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        roleId: { type: Number, required: true },
        itemId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Items'
        },
        reason: { type: String, required: true },
        isDeleted: {type: Boolean, default: false}
    },  
    { timestamps: true }
);
defaulterSchema.plugin(uniqueValidator);

const Defaulter = mongoose.model("Defaulter", defaulterSchema);
module.exports = Defaulter;