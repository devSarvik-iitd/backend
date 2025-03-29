const express = require("express");
const router = express.Router();

// const {getCreate, postCreate} = require('../controllers/doubt-controller')

// router.route("/create")
//     .get(getCreate)
//     .post(postCreate)

const doubtControllers = require('../controllers/doubt-controller')

router.route("/create")
    .get(doubtControllers.getCreate)
    .post(doubtControllers.postCreate)

module.exports = router;