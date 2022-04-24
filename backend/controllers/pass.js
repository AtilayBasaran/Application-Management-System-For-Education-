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
    if (user[0].length = 0) {
        res.status(401).json({
            message: "Invalid Email"
        });
        return;
    }
    const email = req.body.email;
    console.log('-------------------')
    console.log(email)
    console.log('-------------------')

    try {

        var transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "snolldestek@gmail.com",
                pass: "snoll123",
            },
            tls: {
                rejectUnauthorized: false,
            },
        });
        const encryptedemail = cryptr.encrypt(email);
        var mailOptions = {
            from: "snolldestek@gmail.com",
            to: email,
            subject: "Şifre Sıfırlama",
            text: "Şifre sıfırlama talebiniz tarafımızca alınmıştır takip eden bağlantıyı kullanarak şifrenizi sıfırlayabilirsiniz ->  http://localhost:4200/newPass/" +
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
};

exports.newPass = async (req, res, next) => {

    const encryptedEmail = req.body.email;
    const decryptedEmail = cryptr.decrypt(encryptedEmail);
    const password = req.body.password;
    const passwordConfirm = req.body.passwordConfirm;

    console.log('decryptedEmail : ' + decryptedEmail)
    const user = await User.find(decryptedEmail);

    if (user[0].length = 0) {
        res.status(401).json({
            message: "Invalid Email"
        });
        return;
    }
    console.log('-------------------')
    console.log(password)
    console.log(passwordConfirm)
    console.log('-------------------')

    try {
        console.log('buraya kadar geliyor')
        const hashedPassword = await bcrypt.hash(password, 12);
        console.log(hashedPassword)
        console.log(decryptedEmail)
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
};