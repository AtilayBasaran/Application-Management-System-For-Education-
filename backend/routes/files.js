const express = require('express');

const {
    body
} = require('express-validator');

const router = express.Router();

const filesController = require('../controllers/file_upload');


router.post("", filesController.getListFiles);
router.post("/delete", filesController.deleteFiles);
router.get("/:name", filesController.download);

module.exports = router;