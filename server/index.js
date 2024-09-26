const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const router = require("./routes/user");
const cookiesParser = require("cookie-parser");
const http = require("http"); 
const { Server } = require("socket.io"); 
const getUserDetailsFromToken = require("./helpers/getUserDetailsFromToken");
const UserModel = require("./models/UserModel");

dotenv.config();

const app = express();
const server = http.createServer(app); 

const PORT = 5000;


mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected successfully"))
    .catch(err => console.log("Failed to connect to MongoDB", err.message));

app.use(express.json());
app.use(cookiesParser());
app.use(cors({
    origin: process.env.FRONTEND_URL, 
    credentials: true 
}));

// Socket.io configuration
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL, 
        methods: ["GET", "POST"],         
        credentials: true           
    }
});

const onlinUser = new Set();

io.on("connection", async (socket) => {
    console.log("User connected:", socket.id);

    const token = socket.handshake.auth.token;
    const user = await getUserDetailsFromToken(token);
    
    socket.join(user?._id);
    

    if (!onlinUser.has(user?._id)) {
        onlinUser.add(user?._id?.toString());
    };

    io.emit("onlinUser", Array.from(onlinUser));

    socket.on("message-page", async(userId)=>{
        console.log("userId", userId);
        const userDetails = await UserModel.findById(userId).select("-password")
        
        const payload = {
            _id: userDetails?._id,
            name: userDetails?.name,
            email: userDetails?.email,
            profile_pic: userDetails?.profile_pic,
            online: onlinUser.has(userId)
        }
        socket.emit("message-user",payload )
    })

    socket.on("disconnect", () => {
        onlinUser.delete(user?._id)
        console.log("User disconnected:", socket.id);
    });
});

// API endpoint
app.use("/api", router);

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
