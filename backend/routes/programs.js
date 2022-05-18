const express = require('express');

const {
    body
} = require('express-validator');

const router = express.Router();

const programController = require('../controllers/programs');


router.post(
    '/getProgramInfo', programController.getProgramInfo
);

router.get(
    '/getAllProgram', programController.getAllProgram
);


module.exports = router;