const express = require('express');
const router = express.Router();
const controller = require("../controllers/user-controller");
const authenticateUser = require('../utils/authMiddleware');
const User = require('../models/user-model');

router.route('/dashboard')
    .get(authenticateUser,controller.dashboard)
router.route('/logout')
    .post(authenticateUser,controller.logout)
router.route('/logoutall')
    .post(authenticateUser,controller.logoutall)


module.exports = router;