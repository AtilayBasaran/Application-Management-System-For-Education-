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

exports.deleteCourse = async (req, res, next) => {

    try {
        const course_id = req.params.course_id;
        console.log(course_id);
        db.execute(
            'DELETE FROM course WHERE id = ?;',
            [course_id]
        );
        res.status(201).send({
            message: 'Course deleted Succesfully'
        });
        return;
    } catch (err) {
        if (!err.statusCode) {
            res.status(400).send({
                message: "Course delete process Failed!"
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

exports.courseDetails = async (req, res, next) => {

    try {
        const courseInfos = [];
        pool.query(
            "SELECT * FROM course ",
            async (err, result) => {

                for (var i = 0; i < result.length; i++) {
                    var a = {
                        id: result[i].id,
                        name: result[i].name,
                        dept_name: result[i].dept_name,
                    };
                    courseInfos.push(a);
                }

                console.log(courseInfos),
                    res.status(201).send(courseInfos)
            },
        );
        return;
    } catch (err) {
        if (!err.statusCode) {
            res.status(400).send({
                message: "Course Information Cannot Take!"
            });
            return;
        }
        next(err);
    }

};

exports.changeCourseName = async (req, res, next) => {
    try {
        const courseId = req.body.courseId;
        const courseName = req.body.courseName;

        console.log(courseId)
        console.log(courseName)

        db.execute(
            'UPDATE course SET name = ? WHERE id = ?;',
            [courseName, courseId]
        );
        res.status(201).send({
            message: 'Course Name Changed Succesfully'
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

exports.agencyUserDetails = async (req, res, next) => {

    try {
        var agency_email = req.body.agency_email;
        
        var userInfos = [];
        pool.query(
            "select u.id, u.firstname, u.lastname, u.email, u.role, (CASE  WHEN a.id > 0 THEN true ELSE false END) as cas from users u left outer join applications a on u.id = a.user_id where u.agency_email = ? ",
            [agency_email],
            async (err, result) => {

                for (var i = 0; i < result.length; i++) {
                    var a = {
                        id: result[i].id,
                        firstname: result[i].firstname,
                        lastname: result[i].lastname,
                        email: result[i].email,
                        role: result[i].role,
                        haveApplications: result[i].cas,
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
                message: "Agency User Details Failed!"
            });
            return;
        }
        next(err);
    }

};