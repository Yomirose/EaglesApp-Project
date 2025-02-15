const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const router = require("./routes/user");
const cookiesParser = require("cookie-parser");
const http = require("http");
// const https = require("http");
const { Server } = require("socket.io");
const getUserDetailsFromToken = require("./helpers/getUserDetailsFromToken");
const UserModel = require("./models/UserModel");
const ConversationModel = require("./models/ConversationModel");
const MessageModel = require("./models/MessageModel");
const getConversation = require("./helpers/getConversation");
// const path = require("path");

dotenv.config();
const app = express();

const server = http.createServer(app);

// const server = https.createServer(app);
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("MongoDB connected successfully"))
    .catch(err => {
        console.log("Failed to connect to MongoDB", err.message);  
    });

    // middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookiesParser());

app.use(cors({
    origin: process.env.FRONTEND_URL || "https://yourfrontenddomain.com",
    credentials: true
}));



// ...........deployment code ...........//
// const __dirname1 = path.resolve();
// if (process.env.NODE_ENV === "production") {

//     app.use(express.static(path.join(__dirname1,"../client/build")));

//     app.get("*", (req, res) => {
//         res.sendFile(path.resolve(__dirname1, "../client/build", "index.html"));
//     })

// } else {
//     app.get("/", (req, res) => {
//         res.send("API is Running Successfully")
//     });
// }
// ...........deployment code ...........//


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
    // console.log("User connected:", socket.id);

    const token = socket.handshake.auth.token;
    const user = await getUserDetailsFromToken(token);

    socket.join(user?._id?.toString());

    if (!onlinUser.has(user?._id)) {
        onlinUser.add(user?._id?.toString());
    };

    io.emit("onlinUser", Array.from(onlinUser));

    socket.on("message-page", async (userId) => {
        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            console.error("Invalid userId:", userId);
            return socket.emit("error", "Invalid user ID")
        }

        const userDetails = await UserModel.findById(userId).select("-password")

        if (!userDetails) {
            return socket.emit("error", "User not found");
        }

        const payload = {
            _id: userDetails?._id,
            name: userDetails?.name,
            email: userDetails?.email,
            profile_pic: userDetails?.profile_pic,
            online: onlinUser.has(userId)
        }
        socket.emit("message-user", payload)

            // get previous message
            const getConversationMessage = await ConversationModel.findOne({
                "$or": [
                    { sender: user?._id, receiver: userId },
                    { sender: userId, receiver: user?._id }
                ]
            })
            .populate({
                path: "messages",
                model: "Message",
                select: "text imageUrl videoUrl msgByUserId",
                populate: {
                    path: "msgByUserId",  
                    select: "name profile_pic" 
                }
            }).sort({ updatedAt: -1 });

            socket.emit("message", getConversationMessage?.messages || [])
    });

    // new message
    socket.on("new message", async (data) => {

        if (!data?.sender || !data?.receiver || !mongoose.Types.ObjectId.isValid(data.sender) || !mongoose.Types.ObjectId.isValid(data.receiver)) {
            console.error("Invalid sender or receiver ID:", data);

            console.error("Invalid sender or receiver ID:", data.sender, data.receiver);
            return socket.emit("error", "Invalid sender or receiver ID");
        }
        
        let conversation = await ConversationModel.findOne({
            "$or": [
                { sender: data?.sender, receiver: data?.receiver },
                { sender: data?.receiver, receiver: data?.sender }
            ]
        });

        if (!conversation) {
            const createConversation = new ConversationModel({
                sender: data?.sender,
                receiver: data?.receiver
            })
            conversation = await createConversation.save();

        }

        const messages = new MessageModel({
            text: data.text,
            imageUrl: data.imageUrl,
            videoUrl: data.videoUrl,
            msgByUserId: data.msgByUserId,
        });
        const saveMessage = await messages.save();
        
         await ConversationModel.updateOne(
            {_id: conversation?._id},
            {"$push": { messages: saveMessage?._id } }
        );

            // Populating messages
        const getConversationMessage = await ConversationModel.findOne({
            "$or": [
                { sender: data?.sender, receiver: data?.receiver },
                { sender: data?.receiver, receiver: data?.sender }
            ]
        })
        .populate({
            path: "messages",
            model: "Message",
            select: "text imageUrl videoUrl msgByUserId",
            populate: {
                path: "msgByUserId",  
                select: "name profile_pic" 
            }
        }).sort({ updatedAt: -1 });

        io.to(data?.sender).emit("message", getConversationMessage?.messages || []);
        io.to(data?.receiver).emit("message", getConversationMessage?.messages || []);

        // send conversation
        const conversationSender = await getConversation(data?.sender);
        const conversationReceiver = await getConversation(data?.receiver);

        io.to(data?.sender).emit("conversation", conversationSender);
        io.to(data?.receiver).emit("conversation", conversationReceiver);
    });

    // sidebar
    socket.on("sidebar", async (currentUserId) => {
        
        const conversation = await getConversation(currentUserId)
        
        socket.emit("conversation",conversation)
        
    });

    socket.on("seen", async (msgByUserId) => {
        let conversation = await ConversationModel.findOne({
            "$or": [
                { sender: user?._id, receiver: msgByUserId},
                { sender: msgByUserId, receiver: user?._id }
            ]
        });
        const conversationMessageId = conversation?.messages || []

        const updateMessages = await MessageModel.updateMany(
            { _id : {"$in" : conversationMessageId }, msgByUserId : msgByUserId },
            { "$set": { seen: true } }
        )

        // send conversation
        const conversationSender = await getConversation(user?._id?.toString());
        const conversationReceiver = await getConversation(msgByUserId);

        io.to(user?._id?.toString()).emit("conversation", conversationSender);
        io.to(msgByUserId).emit("conversation", conversationReceiver);

    })

    socket.on("disconnect", () => {
        onlinUser.delete(user?._id?.toString())
        console.log("User disconnected:", socket.id);
    });
});

// API endpoint
app.use("/images", express.static("public/images"));

app.use("/api", router);


// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


