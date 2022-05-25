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
                        stage : result[i].stage,
                        user_id: result[i].user_id
                    };
                    applicationInfos.push(a);
                }
                console.log('Allahım sen bana yardım et : ')
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