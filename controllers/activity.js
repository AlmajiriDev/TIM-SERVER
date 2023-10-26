const { default: mongoose } = require("mongoose")
const {InstitutionProfile} = require("../models/Profiles/institutionProfile")
const {StateProfile} = require("../models/Profiles/stateProfile")
const {User} = require("../models/user")
const {ZoneProfile} = require("../models/Profiles/zoneProfile")
const uploadImage = require('../middlewares/cloudinaryUpload')
const { Activity, validateActivity, validateUpdateActivity } = require("../models/activities")



async function activityCreate(activityName, concurrency, venue, time, description) {
    let activityData = {
        activityName: activityName,
        concurrency: concurrency,
        venue: venue, 
        time:time, 
        description: description
    }
    let result = await Activity.create(activityData)
    return result
}


exports.getAllActivities = async (req, res, next) => {
  try {
    const { _id } = req.payload;
    const userId = mongoose.Types.ObjectId(_id);

    const user = await User.findById(userId).select("nec_profile zone_profile state_profile institutition_profile account_type");
  
      if (!user) {
        return res.status(404).json({ message: "User does not exist!" });
      }
    
    const nPid = user.nec_profile
    const zPid = user.zone_profile
    const sPid = user.state_profile
    const iPid = user.institution_profile
    const typeOfAccount = user.account_type


    if (typeOfAccount === "zone"){
      const zoneProfile = await ZoneProfile.findById(zPid).populate({
        path: 'activities',
        select: '-__v -createdAt -updatedAt', 
      });
      
      if (!zoneProfile) {
        return res.status(404).json({ message: "Zone profile does not exist!" });
      }
  
      const activities = zoneProfile.activities;
    
      res.status(200).json({ activities });
    }
    else if (typeOfAccount === "state") {
      const stateProfile = await StateProfile.findById(sPid).populate({
        path: 'activities',
        select: '-__v -createdAt -updatedAt', 
      });
      
      if (!stateProfile) {
        return res.status(404).json({ message: "State profile does not exist!" });
      }
  
      const activities = stateProfile.activities;
    
      res.status(200).json({ activities });
    }
    else {
      const institutionProfile = await InstitutionProfile.findById(iPid).populate({
        path: 'activities',
        select: '-__v -createdAt -updatedAt', 
      });
      
      if (!institutionProfile) {
        return res.status(404).json({ message: "Institution profile does not exist!" });
      }
      
      const activities = institutionProfile.activities;
    
      res.status(200).json({ activities });
    }         
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}



exports.fetchActivityDetails = async (req, res, next) => {
  try {   
    const activityId = req.params.activityId;
    const activity = await Activity.findById(activityId).select('-__v -createdAt -updatedAt -_id');

    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' })
    }
    res.status(200).json({ activity })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err);
  }
}



exports.createActivity = async (req, res, next) => {
  try {
    const { _id } = req.payload;
    const userId = mongoose.Types.ObjectId(_id);

    // Validate input
    const { error } = validateActivity(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const user = await User.findById(userId).select(
      "profile_status nec_profile zone_profile state_profile institutition_profile account_type"
    );

    if (!user) {
      return res.status(404).json({ message: "User does not exist!" });
    }

    const pStatus = user.profile_status;
    const nPid = user.nec_profile;
    const zPid = user.zone_profile;
    const sPid = user.state_profile;
    const iPid = user.institution_profile;
    const typeOfAccount = user.account_type;
    console.log(typeOfAccount);

    if (pStatus === 3) {
      const newActivity = await activityCreate(
        req.body.activityName,
        req.body.concurrency,
        req.body.venue,
        req.body.time,
        req.body.description
      ) 
      if (typeOfAccount === "zone") {
        const zoneProfile = await ZoneProfile.findById(zPid);
        if (!zoneProfile) {
          return res.status(404).json({ message: "Zone profile does not exist!" });
        }
        zoneProfile.activities.push(newActivity._id);
        await zoneProfile.save();
      } else if (typeOfAccount === "state") {
        const stateProfile = await StateProfile.findById(sPid);
        if (!stateProfile) {
          return res.status(404).json({ message: "State profile does not exist!" });
        }
        stateProfile.activities.push(newActivity._id);
        await stateProfile.save();
      } else {
        const institutionProfile = await InstitutionProfile.findById(iPid);
        if (!institutionProfile) {
          return res.status(404).json({ message: "Institution profile does not exist!" });
        }
        institutionProfile.activities.push(newActivity._id);
        await institutionProfile.save();
      }
      return res.status(201).json({ message: "Activity details added successfully!" });
    }
    else {
      return res.status(400).json({message: "User not authorized to add activity"})
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

  

exports.updateActivity= async (req, res, next) => {
  try {
      const { _id } = req.payload;
      const userId = mongoose.Types.ObjectId(_id);
      const activityId = req.params.activityId

      const { error } = validateUpdateActivity(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      
      const user = await User.findById(userId).select("profile_status zone_profile state_profile institutition_profile account_type");
  
      if (!user) {
        return res.status(404).json({ message: "User does not exist!" });
      }

      const zPid = user.zone_profile
      const sPid = user.state_profile
      const iPid = user.institution_profile
      const typeOfAccount = user.account_type
      
      if (typeOfAccount === "zone"){
        const zoneProfile = await ZoneProfile.findById(zPid);
        if (!zoneProfile) {
          return res.status(404).json({ message: "Zone profile does not exist!" });
        }
        const activityIndex = zoneProfile.activities.findIndex(
          (activity) => activity._id.toString() === activityId
          )        

          // check if activity exists in the zone profile
          if (activityIndex === -1) {
            return res.status(404).json({ message: "Activity does not exist in zone profile!" });
          }
      }
      else if (typeOfAccount === "state") {
        const stateProfile = await StateProfile.findById(sPid);  
        if (!stateProfile) {
          return res.status(404).json({ message: "State profile does not exist!" });
        }
        const activityIndex = stateProfile.activities.findIndex(
          (activity) => activity._id.toString() === activityId
          )        
          // check if activity exists in the state profile
          if (activityIndex === -1) {
            return res.status(404).json({ message: "Activity does not exist in state profile!" });
          }
      }
      else {
        const institutionProfile = await InstitutionProfile.findById(iPid);  
        if (!institutionProfile) {
          return res.status(404).json({ message: "Institution profile does not exist!" });
        }

        const activityIndex = institutionProfile.activities.findIndex(
          (activity) => activity._id.toString() === activityId
          )        
          
          // check if activity exists in the institution profile
          if (activityIndex === -1) {
            return res.status(404).json({ message: "Activity does not exist in Institution profile!" });
          }

      }
      
      Activity.findById(activityId, async (err, activity)=>{
          if(err){
            return res.status(404).json({ message: "Zone Profile not found" })
          }
          try {
            activity.activityName = req.body.activityName !== "" ? req.body.activityName : activity.activityName
            activity.concurrency = req.body.concurrency !== "" ? req.body.concurrency : activity.concurrency
            activity.venue = req.body.venue !== "" ? req.body.venue : activity.venue
            activity.time = req.body.time !== "" ? req.body.time : activity.time
            activity.description = req.body.description !== "" ? req.body.description : activity.description
      
            const activityUpdated = await activity.save()
            console.log("Activity updated:", activityUpdated);
            res.status(201).json({message: "Activity details updated"})
          } catch (err) {
            if (err) { 
              console.error(err);
              const errMessage = "Something went wrong, please try again!";
              return res.status(500).json({ message: errMessage });
            }
          }     
          })
      } catch (err) {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      }
}

exports.deleteActivity = async (req, res, next) => {
  try {
    const { _id } = req.payload;
      const userId = mongoose.Types.ObjectId(_id);
      const activityId = req.params.activityId
  
      const user = await User.findById(userId).select("profile_status zone_profile state_profile institutition_profile account_type");

      if (!user) {
        return res.status(404).json({ message: "User does not exist!" });
      }

      const zPid = user.zone_profile
      const sPid = user.state_profile
      const iPid = user.institution_profile
      const typeOfAccount = user.account_type
      
      if (typeOfAccount === "zone"){
        const zoneProfile = await ZoneProfile.findById(zPid)
        const activityIndex = zoneProfile.activities.findIndex(
          (activity) => activity._id.toString() === activityId
          )        

          // check if activity exists in the zone profile
          if (activityIndex === -1) {
            return res.status(404).json({ message: "Activity does not exist in zone profile!" });
          }          
          const activities = zoneProfile.activities
          const deleteActvityIndex = await ZoneProfile.findByIdAndUpdate(
            zPid,
            { $pull: { activities: { $eq: activities[activityIndex] } } },
            { new: true }
          )
    
          if (!deleteActvityIndex) {
            return res.status(404).json({ message: "Zone profile does not exist!" });
          }
      } else if (typeOfAccount === "state"){
        const stateProfile = await StateProfile.findById(zPid)
        const activityIndex = stateProfile.activities.findIndex(
            (activity) => activity._id.toString() === activityId
            )        
  
            // check if activity exists in the zone profile
            if (activityIndex === -1) {
              return res.status(404).json({ message: "Activity does not exist in zone profile!" });
            }          
          const activities = stateProfile.activities
          const deleteActivityIndex = await StateProfile.findByIdAndUpdate(
            sPid,
            { $pull: { activities: { $eq: activities[activityIndex] } } },
            { new: true }
          )
    
          if (!deleteActivityIndex) {
            return res.status(404).json({ message: "State profile does not exist!" });
          }
      } else {
          const institutionProfile = await InstitutionProfile.findById(iPid)
          const activityIndex = institutionProfile.activities.findIndex(
            (activity) => activity._id.toString() === activityId
            )        
                      
            // check if activity exists in the zone profile
            if (activityIndex === -1) {
              return res.status(404).json({ message: "Activity does not exist in state profile!" });
            }          
            const activities = institutionProfile.activities
            const deleteActvityIndex = await InstitutionProfile.findByIdAndUpdate(
              iPid,
              { $pull: { activities: { $eq: activities[activityIndex] } } },
              { new: true }
            )
      
            if (!deleteActvityIndex) {
              return res.status(404).json({ message: "Institution profile does not exist!" });
            }
      }
      Activity.findById(activityId, async (err, activity)=>{
          if(err){
            return res.status(404).json({ message: "Activity not found" })
          }          
          try {       
            const activityDeleted = await activity.remove()
            console.log("Activity deleted:", activityDeleted)
            res.status(201).json({message: "Activity deleted"})
          } catch (err) {
            if (err) { 
              console.error(err);
              const errMessage = "Something went wrong, please try again!";
              return res.status(500).json({ message: errMessage });
            }
          }     
        })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}
