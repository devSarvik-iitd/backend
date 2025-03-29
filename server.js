require('dotenv').config() 

const express = require('express');
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");
app.use(cookieParser());  // ✅ Required for reading cookies

app.use(
    cors({
        origin:["http://localhost:5173","http://143.110.178.26:3000"],
        credentials:true
    })
);
app.use(express.json()); 
// Using router to classify API requests based on their types
const auth_router = require('./router/auth-router.js');
const doubt_router = require('./router/doubt-router.js');
const user_router = require('./router/user-router.js');

app.use("/auth", auth_router);
app.use("/doubt", doubt_router);
app.use("/user", user_router);



// Listening to the server
const PORT = 8000;

// app.listen(PORT, ()=>{
//     console.log(`Server is running: ${PORT}`);
// })

const connectDb = require('./utils/db');

connectDb().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running: ${PORT}`);
    });
});