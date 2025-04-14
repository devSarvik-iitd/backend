const User = require('../models/user-model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const bodyParser = require('body-parser');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const dotenv = require("dotenv");
require("dotenv").config();

const register= async (req, res) => {
    try {
        const { email, name, picture, displayName, phone } = req.body;

        if (!email || !name || !displayName || !phone) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        const newUser = await User.create({
            email,
            name,
            picture,
            displayName,
            phone,
        });

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        // for (const cookieName in req.cookies) {
        //     res.clearCookie(cookieName);
        // }
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 3600000,
        });

        newUser.tokens.push({ token, device: "web" });
        await newUser.save();

        return res.status(200).json({ message: "User registered successfully", user: newUser });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const login = async (req, res) => {

    const token = req.body.token;
    if (!token) {
        return res.status(400).json({ error: 'Token is missing' });
    }

    try {
        // Verify the token with the Google OAuth2 Client
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID, // Specify the client ID to verify the token against
        });

        const payload = ticket.getPayload();  // Get the decoded payload from the token

        // Extract user information from the payload
        const userInfo = {
            user_id: payload.sub,    // Unique user ID from Google
            email: payload.email,
            name: payload.name,
            picture: payload.picture,
        };
        const user = await User.findOne({ email:userInfo.email });
        if (!user) {
            return res.status(206).json({ message: "User does not exist",userInfo });
        } else {
            const token = jwt.sign(
                { id: user._id, username: user.username },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );
            const device = "UNKNOWN";
            user.tokens.push({ token, device: device || device });
            await user.save();
            
            res
                .cookie("token", token, {
                    httpOnly: true,
                    secure: false,
                    sameSite: "lax",
                    maxAge: 3600000,
                })
                .status(200)
                .json({ message: "Login successful" , user_info: userInfo,})
        }
    } catch (error) {
        console.error('Error verifying Google token:', error);
        res.status(401).json({ error: 'Invalid token' });
    }

};

module.exports = { register, login };