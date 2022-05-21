const uploadFile = require("../middleware/upload");
const fs = require("fs");
const fsPromises = require("fs/promises");
const baseUrl = "http://localhost:3000/files/";

const db = require('../util/database');

const mysql = require('mysql2');

const config = require('../config/config.json');

var dateTime = require('node-datetime');

const pool = mysql.createPool({
    host: config.host,
    user: config.user,
    database: config.database,
});


const upload = async (req, res) => {
    try {
        await uploadFile(req, res);

        const user_id = req.params.user_id;
        console.log('parametreye buradan ulaşabiliyor muyum ? ')

        if (req.file == undefined) {
            return res.status(400).send({
                message: "Please upload a file!"
            });
        }

        res.status(200).send({
            message: "Uploaded the file successfully: " + req.file.originalname,
        });
    } catch (err) {
        console.log(err);

        
        console.log('buraya mı düşüyorum');

        if (err.code == "LIMIT_FILE_SIZE") {
            return res.status(500).send({
                message: "File size cannot be larger than 2MB!",
            });
        }

        res.status(500).send({
            message: `Could not upload the file: ${req.file.originalname}. ${err}`,
        });
    }
};

const getListFiles = (req, res) => {
    const user_id = req.body.id;
    const directoryPath = __basedir + "/resources/static/assets/uploads/" + user_id;


    try {
        const fileInfos = [];
        pool.query(
            "SELECT * FROM document where user_id = ?",
            [user_id],
            async (err, result) => {
                
                for (var i = 0; i < result.length; i++) {
                    var a = {
                        title: result[i].title,
                        name: result[i].name,
                        url: baseUrl + result[i].name+'&'+user_id,
                        all_url: directoryPath+ '/' + result[i].name,
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

const download = (req, res) => {
    const fileName = req.params.name;
    const user_id = req.params.user_id;
    const directoryPath = __basedir + "/resources/static/assets/uploads/"+user_id+"/";

    res.download(directoryPath + fileName, fileName, (err) => {
        if (err) {
            res.status(500).send({
                message: "Could not download the file. " + err,
            });
        }
    });
};

const deleteFiles = (req, res) => {
    const url = req.body.document_url;
    const user_id = req.body.id;
    const file_name = req.body.file_name;
    console.log(url)
    
        try {
            fsPromises.unlink(url);
            console.log('Successfully removed file!');

            db.execute(
                'DELETE FROM document where user_id = ? and name = ?',
                [user_id,file_name]
            );

            res.status(200).send({
                message: "Successfully removed file! "
            });

        } catch (err) {
            res.status(500).send({
                message: "File remove failed. " + err,
            });
        }

        
        


};

module.exports = {
    upload,
    getListFiles,
    download,
    deleteFiles,
};