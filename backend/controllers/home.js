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


exports.getApplicationInfo = async (req, res, next) => {

    try {
        const applicationInfos = [];
        pool.query(
            "select u.firstname, u.lastname , a.register_date, a.program , u.email, a.agency_mail, a.stage, a.user_id from applications a inner join users u on a.user_id = u.id ",
            async (err, result) => {

                for (var i = 0; i < result.length; i++) {
                    var a = {
                        name: result[i].firstname + ' ' + result[i].lastname,
                        register_date: result[i].register_date,
                        program: result[i].program,
                        email: result[i].email,
                        agency_mail: result[i].agency_mail,
                        stage: result[i].stage,
                        user_id: result[i].user_id
                    };
                    applicationInfos.push(a);
                }
                console.log(applicationInfos),
                    res.status(201).send(applicationInfos)
            },
        );
        return;
    } catch (err) {
        if (!err.statusCode) {
            res.status(400).send({
                message: "Application Information Cannot Take!"
            });
            return;
        }
        next(err);
    }

};

exports.getProfileApplicationDetail = async (req, res, next) => {

    try {
        const user_id = req.body.user_id;
        const applicationInfos = [];
        pool.query(
            "select u.firstname, u.lastname , a.register_date, a.program , u.email, a.agency_mail, a.stage, a.user_id from applications a inner join users u on a.user_id = u.id where a.user_id = ?",
            [user_id],
            async (err, result) => {

                for (var i = 0; i < result.length; i++) {
                    var a = {
                        name: result[i].firstname + ' ' + result[i].lastname,
                        register_date: result[i].register_date,
                        program: result[i].program,
                        email: result[i].email,
                        agency_mail: result[i].agency_mail,
                        stage: result[i].stage,
                        user_id: result[i].user_id
                    };
                    applicationInfos.push(a);
                }
                console.log(applicationInfos),
                    res.status(201).send(applicationInfos)
            },
        );
        return;
    } catch (err) {
        if (!err.statusCode) {
            res.status(400).send({
                message: "Application Information Cannot Take!"
            });
            return;
        }
        next(err);
    }

};

exports.getAgencyApplicationInfo = async (req, res, next) => {
    var agency_email = req.body.email;
    try {
        const applicationInfos = [];
        pool.query(
            "select u.firstname, u.lastname , a.register_date, a.program , u.email, a.agency_mail, a.stage, a.user_id from applications a inner join users u on a.user_id = u.id where a.agency_mail = ?",
            [agency_email],
            async (err, result) => {

                for (var i = 0; i < result.length; i++) {
                    var a = {
                        name: result[i].firstname + ' ' + result[i].lastname,
                        register_date: result[i].register_date,
                        program: result[i].program,
                        email: result[i].email,
                        agency_mail: result[i].agency_mail,
                        stage: result[i].stage,
                        user_id: result[i].user_id
                    };
                    applicationInfos.push(a);
                }
                console.log(applicationInfos),
                    res.status(201).send(applicationInfos)
            },
        );
        return;
    } catch (err) {
        if (!err.statusCode) {
            res.status(400).send({
                message: "Application Information Cannot Take!"
            });
            return;
        }
        next(err);
    }

};

exports.getTurkishApplicationInfo = async (req, res, next) => {

    try {
        const applicationInfos = [];
        pool.query(
            "select u.firstname, u.lastname , a.register_date, a.program , u.email, a.agency_mail, a.stage, a.user_id from applications a inner join users u on a.user_id = u.id inner join personal_details pd on u.id = pd.user_id  where pd.nationality = 'T.C'",
            async (err, result) => {

                for (var i = 0; i < result.length; i++) {
                    var a = {
                        name: result[i].firstname + ' ' + result[i].lastname,
                        register_date: result[i].register_date,
                        program: result[i].program,
                        email: result[i].email,
                        agency_mail: result[i].agency_mail,
                        stage: result[i].stage,
                        user_id: result[i].user_id
                    };
                    applicationInfos.push(a);
                }
                console.log(applicationInfos),
                    res.status(201).send(applicationInfos)
            },
        );
        return;
    } catch (err) {
        if (!err.statusCode) {
            res.status(400).send({
                message: "Application Information Cannot Take!"
            });
            return;
        }
        next(err);
    }

};


exports.getInternationalApplicationInfo = async (req, res, next) => {

    try {
        const applicationInfos = [];
        pool.query(
            "select u.firstname, u.lastname , a.register_date, a.program , u.email, a.agency_mail, a.stage, a.user_id from applications a inner join users u on a.user_id = u.id inner join personal_details pd on u.id = pd.user_id  where pd.nationality = 'international'",
            async (err, result) => {

                for (var i = 0; i < result.length; i++) {
                    var a = {
                        name: result[i].firstname + ' ' + result[i].lastname,
                        register_date: result[i].register_date,
                        program: result[i].program,
                        email: result[i].email,
                        agency_mail: result[i].agency_mail,
                        stage: result[i].stage,
                        user_id: result[i].user_id
                    };
                    applicationInfos.push(a);
                }
                res.status(201).send(applicationInfos)
            },
        );
        return;
    } catch (err) {
        if (!err.statusCode) {
            res.status(400).send({
                message: "Application Information Cannot Take!"
            });
            return;
        }
        next(err);
    }

};

exports.acceptDocument = async (req, res, next) => {
    var user_id = req.body.user_id;
    var file_name = req.body.file_name;
    console.log('Approve document infos : ', user_id, file_name)

    try {
        db.execute(
            'UPDATE document SET is_approve = true , is_controlled = true WHERE user_id = ? and name = ?',
            [user_id, file_name]);

        res.status(201).send(true);
        return;
    } catch (err) {
        if (!err.statusCode) {
            res.status(400).send({
                message: "Application Information Cannot Take!"
            });
            return;
        }
        next(err);
    }

};

exports.rejectDocument = async (req, res, next) => {
    var user_id = req.body.user_id;
    var file_name = req.body.file_name;
    var reject_reason = req.body.reject_reason;

    try {
        db.execute(
            'UPDATE document SET is_approve = false , is_controlled = true , reject_reason = ? WHERE user_id = ? and name = ?',
            [reject_reason, user_id, file_name]);

        res.status(201).send(true);
        return;
    } catch (err) {
        if (!err.statusCode) {
            res.status(400).send({
                message: "Application Information Cannot Take!"
            });
            return;
        }
        next(err);
    }

};

exports.controlAllControlled = async (req, res, next) => {
    var user_id = req.body.user_id;
    try {
        pool.query(
            "select count(*) as count from document where user_id = ? and is_controlled = 0",
            [user_id],
            async (err, result) => {
                if (result[0].count == 0) {
                    res.status(201).send('true')
                } else {
                    res.status(201).send('false')
                }
            },
        );
        return;
    } catch (err) {
        if (!err.statusCode) {
            res.status(400).send({
                message: "Error Occured !"
            });
            return;
        }
        next(err);
    }

};

exports.changeStatus = async (req, res, next) => {
    var user_id = req.body.user_id;
    var is_all_approved = false;
    try {
        pool.query(
            "select count(*) as count from document where user_id = ? and is_controlled = 1 and is_approve = 0",
            [user_id],
            async (err, result) => {
                if (result[0].count == 0) {
                    is_all_approved = true;
                } else {
                    is_all_approved = false;
                }
                if (is_all_approved) {
                    console.log('Edilmiş')
                    db.execute(
                        "UPDATE applications set stage = 'HeadOfDept' where user_id = ?",
                        [user_id]);

                    res.status(201).send({
                        message: "Status updated !"
                    });
                    return;
                } else if (!is_all_approved) {
                    pool.query(
                        "select id from applications where user_id = ?",
                        [user_id],
                        async (err, result) => {
                            app_id = result[0].id


                            db.execute(
                                "UPDATE applications set stage = 'Rejected' where user_id = ?",
                                [user_id]);

                            var dt = dateTime.create();
                            var formatted = dt.format('Y-m-d H:M:S');

                            db.execute(
                                'INSERT INTO rejected_applications (app_id, reject_reason, reject_date, is_delete) VALUES (?, ?, ?, ?)',
                                [app_id, 'document error', formatted, 0]
                            );
                        },
                    );

                    res.status(201).send({
                        message: "Status updated !"
                    });
                    return;
                }
                return;
            },
        );

    } catch (err) {
        if (!err.statusCode) {
            res.status(400).send({
                message: "Application Information Cannot Take!"
            });
            return;
        }
        next(err);
    }

};

exports.postTurkishApplicationInfo = async (req, res, next) => {
    var user_id = req.body.user_id;

    try {
        pool.query(
            "select department from users where id = ?",
            [user_id],
            async (err, result) => {
                var dept = result[0].department
                pool.query(
                    "select u.firstname, u.lastname , a.register_date, a.program , u.email, a.agency_mail, a.stage, a.user_id from applications a inner join users u on a.user_id = u.id inner join personal_details pd on u.id = pd.user_id  where pd.nationality = 'T.C' and a.dept_name = ?",
                    [dept],
                    async (err, result) => {

                        for (var i = 0; i < result.length; i++) {
                            var a = {
                                name: result[i].firstname + ' ' + result[i].lastname,
                                register_date: result[i].register_date,
                                program: result[i].program,
                                email: result[i].email,
                                agency_mail: result[i].agency_mail,
                                stage: result[i].stage,
                                user_id: result[i].user_id
                            };
                            applicationInfos.push(a);
                        }
                        console.log(applicationInfos),
                            res.status(201).send(applicationInfos)
                    },
                );
            },
        );
        const applicationInfos = [];
        return;
    } catch (err) {
        if (!err.statusCode) {
            res.status(400).send({
                message: "Application Information Cannot Take!"
            });
            return;
        }
        next(err);
    }

};


exports.postInternationalApplicationInfo = async (req, res, next) => {
    var user_id = req.body.user_id;
    try {
        pool.query(
            "select department from users where id = ?",
            [user_id],
            async (err, result) => {
                var dept = result[0].department
                pool.query(
                    "select u.firstname, u.lastname , a.register_date, a.program , u.email, a.agency_mail, a.stage, a.user_id from applications a inner join users u on a.user_id = u.id inner join personal_details pd on u.id = pd.user_id  where pd.nationality = 'international' and a.dept_name = ?",
                    [dept],
                    async (err, result) => {

                        for (var i = 0; i < result.length; i++) {
                            var a = {
                                name: result[i].firstname + ' ' + result[i].lastname,
                                register_date: result[i].register_date,
                                program: result[i].program,
                                email: result[i].email,
                                agency_mail: result[i].agency_mail,
                                stage: result[i].stage,
                                user_id: result[i].user_id
                            };
                            applicationInfos.push(a);
                        }
                        console.log(applicationInfos),
                            res.status(201).send(applicationInfos)
                    },
                );
            },
        );
        const applicationInfos = [];
        return;
    } catch (err) {
        if (!err.statusCode) {
            res.status(400).send({
                message: "Application Information Cannot Take!"
            });
            return;
        }
        next(err);
    }

};