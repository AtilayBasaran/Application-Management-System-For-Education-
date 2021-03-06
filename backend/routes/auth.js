const express = require('express');

const { body } = require('express-validator');

const router = express.Router();

const User = require('../models/user');

const authController = require('../controllers/auth');

router.post(
  '/signup',
  [
    body('name').trim().not().isEmpty(),
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom(async (email) => {
        const user = await User.find(email);
        if (user[0].length > 0) {
          res.status(400).json({
            message: "Email is already in use!"
          });
          return;
        }
      })
      .normalizeEmail(),
    body('password').trim().isLength({ min: 7 }),
  ],
  authController.signup
);

router.post(
  '/agencySignup', authController.agencySignup
);

router.post(
  '/login', authController.login
);

router.post(
  '/createUser', authController.createUser
);


module.exports = router;