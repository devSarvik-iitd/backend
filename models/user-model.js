const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

// Schema for a user
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    displayName: {
        type: String,
        require: false,
    },
    phone: {
        type: String,
        require: true,
        match: [/^\d{10}$/, "Phone number must be exactly 10 digits"], // ✅ Ensures 10-digit number
    },
    email: {
        type: String,
        require: true,
    },
    picture: {
        type: String,
        require: true,
    },
    role: {
        type: String,
        require: true,
        default: 'student',
    },
    // gender:{
    //     type: String,
    //     require: true,
    // },
    tokens: [
        { 
            token: String,
            device: String, 
            createdAt: { type: Date, default: Date.now } }
    ]

});


// Define the model or the collection name
// const modelName = new mongoose.model(collectionName, Schema)
// MongoDB would automatically convert collectionName to lowerCase plural like here "User" becomes users

const User = new mongoose.model("User", userSchema);

module.exports = User;