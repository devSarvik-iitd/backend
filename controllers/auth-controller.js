const User = require('../models/user-model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const bodyParser = require('body-parser');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
const register = async (req, res)=>{}
const login = async (req, res) => {

        // const { email, password, device } = req.body;
        console.log(req.body);
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
        
            // You can use the user information (e.g., store in your database or create a session)
        
            // Send a success response with the user information
            res.status(200).json({
              message: 'Login successful',
              user_info: userInfo,
            });
          } catch (error) {
            console.error('Error verifying Google token:', error);
            res.status(401).json({ error: 'Invalid token' });
          }
    //     const user = await User.findOne({ email });

    //     if (!user) {
    //         return res.status(400).json({ message: "User does not exist" });
    //     }

    //     const isMatch = await bcrypt.compare(password, user.password);
    //     if (!isMatch) {
    //         return res.status(401).json({ message: "Invalid credentials" });
    //     }
    //     const token = jwt.sign(
    //         { id: user._id, username: user.username },
    //         process.env.JWT_SECRET,
    //         { expiresIn: "1h" }
    //     );
    //     res.cookie("token", token, {
    //         httpOnly: true,
    //         secure: false,
    //         sameSite: "lax", 
    //         maxAge: 3600000, // 1 hour
    //     })
    //     user.tokens.push({ token, device: device || device });
    //     await user.save();

    //     res.status(200).json({ message: "Login successful" });
    // } catch (error) {
    //     console.log(error);
    //     res.status(500).json({ message: "Internal Server Error" });
    // }
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