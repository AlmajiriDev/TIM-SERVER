const mongoose = require("mongoose")
const Joi = require('joi')

const NecProfileSchema = new mongoose.Schema(
    {
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
const validateNProfileData = (zProfile) => {
  const schema = Joi.object({
    address: Joi.string().min(2).max(50).required(),
    email: Joi.string()
    .email().required(),
    phone: Joi.string().regex(/^\d{11}$/).required(),
    image: Joi.when('file', {
      is: Joi.exist(),
      then: Joi.string().min(3).max(500)
    })
  })
  return schema.validate(zProfile)
}

//Validate input for updating zone profle
const validateNProfileUpdateData = (zProfile) => {
  const schema = Joi.object({
    email: Joi.string().email(),
    phone: Joi.string().regex(/^\d{11}$/),
    image: Joi.when('file', {
      is: Joi.exist(),
      then: Joi.string().min(3).max(500)
    })
  }).min(1) //require at least one field to update
  
  return schema.validate(zProfile)
}


const NecProfile = mongoose.model("NecProfile", NecProfileSchema)

module.exports = {
  NecProfile,
  validateNProfileData,
  validateNProfileUpdateData
}