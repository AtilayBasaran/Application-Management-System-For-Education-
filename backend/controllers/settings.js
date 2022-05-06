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
    
    try {
        const userInfos = [];
        pool.query(
            "SELECT * FROM users where is_delete = 0",
            async (err, result) => {
                
                for (var i = 0; i < result.length; i++) {
                    var a = {
                        id: result[i].id,
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

exports.deleteUser = async (req, res, next) => {
    console.log('buraya hiç ulaşıyor muyum ???? ')

    try {
        const userid = req.params.userid;
        console.log(userid);
        db.execute(
            'UPDATE users SET is_delete = ? WHERE id = ?;',
            [1, userid]
        );
        res.status(201).send({
            message: 'User deleted Succesfully'
        });
        return;
    } catch (err) {
        if (!err.statusCode) {
            res.status(400).send({
                message: "User delete process Failed!"
            });
            return;
        }
        next(err);
    }

};

exports.updateInstitute = async (req, res, next) => {
    try {
        const userid = req.params.userid;
        console.log(userid);
        db.execute(
            'UPDATE users SET role = ? WHERE id = ?;',
            ['institute', userid]
        );
        res.status(201).send({
            message: 'Role updated Succesfully'
        });
        return;
    } catch (err) {
        if (!err.statusCode) {
            res.status(400).send({
                message: "Role update process Failed!"
            });
            return;
        }
        next(err);
    }

};

exports.updateHeadOfDept = async (req, res, next) => {
    try {
        const userid = req.params.userid;
        console.log(userid);
        db.execute(
            'UPDATE users SET role = ? WHERE id = ?;',
            ['headOfDept', userid]
        );
        res.status(201).send({
            message: 'Role updated Succesfully'
        });
        return;
    } catch (err) {
        if (!err.statusCode) {
            res.status(400).send({
                message: "Role update process Failed!"
            });
            return;
        }
        next(err);
    }

};

