const userService = require('../services/userServices');

exports.dashboard = async (req, res) => {
    try {
        const result = await userService.getDashboardData(req);

        res.status(result.statusCode).json({
            success: result.success,
            message: result.message,
            user: result.user || null,
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" })
    }
};

exports.logout = async (req, res) => {
    try {
        const result = await userService.logoutUser(req);

        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        });

        return res.status(result.statusCode).json({
            success: result.success,
            message: result.message,
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" })
    }
};

exports.logoutall = async (req, res) => {
    try {
        const result = await userService.logoutFromAllDevices(req);

        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        });

        return res.status(result.statusCode).json({
            success: result.success,
            message: result.message,
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" })
    }
};
