const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModel");

const getUserDetailsFromToken = async (token) => {
    if (!token) {
        return {
            message: "Session out",
            logout: true,
        };
    }

    try {
        const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await UserModel.findById(decoded.id).select("-password");

        if (!user) {
            return {
                message: "User not found",
                logout: true,
            };
        }

        return user;
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return {
                message: "Token expired",
                logout: true,
            };
        } else {
            console.error("Token verification error:", error); 
            return {
                message: "Invalid token",
                logout: true,
            };
        }
    }
};

module.exports = getUserDetailsFromToken;
