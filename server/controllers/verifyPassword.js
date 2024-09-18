const UserModel = require("../models/UserModel");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function verifyEmail(req, res) {
    try {
        const { password, userId } = req.body;

        const user = await UserModel.findOne({ _id: userId });
        
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                error: true
            });
        }

        const verifyPassword = await bcryptjs.compare(password, user.password);

        
        if (!verifyPassword) {
            return res.status(400).json({
                message: "Wrong credentials",
                error: true
            });
        };

        
        const tokenData = {
            id: user._id,
            email: user.email
        };

        const token = await jwt.sign(tokenData, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });

        const cookieOptions = {
            httpOnly: true, 
            secure: true 
        };

        // const cookieOptions = {
        //     httpOnly: true, 
        //     secure: process.env.NODE_ENV === 'production' 
        // };

        return res.cookie("token", token, cookieOptions).status(200).json({
            message: "User successfully logged in", 
            token: token, 
            success: true
        });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports = verifyEmail;
