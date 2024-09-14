const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const postRouter = require("./routes/post");
const commentRouter = require("./routes/comment");
const uploadRouter = require('./controllers/uploadController');


dotenv.config();

const app = express();
const PORT = 5000;

mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("MongoDB connected successfully"))
.catch(err => console.log("Failed to connect to MongoDB", err));

app.use("/images", express.static("public/images"));

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/post", postRouter);
app.use("/comment", commentRouter);
app.use('/upload', uploadRouter);



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
