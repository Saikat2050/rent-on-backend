const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const reviewSchema = new Schema(
    {
        itemId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Items'
        },
        totalRating: { type: Number },
        ratingCount: { type: Number },
        reviews: { type: Array },
        isDeleted: {type: Boolean, default: false}
    },  
    { timestamps: true }
);
reviewSchema.plugin(uniqueValidator);

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;