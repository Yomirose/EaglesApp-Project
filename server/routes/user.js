const express = require("express");
const registerUser = require("../controllers/registerUser");
const verifyEmail = require("../controllers/verifyEmail");
const verifyPassword = require("../controllers/verifyPassword");
const userDetails = require("../controllers/userDetails");
const logout = require("../controllers/logout");
const updateUserDetails = require("../controllers/updateUserDetails");
const router = express.Router();


router.post("/register", registerUser);
router.post("/email", verifyEmail );
router.post("/password", verifyPassword);

router.get("/user-details", userDetails);
router.get("/logout", logout);

router.post("/update-user", updateUserDetails);

module.exports = router;