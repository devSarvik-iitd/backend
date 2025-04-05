const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

// Schema for a user
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        require: true,
    },
    lastName: {
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
    password: {
        type: String,
        require: true,
    },
    role: {
        type: String,
        require: true,
        default: 'student',
    },
    gender:{
        type: String,
        require: true,
    },
    tokens: [
        { 
            token: String,
            device: String, 
            createdAt: { type: Date, default: Date.now } }
    ]

});


//Securing the password with bcrypt
userSchema.pre('save', async function (next) {
    // console.log(this);
    const user = this;
    if (!user.isModified('password')) { next(); }
    try {
        const saltRound = await bcryptjs.genSalt(10);
        const hash_password = await bcryptjs.hash(user.password, saltRound);
        user.password = hash_password;
    } catch (error) {
        console.log(error)
    }
})


// Define the model or the collection name
// const modelName = new mongoose.model(collectionName, Schema)
// MongoDB would automatically convert collectionName to lowerCase plural like here "User" becomes users

const User = new mongoose.model("User", userSchema);

module.exports = User;