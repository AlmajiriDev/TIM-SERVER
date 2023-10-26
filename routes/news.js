const express = require("express");
const router = express.Router();
const newsController = require("../controllers/news");
const { verifyAccessToken, isLoggedIn, isAdmin } = require("../controllers/refreshToken");
const { uploadImage } = require("../middlewares/uploadImage");


//news
router.get("/allnews", newsController.getAllNews)
router.post("/post-news", verifyAccessToken, isLoggedIn, isAdmin, uploadImage, newsController.postNews)
router.put("/edit-news/:postId", verifyAccessToken, isLoggedIn, isAdmin, uploadImage, newsController.updateNews)
router.delete("/delete-news/:postId", verifyAccessToken, isLoggedIn, isAdmin, newsController.deleteNews )

 
// broadcasts
router.get("/allBroadcasts",  verifyAccessToken, isLoggedIn, isAdmin, newsController.getAllBroadcast)
router.put("/:bcId/approve", verifyAccessToken, isLoggedIn, isAdmin, newsController.approveBC)
router.put("/:bcId/disApprove", verifyAccessToken, isLoggedIn, isAdmin, newsController.disApproveBC)

router.get("/allApprovedBCs", newsController.getAllApprovedBroadcasts)
router.post("/post-bc", verifyAccessToken, isLoggedIn, uploadImage, newsController.postBroadcast)
router.put("/edit-bc/:bcId", verifyAccessToken, isLoggedIn, uploadImage, newsController.updateBroadcast)
router.delete("/delete-bc/:bcId", verifyAccessToken, isLoggedIn, newsController.deleteBroadcast)

//News-letter
router.post("/subscribe", newsController.subscribeNewsLetter)

module.exports = router;
