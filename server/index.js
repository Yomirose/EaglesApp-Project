const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const router = require("./routes/user");
const cookiesParser = require("cookie-parser");


dotenv.config();

const app = express();
const PORT = 5000;

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log("MongoDB connected successfully"))
.catch(err => console.log("Failed to connect to MongoDB", err.message));


app.use(express.json());
app.use(cookiesParser());
app.use(cors({
    origin : process.env.FRONTEND_URL,
    credentials : true
}));

//Api endpoint
app.use("/api", router)


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
