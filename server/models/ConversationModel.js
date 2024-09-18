const mongoose = require("mongoose")

const ConversationSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "User"
    },
    receiver: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "User"
    },
    message: [
        {
            type: mongoose.Schema.ObjectId,
            default: "Message"
        }
    ]
}, {timestamps: true})
module.exports = mongoose.model("Conversation", ConversationSchema)