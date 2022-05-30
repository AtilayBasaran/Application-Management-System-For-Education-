const express = require('express');

const { body } = require('express-validator');

const router = express.Router();

const homeController = require('../controllers/home');

router.get(
    '/getApplicationInfo', homeController.getApplicationInfo
);

router.post(
    '/acceptDocument', homeController.acceptDocument
);

router.post(
    '/rejectDocument', homeController.rejectDocument
);

router.post(
    '/controlAllControlled', homeController.controlAllControlled
);

router.post(
    '/changeStatus', homeController.changeStatus
);




module.exports = router;