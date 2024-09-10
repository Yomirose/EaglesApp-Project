const User = require("../models/User");
const Post = require("../models/Post");

const getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        return res.status(200).json(post)
    } catch (error) {
        return res.status(500).json(error.message)
    }
}

const getUserPost = async (req, res) => {
    try {
        const userPosts = await Post.find({ userId: req.params.id })
        return res.status(200).json(userPosts)
    } catch (error) {
        return res.status(500).json(error.message)
    }
}

const createPost = async (req, res) => {
    try {
        const isEmpty = Object.values(req.body).some(v => v === '')
        if (isEmpty) {
            throw new Error("Fill all field!")
        }

        const post = await Post.create({ ...req.body, userId: req.user.id })

        return res.status(201).json(post)
    } catch (error) {
        return res.status(500).json(error.message)
    }
}

const updatePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (post.userId === req.user.id) {
            const updatePost = await Post.findByIdAndUpdate(
                req.params.id,
                { $set: req.body },
                { new: true }
            )
            return res.status(200).json(updatePost);
        } else {
            throw new Error("You can update only your own posts");
        }
    } catch (error) {
        return res.status(500).json(error.message);
    }
};

const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            throw new Error("Post not found.");
        }

        if (post.userId === req.user.id) {
            await post.delete()
            return res.status(200).json({ msg: "Successfully deleted post" });
        } else {
            throw new Error("You can delete only your own posts");
        }
    } catch (error) {
        return res.status(500).json(error.message);
    }
};

const likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) {
            throw new Error("Post not found");
        }

        const likeByCurrentUser = post.likes.includes(req.user.id);
        if (likeByCurrentUser) {
            throw new Error("You can't like a post two times :D");
        } else {
            await Post.findByIdAndUpdate(
                req.params.postId,
                { $push: { likes: req.user.id } },
                { new: true }
            )
            return res.status(200).json({ msg: "Post has been successfully liked" });
        }
    } catch (error) {
        return res.status(500).json(error.message);
    }
};

const dislikePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) {
            throw new Error("No such post")
        }

        const likeByCurrentUser = post.likes.includes(req.user.id);
        if (likeByCurrentUser) {
            await Post.findByIdAndUpdate(
                req.params.postId,
                { $pull: { likes: req.user.id } },
                { new: true }
            )
            return res.status(200).json({ msg: "Successfully unliked the post" });
        } else {
            throw new Error("Can't unlike a post that you have not liked");
        }
    } catch (error) {
        return res.status(500).json(error.message);
    }
};

const getTimelinePosts = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.id)
        const userPosts = await Post.find({ userId: currentUser._id });
        const friendsPosts = await Promise.all(
            currentUser.followings.map((friendId) => {
                return Post.find({ userId: friendId });
            })
        )
        const allPosts = userPosts.concat(...friendsPosts).sort((a, b) => b.createdAt - a.createdAt);

        return res.status(200).json(allPosts);
    } catch (error) {
        return res.status(500).json(error.message);
    }
}
module.exports = {
    getPost, getUserPost, getTimelinePosts,
    createPost, updatePost, deletePost,
    likePost, dislikePost
};