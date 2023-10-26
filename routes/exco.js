const express = require("express");
const { verifyAccessToken, isLoggedIn } = require("../controllers/refreshToken");
const router = express.Router();
const excoController = require("../controllers/exco")
const { uploadImage } = require("../middlewares/uploadImage");


//EXCO PROFILE ROUTES
router.get("/exco", verifyAccessToken,isLoggedIn,  excoController.getAllExcos)
router.post("/exco", verifyAccessToken,isLoggedIn, uploadImage,  excoController.createExcoProfile)
router.get("/exco/:excoId", verifyAccessToken, isLoggedIn,  excoController.fetchExcoDetails)
router.put("/exco/:excoId", verifyAccessToken,isLoggedIn, uploadImage,  excoController.updateExcoProfile)
router.delete("/exco/:excoId", verifyAccessToken,isLoggedIn,  excoController.deleteExcoProfile)




module.exports = router;
