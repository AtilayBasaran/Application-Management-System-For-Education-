const { validationResult } = require('express-validator');

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const config = require('../config/config.json');

const db = require('../util/database');

const User = require('../models/user');

const mysql = require('mysql2');

var dateTime = require('node-datetime');

const pool = mysql.createPool({
  host: config.host,
  user: config.user,
  database: config.database,
});


exports.signup = async (req, res, next) => {
    const errors = validationResult(req);

    const user = await User.find(req.body.email);
        if (user[0].length > 0) {
          res.status(401).json({
            message: "Email is already in use!"
            
          });
          return;
        }
  
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email;
    const password = req.body.password;
  
    try {
      const hashedPassword = await bcrypt.hash(password, 12);
  
      const userDetails = {
        firstname: firstname,
        lastname: lastname,
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
        return;
      }
      next(err);
    }
  };

  exports.agencySignup = async (req, res, next) => {

    try {
      console.log('agency signup')


      pool.query( "select count(*) as count from agency where email = ?",
      [req.body.email] ,
          async (err, result) => {

            var c = result[0].count
            if(c != 0){

              res.status(400).send({
                message: "Email is already in use!"
            });
            return;
            }else{
              const hashedPassword = await bcrypt.hash(req.body.password, 12);
              var dt = dateTime.create();
              var formatted = dt.format('Y-m-d H:M:S');

              db.execute(
                'INSERT INTO agency (company_name, email, password ,register_date, is_delete) VALUES (?, ?, ?, ?, ?)',
                [req.body.company_name, req.body.email, hashedPassword, formatted ,0]
            );
            res.status(201).send({ message: 'User registered!' });
            }
          },
      );
      return;
  } catch (err) {
      if (!err.statusCode) {
          res.status(400).send({
              message: "Agency register process failed"
          });
          return;
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
        return;
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

      // Frontta data olarak tuttuğu yer burdan geliyor eğer next err diye atarsam da error tutuyor ve ekrana bastırabiliyorum
      // Bu şekilde currentuseri da güncellemiş oldum çünkü token yanında tuttuğum bilgilere burdan dönenlerle yaptım.
      res.status(200).send(
        {
        id: storedUser.id,
        firstname: storedUser.firstname,
        lastname: storedUser.lastname,
        email: storedUser.email,
        roles: storedUser.role,
        accessToken: token}
        );
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  };
  