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

        console.log('educational Info tarafı ------------')
        console.log(university)
        console.log(highest_qualification)
        console.log(total_marks)
        console.log('educational Info tarafı ------------')

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

        console.log('address Info tarafı ------------')
        console.log(city)
        console.log(address)
        console.log(pincode)
        console.log('address Info tarafı ------------')

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
    console.log('içerdeyimmm');
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