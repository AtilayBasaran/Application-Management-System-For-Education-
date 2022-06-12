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

        pool.query(
            "SELECT count(*) as count FROM course where name = ?",
            [courseName],
            async (err, result) => {
                if(result[0].count == 0){
                    db.execute(
                        'INSERT INTO course (name, dept_name) VALUES (?, ?)',
                        [courseName, deptName]
                    );
                    res.status(201).send({
                        message: 'Course Inserted Succesfully'
                    });
                }else{
                    res.status(400).send({
                        message: 'This Course Already Inserted'
                    });
                }

                
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

exports.userDetails = async (req, res, next) => {

    try {
        const userInfos = [];
        pool.query(
            "SELECT * FROM users",
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

exports.settingsUserDetails = async (req, res, next) => {

    try {
        const userInfos = [];
        pool.query(
            "SELECT * FROM users where is_delete = 0 and role != 'student' and role != 'agency'",
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
        pool.query(
            "select q.percent, q.program_id, q.remaining_quota, count(q.percent) as count from applications a inner join programs p on a.program = p.name inner join approved_applications aa on a.id = aa.app_id inner join quota q on p.id = q.program_id and aa.scholarship = q.percent where a.user_id = ?",
            [userid],
            async (err, result) => {
                if(result[0].count != 0){
                    var percent = result[0].percent
                    var program_id = result[0].program_id
                    var remaining_quota = result[0].remaining_quota
                    var new_remaining = Number(remaining_quota)+1
                    db.execute(
                        'UPDATE quota SET remaining_quota = ? WHERE percent = ? and program_id = ?;',
                        [new_remaining, percent ,program_id]
                    );
                }
        db.execute(
            'DELETE FROM users WHERE id = ?;',
            [userid]
        );
        db.execute(
            'DELETE FROM educational_details WHERE user_id = ?;',
            [userid]
        );
        db.execute(
            'DELETE FROM personal_details WHERE user_id = ?;',
            [userid]
        );

        

            },
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

exports.getQuotaDetail = async (req, res, next) => {

    try {
        var program = req.body.program;
        var scholar = req.body.scholar;

        var quotaInfos = [];
        pool.query(
            "select * from programs p inner join quota q on p.id = q.program_id where p.name = ? and q.percent = ?",
            [program, scholar],
            async (err, result) => {

                for (var i = 0; i < result.length; i++) {
                    var a = {
                        initial_quota: result[i].initial_quota,
                        remaining_quota: result[i].remaining_quota,
                    };
                    quotaInfos.push(a);
                }

                console.log(quotaInfos),
                    res.status(201).send(quotaInfos)
            },
        );
        return;
    } catch (err) {
        if (!err.statusCode) {
            res.status(400).send({
                message: "Quota Details Failed!"
            });
            return;
        }
        next(err);
    }

};

exports.getQuotaDetail = async (req, res, next) => {

    try {
        var program = req.body.program;
        var scholar = req.body.scholar;

        var quotaInfos = [];
        pool.query(
            "select * from programs p inner join quota q on p.id = q.program_id where p.name = ? and q.percent = ?",
            [program, scholar],
            async (err, result) => {

                for (var i = 0; i < result.length; i++) {
                    var a = {
                        initial_quota: result[i].initial_quota,
                        remaining_quota: result[i].remaining_quota,
                    };
                    quotaInfos.push(a);
                }

                console.log(quotaInfos),
                    res.status(201).send(quotaInfos)
            },
        );
        return;
    } catch (err) {
        if (!err.statusCode) {
            res.status(400).send({
                message: "Quota Details Failed!"
            });
            return;
        }
        next(err);
    }

};

exports.getAllQuota = async (req, res, next) => {

    try {

        var quotaInfos = [];
        pool.query(
            "select p.name, p.degree, q.percent , q.initial_quota, q.remaining_quota from programs p join quota q on p.id = q.program_id",
            async (err, result) => {

                for (var i = 0; i < result.length; i++) {
                    var a = {
                        name: result[i].name,
                        degree: result[i].degree,
                        percent: result[i].percent,
                        initial_quota: result[i].initial_quota,
                        remaining_quota: result[i].remaining_quota,
                    };
                    quotaInfos.push(a);
                }

                console.log(quotaInfos),
                    res.status(201).send(quotaInfos)
            },
        );
        return;
    } catch (err) {
        if (!err.statusCode) {
            res.status(400).send({
                message: "Quota Details Failed!"
            });
            return;
        }
        next(err);
    }

};

exports.changeQuota = async (req, res, next) => {


    var program = req.body.quotaProgramChooice;
    var scholar = req.body.quotaSchoolarChoice;

    var year = req.body.quotaYearChooice;
    var semester = req.body.quotaSemesterChooice;

    var quotaNumber = Number(req.body.quotaNumber);



    try {
        pool.query(
            "select id from programs where name = ? and academic_year = ? and semester = ?",
            [program, year, semester],
            async (err, result) => {
                var id = result[0].id
                db.execute(
                    'UPDATE quota SET initial_quota = ? , remaining_quota = ? WHERE program_id =  ? and percent = ?;',
                    [quotaNumber, quotaNumber, id, scholar]
                );
                res.status(201).send({
                    message: 'Quota changed Succesfully'
                });
            },
        );

        return;
    } catch (err) {
        if (!err.statusCode) {
            res.status(400).send({
                message: "Update quota process Failed!"
            });
            return;
        }
        next(err);
    }


};

exports.getSchoolarInfos = async (req, res, next) => {

    try {
        var academic_year = req.body.academic_year;
        var semester = req.body.semester;
        var program = req.body.program;
        var scholarInfos = [];
        pool.query(
            "select q.percent, q.initial_quota, q.remaining_quota, (CASE WHEN q.initial_quota = 0 THEN true ELSE false END) as canUpdated from programs p inner join quota q on p.id = q.program_id where p.name = ? and p.academic_year = ? and p.semester = ?",
            [program, academic_year, semester],
            async (err, result) => {

                for (var i = 0; i < result.length; i++) {
                    var a = {
                        percent: result[i].percent,
                        initial_quota: result[i].initial_quota,
                        remaining_quota: result[i].remaining_quota,
                        canUpdated: result[i].canUpdated,
                    };
                    scholarInfos.push(a);
                }

                console.log(scholarInfos),
                    res.status(201).send(scholarInfos)
            },
        );
        return;
    } catch (err) {
        if (!err.statusCode) {
            res.status(400).send({
                message: "Schoolar Failed!"
            });
            return;
        }
        next(err);
    }

};