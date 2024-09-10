const User = require("../models/User.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const register = async(req, res) => {
    try {
        const isEmpty = Object.values(req.body).some((v) => !v)

        if(isEmpty){
            throw new Error("Fill all fields!")
        }

        const isExisting = await User.findOne({username: req.body.username});
        if(isExisting){
            throw new Error("Username has already been used")
        }

        const hashedPassword = await bcrypt.hash(req.body.password,10);
        const newUser = await User.create({
            username: req.body.username, 
            email: req.body.email, 
            password: hashedPassword
        });

        const payload = {id: newUser._id, username: newUser.username}
        const token = jwt.sign(payload, process.env.JWT_SECRET);

        const {password, ...others} = newUser._doc

        return res.status(201).json({token, others})
    } catch (error) {
        return res.status(500).json(error.message)
    }
    
}

const login = async(req, res) => {
    try {
        const isEmpty = Object.values(req.body).some((v) => v === "");
        if(isEmpty){
            throw new Error("Fill all fields!")
        }

        const user = await User.findOne({
            $or: [
                {username: req.body.username},
                {email: req.body.email}
            ]
        });
        
        if(!user){
            throw new Error("Wrong credentials")
        }
        const comparePass = await bcrypt.compare(req.body.password, user.password);
        if(!comparePass){
            throw new Error("Wrong credentials")
        }

        const payload = {id: user._id, username: user.username}
        const {password, ...others} = user._doc
        const token = jwt.sign(payload, process.env.JWT_SECRET)

        return res.status(200).json({ token, others });
    } catch (error) {
        return res.status(500).json(error.message)
    }
}

module.exports = { register, login };
