const mongoose = require('mongoose');
const { profileStatus: pStatus } = require('../helpers/enum');
const { InstitutionProfile, validateIProfileData, validateUpdateIProfileData } = require("../models/Profiles/institutionProfile")
const { MemberProfile, validateMemberProfileData, validateUpdateMemberProfileData } = require("../models/Profiles/memberProfile");
const { StateProfile, validateSProfileData,validateUpdateSProfileData } = require('../models/Profiles/stateProfile');
const { User } = require("../models/user");
const { ZoneProfile, validateZProfileData, validateZProfileUpdateData  } = require('../models/Profiles/zoneProfile');
const uploadImage = require('../middlewares/cloudinaryUpload');
const { validateNProfileData, NecProfile, validateNProfileUpdateData } = require('../models/Profiles/necProfile');


async function memberProfileCreate(firstName, lastName, otherNames, bio, gender, institution, course, occupation, graduation_status, graduation_date, state_of_origin, state_of_residence, phone, email, image){
  const allInstitutions = await InstitutionProfile.find().select('institution_name')

  const listOfInstitutions = []
  for(const obj of allInstitutions){
    listOfInstitutions.push(obj.institution_name)
  }
  console.log(listOfInstitutions)
  const profileDetails = {
    firstName: firstName,
    lastName: lastName, 
    otherNames: otherNames,
    bio: bio,
    gender: gender,
    institution: institution,
    course: course,
    occupation: occupation,
    graduation_status: graduation_status,
    graduation_date: new Date(graduation_date).toLocaleDateString('en-GB'),
    state_of_origin: state_of_origin,
    state_of_residence: state_of_residence,
    phone: phone,
    email: email,
    image: image
  }
  if(listOfInstitutions.includes(profileDetails.institution)){
    let profile = await MemberProfile.create(profileDetails)
    return profile
  }
  else {
    const error = new Error("Not Allowed, please provide a valid state")
    error.statusCode = 400
    throw error
  }
}

async function institutionProfileCreate(institution_name, acronym, address, longitude, latitude,  state, zone, email, phone, image){
  const allStates = await StateProfile.find().select('state')
  
  const listOfStates = []
  for(const obj of allStates){
    listOfStates.push(obj.state)
  }
  console.log(listOfStates)

  const profileDetails = {
    institution_name: institution_name,
    acronym: acronym,
    address: address,
    longitude: longitude,
    latitude: latitude,
    state: state,
    zone: zone,
    phone: phone,
    email: email,
    image: image,
  }
  if(listOfStates.includes(profileDetails.state)){
    let profile = await InstitutionProfile.create(profileDetails)
    return profile
  }
  else {
    const error = new Error("Not Allowed, please provide a valid state")
    error.statusCode = 400
    throw error
  }
}

async function stateProfileCreate(address, state, zone, email, phone, image) {
  const allZones = await ZoneProfile.find().select('zone')

  const listOfZones = [];
  for (const obj of allZones) {
    listOfZones.push(obj.zone);
  }
  console.log(listOfZones)
  
  const profileDetals = {
    address: address,
    state: state,
    zone: zone,
    email: email,
    phone: phone,
    image: image
  }
  if (listOfZones.includes(profileDetals.zone)){
    let profile = await StateProfile.create(profileDetals)
    return profile
  }
  else {
    const error = new Error("Not Allowed, please provide a valid zone")
    error.statusCode = 400
    throw error
  }
}

async function zoneProfileCreate(zone, address, phone, email, image){
    const profileDetals = {
        zone: zone,
        address: address,
        phone: phone,
        email: email,
        image: image
    }
    let profile = await ZoneProfile.create(profileDetals)
    console.log(profile)
    return profile
}

async function necProfileCreate(address, phone, email, image){
    const profileDetals = {
        address: address,
        phone: phone,
        email: email,
        image: image
    }
    let profile = await NecProfile.create(profileDetals)
    console.log(profile)
    return profile
}


/**
    CREATE, UPDATE, DELETE MEMBER PROFILE  
 */

exports.createMemberProfile = async (req, res, next) => {
try{
  const { _id } = req.payload
  const userId = mongoose.Types.ObjectId(_id)

  // Validate input
  const { error } = validateMemberProfileData(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  
  //function for uploading to cloudinary
  const imageUrl = await uploadImage(req.file, {
    folder: 'members-profiles', 
    public_id: `members-profiles-${userId}`, 
    overwrite: true, 
    resource_type: 'auto', 
  });

      // const {profile} = req.body
  User.findById(userId).select("profile_status").exec((err, user) =>{ 
    if(err){
        res.status(404).json({message: "User does not exist!"})
    }
    let pStatus = user.profile_status
    if(pStatus === 3){
        const error = new Error("Profile already exists");
        error.statusCode = 401;
        throw error;  
      }
    })


    const profileDetails = await memberProfileCreate(
      req.body.firstName,     
      req.body.lastName, 
      req.body.otherNames, 
      req.body.bio, 
      req.body.gender, 
      req.body.institution, 
      req.body.course, 
      req.body.occupation, 
      req.body.graduation_status, 
      req.body.graduation_date, 
      req.body.state_of_origin, 
      req.body.state_of_residence, 
      req.body.phone, 
      req.body.email, 
      imageUrl
    )
      const newProfileId = profileDetails._id;
      // console.log("id is", profileObjectId)
      
      const profileUpdated = await User.updateOne({_id: userId}, {$set: {profile: newProfileId}})    

      if(profileUpdated){
          try {
            const institutionProfile = await InstitutionProfile.findOne({institution_name: req.body.institution})
            institutionProfile.members.push(newProfileId)
            // console.error(stateProfile.errors)
            await institutionProfile.save()

            await User.updateOne({_id: userId}, {$set: {profile_status: pStatus.completed.value}})
          res.status(201).json({ message: "Member Profile info added successfully" });
          } catch (err) {
            console.error(err)
            const error = new Error("Something went while saving to profile, please try again")
            error.statusCode = 500
            throw error
          }
          } else {
              const error = new Error("Something went wrong");
              error.statusCode = 401;
              throw error;
          }
} catch (err) {
  if (!err.statusCode) {
    err.statusCode = 500;
  }
  next(err);
}
}

exports.updateMemberProfile = async (req, res, next) =>{
  try {
    console.log(new Date(req.body.graduation_date).toLocaleDateString('en-GB'))
    const { _id } = req.payload;
    const userId = mongoose.Types.ObjectId(_id);

    //validate input
    const { error } = validateUpdateMemberProfileData(req.body);
        if (error) {
          return res.status(400).json({ message: error.details[0].message });
        }

   
    User.findById(userId).select('profile').exec()
      .then(user => {
        const pId = user.profile;
        console.log(pId);
   
        MemberProfile.findById(pId, async (err, profile) => {
          if (err) {
            return res.status(404).json({ message: "Profile not found" })
          }

          profile.firstName = req.body.firstName !== "" ? req.body.firstName : profile.firstName;
          profile.lastName = req.body.lastName !== "" ? req.body.lastName : profile.lastName;
          profile.otherNames = req.body.otherNames !== "" ? req.body.otherNames : profile.otherNames;
          profile.bio = req.body.bio !== "" ? req.body.bio : profile.bio;
          profile.gender = req.body.gender !== "" ? req.body.gender : profile.gender;
          profile.institution = req.body.institution !== "" ? req.body.institution : profile.institution;
          profile.course = req.body.course !== "" ? req.body.course : profile.course;
          profile.occupation = req.body.occupation !== "" ? req.body.occupation : profile.occupation;
          profile.graduation_status = req.body.graduation_status !== "" ? req.body.graduation_status : profile.graduation_status;
          profile.graduation_date = req.body.graduation_date !== "" ? req.body.graduation_date : profile.graduation_date;
          profile.state_of_origin = req.body.state_of_origin !== "" ? req.body.state_of_origin : profile.state_of_origin;
          profile.state_of_residence = req.body.state_of_residence !== "" ? req.body.state_of_residence : profile.state_of_residence;
          profile.phone = req.body.phone !== "" ? req.body.phone : profile.phone;
          
          //checks body if image is to be updated
          if (req.file) {
            const imageUrl = await uploadImage(req.file, {
              folder: "members-profiles",
              public_id: `members-profiles-${userId}`,
              overwrite: true,
              resource_type: "auto",
            });
            profile.image = req.file.image !== "" ? imageUrl : profile.image;
          }

          profile.save(function (err) {
            if (err) { 
              console.error(err);
              const errMessage = "Something went wrong, please try again!";
              return res.status(500).json({ message: errMessage });
            } else {
              return res.status(201).json({ message: "Profile Updated Successfully" });
            }
          })
        })
      })
      .catch(err => {
        console.error(err);
        return res.status(500).json({ message: "Profile details not added..." });
      })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.fetchMemberProfileDetails = async (req, res, next) => {
  try {
    const { _id } = req.payload
    const userId = mongoose.Types.ObjectId(_id)
    
    User.findById(userId).populate('profile').exec((err, user) =>{
      if (err){
        console.error(err)
        return res.status(404).json({ message: "Profile not found" })
      }
      const gradDateObj = new Date(user.profile.graduation_date)
      const graduation_date_ymd = gradDateObj.getFullYear() + " " + (gradDateObj.getMonth() + 1) + " " + gradDateObj.getDate();
      
      const profileDetails = {
      firstName: user.profile.firstName,     
      lastName: user.profile.lastName,
      otherNames: user.profile.otherNames,
      bio: user.profile.bio,
      gender: user.profile.gender, 
      institution: user.profile.institution, 
      course: user.profile.course, 
      occupation: user.profile.occupation, 
      graduation_status: user.profile.graduation_status, 
      graduation_date: graduation_date_ymd,
      state_of_origin: user.profile.state_of_origin, 
      state_of_residence: user.profile.state_of_residence, 
      phone: user.profile.phone, 
      email: user.profile.email,       
      }
      res.status(201).json({profileDetails})
    })
} catch (err) {
    if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
} 
}

/**
    CREATE, UPDATE, DELETE INSTITUTION PROFILE  
 */

exports.createInstitutionProfile = async (req, res, next) => {
  try {  
    const { _id } = req.payload
    const userId = mongoose.Types.ObjectId(_id)

    
    // Validate input
    const { error } = validateIProfileData(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    
    //function for uploading to cloudinary
    const imageUrl = await uploadImage(req.file, {
      folder: 'institutions-profiles', 
      public_id: `institutions-profiles-${userId}`, 
      overwrite: true, 
      resource_type: 'auto', 
    });

        // const {profile} = req.body
    User.findById(userId).select("profile_status").exec((err, user) =>{
      if(err){
          res.status(404).json({message: "User does not exist!"})
      }
      let pStatus = user.profile_status
      if(pStatus === 3){
          const error = new Error("Profile already exists");
          error.statusCode = 401;
          throw error;  
        }
      })

      // const profileAlreadyPresent = StateProfile.findOne({state: req.body.state})
      // if (profileAlreadyPresent){
      //   res.status(400).json({message: "State Profile already created."})
      // }
      
      const profileDetails = await institutionProfileCreate(
        req.body.institution_name,
        req,body.acronym,
        req.body.address,
        req.body.longitude,
        req.body.latitude,
        req.body.state,
        req.body.zone,
        req.body.email,
        req.body.phone,
        imageUrl
      )          
        const newProfileId = profileDetails._id;
        // console.log("id is", profileObjectId)
        
        const profileUpdated = await User.updateOne({_id: userId}, {$set: {institution_profile: newProfileId}})
      

        if(profileUpdated){
            try {
              const stateProfile = await StateProfile.findOne({state: req.body.state})
              stateProfile.institutions.push(newProfileId)
              // console.error(stateProfile.errors)
              await stateProfile.save()

              await User.updateOne({_id: userId}, {$set: {profile_status: pStatus.completed.value}})
            res.status(201).json({ message: "Institution Profile info added successfully" });
            } catch (err) {
              console.error(err)
              const error = new Error("Something went while saving to profile, please try again")
              error.statusCode = 500
              throw error
            }
    } else {
        const error = new Error("Something went wrong");
        error.statusCode = 401;
        throw error;
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }

    }     
exports.updateInstitutionProfile = async (req, res, next) =>{
  try {
    const { _id } = req.payload;
    const userId = mongoose.Types.ObjectId(_id);

    //validate input
    const { error } = validateUpdateIProfileData(req.body);
        if (error) {
          return res.status(400).json({ message: error.details[0].message });
        }

    User.findById(userId).select('institution_profile').exec()
      .then(user => {
        const iId = user.institution_profile;
        console.log(iId);
   
        InstitutionProfile.findById(iId, async (err, instituitionProfile) => {
          if (err) {
            return res.status(404).json({ message: "Institution Profile not found" })
          }


          instituitionProfile.institution_name = req.body.institution_name !== "" ? req.body.institution_name : instituitionProfile.institution_name;
          instituitionProfile.acronym = req.body.acronym !== "" ? req.body.acronym : instituitionProfile.acronym;
          instituitionProfile.address = req.body.address !== "" ? req.body.address : instituitionProfile.address;
          instituitionProfile.longitude = req.body.longitude !== "" ? req.body.longitude : instituitionProfile.longitude;
          instituitionProfile.latitude = req.body.latitude !== "" ? req.body.latitude : instituitionProfile.latitude;
          instituitionProfile.state = req.body.state !== "" ? req.body.state : instituitionProfile.state;
          instituitionProfile.zone = req.body.zone !== "" ? req.body.zone : instituitionProfile.zone;
          instituitionProfile.email = req.body.email !== "" ? req.body.email : instituitionProfile.email;
          
          //checks body if image is to be updated
          if (req.file) {
            imageUrl = await uploadImage(req.file, {
              folder: "institutions-profiles",
              public_id: `institutions-profiles-${userId}`,
              overwrite: true,
              resource_type: "auto",
            });
            instituitionProfile.image = req.file.image !== "" ? imageUrl : instituitionProfile.image;
          }
          
          instituitionProfile.save(function (err) {
            if (err) { 
              console.error(err);
              const errMessage = "Something went wrong, please try again!";
              return res.status(500).json({ message: errMessage });
            } else {
              return res.status(201).json({ message: "Profile Updated Successfully" });
            }
          })
        })
      })
      .catch(err => {
        console.error(err);
        return res.status(500).json({ message: "Profile details not added..." });
      })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.fetchInstitutionProfile = async (req, res, next) =>{
  try {
    const { _id } = req.payload
    const userId = mongoose.Types.ObjectId(_id)
    
    User.findById(userId).populate('institution_profile').exec((err, user) =>{
      if (err){
        console.error(err)
        return res.status(404).json({ message: "Profile not found" })
      }
      const profileDetails = {
        institution: user.institution_profile.institution_name,
        email: user.institution_profile.email,
        zone: user.institution_profile.zone,
        state: user.institution_profile.state,
        address: user.institution_profile.address,
        longitude: user.institution_profile.longitude,
        latitude: user.institution_profile.latitude,
        phone: user.institution_profile.phone,
        image: user.institution_profile.image
      }
      res.status(201).json({profileDetails})
    })
} catch (err) {
    if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
} 
}



/**
    CREATE, UPDATE, DELETE STATE CHAPTER PROFILE  
 */

exports.createStateProfile = async (req, res, next) => {
  try {  
    const { _id } = req.payload
    const userId = mongoose.Types.ObjectId(_id)

    // Validate input
    const { error } = validateSProfileData(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    
    //function for uploading to cloudinary
    const imageUrl = await uploadImage(req.file, {
      folder: 'state-profiles', 
      public_id: `state-profile-${userId}`, 
      overwrite: true, 
      resource_type: 'auto', 
    });

        // const {profile} = req.body
    User.findById(userId).select("profile_status").exec((err, user) =>{
      if(err){
          res.status(404).json({message: "User does not exist!"})
      }
      let pStatus = user.profile_status
      if(pStatus === 3){
          const error = new Error("Profile already exists");
          error.statusCode = 401;
          throw error;  
        }
      })

      const profileDetails = await stateProfileCreate(
        req.body.address,
        req.body.state,
        req.body.zone,
        req.body.email,
        req.body.phone,
        imageUrl
        )          
        const newProfileId = profileDetails._id;
        // console.log("id is", profileObjectId)
        
        const profileUpdated = await User.updateOne({_id: userId}, {$set: {state_profile: newProfileId}})
      

        if(profileUpdated){
            try {
              const zoneProfile = await ZoneProfile.findOne({zone: req.body.zone})
              zoneProfile.states.push(newProfileId)
              console.error(zoneProfile.errors)
              await zoneProfile.save()

              await User.updateOne({_id: userId}, {$set: {profile_status: pStatus.completed.value}})
            res.status(201).json({ message: "State Profile info added successfully" });
            } catch (err) {
              console.error(err)
              const error = new Error("Something went while saving to profile, please try again")
              error.statusCode = 500
              throw error
            }
    } else {
        const error = new Error("Something went wrong");
        error.statusCode = 401;
        throw error;
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}
         
exports.updateStateProfile = async (req, res, next) =>{
  try {
    const { _id } = req.payload;
    const userId = mongoose.Types.ObjectId(_id);

    //validate input
    const { error } = validateUpdateSProfileData(req.body);
        if (error) {
          return res.status(400).json({ message: error.details[0].message });
        }

    User.findById(userId).select('state_profile').exec()
      .then(user => {
        const sId = user.state_profile;
        console.log(sId);
   
        StateProfile.findById(sId, async (err, stateProfile) => {
          if (err) {
            return res.status(404).json({ message: "State Profile not found" })
          }
          stateProfile.address = req.body.address !== "" ? req.body.address : stateProfile.address;
          stateProfile.state = req.body.state !== "" ? req.body.state : stateProfile.state;
          stateProfile.phone = req.body.phone !== "" ? req.body.phone : stateProfile.phone;
          stateProfile.email = req.body.email !== "" ? req.body.email : stateProfile.email;

           //checks body if image is to be updated
           if (req.file) {
            imageUrl = await uploadImage(req.file, {
              folder: "state-profiles",
              public_id: `state-profiles-${userId}`,
              overwrite: true,
              resource_type: "auto",
            });
            stateProfile.image = req.file.image !== "" ? imageUrl : stateProfile.image;
          }

          stateProfile.save(function (err) {
            if (err) { 
              console.error(err);
              const errMessage = "Something went wrong, please try again!";
              return res.status(500).json({ message: errMessage });
            } else {
              return res.status(201).json({ message: "Profile Updated Successfully" });
            }
          })
        })
      })
      .catch(err => {
        console.error(err);
        return res.status(500).json({ message: "Profile details not added..." });
      })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}
exports.fetchStateProfile = async (req, res, next) =>{
  try {
    const { _id } = req.payload
    const userId = mongoose.Types.ObjectId(_id)
    
    User.findById(userId).populate('state_profile').exec((err, user) =>{
      if (err){
        console.error(err)
        return res.status(404).json({ message: "Profile not found" })
      }
      const profileDetails = {
        email: user.state_profile.email,
        zone: user.state_profile.zone,
        state: user.state_profile.state,
        address: user.state_profile.address,
        phone: user.state_profile.phone,
        image: user.state_profile.image
      }
      res.status(201).json({profileDetails})
    })
} catch (err) {
    if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
} 
}
    

    /**
    CREATE, UPDATE, DELETE ZONAL CHAPTER PROFILE  
 */

    // exports.getAllZone = async (req, res, next) => {

    // }
    
    //create a zone profile

exports.createZoneProfile = async (req, res, next) => {
    try {
        const { _id } = req.payload
        const userId = mongoose.Types.ObjectId(_id)
        
        User.findById(userId).select("profile_status").exec((err, user) =>{
          if(err){
              res.status(404).json({message: "User does not exist!"})
          }
          let pStatus = user.profile_status
          if(pStatus === 3){
              const error = new Error("Profile already exists");
              error.statusCode = 401;
              throw error;
      }
      })
          // Validate input
        const { error } = validateZProfileData(req.body);
        if (error) {
          return res.status(400).json({ message: error.details[0].message });
        }

        //function for uploading to cloudinary
        const imageUrl = await uploadImage(req.file, {
          folder: 'zone-profiles', 
          public_id: `zone-profile-${userId}`, 
          overwrite: true, 
          resource_type: 'auto', 
        });
        
        
        const profileDetails = await zoneProfileCreate(
          req.body.zone, 
          req.body.address, 
          req.body.phone, 
          req.body.email, 
          imageUrl
          )
        const profileObjectId = profileDetails._id;
        // console.log("id is", profileObjectId)
        
        
        // const profileUpdated = await User.findByIdAndUpdate(userId, {$set: {profile: profileObjectId}})
        const profileUpdated = await User.updateOne({_id: userId}, {$set: {zone_profile: profileObjectId}})
        console.log(profileUpdated)

        if(profileUpdated){
            await User.updateOne({_id: userId}, {$set: {profile_status: pStatus.completed.value}})
            res.status(201).json({ message: "Profile info added successfully" });
    } else {
        const error = new Error("Something went wrong");
        error.statusCode = 401; 
        throw error;
    }
    }
    catch (err) {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
    }
    
    
        }  
        
//update zone profile
exports.updateZoneProfile = async (req, res, next) =>{
    try {
        const { _id } = req.payload;
        const userId = mongoose.Types.ObjectId(_id);

        // Validate input
        const { error } = validateZProfileUpdateData(req.body);
        if (error) {
          return res.status(400).json({ message: error.details[0].message });
        }
        
        User.findById(userId).select('zone_profile').exec()
          .then(user => {
            const pId = user.zone_profile;
            console.log(pId);
            ZoneProfile.findById(pId, async (err, zoneProfile) => {
              if (err) {
                return res.status(404).json({ message: "Zone Profile not found" })
              }
              
              zoneProfile.address = req.body.address !== "" ? req.body.address : zoneProfile.address;
              zoneProfile.email = req.body.email !== "" ? req.body.email : zoneProfile.email;
              zoneProfile.phone = req.body.phone !== "" ? req.body.phone : zoneProfile.phone;

            //checks body if image is to be updated
           if (req.file) {
            imageUrl = await uploadImage(req.file, {
              folder: "zone-profiles",
              public_id: `zone-profiles-${userId}`,
              overwrite: true,
              resource_type: "auto",
            });
              zoneProfile.image = req.file.image !== "" ? imageUrl : zoneProfile.image;
            }
              zoneProfile.save(function (err) {
                if (err) { 
                  console.error(err);
                  const errMessage = "Something went wrong, please try again!";
                  return res.status(500).json({ message: errMessage });
                } else {
                  return res.status(201).json({ message: "Profile Updated Successfully" });
                }
              })
            })
          })
          .catch(err => {
            console.error(err);
            return res.status(500).json({ message: "Profile details not added..." });
          })
      } catch (err) {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      }
}
    
//get zone profile details
exports.fetchZoneProfile = async (req, res, next) =>{
  try {
      const { _id } = req.payload
      const userId = mongoose.Types.ObjectId(_id)
      
      User.findById(userId).populate('zone_profile').exec((err, user) =>{
        if (err){
          console.error(err)
          return res.status(404).json({ message: "Profile not found" })
        }
        const profileDetails = {
          zone: user.zone_profile.zone,
          address: user.zone_profile.address,
          phone: user.zone_profile.phone,
          image: user.zone_profile.image
        }
        res.status(201).json({profileDetails})
      })
  } catch (err) {
      if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
  }       
}

exports.createNecProfile = async (req, res, next) => {
  try {
      const { _id } = req.payload
      const userId = mongoose.Types.ObjectId(_id)
      
      User.findById(userId).select("nec_status").exec((err, user) =>{
        if(err){
            res.status(404).json({message: "User does not exist!"})
        }
        let pStatus = user.profile_status
        if(pStatus === 3){
            const error = new Error("Profile already exists");
            error.statusCode = 401;
            throw error;
    }
    })
        // Validate input
      const { error } = validateNProfileData(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      //function for uploading to cloudinary
      const imageUrl = await uploadImage(req.file, {
        folder: 'nec-profiles', 
        public_id: `nec-profile-${userId}`, 
        overwrite: true, 
        resource_type: 'auto', 
      });
      
      
      const profileDetails = await necProfileCreate(
        req.body.address, 
        req.body.phone, 
        req.body.email, 
        imageUrl
        )
      const profileObjectId = profileDetails._id;
      // console.log("id is", profileObjectId)
      
      
      // const profileUpdated = await User.findByIdAndUpdate(userId, {$set: {profile: profileObjectId}})
      const profileUpdated = await User.updateOne({_id: userId}, {$set: {nec_profile: profileObjectId}})
      console.log(profileUpdated)

      if(profileUpdated){
          await User.updateOne({_id: userId}, {$set: {profile_status: pStatus.completed.value}})
          res.status(201).json({ message: "Profile info added successfully" });
  } else {
      const error = new Error("Something went wrong");
      error.statusCode = 401; 
      throw error;
  }
  }
  catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
  }
  }  
      

  exports.updateNecProfile = async (req, res, next) =>{
    try {
        const { _id } = req.payload;
        const userId = mongoose.Types.ObjectId(_id);

        // Validate input
        const { error } = validateNProfileUpdateData(req.body);
        if (error) {
          return res.status(400).json({ message: error.details[0].message });
        }
        
        User.findById(userId).select('nec_profile').exec()
          .then(user => {
            const pId = user.zone_profile;
            console.log(pId);
            NecProfile.findById(pId, async (err, necProfile) => {
              if (err) {
                return res.status(404).json({ message: "Nec Profile not found" })
              }
              
              necProfile.address = req.body.address !== "" ? req.body.address : necProfile.address;
              necProfile.email = req.body.email !== "" ? req.body.email : necProfile.email;
              necProfile.phone = req.body.phone !== "" ? req.body.phone : necProfile.phone;

            //checks body if image is to be updated
           if (req.file) {
            imageUrl = await uploadImage(req.file, {
              folder: "nec-profiles",
              public_id: `nec-profiles-${userId}`,
              overwrite: true,
              resource_type: "auto",
            });
              necProfile.image = req.file.image !== "" ? imageUrl : necProfile.image;
            }
              necProfile.save(function (err) {
                if (err) { 
                  console.error(err);
                  const errMessage = "Something went wrong, please try again!";
                  return res.status(500).json({ message: errMessage });
                } else {
                  return res.status(201).json({ message: "Profile Updated Successfully" });
                }
              })
            })
          })
          .catch(err => {
            console.error(err);
            return res.status(500).json({ message: "Profile details not added..." });
          })
      } catch (err) {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      }
}

exports.fetchNecProfile = async (req, res, next) =>{
  try {
      const { _id } = req.payload
      const userId = mongoose.Types.ObjectId(_id)
      
      User.findById(userId).populate('nec_profile').exec((err, user) =>{
        if (err){
          console.error(err)
          return res.status(404).json({ message: "Profile not found" })
        }
        const profileDetails = {
          address: user.nec_profile.address,
          phone: user.nec_profile.phone,
          image: user.nec_profile.image
        }
        res.status(201).json({profileDetails})
      })
  } catch (err) {
      if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
  }       
}

