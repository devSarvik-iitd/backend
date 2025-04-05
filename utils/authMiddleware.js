const jwt = require("jsonwebtoken");
const User = require("../models/user-model");

const authenticateUser = async (req, res, next) => {
    let token = req.headers.authorization?.split(" ")[1] || req.cookies?.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    try {
        const decoded = jwt.decode(token);

        if (decoded.exp * 1000 < Date.now()) {
            return res.status(401).json({ message: "Token expired, please log in again" });
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: verified.id, "tokens.token": token }).select("-password");

        if (!user) return res.status(401).json({ message: "Invalid session or logged out" });

        req.user = user;
        req.token = token; // Store token in req for logout handling
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};

module.exports = authenticateUser;
