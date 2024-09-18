const UserModel = require("../models/UserModel");
const bcryptjs = require("bcryptjs");

async function registerUser(req,res) {
    try {
        const { name, email, password, profile_pic } = req.body

        const verifyEmail = await UserModel.findOne({ email })
        
        if(verifyEmail){
            return res.status(400).json({ msg: "User already exist", error: true })
        }

        const salt = await bcryptjs.genSalt(10);
        const hashpassword = await bcryptjs.hash(password, salt);

        const payload = {
            name,
            email,
            password: hashpassword,
            profile_pic
        };


        const user = new UserModel(payload);
        const userSave = await user.save()

        return res.status(201).json({
            msg: "User successfully created", 
            data: userSave,
            success : true
        })

    } catch (error) {
        return res.status(500).json(error.message);
    }
}
module.exports = registerUser;