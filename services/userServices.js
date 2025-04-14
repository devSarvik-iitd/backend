const User = require('../models/user-model');

exports.getDashboardData = async (req) => {
    return {
        success: true,
        statusCode: 200,
        message: "Dashboard fetched successfully",
        user: req.user,
    };
};

exports.logoutUser = async (req) => {

        await User.findByIdAndUpdate(req.user.id, {
            $pull: { tokens: { token: req.token } }
        });

        return {
            success: true,
            statusCode: 200,
            message: "Logged out successfully"
        };
   
};

exports.logoutFromAllDevices = async (req) => {

        await User.findByIdAndUpdate(req.user.id, { tokens: [] });

        return {
            success: true,
            statusCode: 200,
            message: "Logged out from all devices successfully"
        };
};
