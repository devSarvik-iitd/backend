const User = require('../models/user-model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    try {
        const { tempToken, firstName, lastName, phone, email, password, gender } = req.body;
        if(!tempToken){
            return res.status(401).json({message:"OTP Verification needed"});
        }
        let decoded;
        try {
            decoded = jwt.verify(tempToken, process.env.JWT_SECRET);
        } catch (error) {
            return res.status(401).json({message:"Email verification expired"});
        }
        if(decoded.email!== email){
            return res.status(400).json({message:"Email verification failed"});
        }
        const userExist = await User.findOne({ email });
        if (userExist) {
            res
                .status(400)
                .json({ message: "User already exists" });
        }   else {
            const createdUser = await User.create({ firstName,lastName, phone, email, password, gender});
            res
                .status(200)
                .json({ message: "User Created Successfully", userData: createdUser });
        }

    } catch (error) {
        console.log(error)
        res.status(500).json("Internal Server Error");
    }
}
const login = async (req, res) => {
    try {
        const { email, password, device } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax", 
            maxAge: 3600000, // 1 hour
        })
        user.tokens.push({ token, device: device || device });
        await user.save();

        res.status(200).json({ message: "Login successful" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const change = async (req, res) => {
    try {
        const { tempToken, email, newPassword } = req.body;
        if(!tempToken){
            return res.status(401).json({message:"OTP Verification needed"});
        }
        let decoded;
        try {
            decoded = jwt.verify(tempToken, process.env.JWT_SECRET);
        } catch (error) {
            return res.status(401).json({message:"Email verification expired"});
        }
        if(decoded.email!== email){
            return res.status(400).json({message:"Email verification failed"});
        }

        const user = await User.findOne({email});
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.password = newPassword;
        await user.save();

        return res.status(200).json({message : "Password changed successfully"});

    } catch (error) {
        console.log(error)
        res.status(500).json("Internal Server Error");
    }
}


module.exports = { register, login, change };