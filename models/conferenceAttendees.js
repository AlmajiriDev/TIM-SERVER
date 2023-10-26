const mongoose = require("mongoose");
const Joi = require("joi");

const ConferenceAttendeesSchema = mongoose.Schema(
  {

    conferenceId: {
      type: String,
    },

    attendeeId: {
        type: String
    }, 

    fullName: {
      type: String,
    },

    email: {
        type: String,
    },
    
    phone: {
        type: String,
    },

    membershipType: {
        type: String,
    },

    institution: {
      type: String,
    },
    
    state: {
      type: String,
    },

    zone: {
        type: String,
      },

    status: {
        type: String,
      },
},
  {
    timestamps: true,
  }
);

// Use Joi to validate the input data
const validateConferenceAttendees = (conferenceAttendees) => {
  const schema = Joi.object({
        conferenceId: Joi.string().min(20).max(500).required(),
        attendeeId: Joi.string().min(20).max(50).required(),
        fullName: Joi.string().min(20).max(50).required(),
        email: Joi.string().min(20).max(50).required(),
        phone: Joi.string().min(20).max(50).required(),
        membershipType: Joi.string().min(3).max(50).required(),
        institution: Joi.string().min(3).max(50).required(),
        state: Joi.string().min(3).max(10).required(),
        zone: Joi.string().min(3).max(10).required(),
        status: Joi.string().min(1).max(1).required()
      });
      
      return schema.validate(conferenceAttendees);
    };
    
    const validateUpdateConferenceAttendees = (conferenceAttendees) => {
      const schema = Joi.object({
        conferenceId: Joi.string().min(20).max(500),
        attendeeId: Joi.string().min(20).max(50),    
        fullName: Joi.string().min(20).max(50),
        email: Joi.string().min(20).max(50),
        phone: Joi.string().min(20).max(50),
        membershipType: Joi.string().min(3).max(50),
        institution: Joi.string().min(3).max(50),
        state: Joi.string().min(3).max(10),
        zone: Joi.string().min(3).max(10),
        status: Joi.string().min(1).max(1)
    }).min(1);
  
    return schema.validate(conferenceAttendees);
  };

const ConferenceAttendees = mongoose.model("ConferenceAttendees", ConferenceAttendeesSchema);

module.exports = {
  ConferenceAttendees,
  validateConferenceAttendees,
  validateUpdateConferenceAttendees
};