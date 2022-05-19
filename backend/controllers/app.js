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


exports.addPersonal = async (req, res, next) => {

    try {

        var name = req.body.name;
        var email = req.body.email;
        var phone = req.body.phone;
        console.log('Personal Info tarafı ------------')
        console.log(name)
        console.log(email)
        console.log(phone)
        console.log('Personal Info tarafı ------------')

        db.execute(
            'INSERT INTO personal_details (name, email, phone) VALUES (?, ?, ?)',
            [name, email, phone]
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

        var university = req.body.university;
        var highest_qualification = req.body.highest_qualification;
        var total_marks = req.body.total_marks;

        db.execute(
            'INSERT INTO educational_details (university, highQ, totalmarks) VALUES (?, ?, ?)',
            [university, highest_qualification, total_marks]
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
    console.log(req.body.email);

    var dt = dateTime.create();
    var formatted = dt.format('Y-m-d H:M:S');

    pool.query('SELECT * FROM users ', function (err, rows) {
        if (err) throw err;
        user_id = rows[0].id;
        dept_name = 'cse';
        register_date = formatted;
        agency_email = rows[0].agency_email;
        stage = 'controlling';
        is_delete = false;
        interview_req = 'false';

        console.log(user_id);
        console.log(dept_name);
        console.log(register_date);
        console.log(agency_email);
        console.log(stage);
        console.log(is_delete);
        console.log(interview_req);

        db.execute(
            'INSERT INTO applications (user_id, dept_name, register_date, agency_mail, stage, is_delete, interview_req) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [user_id, dept_name, register_date, agency_email, stage, is_delete, interview_req]
        );
    });

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
                if(result != ''){
                    res.status(201).send(true)
                }else{
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
                if(result != ''){
                    res.status(201).send(true)
                }else{
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