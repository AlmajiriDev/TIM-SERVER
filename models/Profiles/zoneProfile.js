const mongoose = require("mongoose")
const Joi = require('joi')

const ZoneProfileSchema = new mongoose.Schema(
    {
        zone: {
            type: String,

        },
        
        address: {
            type: String,
        },
        
        email: {
          type: String,
          unique: true,
      //     validate: {
      //         validator: function(v) {
      //             return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      //         },
      //         message: props => `${props.value} is not a valid email address!`
      //     }
      },
        
        states: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'StateProfile',
            required: true,
          }
        ],
         
        phone: {
            type: String,
        },
        
        image: {
            type: String
        },
        
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
        },

        {
            timestamps: true
        }
)

//Validate input for creating zone profle
const validateZProfileData = (zProfile) => {
  const schema = Joi.object({
    zone: Joi.string().trim().valid('southwest', 'northwest', 'northeast', 'northcentral').lowercase().required(),
    address: Joi.string().min(2).max(50).required(),
    email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
    phone: Joi.string().regex(/^\d{11}$/).required(),
    image: Joi.when('file', {
      is: Joi.exist(),
      then: Joi.string().min(3).max(500)
    })
  })
  return schema.validate(zProfile)
}

//Validate input for updating zone profle
const validateZProfileUpdateData = (zProfile) => {
  const schema = Joi.object({
    address: Joi.string().min(2).max(50),
    email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
    phone: Joi.string().regex(/^\d{11}$/),
    image: Joi.when('file', {
      is: Joi.exist(),
      then: Joi.string().min(3).max(500)
    })
    // image: Joi.string().min(3).max(500)
  }).min(1) //require at least one field to update
  
  return schema.validate(zProfile)
}


const ZoneProfile = mongoose.model("ZoneProfile", ZoneProfileSchema)

module.exports = {
  ZoneProfile,
  validateZProfileData,
  validateZProfileUpdateData
}