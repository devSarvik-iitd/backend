const express = require("express");
const router = express.Router();

const auth_controller = require('../controllers/auth-controller')
router.route('/register')
    .post(auth_controller.register)
    
router.route('/login')
    .post(auth_controller.login)

const otp_controller = require('../controllers/otp-controller')
router.route('/request-otp')
    .post(otp_controller.generateOTP)
router.route('/verify-otp')
    .post(otp_controller.verifyOTP)

module.exports = router;