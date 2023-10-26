const mongoose = require("mongoose");
const Joi = require("joi");


// Create SCHEMA
const BroadCastSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "post description is required"],
      trim: true,
    },

    image: {
      type: String,
    },

    approved: {
      type: Boolean,
      required: true,
      default: false
    },

    author: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const validateBroadcastData = (bc) => {
  const schema = Joi.object({
    title: Joi.string().min(2).max(100).required(),
    description: Joi.string().min(3).max(1000).required(),
    image: Joi.when('file', {
      is: Joi.exist(),
      then: Joi.string().min(3).max(500)
    })
  })
  return schema.validate(bc)
}

const validateBroadcastDataUpdate = (bc) => {
  const schema = Joi.object({
    title: Joi.string().min(2).max(100),
    description: Joi.string().min(3).max(1000),
    image: Joi.when('file', {
      is: Joi.exist(),
      then: Joi.string().min(3).max(500)
    })
  }).min(1)
  return schema.validate(bc)
}


const BroadCast = mongoose.model("BroadCast", BroadCastSchema);

module.exports = {
  BroadCast,
  validateBroadcastData,
  validateBroadcastDataUpdate
};