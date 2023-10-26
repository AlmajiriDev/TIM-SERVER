const express = require("express");
const { verifyAccessToken, isLoggedIn } = require("../controllers/refreshToken");
const router = express.Router();
const zoneActionController = require("../controllers/zoneActions")

router.get("/zonal-body/states", verifyAccessToken, isLoggedIn, zoneActionController.zoneGetAllStates)
router.get("/zonal-body/states/activities/:stateId", verifyAccessToken, isLoggedIn, zoneActionController.zoneGetStateActivites)
router.get("/zonal-body/states/events/:stateId", verifyAccessToken, isLoggedIn, zoneActionController.zoneGetStateEvents)
router.get("/zonal-body/states/excos/:stateId", verifyAccessToken, isLoggedIn, zoneActionController.zoneGetStateExcos)
router.get("/zonal-body/states/patrons/:stateId", verifyAccessToken, isLoggedIn, zoneActionController.zoneGetStatePatrons)
router.get("/zonal-body/states/institutions/:stateId", verifyAccessToken, isLoggedIn, zoneActionController.zoneGetStateInstitutions)
router.get("/zonal-body/institution/members/:institutionId", verifyAccessToken, isLoggedIn, zoneActionController.zoneGetInstitutionMembers)
router.get("/zonal-body/institution/activities/:institutionId", verifyAccessToken, isLoggedIn, zoneActionController.zoneGetInstitutionActivities)
router.get("/zonal-body/institution/excos/:institutionId", verifyAccessToken, isLoggedIn, zoneActionController.zoneGetInstitutionExcos)
router.get("/zonal-body/institution/patrons/:institutionId", verifyAccessToken, isLoggedIn, zoneActionController.zoneGetInstitutionPatrons)
router.get("/zonal-body/institution/events/:institutionId", verifyAccessToken, isLoggedIn, zoneActionController.zoneGetInstitutionEvents)


module.exports = router;
