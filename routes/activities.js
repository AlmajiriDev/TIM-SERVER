const express = require("express");
const { verifyAccessToken, isLoggedIn } = require("../controllers/refreshToken");
const router = express.Router();
const activityController = require('../controllers/activity')
const eventController = require('../controllers/event')

//ACTVITY ROUTES
router.get('/activities', verifyAccessToken, isLoggedIn, activityController.getAllActivities)
router.get('/activities/:activityId', verifyAccessToken, isLoggedIn, activityController.fetchActivityDetails)
router.post('/activities', verifyAccessToken, isLoggedIn, activityController.createActivity)
router.put('/activities/:activityId', verifyAccessToken, isLoggedIn, activityController.updateActivity)
router.delete('/activities/:activityId', verifyAccessToken, isLoggedIn, activityController.deleteActivity)


// //EVENTS ROUTES
// router.get('/events', verifyAccessToken, isLoggedIn, eventController.getAllevents)
// router.get('/events/:eventId', verifyAccessToken, isLoggedIn, eventController.fetcheventDetails)
// router.post('/events', verifyAccessToken, isLoggedIn, eventController.createEvent)
// router.put('/events/:eventId', verifyAccessToken, isLoggedIn, eventController.updateEvent)
// router.delete('/events/:eventId', verifyAccessToken, isLoggedIn, eventController.dele)

    

module.exports = router;
