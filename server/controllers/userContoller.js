const User = require("../models/User");
const bcrypt = require("bcrypt");

const getAll = async(req, res) => {
    try {
        const users = await User.find({}).select("-password");

        return res.status(200).json(users);
    } catch (error) {
       return res.status(500).json(error.massage) 
    }
};

const getUser  = async(req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if(!user){
            throw new Error("User does not exist")
        }
        
        const {password, ...others} = user._doc

        return res.status(200).json(others)
    } catch (error) {
        return res.status(500).json(error.massage); 
    }
};

const updateUser = async(req, res) => {
    if(req.params.id === req.user.id){
        try {
            if(req.body.password){
                const newHashedPassword = await bcrypt.hash(req.body.password, 10);
                req.body.password = newHashedPassword
            }

            const user = await User.findByIdAndUpdate(
                req.params.id,
                {$set: req.body},
                {new: true}
            )

            return res.status(200).json(user);

        } catch (error) {
            return res.status(500).json(error.massage); 
        }
    } else {
        return res.status(403).json({msg: "You can update only your own profile"});
    }
};

const deleteUser = async(req, res) => {
    if(req.params.id === req.user.id){
        try {
            const user = await User.findById(req.params.id);

            if(!user){
                throw new Error("User does not exist")
            }

            await User.findByIdAndDelete(req.params.id)
            return res.status(200).json({msg: "Successfully deleted the user"});
        } catch (error) {
            return res.status(500).json(error.massage); 
        }
    } else {
        return res.status(403).json({msg: "You can delete only your own profile"});
    }
};

const getUserFriends = async(req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if(!user){
            throw new Error("User does not exist")
        }

        const userfriends = await Promise.all(
            user.followings.map((friendId) => {
                return User.findById(friendId).select("-password")
            })
        )

        return res.status(200).json(userfriends)
    } catch (error) {
        return res.status(500).json(error.massage); 
    }
}

const followUser = async(req, res) => {
    if(req.params.id !== req.user.id){
        try {
            const friend = await User.findById(req.params.id)
            if(!friend){
                throw new Error("User with this id does not exist")
            }

            if(friend.followers.includes(req.user.id)){
                throw new Error("You can't follow the same user twice")
            }
            await User.findByIdAndUpdate(
                req.params.id,
                {$push: {followers: req.user.id}}
            )

            await User.findByIdAndUpdate(
                req.user.id,
                {$push: {followers: req.params.id}}
            )

            return res.status(200).json({msg: "You have successfully followed this user"});
        } catch (error) {
            return res.status(500).json(error.massage); 
    
        }
    } else {
        return res.status(500).json({msg: "You can't follow yourself!!!"})
    }
};

const unfollowUser = async(req, res) => {
    if (req.params.id !== req.user.id) {
        
        try {
            const friend = await User.findById(req.params.id)
            if(!friend){
                throw new Error("User does not exist")
            }

            if(!friend.followers.includes(req.user.id)){
                throw new Error("You can't unfollow a user that you do not follow")
            }

            await User.findByIdAndUpdate(
                req.params.id,
                {$pull: {followers: req.user.id}}
            )

            await User.findByIdAndUpdate(
                req.user.id,
                {$pull: {followings: req.params.id}}
            )

            return  res.status(200).json({msg: "User successfully unfollowed"})
        } catch (error) {
            return res.status(500).json(error.massage);  
        }

    } else {
        return res.status(500).json({msg: "You can't follow  or unfollow yourself!!!"})
    }
}
module.exports = {
    getAll, updateUser, unfollowUser,
    followUser, deleteUser, getUserFriends,
    getUser
}