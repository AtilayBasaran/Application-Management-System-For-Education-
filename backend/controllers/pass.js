const {
    validationResult
} = require('express-validator');
const db = require('../util/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
var nodemailer = require("nodemailer");
const Cryptr = require("cryptr");
const cryptr = new Cryptr("myTotalySecretKey");

exports.changePass = async (req, res, next) => {
    const errors = validationResult(req);
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



    try {
        const hashedPassword = await bcrypt.hash(password, 12);
        console.log(hashedPassword)
        console.log(email)
        db.execute(
            'UPDATE users SET password = ? WHERE email = ?;',
            [hashedPassword, email]);

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

exports.forgetPass = async (req, res, next) => {
    const errors = validationResult(req);
    const user = await User.find(req.body.email);
    if (user[0].length == 0) {
        res.status(401).json({
            message: "Invalid Email"
        });
        return;
    } else {
        const email = req.body.email;
        try {
            var transporter = nodemailer.createTransport({
                service: "hotmail",
                auth: {
                    user: "applicationdestek@hotmail.com",
                    pass: "application123",
                },
                tls: {
                    rejectUnauthorized: false,
                },
            });
            const encryptedemail = cryptr.encrypt(email);
            var mailOptions = {
                from: "applicationdestek@hotmail.com",
                to: email,
                subject: "Reset Password",
                text: "Your password reset request has been received by us. You can reset your password using the following link. ->  http://localhost:4200/newPass/" +
                    encryptedemail +
                    "",
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log("Email sent: " + info.response);
                }
            });
            res.status(201).send({
                message: 'Email Succesfully Sended'
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
        
    }

};

exports.newPass = async (req, res, next) => {

    const encryptedEmail = req.body.email;
    const decryptedEmail = cryptr.decrypt(encryptedEmail);
    const password = req.body.password;
    const passwordConfirm = req.body.passwordConfirm;
    const user = await User.find(decryptedEmail);

    if (user[0].length == 0) {
        res.status(401).json({
            message: "Invalid Email"
        });
        return;
    }else{
        try {
            const hashedPassword = await bcrypt.hash(password, 12);
            db.execute(
                'UPDATE users SET password = ? WHERE email = ?;',
                [hashedPassword, decryptedEmail]);
    
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
    }

};