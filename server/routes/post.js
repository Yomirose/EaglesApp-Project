// const { verify } = require("jsonwebtoken");
const {getPost, getUserPost, createPost, 
    updatePost, deletePost, getTimelinePosts,
likePost, dislikePost} = require("../controllers/postController");
const verifyToken = require("../middlewares/auth")

const postRouter = require("express").Router();

postRouter.get("/find/:id", getPost);
postRouter.get("/find/userposts/:id", getUserPost);
postRouter.get("/timelinePost", getTimelinePosts);

postRouter.post("/", verifyToken, createPost);

postRouter.put("/updatePost/:id", verifyToken, updatePost);
postRouter.put("/likePost/:postId", verifyToken, likePost);
postRouter.put("/dislikePost/:postId", verifyToken, dislikePost);

postRouter.delete("/deletePost/:id", verifyToken, deletePost);

module.exports = postRouter;