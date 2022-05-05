const {
    validationResult
} = require('express-validator');
const db = require('../util/database');
const User = require('../models/user');

const mysql = require('mysql2');

const config = require('../config/config.json');

var dateTime = require('node-datetime');

const pool = mysql.createPool({
    host: config.host,
    user: config.user,
    database: config.database,
});

exports.addCourse = async (req, res, next) => {

    try {

        console.log('buraya geldim mi ? ?')
        var courseName = req.body.courseName;
        var deptName = req.body.deptName;

        db.execute(
            'INSERT INTO course (name, dept_name) VALUES (?, ?)',
            [courseName, deptName]
        );
        res.status(201).send({
            message: 'Course Inserted Succesfully'
        });
        return;
    } catch (err) {
        if (!err.statusCode) {
            res.status(400).send({
                message: "Course Insertion Failed!"
            });
            return;
        }
        next(err);
    }

};

exports.userDetails = async (req, res, next) => {
    console.log('buraya hiç ulaşıyor muyum ???? ')
    try {
        const userInfos = [];
        pool.query(
            "SELECT * FROM users ",
            async (err, result) => {
                
                for (var i = 0; i < result.length; i++) {
                    var a = {
                        firstname: result[i].firstname,
                        lastname: result[i].lastname,
                        email: result[i].email,
                        role: result[i].role,
                    };
                    userInfos.push(a);
                }

            console.log(userInfos),
            res.status(201).send(userInfos)
            },
        );
        return;
    } catch (err) {
        if (!err.statusCode) {
            res.status(400).send({
                message: "Course Insertion Failed!"
            });
            return;
        }
        next(err);
    }

};