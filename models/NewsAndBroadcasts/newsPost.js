const mongoose = require("mongoose");
const Joi = require("joi");


// Create SCHEMA
const PostSchema = new mongoose.Schema(
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

    author: {
      type: String,
      required: [true, "Author is required"],
    },
    
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

    // category: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Category",
    //   required: [true, "Post category is required"],
    // },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    disLikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const validateNewsData = (news) => {
  const schema = Joi.object({
    title: Joi.string().min(2).max(100).required(),
    description: Joi.string().min(3).max(10000000000000).required(),
    author: Joi.string().min(3).max(100).required(),
    image: Joi.when('file', {
      is: Joi.exist(),
      then: Joi.string().min(3).max(500)
    })
  })
  return schema.validate(news)
}

const validateNewsDataUpdate = (news) => {
  const schema = Joi.object({
    title: Joi.string().min(2).max(100),
    description: Joi.string().min(3).max(10000000000000),
    author: Joi.string().min(3).max(100),
    image: Joi.when('file', {
      is: Joi.exist(),
      then: Joi.string().min(3).max(500)
    })
  }).min(1)
  return schema.validate(news)
}


const Post = mongoose.model("Post", PostSchema);
module.exports = {
  Post,
  validateNewsData,
  validateNewsDataUpdate
};