const express = require('express');

const { body } = require('express-validator');

const router = express.Router();

const homeController = require('../controllers/home');

router.get(
    '/getApplicationInfo', homeController.getApplicationInfo
);

router.get(
    '/getTurkishApplicationInfo', homeController.getTurkishApplicationInfo
);
router.get(
    '/getInternationalApplicationInfo', homeController.getInternationalApplicationInfo
);

router.post(
    '/postTurkishApplicationInfo', homeController.postTurkishApplicationInfo
);
router.post(
    '/postInternationalApplicationInfo', homeController.postInternationalApplicationInfo
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

router.post(
    '/getAgencyApplicationInfo', homeController.getAgencyApplicationInfo
);

router.post(
    '/getProfileApplicationDetail', homeController.getProfileApplicationDetail
);


module.exports = router;