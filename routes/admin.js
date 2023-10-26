const express = require("express");
const router = express.Router();
const newsController = require("../controllers/news")


//news
router.post("/postNews", newsController.postNews)
router.put("/updateNews/:newsId", newsController.updateNews)
router.delete("/deleteNews/:newsId", newsController.deleteNews)

//broadcasts
router.post("/postBroadcast", newsController.postBroadcast) 
router.put("/updateBroadcast/:broadcastId", newsController.updateBroadcast)
router.delete("/deleteBroadcast/:broadcastId", newsController.deleteBroadcast)


module.exports = router;
