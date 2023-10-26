const mongoose = require("mongoose")
const Joi = require('joi');

const ExcoProfileSchema = new mongoose.Schema(
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

        course_of_study:{
          type: String,
        },
        
        post: {
          type: String,
        },
        
        occupation: {
            type: String
        },

        graduation_status:{
            type: String,
        },

        graduation_date: {
          type: String
        },
  
        state_of_origin: {
          type: String,
        },

        state_of_residence: {
          type: String,
        },

        email: {
          type: String,
        },
        
        phone: {
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

// Use Joi to validate the input data
const validateEProfile = (eProfile) => {
  const schema = Joi.object({
    firstName: Joi.string().min(3).max(50).required(),
    lastName: Joi.string().min(3).max(50).required(),
    otherNames: Joi.string().min(3).max(50),
    course_of_study: Joi.string().min(3).max(50).required(),
    post: Joi.string().min(3).max(50).required(),
    occupation: Joi.string().min(3).max(50),
    graduation_status: Joi.string().min(3).max(50).required(),
    graduation_date: Joi.string().min(3).max(50),
    state_of_origin: Joi.string().min(3).max(50).required(),
    state_of_residence: Joi.string().min(3).max(50).required(),
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .required(),
    phone: Joi.string().regex(/^\d{11}$/).required(),
    image: Joi.when('file', {
      is: Joi.exist(),
      then: Joi.string().min(3).max(500)
    })
  });
  return schema.validate(eProfile);
}

const validateUpdateEProfile = (eProfile) => {
  const schema = Joi.object({
    firstName: Joi.string().min(3).max(50),
    lastName: Joi.string().min(3).max(50),
    otherNames: Joi.string().min(3).max(50),
    course_of_study: Joi.string().min(3).max(50),
    post: Joi.string().min(3).max(50).required(),
    occupation: Joi.string().min(3).max(50),
    graduation_status: Joi.string().min(3).max(50),
    graduation_date: Joi.string().min(3).max(50),
    state_of_origin: Joi.string().min(3).max(50),
    state_of_residence: Joi.string().min(3).max(50),
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
    phone: Joi.string().regex(/^\d{11}$/),
    image: Joi.when('file', {
      is: Joi.exist(),
      then: Joi.string().min(3).max(500)
    })
  }).min(1);
  return schema.validate(eProfile);
};

const ExcoProfile = mongoose.model("ExcoProfile", ExcoProfileSchema)

module.exports = {
  ExcoProfile,
  validateEProfile,
  validateUpdateEProfile
}