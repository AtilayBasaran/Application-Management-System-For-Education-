const { validationResult } = require('express-validator');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');


exports.signup = async (req, res, next) => {
    const errors = validationResult(req);

    const user = await User.find(req.body.email);
        if (user[0].length > 0) {
          res.status(401).json({
            message: "Email is already in use!"
          });
        }
  
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
  
    try {
      const hashedPassword = await bcrypt.hash(password, 12);
  
      const userDetails = {
        name: name,
        email: email,
        password: hashedPassword,
      };
  
      const result = await User.save(userDetails);
  
      res.status(201).send({ message: 'User registered!' });
      return;
    } catch (err) {
      if (!err.statusCode) {
        res.status(400).send({
          message: "Failed!"
        });
      }
      next(err);
    }
  };

  exports.login = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    try {
      const user = await User.find(email);
  
      if (user[0].length !== 1) {
        res.status(400).send({
          message: "Wrong email or password!"
        });
      }
  
      const storedUser = user[0][0];
  
      const isEqual = await bcrypt.compare(password, storedUser.password);
  
      if (!isEqual) {
        res.status(400).send({
          message: "Wrong email or password!"
        });
        return;
      }
  
      const token = jwt.sign(
        {
          email: storedUser.email,
          userId: storedUser.id,
        },
        'secretfortoken',
        { expiresIn: '1h' }
      );
      res.status(200).json({ token: token, userId: storedUser.id });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  };
  