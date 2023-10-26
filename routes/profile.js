const express = require("express");
const { verifyAccessToken, isLoggedIn } = require("../controllers/refreshToken");
const router = express.Router();
const profileController = require("../controllers/profile");
const { uploadImage } = require("../middlewares/uploadImage");
const zoneActionControllers = require("../controllers/zoneActions")

//MEMBER PRFILE ROUTES
router.post("/member", verifyAccessToken,isLoggedIn, uploadImage,  profileController.createMemberProfile);
router.put("/member", verifyAccessToken,isLoggedIn, uploadImage,  profileController.updateMemberProfile);
router.get("/member", verifyAccessToken, isLoggedIn, profileController.fetchMemberProfileDetails);

//INSTITUTION PROFILE ROUTES
router.post("/institution", verifyAccessToken, isLoggedIn, uploadImage,  profileController.createInstitutionProfile)
router.put("/institution", verifyAccessToken, isLoggedIn, uploadImage, profileController.updateInstitutionProfile)
router.get("/institution", verifyAccessToken,isLoggedIn, profileController.fetchInstitutionProfile)

//STATE PROFILE ROUTES
router.post("/state", verifyAccessToken, isLoggedIn, uploadImage, profileController.createStateProfile)
router.put("/state", verifyAccessToken, isLoggedIn, uploadImage, profileController.updateStateProfile)
router.get("/state", verifyAccessToken, isLoggedIn, profileController.fetchStateProfile)

//ZONE PROFILE ROUTES
router.post("/zone", verifyAccessToken, isLoggedIn, uploadImage, profileController.createZoneProfile)
router.put("/zone", verifyAccessToken, isLoggedIn, uploadImage, profileController.updateZoneProfile)
router.get("/zone", verifyAccessToken, isLoggedIn, profileController.fetchZoneProfile)

//NEC PROFILE ROUTES
router.post("/nec", verifyAccessToken, isLoggedIn, uploadImage, profileController.createNecProfile)
router.put("/nec", verifyAccessToken, isLoggedIn, uploadImage, profileController.updateNecProfile)
router.get("/nec", verifyAccessToken, isLoggedIn, profileController.fetchNecProfile)

// router.get("/zone/states", verifyAccessToken, isLoggedIn, zoneActionControllers.zoneGetAllStates)
// router.get("/zone/states/:stateId", verifyAccessToken, isLoggedIn, zoneActionControllers.zone)

//To get all patrons in zone
// router.get("/patron/:zoneId", verifyAccessToken,isLoggedIn, )

//To get all excos in zone


module.exports = router;
