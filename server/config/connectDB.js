// const mongoose = require("mongoose");

// async function connectDB(){
//     try {
//         await mongoose.connect(process.env.MONGO_URL)

//         const connection = mongoose.connection

//         connection.on("connected",()=>{
//             console.log("MongoDB connected successfully")
//         })

//         connection.on("error",(error)=>{
//             console.log("Something is wrong in mongoDB", error)
//         })
//     } catch (error) {
//         console.log("Somthing is wrong in mongoBd", error)
//     }
// }
// module.exports = connectDB