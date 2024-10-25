async function logout(req, res) {
    try {
        const cookieOptions = {
            httpOnly: true,
            secure: true,
            expires: new Date(0),
            sameSite: "None"
        };

        return res.cookie("token", "", cookieOptions).status(200).json({
            msg: "You have successfully logged out",
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            msg: error.message || error,
            error: true
        });
    }
}

module.exports = logout;
