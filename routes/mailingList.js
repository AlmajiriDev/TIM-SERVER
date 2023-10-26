const express = require("express");
const router = express.Router();
const mailingListController = require('../controllers/mailingList')

router.post("/", mailingListController.acceptMailingList)

module.exports = router
