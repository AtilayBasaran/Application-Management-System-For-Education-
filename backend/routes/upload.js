const express = require("express");
const router = express.Router();
const controller = require("../controllers/file_upload");
let routes = (app) => {
    router.post("/upload/:user_id", controller.upload);
    /*router.get("/files", controller.getListFiles);
    router.get("/files/:name", controller.download);*/
    app.use(router);
};
module.exports = routes;