const UserModel = require("../models/UserModel");


async function verifyEmail(req, res) {
    try {
        const { email } = req.body;

        const verifyEmail = await UserModel.findOne({ email }).select("-password")

        if(!verifyEmail){
            return res.status(400).json({message: "User does not exit", error: true})
        }

        return res.status(200).json({
            message: "Email verify succefully", 
            success: true, 
            data: verifyEmail
        });

    } catch (error) {
        return res.status(500).json(error.message)
    }
}
module.exports = verifyEmail;