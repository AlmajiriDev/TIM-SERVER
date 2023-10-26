const express = require("express");
const { verifyAccessToken, isLoggedIn } = require("../controllers/refreshToken");
const router = express.Router();
const patronController = require("../controllers/patron")
const { uploadImage } = require("../middlewares/uploadImage");


//PATRON PROFILE ROUTES
router.get("/patron", verifyAccessToken,isLoggedIn,  patronController.getAllPatrons)
router.post("/patron", verifyAccessToken,isLoggedIn,uploadImage, patronController.createPatronProfile)
router.get("/patron/:patronId", verifyAccessToken, isLoggedIn,  patronController.fetchPatronDetails)
router.put("/patron/:patronId", verifyAccessToken,isLoggedIn, uploadImage,  patronController.updatePatronProfile)
router.delete("/patron/:patronId", verifyAccessToken,isLoggedIn,  patronController.deletePatronProfile)




module.exports = router;
