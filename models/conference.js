const mongoose = require("mongoose");
const Joi = require("joi");

const ConferenceSchema = mongoose.Schema(
  {
    conferenceName: {
      type: String,
    },
    description: {
      type: String,
    },
    venue: {
      type: String,
    },
    
    image: {
      type: String,
    },
    date: {
      type: String,
    },
    createdBy: {
      type: String,
    },
    status: {
      type: String,
    },
    attendees: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ConferenceAttendees',
      required: true,
    }],
    
},
  {
    timestamps: true,
  }
);

// Use Joi to validate the input data
const validateConference = (conference) => {
  const schema = Joi.object({
    conferenceName: Joi.string().min(3).max(50).required(),
    description: Joi.string().min(20).max(500).required(),
    image: Joi.string().min(20).max(500).required(),
    venue: Joi.string().min(3).max(50).required(),
    date: Joi.string().min(3).max(50).required(),
    createdBy: Joi.string().min(3).max(50).required(),
    status: Joi.string().min(1).max(10).required()
  });

  return schema.validate(conference);
};

const validateUpdateConference = (conference) => {
    const schema = Joi.object({
      conferenceName: Joi.string().min(3).max(50),
      description: Joi.string().min(20).max(500),
      image: Joi.string().min(20).max(500),
      venue: Joi.string().min(3).max(50),
      date: Joi.string().min(3).max(50),
      status: Joi.string().min(1).max(10)
    }).min(1);
  
    return schema.validate(conference);
  };

const Conference = mongoose.model("Conference", ConferenceSchema);

module.exports = {
  Conference,
  validateConference,
  validateUpdateConference
};