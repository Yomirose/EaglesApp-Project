const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "provide email"],
        unique: true,
    },
    email: {
        type: String,
        required: [true, "provide email"],
        unique: true,  
    },
    password: {
        type: String,
        required: [true, 'provide password'],
    },
    profile_pic: {
        type: String,
        default: ""
    }

}, {timestamps: true});

module.exports = mongoose.model("User", UserSchema);