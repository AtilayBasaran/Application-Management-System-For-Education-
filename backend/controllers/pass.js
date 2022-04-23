const {validationResult} = require('express-validator');
const db = require('../util/database');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.changePass = async (req, res, next) => {
    const errors = validationResult(req);
    console.log('nerdeyim ben')
    const user = await User.find(req.body.email);
    if (user[0].length = 0) {
        res.status(401).json({
            message: "Invalid Email"
        });
        return;
    }

    const email = req.body.email;
    const password = req.body.password;
    const passwordConfirm = req.body.passwordConfirm;
    console.log('-------------------')
    console.log(email)
    console.log(password)
    console.log(passwordConfirm)
    console.log('-------------------')


    try {
        console.log('buraya kadar geliyor')
        const hashedPassword = await bcrypt.hash(password, 12);
        console.log(hashedPassword)
        console.log(email)
        db.execute(
        'UPDATE users SET password = ? WHERE email = ?;',
            [hashedPassword,email]);

        res.status(201).send({
            message: 'Password Succesfully Changed'
        });
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