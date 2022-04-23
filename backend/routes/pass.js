const express = require('express');

const { body } = require('express-validator');

const router = express.Router();

const User = require('../models/user');

const passController = require('../controllers/pass');

router.post(
    '/changepass', passController.changePass
);

module.exports = router;