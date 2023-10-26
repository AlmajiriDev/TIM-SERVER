const mongoose = require("mongoose")
const Joi = require("joi");

const ProfileSchema = new mongoose.Schema(
    {
        firstName: {
          type: String,
        },
  
        lastName: {
          type: String,
        },
        otherNames: {
            type: String,
        },

        bio: {
          type: String,
      },
      
        institution: {
          type: String,
        },

        gender:{
          type: String
        },

        course:{
          type: String
        },
        
        occupation: {
            type: String
        },

        graduation_status:{
            type: String,
        },

        graduation_date: {
          type: String,
        },
  
        state_of_origin: {
          type: String,
        },

        state_of_residence: {
            type: String,
        },

        phone: {
          type: String,
        },
        
        email: {
          type: String,
        },

        
        image: {
            type: String
        },
      },
      {
        timestamps: true,
      }
)

//Validate input using Joi
const validateMemberProfileData = (profile) => {
  const schema = Joi.object({
    firstName: Joi.string().min(3).max(50).required(),
    lastName: Joi.string().min(3).max(50).required(),
    otherNames: Joi.string().min(3).max(50),
    bio: Joi.string().min(3).max(200),
    gender: Joi.string().trim().valid('male', 'female').lowercase().required(),
    institution: Joi.string().min(3).max(50).required(),
    course: Joi.string().min(3).max(50).required(),
    occupation: Joi.string().min(3).max(50),
    graduation_status: Joi.string().min(3).max(50).required(),
    graduation_date: Joi.string().min(3).max(50),
    state_of_origin: Joi.string().min(3).max(50).required(),
    state_of_residence: Joi.string().min(3).max(50).required(),
    phone: Joi.string().regex(/^\d{11}$/).required(),
    email: Joi.string().email().required(),
    image: Joi.when('file', {
      is: Joi.exist(),
      then: Joi.string().min(3).max(500)
    })
  })
  return schema.validate(profile)
}

const validateUpdateMemberProfileData = (profile) => {
  const schema = Joi.object({
    firstName: Joi.string().min(3).max(50),
    lastName: Joi.string().min(3).max(50),
    otherNames: Joi.string().min(3).max(50),
    bio: Joi.string().min(3).max(200),
    gender: Joi.string().trim().valid('male', 'female').lowercase(),
    institution: Joi.string().min(3).max(50),
    course: Joi.string().min(3).max(50),
    occupation: Joi.string().min(3).max(50),
    graduation_status: Joi.string().min(3).max(50),
    graduation_date: Joi.string().min(3).max(50),
    state_of_origin: Joi.string().min(3).max(50),
    state_of_residence: Joi.string().min(3).max(50),
    phone: Joi.string().regex(/^\d{11}$/),
    email: Joi.string().email(),
    image: Joi.when('file', {
      is: Joi.exist(),
      then: Joi.string().min(3).max(500)
    })
  }).min(1)
  return schema.validate(profile)
}

const MemberProfile = mongoose.model("MemberProfile", ProfileSchema)

module.exports = {
  MemberProfile, 
  validateMemberProfileData,
  validateUpdateMemberProfileData
}