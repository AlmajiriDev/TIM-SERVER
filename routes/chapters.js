const express = require("express");
const { verifyAccessToken, isLoggedIn } = require("../controllers/refreshToken");
const router = express.Router();
const chaptersController = require('../controllers/chapters')

router.get('/institution-chapters', chaptersController.getAllInstitutionChapters)
router.get('/state-chapters', chaptersController.getAllStateChapters)
router.get('/zone-chapters', chaptersController.getAllZoneChapters)


module.exports = router;