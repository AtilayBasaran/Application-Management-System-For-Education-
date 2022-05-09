const util = require("util");
var path = require('path');
const multer = require("multer");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const maxSize = 2 * 1024 * 1024;

let storage = multer.diskStorage({

    destination: (req, file, cb) => {
        console.log(req.params.user_id);
        directoryPath = req.params.user_id;

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
        cb(null, file.originalname);
    },
});
let uploadFile = multer({
    storage: storage,
    limits: {
        fileSize: maxSize
    },
}).single("file");
let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;