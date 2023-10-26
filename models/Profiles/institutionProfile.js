const mongoose = require("mongoose")
const Joi = require("joi");

const InstitutionProfileSchema = new mongoose.Schema(
    {
        institution_name: {
            type: String,
        },

        acronym: {
          type: String,
      },
      
        address: {
            type: String,
        },

        latitude: {
          type: Number,
        },
        longitude: {
          type: Number,
      
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
        },
        
        image: {
            type: String
        },

        members: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Member',
            required: true,
          }],
        
        excos: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Exco',
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
        
        {timestamps: true}
        
)
//Validate input using Joi
const validateIProfileData = (iProfile) => {
    const schema = Joi.object({
      institution_name: Joi.string().min(2).max(50).required(),
      acronym: Joi.string().min(2).max(50).required(),
      address: Joi.string().min(2).max(50).required(),
      longitude: Joi.string().min(2).max(100).required(),
      latitude: Joi.string().min(2).max(100).required(),
      state: Joi.string().min(3).max(50).required(),
      zone: Joi.string().min(3).max(50).required(),
      email: Joi.string().required()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .required(),
      phone: Joi.string().regex(/^\d{11}$/).required(),
      image: Joi.when('file', {
        is: Joi.exist(),
        then: Joi.string().min(3).max(500)
      })
    })
    return schema.validate(iProfile)
  }
  
//Validate input using Joi
const validateUpdateIProfileData = (iProfile) => {
  const schema = Joi.object({
    institution_name: Joi.string().min(2).max(50),
    acronym: Joi.string().min(2).max(50),
    address: Joi.string().min(2).max(50),
    longitude: Joi.string().min(2).max(100),
    latitude: Joi.string().min(2).max(100),
    state: Joi.string().min(3).max(50),
    zone: Joi.string().min(3).max(50),
    email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
    phone: Joi.string().regex(/^\d{11}$/),
    image: Joi.when('file', {
      is: Joi.exist(),
      then: Joi.string().min(3).max(500)
    })
  }).min(1) //atleast a field must be updated
  return schema.validate(iProfile)
}

const InstitutionProfile = mongoose.model("InstitutionProfile", InstitutionProfileSchema)

module.exports = {
    InstitutionProfile,
    validateIProfileData,
    validateUpdateIProfileData
}