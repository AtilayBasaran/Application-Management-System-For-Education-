const util = require("util");
var path = require('path');
const multer = require("multer");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const {
    validationResult
} = require('express-validator');
const db = require('../util/database');
const mysql = require('mysql2');
var dateTime = require('node-datetime');
const { dir, error } = require("console");
const maxSize = 2 * 1024 * 1024;


let storage = multer.diskStorage({

    destination: (req, file, cb) => {
        console.log(req.params.user_id);
        directoryPath = req.params.user_id;
        console.log('Allahım sen yardım et : '+ req.body.documentTitle)

        let reqPath = path.join(__dirname, '../');
        const a = reqPath;
        console.log(a);

        var dir = reqPath + "/resources/static/assets/uploads/" + directoryPath;
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }


        cb(null, dir);
    },
    filename: (req, file, cb) => {
        console.log(file.originalname);
        
        directoryPath = req.params.user_id;

        let reqPath = path.join(__dirname, '../');
        const a = reqPath;
        console.log(a);

        var dir = reqPath + "/resources/static/assets/uploads/" + directoryPath;
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        cb(null, file.originalname);


        
        var dt = dateTime.create();
        var formatted = dt.format('Y-m-d H:M:S');

        db.execute(
            'INSERT INTO document (user_id, name, is_approve, update_date,is_delete,path,title) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [req.params.user_id, file.originalname, 0,formatted,0, dir, req.body.documentTitle]
        );
    },
});
let uploadFile = multer({
    storage: storage,
    limits: {
        fileSize: maxSize
    },
    onError: function (error, next) {
        console.log(error)
        next(error)
},
}).single("file");
let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;