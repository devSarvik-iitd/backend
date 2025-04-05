const mongoose = require ('mongoose');

// const URI = "mongodb://127.0.0.1:27017/backend_practice";
const URI = process.env.MONGODB_URI;
// mongoose.connect(URI);

const connectDb = async()=>{
    try{
        await mongoose.connect(URI);
        console.log("Successfully connected to the DataBase");
    } catch (error) {
        console.log("Database connection failed with the error :\n" + error);
        process.exit(0);
    }
}

module.exports = connectDb