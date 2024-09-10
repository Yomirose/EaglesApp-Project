const  Comment = require("../models/Comment");

const getCommentsFromPost = async(req, res) => {
    try {
        const comments = await Comment.find({postId: req.params.postId});

        return res.status(200).json(comments);
    } catch (error) {
        return res.status(500).json(error.messsage);
    }
};

const createComment = async(req, res) => {
    try {
        const createdComment = await Comment.create({...req.body, userId: req.user.id});

        return res.status(200).json(createdComment);
    } catch (error) {
        return res.status(500).json(error.messsage);
    }
};

const deleteComment = async(req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId);

        if(comment.userId === req.user.id){
            await comment.delete();
        } else {
            throw new Error("You can only delete your own comments");
        }
    } catch (error) {
        return res.status(500).json(error.messsage);
    }
};

const toggleLike = async(req, res) => {
    try {
        const currentUserId = req.user.id;
        const comment = await comment.findById(req.params.commentId);

        if(!comment.likes.includes(currentUserId)){
            comment.likes.push(currentUserId);
            await comment.save();

            return res.status(200).josn({msg: "You have successfully like the comment"});
        } else {
            comment.likes = comment.likes.filter((id) => id !== currentUserId);
            await comment.save();

            return res.status(200).json({msg: "You have successfully unliked the comment"})
        }
    } catch (error) {
        return res.status(500).json(error.messsage);
    }
};

module.exports = {
    getCommentsFromPost, createComment,
    deleteComment, toggleLike
}
