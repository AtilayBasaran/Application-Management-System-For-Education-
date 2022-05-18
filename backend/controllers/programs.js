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


exports.getProgramInfo = async (req, res, next) => {
    degree = req.body.type;
    
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
                        degree: result[i].degree,
                        language: result[i].language,
                        duration: result[i].duration,
                        campus : result[i].campus,
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

exports.getAllProgram = async (req, res, next) => {
    
    try {
        const programInfos = [];
        pool.query(
            "SELECT * FROM programs",
            async (err, result) => {
                
                for (var i = 0; i < result.length; i++) {
                    var a = {
                        id: result[i].id,
                        name: result[i].name,
                        faculty: result[i].faculty,
                        degree: result[i].degree,
                        language: result[i].language,
                        duration: result[i].duration,
                        campus : result[i].campus,
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