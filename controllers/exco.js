const { default: mongoose } = require("mongoose")
const {InstitutionProfile} = require("../models/Profiles/institutionProfile")
const {ExcoProfile, validateEProfile, validateUpdateEProfile} = require("../models/Profiles/excoProfile")
const {StateProfile} = require("../models/Profiles/stateProfile")
const {User} = require("../models/user")
const {ZoneProfile} = require("../models/Profiles/zoneProfile")
const uploadImage = require('../middlewares/cloudinaryUpload')


async function excoProfileCreate(firstName, lastName, otherNames, course_of_study, post, occupation, graduation_status, graduation_date, state_of_origin, state_of_residence, email, phone, image) {
      let profileDate = {
        firstName: firstName,
        lastName: lastName,
        otherNames: otherNames,
        course_of_study: course_of_study,
        post: post, 
        occupation: occupation,
        graduation_status: graduation_status,
        graduation_date: new Date(graduation_date).toLocaleDateString('en-GB'),
        state_of_origin: state_of_origin,
        state_of_residence: state_of_residence,
        email: email,
        phone: phone,
        image: image
    }
    let result = await ExcoProfile.create(profileDate)
    return result
}



exports.getAllExcos = async (req, res, next) => {
  try {
    const { _id } = req.payload;
    const userId = mongoose.Types.ObjectId(_id);

    const user = await User.findById(userId).select("zone_profile state_profile institutition_profile account_type");
  
      if (!user) {
        return res.status(404).json({ message: "User does not exist!" });
      }
    
    const zPid = user.zone_profile
    const sPid = user.state_profile
    const iPid = user.institution_profile
    const typeOfAccount = user.account_type

    if (typeOfAccount === "zone"){
      const zoneProfile = await ZoneProfile.findById(zPid).populate({
        path: 'excos',
        select: '-__v -createdAt -updatedAt', 
      });
      
      if (!zoneProfile) {
        return res.status(404).json({ message: "Zone profile does not exist!" });
      }
  
      const excos = zoneProfile.excos;
    
      res.status(200).json({ excos });
    }
    else if (typeOfAccount === "state") {
      const stateProfile = await StateProfile.findById(sPid).populate({
        path: 'excos',
        select: '-__v -createdAt -updatedAt', 
      });
      
      if (!stateProfile) {
        return res.status(404).json({ message: "State profile does not exist!" });
      }
  
      const excos = stateProfile.excos;
    
      res.status(200).json({ excos   });
    }
    else {
      const institutionProfile = await InstitutionProfile.findById(iPid).populate({
        path: 'excos',
        select: '-__v -createdAt -updatedAt', 
      });
      
      if (!institutionProfile) {
        return res.status(404).json({ message: "Institution profile does not exist!" });
      }
      
      const excos = institutionProfile.excos;
    
      res.status(200).json({ excos });
    }         
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}


exports.fetchExcoDetails = async (req, res, next) => {
  try {
    const excoId = req.params.patronId;
    const exco = await ExcoProfile.findById(excoId).select('-__v -createdAt -updatedAt -_id');

    if (!exco) {
      return res.status(404).json({ message: 'Exco profile not found' })
    }
  
    res.status(200).json({ patron: exco })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err);
  }
}


exports.createExcoProfile = async (req, res, next) => {
    try { 
      const { _id } = req.payload;
      const userId = mongoose.Types.ObjectId(_id);
  
      console.log(req.body)
      // Validate input
      const { error } = validateEProfile(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const user = await User.findById(userId).select("profile_status zone_profile state_profile institutition_profile account_type");
  
      if (!user) {
        return res.status(404).json({ message: "User does not exist!" });
      }

      // console.log(req.file)
      
      const imageUrl = await uploadImage(req.file, {
        folder: 'excos-profiles', 
        public_id: `excos-profiles-${userId}`, 
        overwrite: true, 
        resource_type: 'auto', 
      });
      
      const pStatus = user.profile_status
      const zPid = user.zone_profile
      const sPid = user.state_profile
      const iPid = user.institution_profile
      const typeOfAccount = user.account_type
      console.log(typeOfAccount)
  
      if (pStatus === 3) {
        const newExco = await excoProfileCreate(
            req.body.firstName, 
            req.body.lastName, 
            req.body.otherNames, 
            req.body.course_of_study,
            req.body.post,
            req.body.occupation,
            req.body.graduation_status,
            req.body.graduation_date,
            req.body.state_of_origin,
            req.body.state_of_residence,
            req.body.email,
            req.body.phone,
            imageUrl
        )
        try { 
          if (typeOfAccount === "zone") {
            const zoneProfile = await ZoneProfile.findById(zPid)
            if (!zoneProfile) {
              return res.status(404).json({ message: "Zone profile does not exist!" });
            }   
            zoneProfile.excos.push(newExco._id);
            await zoneProfile.save();
          } else if (typeOfAccount === "state") {
            const stateProfile = await StateProfile.findById(sPid)
            if (!stateProfile) {
              return res.status(404).json({ message: "State profile does not exist!" });
            }   
            stateProfile.excos.push(newExco._id);
            await stateProfile.save();
          } else {
            const institutionProfile = await InstitutionProfile.findById(iPid)
            if (!institutionProfile) {
              return res.status(404).json({ message: "Institution profile does not exist!" });
            }   
            institutionProfile.excos.push(newExco._id);
            await institutionProfile.save();
          }
          return res.status(201).json({ message: "Exco details added successfully!" });

        } catch (err) {
          const error = new Error("User not authorized to create exco profile");
          throw error;
        }
        
      } 
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
  }
}

exports.updateExcoProfile = async (req, res, next) => {
  try {
      const { _id } = req.payload;
      const userId = mongoose.Types.ObjectId(_id);
      const excoId = req.params.excoId
  
      // Validate input
      const { error } = validateUpdateEProfile(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const user = await User.findById(userId).select("profile_status zone_profile state_profile institutition_profile account_type");
  
      if (!user) {
        return res.status(404).json({ message: "User does not exist!" });
      }
      //function for uploading to cloudinary
      const imageUrl = await uploadImage(req.file, {
        folder: 'excos-profiles', 
        public_id: `excos-profiles-${userId}`, 
        overwrite: true, 
        resource_type: 'auto', 
      });


      const zPid = user.zone_profile
      const sPid = user.state_profile
      const iPid = user.institution_profile
      const typeOfAccount = user.account_type
      
      if (typeOfAccount === "zone"){
        const zoneProfile = await ZoneProfile.findById(zPid);
        if (!zoneProfile) {
          return res.status(404).json({ message: "Zone profile does not exist!" });
        }
        const excoIndex = zoneProfile.patrons.findIndex(
          (exco) => exco._id.toString() === excoId
          )        

          // check if patron exists in the zone profile
          if (excoIndex === -1) {
            return res.status(404).json({ message: "Exco does not exist in zone profile!" });
          }
      }
      else if (typeOfAccount === "state") {
        const stateProfile = await StateProfile.findById(sPid);  
        if (!stateProfile) {
          return res.status(404).json({ message: "State profile does not exist!" });
        }
        const excoIndex = stateProfile.patrons.findIndex(
          (exco) => exco._id.toString() === excoId
          )        
          // check if patron exists in the zone profile
          if (excoIndex === -1) {
            return res.status(404).json({ message: "Exco does not exist in state profile!" });
          }
      }
      else {
        const institutionProfile = await InstitutionProfile.findById(iPid);  
        if (!institutionProfile) {
          return res.status(404).json({ message: "Institution profile does not exist!" });
        }

        const excoIndex = institutionProfile.patrons.findIndex(
          (exco) => exco._id.toString() === excoId
          )        
          
          // check if patron exists in the zone profile
          if (excoIndex === -1) {
            return res.status(404).json({ message: "Patron does not exist in Institution profile!" });
          }

      }
      
      ExcoProfile.findById(excoId, async (err, exco)=>{
          if(err){
            return res.status(404).json({ message: "Exco Profile not found" })
          }
          try {
            exco.firstName = req.body.firstName !== "" ? req.body.firstName : exco.firstName
            exco.lastName = req.body.lastName !== "" ? req.body.lastName : exco.lastName
            exco.otherNames = req.body.otherNames !== "" ? req.body.otherNames : exco.otherNames
            exco.course_of_study = req.body.course_of_study !== "" ? req.body.course_of_study : exco.course_of_study
            exco.post = req.body.post !== "" ? req.body.post : exco.post
            exco.occupation = req.body.occupation !== "" ? req.body.occupation : exco.occupation
            exco.graduation_status= req.body.graduation_status !== "" ? req.body.graduation_status : exco.graduation_status
            exco.graduation_date = req.body.graduation_date !== "" ? new Date(req.body.graduation_date).toLocaleDateString('en-GB') : exco.graduation_date
            exco.state_of_origin = req.body.state_of_origin !== "" ? req.body.state_of_origin : exco.state_of_origin
            exco.state_of_residence = req.body.state_of_residence !== "" ? req.body.state_of_residence : exco.state_of_residence
            exco.email = req.body.email !== "" ? req.body.email : exco.email
            exco.phone = req.body.phone !== "" ? req.body.phone : exco.phone
            exco.image = req.body.image !== "" ? imageUrl : exco.image
          
            const excoUpdated = await patron.save()
            console.log("Exco Profile updated:", excoUpdated);
            res.status(201).json({message: "Exco profile updated"})
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


exports.deleteExcoProfile = async (req, res, next) => {
  try {
    const { _id } = req.payload;
      const userId = mongoose.Types.ObjectId(_id);
      const excoId = req.params.excoId
  
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
        const excoIndex = zoneProfile.excos.findIndex(
          (exco) => exco._id.toString() === excoId
          )        

          // check if patron exists in the zone profile
          if (excoIndex === -1) {
            return res.status(404).json({ message: "Exco does not exist in zone profile!" });
          }          
          const excos = zoneProfile.excos
          const deleteExcoProfileIndex = await ZoneProfile.findByIdAndUpdate(
            zPid,
            { $pull: { excos: { $eq: excos[excoIndex] } } },
            { new: true }
          )
    
          if (!deleteExcoProfileIndex) {
            return res.status(404).json({ message: "Zone profile does not exist!" });
          }
      } else if (typeOfAccount === "state"){
        const stateProfile = await StateProfile.findById(sPid)
        const excoIndex = stateProfile.excos.findIndex(
          (excos) => excos._id.toString() === excoId
          )        
                    
          // check if patron exists in the zone profile
          if (excoIndex === -1) {
            return res.status(404).json({ message: "Exco does not exist in state profile!" });
          }          
          const excos = stateProfile.excos
          const deleteExcoProfileIndex = await StateProfile.findByIdAndUpdate(
            sPid,
            { $pull: { patrons: { $eq: excos[excoIndex] } } },
            { new: true }
          )
  
          if (!deleteExcoProfileIndex) {
            return res.status(404).json({ message: "State profile does not exist!" });
          }
      } else {
          const institutionProfile = await InstitutionProfile.findById(zPid)
          const excoIndex = institutionProfile.excos.findIndex(
            (exco) => exco._id.toString() === excoId
            )        
                      
            // check if patron exists in the zone profile
            if (excoIndex === -1) {
              return res.status(404).json({ message: "Exco does not exist in state profile!" });
            }          
            const excos = institutionProfile.exco
            const deleteExcoProfileIndex = await InstitutionProfile.findByIdAndUpdate(
              iPid,
              { $pull: { excos: { $eq: excos[excoIndex] } } },
              { new: true }
            )
            if (!deleteExcoProfileIndex) {
              return res.status(404).json({ message: "Exco profile does not exist!" });
            }
      }
      ExcoProfile.findById(excoId, async (err, exco)=>{
          if(err){
            return res.status(404).json({ message: "Institution Profile not found" })
          }          
          try {       
            const excoDeleted = await exco.remove()
            console.log("Exco Profile deleted:", excoDeleted)
            res.status(201).json({message: "Exco profile deleted"})
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

