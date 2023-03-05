const Defaulter = require('../models/defaulterModel')
const Aggrement = require('../models/aggrementModel')
const Review = require('../models/reviewModel')
const message = require('../util/message.json')
const Items = require('../models/itemsModel')

class reviewController {
constructor () {
    this.giveReview = this.giveReview.bind(this)
}

    async giveReview(req, res) {
        try {
            const { review, rating } = req.body

            const iFDefaulter = await Defaulter.findOne({
                userId: req.user._id,
                isDeleted: false
            })
            if (iFDefaulter)
                return res.status(400).json({ Status: "Error", Message: message.DEFAULTER })

            const itemExist = await Aggrement.findOne({
                to: req.user._id,
                isDeleted: false
            })
            if (!itemExist)
                return res.status(400).json({ Status: "Error", Message: message.DATAMISSING })

            const reviewExists = await Review.findOne({
                itemId: itemExist.itemId,
                isDeleted: false
            })
            let result
            let itemRatingValue
            if (!reviewExists) {
                result = await Review.insertMany([{
                    itemId: itemExist.itemId,
                    totalRating: parseInt(rating ?? 0),
                    ratingCount: rating ? 1 : 0,
                    reviews: review ? [review] : null 
                }])

                if (rating) {
                    itemRatingValue = (parseInt(rating))*10
                    const ItemRating = await Items.findOneAndUpdate({
                        _id: itemExist.itemId,
                        isDeleted: false
                    },{
                        $set: {
                            rating: itemRatingValue
                        }
                    })
                }

                return res.status(200).json({ Status: "Success", Message: message.REVIEW, Data: result })
            }
        
            let ratingCount = parseInt(reviewExists.ratingCount)
            rating = parseInt(rating ?? 0) + parseInt(reviewExists.totalRating)
            if (rating)
                ratingCount++

            let reviews = reviewExists.reviews 
            if (review)
                reviews.push(review)

            result = await Review.findByIdAndUpdate(
                reviewExists._id,
                {
                    $set: {
                        totalRating: parseInt(rating),
                        ratingCount: ratingCount,
                        reviews: reviews
                    }
                }
            )

            if (rating) {
                itemRatingValue = (parseInt(rating)/parseInt(ratingCount))*10
                const ItemRating = await Items.findOneAndUpdate({
                    _id: itemExist.itemId,
                    isDeleted: false
                },{
                    $set: {
                        rating: itemRatingValue
                    }
                })
            }

            return res.status(200).json({ Status: "Success", Message: message.REVIEW, Data: result })
        }
        catch (err) {
            console.log("Some Error Occurred: ", err.message)
            return res.status(400).json({ Status: "Error", Message: err.message })
        }
    }
}

module.exports = new reviewController()