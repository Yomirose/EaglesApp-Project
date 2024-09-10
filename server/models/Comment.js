const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    postId: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    likes: {
        type: [String],
        default: [],
    }  
}, {timestamps: true})
module.exports = mongoose.model("comment", CommentSchema)