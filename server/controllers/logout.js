async function logout(req, res) {
    try {
        const cookieOptions = {
            httpOnly: true, 
            secure: true 
        };

        return res.cookie("token", "", cookieOptions).status(200).json({
            mgs: "You have successfully logout",
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            msg: error.message || error,
            error: true
        })
    }
}
module.exports = logout;