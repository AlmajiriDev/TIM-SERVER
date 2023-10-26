const express = require("express");
const router = express.Router();
const tiletsController = require("../controllers/tilets")

router.get("/sessions", tiletsController.getAllTiletsSessions)




module.exports = router;