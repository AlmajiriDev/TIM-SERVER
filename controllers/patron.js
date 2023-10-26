const { ObjectId } = require('mongodb');
const { default: mongoose } = require("mongoose")
const {institutionProfile, InstitutionProfile} = require("../models/Profiles/institutionProfile")
const {PatronProfile, validatePProfile, validateUpdatePProfile} = require("../models/Profiles/patron_profile")
const {StateProfile} = require("../models/Profiles/stateProfile")
const {User} = require("../models/user")
const {ZoneProfile} = require("../models/Profiles/zoneProfile")
const uploadImage = require('../middlewares/cloudinaryUpload')
const { profileStatus } = require("../helpers/enum")



async function patronProfileCreate(title, firstName, lastName, otherNames, occupation, place_of_work, state_of_residence, post, email, phone, image) {
    let profileDate = {
        title: title,
        firstName: firstName,
        lastName: lastName,
        otherNames: otherNames,
        occupation: occupation,
        place_of_work: place_of_work,
        state_of_residence: state_of_residence,
        post: post, 
        email: email,
        phone: phone,
        image: image
    }
    let result = await PatronProfile.create(profileDate)
    return result
}


exports.getAllPatrons = async (req, res, next) => {
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
        path: 'patrons',
        select: '-__v -createdAt -updatedAt', 
      });
      
      if (!zoneProfile) {
        return res.status(404).json({ message: "Zone profile does not exist!" });
      }
  
      const patrons = zoneProfile.patrons;
    
      res.status(200).json({ patrons });
    }
    else if (typeOfAccount === "state") {
      const stateProfile = await StateProfile.findById(sPid).populate({
        path: 'patrons',
        select: '-__v -createdAt -updatedAt', 
      });
      
      if (!stateProfile) {
        return res.status(404).json({ message: "State profile does not exist!" });
      }
  
      const patrons = stateProfile.patrons;
    
      res.status(200).json({ patrons });
    }
    else {
      const institutionProfile = await institutionProfile.findById(iPid).populate({
        path: 'patrons',
        select: '-__v -createdAt -updatedAt', 
      });
      
      if (!institutionProfile) {
        return res.status(404).json({ message: "Institution profile does not exist!" });
      }
      
      const patrons = institutionProfile.patrons;
    
      res.status(200).json({ patrons });
    }         
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}



exports.fetchPatronDetails = async (req, res, next) => {
  try {   
    const patronId = req.params.patronId;
    const patron = await PatronProfile.findById(patronId).select('-__v -createdAt -updatedAt -_id');

    if (!patron) {
      return res.status(404).json({ message: 'Patron profile not found' })
    }
  
    res.status(200).json({ patron })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err);
  }
}



exports.createPatronProfile = async (req, res, next) => {
    try {
      const { _id } = req.payload;
      const userId = mongoose.Types.ObjectId(_id);
      
      // // Validate input
      // const { error } = validatePProfile(req.body);
      // if (error) {
      //   return res.status(400).json({ message: error.details[0].message });
      // }
      const user = await User.findById(userId).select("profile_status zone_profile state_profile institutition_profile account_type");
  
      if (!user) {
        return res.status(404).json({ message: "User does not exist!" });
      }
      
      const pStatus = user.profile_status
      const zPid = user.zone_profile
      const sPid = user.state_profile
      const iPid = user.institution_profile
      const typeOfAccount = user.account_type

      // console.log(`this is ${typeOfAccount} account`)
      // console.log(pStatus)
      // console.log(iPid)
      // console.log(zPid)
      // console.log(sPid)
      console.log(user)

      let imageUrl = null

      if(req.file){
        //function for uploading to cloudinary
        imageUrl = await uploadImage(req.file, {
          folder: 'patrons-profiles', 
          public_id: `patrons-profiles-${userId}`, 
          overwrite: true, 
          resource_type: 'auto', 
        });
      }

      try {
        
      } catch (error) {
        
      }
      if (pStatus === profileStatus.completed.value) {

        // const newPatron = await patronProfileCreate(req.body.title, req.body.firstName, req.body.lastName, req.body.otherNames, req.body.occupation, 
        //   req.body.place_of_work, req.body.state_of_residence, req.body.post, req.body.email, req.body.phone, imageUrl)

        const newPatron = await PatronProfile.create({
            title: req.body.title,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            otherNames: req.body.otherNames,
            occupation: req.body.occupation,
            place_of_work: req.body.place_of_work,
            state_of_residence: req.body.state_of_residence,
            post: req.body.post, 
            email: req.body.email,
            phone: req.body.phone,
            image: imageUrl
        })
        try {
          if (typeOfAccount === "zone") {
            const zoneProfile = await ZoneProfile.findById(zPid)
            if (!zoneProfile) {
              return res.status(404).json({ message: "Zone profile does not exist!" });
            }   
            zoneProfile.patrons.push(newPatron._id);
            await zoneProfile.save();
          }
          else if(typeOfAccount === "state") {
            const stateProfile = await StateProfile.findById(sPid)
            if (!stateProfile) {
              return res.status(404).json({ message: "State profile does not exist!" });
            }   
            stateProfile.patrons.push(newPatron._id);
            await stateProfile.save();
          }
          else{
            const institutionProfile = await institutionProfile.findById(iPid)
            if (!institutionProfile) {
              return res.status(404).json({ message: "Institution profile does not exist!" });
            }   
            institutionProfile.patrons.push(newPatron._id);
            await institutionProfile.save();
          }
          res.status(201).json({ message: "Patron details added successfully!" })   
        } catch (err) {
          if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
      }} 
    else {
          res.status(403).json({ message: "User is not authorized to create a patron profile!" });
        }
      } catch (err) {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
    }
  };
  exports.createPatronProfile = async (req, res, next) => {
    try {
      const { _id } = req.payload;
      const userId = mongoose.Types.ObjectId(_id);
      
      // // Validate input
      // const { error } = validatePProfile(req.body);
      // if (error) {
      //   return res.status(400).json({ message: error.details[0].message });
      // }
      const user = await User.findById(userId).select("profile_status zone_profile state_profile institutition_profile account_type");
  
      if (!user) {
        return res.status(404).json({ message: "User does not exist!" });
      }
      
      const pStatus = user.profile_status
      const zPid = user.zone_profile
      const sPid = user.state_profile
      const iPid = user.institution_profile
      const typeOfAccount = user.account_type

      console.log(`this is ${typeOfAccount} account`)
      // console.log(pStatus)
      // console.log(iPid)
      // console.log(zPid)
      // console.log(sPid)
      console.log(user)

      let imageUrl = null

      if(req.file){
        //function for uploading to cloudinary
        imageUrl = await uploadImage(req.file, {
          folder: 'patrons-profiles', 
          public_id: `patrons-profiles-${userId}`, 
          overwrite: true, 
          resource_type: 'auto', 
        });
      }

      if (pStatus === profileStatus.completed.value) {

        // const newPatron = await patronProfileCreate(req.body.title, req.body.firstName, req.body.lastName, req.body.otherNames, req.body.occupation, 
        //   req.body.place_of_work, req.body.state_of_residence, req.body.post, req.body.email, req.body.phone, imageUrl)
        const newPatron = await PatronProfile.create({
            title: req.body.title,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            otherNames: req.body.otherNames,
            occupation: req.body.occupation,
            place_of_work: req.body.place_of_work,
            state_of_residence: req.body.state_of_residence,
            post: req.body.post, 
            email: req.body.email,
            phone: req.body.phone,
            image: imageUrl
        })

        try {
          if (typeOfAccount === "zone") {
            const zoneProfile = await ZoneProfile.findById(zPid)
            if (!zoneProfile) {
              return res.status(404).json({ message: "Zone profile does not exist!" });
            }   
            zoneProfile.patrons.push(newPatron._id);
            await zoneProfile.save();
          }
          else if(typeOfAccount === "state") {
            const stateProfile = await StateProfile.findById(sPid)
            if (!stateProfile) {
              return res.status(404).json({ message: "State profile does not exist!" });
            }   
            stateProfile.patrons.push(newPatron._id);
            await stateProfile.save();
          }
          else{
            const institutionProfile = await InstitutionProfile.findById(iPid)
            if (!institutionProfile) {
              return res.status(404).json({ message: "Institution profile does not exist!" });
            }   
            institutionProfile.patrons.push(newPatron._id);
            await institutionProfile.save();
          }
          res.status(201).json({ message: "Patron details added successfully!" })   
        } catch (err) {
          if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
      }} 
    else {
          res.status(403).json({ message: "User is not authorized to create a patron profile!" });
        }
      } catch (err) {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
    }
  };

exports.updatePatronProfile = async (req, res, next) => {
  try {
      const { _id } = req.payload;
      const userId = mongoose.Types.ObjectId(_id);
      const patronId = req.params.patronId

      const { error } = validateUpdatePProfile(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      //function for uploading to cloudinary
      
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
        const patronIndex = zoneProfile.patrons.findIndex(
          (patron) => patron._id.toString() === patronId
          )        

          // check if patron exists in the zone profile
          if (patronIndex === -1) {
            return res.status(404).json({ message: "Patron does not exist in zone profile!" });
          }
      }
      else if (typeOfAccount === "state") {
        const stateProfile = await StateProfile.findById(sPid);  
        if (!stateProfile) {
          return res.status(404).json({ message: "State profile does not exist!" });
        }
        const patronIndex = stateProfile.patrons.findIndex(
          (patron) => patron._id.toString() === patronId
          )        
          // check if patron exists in the zone profile
          if (patronIndex === -1) {
            return res.status(404).json({ message: "Patron does not exist in state profile!" });
          }
      }
      else {
        const institutionProfile = await institutionProfile.findById(iPid);  
        if (!institutionProfile) {
          return res.status(404).json({ message: "Institution profile does not exist!" });
        }

        const patronIndex = institutionProfile.patrons.findIndex(
          (patron) => patron._id.toString() === patronId
          )        
          
          // check if patron exists in the zone profile
          if (patronIndex === -1) {
            return res.status(404).json({ message: "Patron does not exist in Institution profile!" });
          }

      }
      
      PatronProfile.findById(patronId, async (err, patron)=>{
          if(err){
            return res.status(404).json({ message: "Zone Profile not found" })
          }
          try {
            patron.title = req.body.title !== "" ? req.body.title : patron.title
            patron.firstName = req.body.firstName !== "" ? req.body.firstName : patron.firstName
            patron.lastName = req.body.lastName !== "" ? req.body.lastName : patron.lastName
            patron.otherNames = req.body.otherNames !== "" ? req.body.otherNames : patron.otherNames
            patron.occupation = req.body.occupation !== "" ? req.body.occupation : patron.occupation
            patron.place_of_work = req.body.place_of_work !== "" ? req.body.place_of_work : patron.place_of_work
            patron.state_of_residence = req.body.state_of_residence !== "" ? req.body.state_of_residence : patron.state_of_residence
            patron.post = req.body.post !== "" ? req.body.post : patron.post
            patron.email = req.body.email !== "" ? req.body.email : patron.email
            patron.phone = req.body.phone !== "" ? req.body.phone : patron.phone
            if(req.file){
              const imageUrl = await uploadImage(req.file, {
                folder: 'patrons-profiles', 
                public_id: `patrons-profiles-${userId}`, 
                overwrite: true, 
                resource_type: 'auto', 
              });
              patron.image = req.body.image !== "" ? imageUrl : patron.image
            }
      
            const patronUpdated = await patron.save()
            console.log("Patron Profile updated:", patronUpdated);
            res.status(201).json({message: "Patron profile updated"})
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

exports.deletePatronProfile = async (req, res, next) => {
  try {
    const { _id } = req.payload;
      const userId = mongoose.Types.ObjectId(_id);
      const patronId = req.params._patronId
  
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
        const patronIndex = zoneProfile.patrons.findIndex(
          (patron) => patron._id.toString() === patronId
          )        

          // check if patron exists in the zone profile
          if (patronIndex === -1) {
            return res.status(404).json({ message: "Patron does not exist in zone profile!" });
          }          
          const patrons = zoneProfile.patrons
          const deletePatronProfileIndex = await ZoneProfile.findByIdAndUpdate(
            zPid,
            { $pull: { patrons: { $eq: patrons[patronIndex] } } },
            { new: true }
          )
    
          if (!deletePatronProfileIndex) {
            return res.status(404).json({ message: "Zone profile does not exist!" });
          }
      } else if (typeOfAccount === "state"){
        const stateProfile = await StateProfile.findById(zPid)
        const patronIndex = stateProfile.patrons.findIndex(
          (patron) => patron._id.toString() === patronId
          )        
                    
          // check if patron exists in the zone profile
          if (patronIndex === -1) {
            return res.status(404).json({ message: "Patron does not exist in state profile!" });
          }          
          const patrons = stateProfile.patrons
          const deletePatronProfileIndex = await StateProfile.findByIdAndUpdate(
            sPid,
            { $pull: { patrons: { $eq: patrons[patronIndex] } } },
            { new: true }
          )
    
          if (!deletePatronProfileIndex) {
            return res.status(404).json({ message: "State profile does not exist!" });
          }
      } else {
          const institutionProfile = await institutionProfile.findById(iPid)
          const patronIndex = institutionProfile.patrons.findIndex(
            (patron) => patron._id.toString() === patronId
            )        
                      
            // check if patron exists in the zone profile
            if (patronIndex === -1) {
              return res.status(404).json({ message: "Patron does not exist in state profile!" });
            }          
            const patrons = institutionProfile.patrons
            const deletePatronProfileIndex = await institutionProfile.findByIdAndUpdate(
              iPid,
              { $pull: { patrons: { $eq: patrons[patronIndex] } } },
              { new: true }
            )
      
            if (!deletePatronProfileIndex) {
              return res.status(404).json({ message: "Institution profile does not exist!" });
            }
      }
      PatronProfile.findById(patronId, async (err, patron)=>{
          if(err){
            return res.status(404).json({ message: "Zone Profile not found" })
          }          
          try {       
            const patronDeleted = await patron.remove()
            console.log("Patron Profile deleted:", patronDeleted)
            res.status(201).json({message: "Patron profile deleted"})
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
