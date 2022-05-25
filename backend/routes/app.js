const express = require('express');

const { body } = require('express-validator');

const router = express.Router();

const appController = require('../controllers/app');

router.post(
    '/addPersonal', appController.addPersonal
);

router.post(
    '/addEducational', appController.addEducational
);

router.post(
    '/addAddress', appController.addAddress
);

router.post(
    '/createMainApp', appController.createMainApp
);

router.post(
    '/getProgramInfo', appController.getProgramInfo
);

router.post(
    '/controlTitle', appController.controlTitle
);

router.post(
    '/controlName', appController.controlName
);

router.post(
    '/getUniqueUserFiles', appController.getUniqueUserFiles
);




module.exports = router;