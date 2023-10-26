const mongoose = require("mongoose")
const Joi = require("joi");

const PatronProfileSchema = new mongoose.Schema(
    {
        title: {
          type: String,
        },

        firstName: {
          type: String,
        },  
        lastName: {
          type: String,
        },
        otherNames: {
            type: String,
        },

        occupation: {
            type: String
        },

        place_of_work: {
            type: String    
        },

        state_of_residence: {
            type: String,
        },
        post: {
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
const validatePProfile = (pProfile) => {
  const schema = Joi.object({
    title: Joi.string().min(2).max(50).required(),
    firstName: Joi.string().min(3).max(50).required(),
    lastName: Joi.string().min(3).max(50).required(),
    otherNames: Joi.string().max(50),
    occupation: Joi.string().max(50),
    place_of_work: Joi.string().max(50),
    state_of_residence: Joi.string().min(3).max(50).required(),
    post: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().regex(/^\d{11}$/).required(),
    image: Joi.when('file', {
        is: Joi.exist(),
        then: Joi.string().min(3).max(500)
      })
  });

  return schema.validate(pProfile);
};

const validateUpdatePProfile = (pProfile) => {
  const schema = Joi.object({
    title: Joi.string().min(2).max(50),
    firstName: Joi.string().min(3).max(50),
    lastName: Joi.string().min(3).max(50),
    otherNames: Joi.string().min(3).max(50),
    occupation: Joi.string().min(3).max(50),
    place_of_work: Joi.string().min(3).max(50),
    state_of_residence: Joi.string().min(3).max(50),
    post: Joi.string().min(3).max(50),
    email: Joi.string().email(),
    phone: Joi.string().regex(/^\d{11}$/),
    image: Joi.when('file', {
        is: Joi.exist(),
        then: Joi.string().min(3).max(500)
      })
  }).min(1)

  return schema.validate(pProfile);
};
const PatronProfile = mongoose.model("PatronProfile", PatronProfileSchema)

module.exports = {
  PatronProfile,
  validatePProfile,
  validateUpdatePProfile
}