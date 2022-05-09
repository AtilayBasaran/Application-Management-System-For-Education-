const express = require('express');

const {
    body
} = require('express-validator');

const router = express.Router();

const filesController = require('../controllers/file_upload');


router.get("", filesController.getListFiles);
router.get("/:name", filesController.download);

module.exports = router;