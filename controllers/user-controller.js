const User = require('../models/user-model');
const dashboard = async(req,res)=>{
    res
        .status(200)
        .json({message:"Dashboard successful", user:req.user});
}
const logout = async(req,res)=>{
    try{
        res.clearCookie( "token", {
            httpOnly : true,
            secure: true,
            sameSite: "strict",
        });

        await User.findByIdAndUpdate(req.user.id, {
            $pull: { tokens: { token: req.token } } // ✅ Correct way to remove a nested object
        });
        

        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({message : "Internal Server error"});
    }
}
const logoutall = async(req,res)=>{
    try {
        await User.findByIdAndUpdate(req.user.id, { tokens: [] });

        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        });

        res.status(200).json({ message: "Logged out from all devices successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}
module.exports = {dashboard, logout, logoutall};