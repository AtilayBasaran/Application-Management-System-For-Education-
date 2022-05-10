const express = require('express');

const {
    body
} = require('express-validator');

const router = express.Router();

const User = require('../models/user');

const settingsController = require('../controllers/settings');


router.post(
    '/addCourse', settingsController.addCourse
);

router.post(
    '/changeCourseName', settingsController.changeCourseName
);

router.get(
    '/userDetails', settingsController.userDetails
);

router.get(
    '/courseDetails', settingsController.courseDetails
);

router.get(
    '/deleteUser/:userid', settingsController.deleteUser
);

router.get(
    '/deleteCourse/:course_id', settingsController.deleteCourse
);

router.get(
    '/updateInstitute/:userid', settingsController.updateInstitute
);

router.get(
    '/updateHeadOfDept/:userid', settingsController.updateHeadOfDept
);

module.exports = router;