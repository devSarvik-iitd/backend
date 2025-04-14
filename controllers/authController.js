const authService = require('../services/authServices');

exports.register = async (req, res) => {
    try {
        const { email, name, picture, displayName, phone } = req.body;
        const result = await authService.registerUser(email, name, picture, displayName, phone );

        if (!result.success) {
            return res.status(result.statusCode).json({ success: false, message: result.message });
        }

        res
            .cookie('token', result.token, {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                maxAge: 3600000,
            })
            .status(result.statusCode)
            .json({
                success: true,
                message: result.message,
                user: result.user,
            });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.login = async (req, res) => {
    try {
        const result = await authService.loginUser(req.body.token);

        if (!result.success) {
            return res.status(result.statusCode).json({
                success: false,
                message: result.message,
                userInfo: result.userInfo || null,
            });
        }

        res
            .cookie("token", result.token, {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                maxAge: 3600000,
            })
            .status(result.statusCode)
            .json({
                success: true,
                message: result.message,
                user_info: result.userInfo,
            });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};