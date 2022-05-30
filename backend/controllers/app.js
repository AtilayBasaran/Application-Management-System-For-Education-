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

    
    var dt = dateTime.create();
    var formatted = dt.format('Y-m-d H:M:S');
        dept_name = 'cse';
        register_date = formatted;
        agency_email = '';
        stage = 'controlling';
        is_delete = false;
        interview_req = 'false';
try{
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
}catch(err){
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