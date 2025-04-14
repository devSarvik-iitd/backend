const User = require('../models/user-model');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const dotenv = require("dotenv");
require("dotenv").config();

exports.registerUser = async (email, name, picture, displayName, phone) => {
    if (!email || !name || !displayName || !phone) {
        return {
            success: false,
            statusCode: 400,
            message: "Missing Required Fields",
        };
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return {
            success: false,
            statusCode: 409,
            message: "User already exists",
        }
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
    newUser.tokens.push({ token, device: "web" });
    await newUser.save();

    return {
        success: true,
        statusCode: 200,
        message: "User registered successfully",
        token,
        user: newUser,
    }
};

exports.loginUser = async (token) => {
    if (!token) {
        return {
            success: false,
            statusCode: 400,
            message: "Google token is missing",
        };
    }

    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const userInfo = {
        user_id: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
    };

    const user = await User.findOne({ email: userInfo.email });

    if (!user) {
        return {
            success: false,
            statusCode: 206, // Not fully accepted
            message: "User does not exist",
            userInfo,
        };
    }

    const jwtToken = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    user.tokens.push({ token: jwtToken, device: "UNKNOWN" });
    await user.save();

    return {
        success: true,
        statusCode: 200,
        message: "Login successful",
        token: jwtToken,
        userInfo,
    };
};