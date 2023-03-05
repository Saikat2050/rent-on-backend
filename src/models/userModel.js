const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        mobile: { type: Number },
        password: { type: String, required: true },
        address: { type: String, required: true },
        gender: { type: String, enum: ['male', 'female', 'others'] },
        age: { type: Number },
        roleId: { type: Number, required: true },
        rating: { type: Number, default: 10 },
        verificationCode: { type: String },
        isVerified: {type: Boolean, default: false},
        isDeleted: {type: Boolean, default: false}
    },  
    { timestamps: true }
);
userSchema.plugin(uniqueValidator);

const User = mongoose.model("User", userSchema);
module.exports = User;