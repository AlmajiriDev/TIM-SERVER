const mongoose = require("mongoose")
const Joi = require("joi");

const StateProfileSchema = new mongoose.Schema(
    {
        address: {
            type: String,
        },

        state: {
            type: String,
        },
        
        zone: {
            type: String,
        },
        
        email: {
            type: String,
            unique: true,
        },
        
        phone: {
            type: String,
            required: true,
          },
        
        image: {
            type: String
        },

        institutions: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'InstitutionProfile',
            required: true,
            }],
        
        excos: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ExcoProfile',
            required: true,
          }],
        patrons: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'PatronProfile',
            required: true,
          }],
        activities: [{
          type: mongoose.Schema.Types.ObjectId,
              ref: 'Activity',
              required: true,
            }],
        events: [{
          type: mongoose.Schema.Types.ObjectId,
              ref: 'Event',
              required: true,
            }],
        
        },
        {
            timestamps: true,
        }
)
//Validate input using Joi for creating a new StateProfile
const validateSProfileData = (sProfile) => {
    const schema = Joi.object({
      address: Joi.string().min(2).max(50).required(),
      state: Joi.string().min(3).max(50).required(),
      zone: Joi.string().min(3).max(50).required(),
      email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .required(),
      phone: Joi.string().regex(/^\d{11}$/).required(),
      image: Joi.when('file', {
        is: Joi.exist(),
        then: Joi.string().min(3).max(500)
      })
    })
    return schema.validate(sProfile)
  }

//Validate input using Joi for updating an existing StateProfile
const validateUpdateSProfileData = (sProfile) => {
    const schema = Joi.object({
      address: Joi.string().min(2).max(50),
      state: Joi.string().min(3).max(50),
      zone: Joi.string().min(3).max(50),
      email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
      phone: Joi.string().regex(/^\d{11}$/),
      image: Joi.when('file', {
        is: Joi.exist(),
        then: Joi.string().min(3).max(500)
      })
    }).min(1) // require at least one field to update
    
    return schema.validate(sProfile)
  }
  
const StateProfile = mongoose.model("StateProfile", StateProfileSchema)

module.exports = {
    StateProfile,
    validateSProfileData,
    validateUpdateSProfileData
}