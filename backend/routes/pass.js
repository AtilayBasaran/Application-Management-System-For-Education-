const express = require('express');

const {
    body
} = require('express-validator');

const router = express.Router();

const User = require('../models/user');

const passController = require('../controllers/pass');

router.post(
    '/changepass', passController.changePass
);

router.post(
    '/forgetpass', passController.forgetPass
);

router.post(
    '/newpass', passController.newPass
);


module.exports = router;