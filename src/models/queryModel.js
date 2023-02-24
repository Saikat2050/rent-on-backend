const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const mongoosePaginate = require('mongoose-paginate-v2');

const Schema = mongoose.Schema;

const querySchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        subject: { type: String, required: true },
        description: { type: String, required: true },
        status: { type: Boolean, required: true, default: false },
        remark: { type: String, required: true, default: 'pending' },
        isDeleted: {type: Boolean, default: false}
    },  
    { timestamps: true }
);
querySchema.plugin(uniqueValidator);
querySchema.plugin(mongoosePaginate);

const Query = mongoose.model("Query", querySchema);
module.exports = Query;