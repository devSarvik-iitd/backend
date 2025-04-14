const express = require("express");
const router = express.Router();

const auth_controller = require('../controllers/authController')
router.route('/register')
    .post(auth_controller.register)
    
router.route('/login')
    .post(auth_controller.login)

module.exports = router;