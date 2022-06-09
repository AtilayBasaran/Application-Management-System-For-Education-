const {
    validationResult
} = require('express-validator');

const db = require('../util/database');

const User = require('../models/user');

const mysql = require('mysql2');

const config = require('../config/config.json');

var dateTime = require('node-datetime');

var nodemailer = require("nodemailer");

const pool = mysql.createPool({
    host: config.host,
    user: config.user,
    database: config.database,
});


exports.addPersonal = async (req, res, next) => {

    try {

        var user_id = req.body.user_id;
        var name = req.body.personalInfo.name;
        var email = req.body.personalInfo.email;
        var address = req.body.personalInfo.address;
        var phone = req.body.personalInfo.phone;
        var country = req.body.personalInfo.country;
        var nationality = req.body.personalInfo.nationality;
        var id_number = req.body.personalInfo.id_number;

        console.log('Personal Info tarafı ------------')
        console.log(user_id)
        console.log(name)
        console.log(email)
        console.log(address)
        console.log(phone)
        console.log(country)
        console.log(nationality)
        console.log(id_number)
        console.log('Personal Info tarafı ------------')


        db.execute(
            'INSERT INTO personal_details (user_id, name, email, address, phone, country, nationality, id_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [user_id, name, email, address, phone, country, nationality, id_number]
        );
        res.status(201).send({
            message: 'Personal Inserted Succesfully'
        });
        return;
    } catch (err) {
        if (!err.statusCode) {
            res.status(400).send({
                message: "Personal Insertion Failed!"
            });
            return;
        }
        next(err);
    }

};

exports.addEducational = async (req, res, next) => {

    try {


        var user_id = req.body.user_id;
        var blue_card = req.body.eduInfo.blueCard;
        var dual_citizen = req.body.eduInfo.dualCitizenCheck;
        var highest_qualification = req.body.eduInfo.highest_qualification;
        var university = req.body.eduInfo.university;
        var total_marks = req.body.eduInfo.total_marks;
        var graduation_year = req.body.eduInfo.graduation_year;
        var language_profiency = req.body.eduInfo.language_profiency;
        var exam_score = req.body.eduInfo.exam_score;

        console.log('----------------------------')

        console.log(user_id)
        console.log(blue_card)
        console.log(dual_citizen)
        console.log(highest_qualification)
        console.log(university)
        console.log(total_marks)
        console.log(graduation_year)
        console.log(language_profiency)
        console.log(exam_score)

        console.log('----------------------------')

        db.execute(
            'INSERT INTO educational_details (user_id, blue_card, dual_citizen, high_q, university, total_marks, graduation_year, language_prof, exam_score) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [user_id, blue_card, dual_citizen, highest_qualification, university, total_marks, graduation_year, language_profiency, exam_score]
        );
        res.status(201).send({
            message: 'Educational Inserted Succesfully'
        });
        return;
    } catch (err) {
        if (!err.statusCode) {
            res.status(400).send({
                message: "Educational Insertion Failed!"
            });
            return;
        }
        next(err);
    }

};

exports.addAddress = async (req, res, next) => {

    try {
        var city = req.body.city;
        var address = req.body.address;
        var pincode = req.body.pincode;

        db.execute(
            'INSERT INTO address_details (city, address, pincode) VALUES (?, ?, ?)',
            [city, address, pincode]
        );
        res.status(201).send({
            message: 'Address Inserted Succesfully'
        });
        return;
    } catch (err) {
        if (!err.statusCode) {
            res.status(400).send({
                message: "Address Insertion Failed!"
            });
            return;
        }
        next(err);
    }

};

exports.createMainApp = async (req, res, next) => {
    console.log(req.body.degreeType)
    var user_id = req.body.user_id;
    var program_type = req.body.programType;
    var degreeType = req.body.degreeType;

    try {
        pool.query(
            "SELECT department FROM programs where name = ?",
            [program_type],
            async (err, result) => {
                var dept_name = result[0].department

                var dt = dateTime.create();
                var formatted = dt.format('Y-m-d H:M:S');

                register_date = formatted;
                stage = 'controlling';
                is_delete = false;
                interview_req = 'false';

                pool.query(
                    "SELECT agency_email FROM users where id = ?",
                    [user_id],
                    async (err, result) => {
                        var agency_email = result[0].agency_email

                pool.query('INSERT INTO applications (user_id, dept_name, register_date, agency_mail, stage, is_delete, interview_req, degree, program) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    [user_id, dept_name, register_date, agency_email, stage, is_delete, interview_req, degreeType, program_type],
                    function (err, rows) {
                        if (err) throw err;


                        console.log(user_id);
                        console.log(dept_name);
                        console.log(register_date);
                        console.log(agency_email);
                        console.log(stage);
                        console.log(is_delete);
                        console.log(interview_req);
                    });
                },
                );
            },
        );
    } catch (err) {
        console.log(err);
        return;
    }
    return;

};


exports.getProgramInfo = async (req, res, next) => {
    degree = req.body.degree;

    try {
        const programInfos = [];
        pool.query(
            "SELECT * FROM programs where degree = ?",
            [degree],
            async (err, result) => {

                for (var i = 0; i < result.length; i++) {
                    var a = {
                        id: result[i].id,
                        name: result[i].name,
                        faculty: result[i].faculty,
                    };
                    programInfos.push(a);
                }

                console.log(programInfos),
                    res.status(201).send(programInfos)
            },
        );
        return;
    } catch (err) {
        if (!err.statusCode) {
            res.status(400).send({
                message: "Program Information Cannot Take!"
            });
            return;
        }
        next(err);
    }

};

exports.controlTitle = async (req, res, next) => {
    user_id = req.body.user_id;
    title = req.body.title;

    try {
        pool.query(
            "SELECT * FROM document where user_id = ? and title = ?",
            [user_id, title],
            async (err, result) => {
                console.log(result)
                if (result != '') {
                    res.status(201).send(true)
                } else {
                    res.status(201).send(false)
                }
            }
        );
        return;
    } catch (err) {
        if (!err.statusCode) {
            res.status(400).send({
                message: "Error Occured"
            });
            return;
        }
        next(err);
    }

};

exports.controlName = async (req, res, next) => {
    user_id = req.body.user_id;
    fileName = req.body.fileName;

    try {
        pool.query(
            "SELECT * FROM document where user_id = ? and name = ?",
            [user_id, fileName],
            async (err, result) => {
                console.log(result)
                if (result != '') {
                    res.status(201).send(true)
                } else {
                    res.status(201).send(false)
                }
            }
        );
        return;
    } catch (err) {
        if (!err.statusCode) {
            res.status(400).send({
                message: "Error Occured"
            });
            return;
        }
        next(err);
    }

};

exports.getUniqueUserFiles = (req, res, next) => {
    const baseUrl = "http://localhost:3000/files/";
    const user_id = req.body.user_id;
    const directoryPath = __basedir + "/resources/static/assets/uploads/" + user_id;


    try {
        const fileInfos = [];
        pool.query(
            "SELECT * FROM document where user_id = ?",
            [user_id],
            async (err, result) => {

                for (var i = 0; i < result.length; i++) {
                    var a = {
                        is_approve: result[i].is_approve,
                        is_controlled: result[i].is_controlled,
                        title: result[i].title,
                        name: result[i].name,
                        url: baseUrl + result[i].name + '&' + user_id,
                        all_url: directoryPath + '/' + result[i].name,
                    };
                    fileInfos.push(a);
                }
                console.log(fileInfos),
                    res.status(201).send(fileInfos)
            },
        );
        return;
    } catch (err) {
        if (!err.statusCode) {
            res.status(400).send({
                message: "Document Information Cannot Take!"
            });
            return;
        }
        next(err);
    }
};

exports.getCourseInfos = (req, res, next) => {
    const user_id = req.body.user_id;


    try {
        const courseInfos = [];
        pool.query(
            "SELECT dept_name FROM applications where user_id = ?",
            [user_id],
            async (err, result) => {
                var dept_name = result[0].dept_name;

                pool.query(
                    "SELECT * FROM course where dept_name = ?",
                    [dept_name],
                    async (err, result) => {

                        for (var i = 0; i < result.length; i++) {
                            var a = {
                                name: result[i].name,
                                dept_name: result[i].dept_name,
                            };
                            courseInfos.push(a);
                        }
                        console.log(courseInfos),
                            res.status(201).send(courseInfos)
                    },
                );
            }
        );
        return;
    } catch (err) {
        if (!err.statusCode) {
            res.status(400).send({
                message: "Document Information Cannot Take!"
            });
            return;
        }
        next(err);
    }
};

exports.addCourse = async (req, res, next) => {

    try {
        var course_name = req.body.course_name;
        var user_id = req.body.user_id;

        console.log('----------------------------')

        console.log('id : ' + user_id)
        console.log('course_name : ' + course_name)

        pool.query(
            "SELECT id FROM course where name = ?",
            [course_name],
            async (err, result) => {


                var course_id = result[0].id;
                console.log('ilk query içi : ' + course_id)

                pool.query(
                    "SELECT id FROM applications where user_id = ?",
                    [user_id],
                    async (err, result) => {
                        var app_id = result[0].id;

                        console.log('ikinci query içi : ' + app_id)

                        db.execute(
                            'INSERT INTO app_course (app_id, course_id) VALUES (?, ?)',
                            [app_id, course_id]
                        );

                        res.status(201).send({
                            message: 'Course Inserted Succesfully'
                        });
                    },
                );
            }
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

exports.removeCourse = async (req, res, next) => {

    try {
        var course_name = req.body.course_name;
        var user_id = req.body.user_id;

        console.log('----------------------------')

        console.log('id : ' + user_id)
        console.log('course_name : ' + course_name)

        pool.query(
            "SELECT id FROM course where name = ?",
            [course_name],
            async (err, result) => {


                var course_id = result[0].id;
                console.log('ilk query içi : ' + course_id)

                pool.query(
                    "SELECT id FROM applications where user_id = ?",
                    [user_id],
                    async (err, result) => {
                        var app_id = result[0].id;

                        console.log('ikinci query içi : ' + app_id)

                        db.execute(
                            'DELETE from app_course where app_id = ? and course_id = ?',
                            [app_id, course_id]
                        );

                        res.status(201).send({
                            message: 'Course deleted Succesfully'
                        });
                    },
                );
            }
        );
        return;
    } catch (err) {
        if (!err.statusCode) {
            res.status(400).send({
                message: "Course delete Failed!"
            });
            return;
        }
        next(err);
    }

};

exports.getUserCourses = (req, res, next) => {
    const user_id = req.body.user_id;


    try {
        const userCourses = [];
        pool.query(
            "SELECT id FROM applications where user_id = ?",
            [user_id],
            async (err, result) => {
                var app_id = result[0].id;

                pool.query(
                    "SELECT * FROM app_course ac inner join course c on ac.course_id = c.id where app_id = ?",
                    [app_id],
                    async (err, result) => {

                        for (var i = 0; i < result.length; i++) {
                            var a = {
                                name: result[i].name,
                                dept_name: result[i].dept_name,
                                app_id: result[i].app_id,
                            };
                            userCourses.push(a);
                        }
                        console.log(userCourses),
                            res.status(201).send(userCourses)
                    },
                );
            }
        );
        return;
    } catch (err) {
        if (!err.statusCode) {
            res.status(400).send({
                message: "User Courses Cannot Take!"
            });
            return;
        }
        next(err);
    }
};

exports.controlAdded = (req, res, next) => {

    try {
        var course_name = req.body.course_name;
        var user_id = req.body.user_id;

        pool.query(
            "SELECT id FROM course where name = ?",
            [course_name],
            async (err, result) => {


                var course_id = result[0].id;

                pool.query(
                    "SELECT id FROM applications where user_id = ?",
                    [user_id],
                    async (err, result) => {
                        var app_id = result[0].id;

                        console.log('ikinci query içi : ' + app_id)

                        pool.query(
                            "SELECT count(*) as count FROM app_course where app_id = ? and course_id = ? ",
                            [app_id, course_id],
                            async (err, result) => {

                                if (result[0].count != 0) {
                                    res.status(201).send('true')
                                } else {
                                    res.status(201).send('false')
                                }

                            },
                        );
                    },
                );
            }
        );
        return;
    } catch (err) {
        if (!err.statusCode) {
            res.status(400).send({
                message: "Course delete Failed!"
            });
            return;
        }
        next(err);
    }
};

exports.approveApplication = (req, res, next) => {

    try {
        var schoolar = req.body.schoolar;
        var user_id = req.body.user_id;

        pool.query(
            "SELECT id, program FROM applications where user_id = ?",
            [user_id],
            async (err, result) => {
                var app_id = result[0].id;
                var program_name = result[0].program;

                pool.query(
                    "select q.id, q.remaining_quota from programs p inner join quota q on p.id = q.program_id where p.name = ? and q.percent = ?",
                    [program_name, schoolar],
                    async (err, result) => {
                        var q_id = result[0].id
                        var last_quota = result[0].remaining_quota
                        var new_quota = last_quota - 1
                        db.execute(
                            "UPDATE quota set remaining_quota = ? where id = ? ",
                            [new_quota,q_id]);
                
                    },
                );
                db.execute(
                    "UPDATE applications set stage = 'Approved' where id = ?",
                    [app_id]);

                var dt = dateTime.create();
                var formatted = dt.format('Y-m-d H:M:S');

                db.execute(
                    'INSERT INTO approved_applications (app_id, scholarship, approve_date, is_delete) VALUES (?, ?, ?, ?)',
                    [app_id, schoolar, formatted, 0]
                );

                

                res.status(201).send('true');


            },
        );
        return;
    } catch (err) {
        if (!err.statusCode) {
            res.status(400).send('false');
            return;
        }
        next(err);
    }
};

exports.rejectApplication = (req, res, next) => {

    try {
        var reject_reason = req.body.reject_reason;
        var user_id = req.body.user_id;
        console.log(reject_reason)
        console.log(user_id)

        pool.query(
            "SELECT id FROM applications where user_id = ?",
            [user_id],
            async (err, result) => {
                var app_id = result[0].id;

                db.execute(
                    "UPDATE applications set stage = 'Rejected' where id = ?",
                    [app_id]);

                var dt = dateTime.create();
                var formatted = dt.format('Y-m-d H:M:S');

                db.execute(
                    'INSERT INTO rejected_applications (app_id, reject_reason, reject_date, is_delete) VALUES (?, ?, ?, ?)',
                    [app_id, reject_reason, formatted, 0]
                );

                res.status(201).send('true');


            },
        );
        return;
    } catch (err) {
        if (!err.statusCode) {
            res.status(400).send('false');
            return;
        }
        next(err);
    }
};

exports.isCreateApplication = (req, res, next) => {

    try {
        var user_id = req.body.user_id;

        pool.query(
            "SELECT count(id) as count FROM applications where user_id = ?",
            [user_id],
            async (err, result) => {

                if (result[0].count != 0) {
                    res.status(201).send('true');
                }else{
                    res.status(201).send('false');
                }
            },
        );
        return;
    } catch (err) {
        if (!err.statusCode) {
            res.status(400).send('false');
            return;
        }
        next(err);
    }
};

exports.isUploadMandatory = (req, res, next) => {

    try {
        var user_id = req.body.user_id;

        pool.query(
            "SELECT count(id) as count FROM document where user_id = ? and title = 'Copy of Passport / ID Card (*)'",
            [user_id],
            async (err, result) => {

                if (result[0].count != 0) {
                    res.status(201).send('true');
                }else{
                    res.status(201).send('false');
                }
            },
        );
        return;
    } catch (err) {
        if (!err.statusCode) {
            res.status(400).send('false');
            return;
        }
        next(err);
    }
};

exports.sendInterviewRequest = (req, res, next) => {

    try {
        var user_id = req.body.user_id;

        pool.query(
            "SELECT email from users where id = ?",
            [user_id],
            async (err, result) => {
                var email = result[0].email




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
                var mailOptions = {
                    from: "applicationdestek@hotmail.com",
                    to: email,
                    subject: "Interview Invitation",
                    text: "An interview will be held for your application with the department chair you applied for. You will be contacted as soon as possible about the place and time of the interview.",
                };
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log("Email sent: " + info.response);
                    }
                });

                db.execute(
                    "UPDATE applications set stage = 'Interview' where user_id = ?",
                    [user_id]);

                db.execute(
                    "UPDATE applications set interview_req = true where user_id = ?",
                    [user_id]);


                res.status(201).send('true');


            },
        );
        return;
    } catch (err) {
        if (!err.statusCode) {
            res.status(400).send('false');
            return;
        }
        next(err);
    }
};



exports.getProgramQuotaInfos = (req, res, next) => {

    try {
        var programQuotaInfo = []
        var user_id = req.body.user_id;

        pool.query(
            "select q.percent, q.remaining_quota from applications a inner join programs p on a.program = p.name inner join quota q on p.id = q.program_id where a.user_id = ?",
            [user_id],
            async (err, result) => {

                for (var i = 0; i < result.length; i++) {
                    var a = {
                        percent: result[i].percent,
                        remaining_quota: result[i].remaining_quota,
                    };
                    programQuotaInfo.push(a);
                }
                res.status(201).send(programQuotaInfo)
            },
        );
        return;
    } catch (err) {
        if (!err.statusCode) {
            res.status(400).send('false');
            return;
        }
        next(err);
    }
};
