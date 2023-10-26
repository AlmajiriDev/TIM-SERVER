const mongoose = require("mongoose");
const Joi = require("joi");

const ActivitySchema = mongoose.Schema(
  {
    activityName: {
      type: String,
    },
    concurrency: {
      type: String,
    },

    venue: {
      type: String,
    },

    time: {
      type: String,
    },

    description: {
      type: String,
    },
},
  {
    timestamps: true,
  }
);

// Use Joi to validate the input data
const validateActivity = (activity) => {
  const schema = Joi.object({
    activityName: Joi.string().min(3).max(50).required(),
    concurrency: Joi.string().min(3).max(50).required(),
    venue: Joi.string().min(3).max(50).required(),
    time: Joi.string().min(3).max(10).required(),
    description: Joi.string().min(20).max(500).required()
  });

  return schema.validate(activity);
};

const validateUpdateActivity = (activity) => {
    const schema = Joi.object({
      activityName: Joi.string().min(3).max(50),
      concurrency: Joi.string().min(3).max(50),
      venue: Joi.string().min(3).max(50),
      time: Joi.string().min(3).max(10),
      description: Joi.string().min(20).max(500)
    }).min(1);
  
    return schema.validate(activity);
  };

const Activity = mongoose.model("Activity", ActivitySchema);

module.exports = {
  Activity,
  validateActivity,
  validateUpdateActivity
  
};







































// const mongoose = require("mongoose")

// const UserSchema = mongoose.Schema(
//     {
//       firstName: {
//         type: String,
//         required: true,
//         minlength: [2, ' name must be at least 3 characters long.'],
//         maxlength: [50, ' name cannot be longer than 20 characters.']
//       },  
//       lastName: {
//         type: String,
//         required: true,
//         minlength: [2, ' name must be at least 3 characters long.'],
//         maxlength: [50, ' name cannot be longer than 20 characters.']
//       },

//       status:{
//         type: Number,
//       },
      
//       email: {
//         type: String,
//         required: true,
//         unique: true,
//         validate: {
//             validator: function(v) {
//                 return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
//             },
//             message: props => `${props.value} is not a valid email address!`
//         }
//       },

//       password: {
//         type: String,
//         required: true,
//         validate: {
//           validator: function(v) {
//             return /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.{8,})/.test(v);
//           },
//           message: 'Password must be at least 8 characters, contain one capital letter, and one special character'
//         }
//       },
//       confirmPassword: {
//         type: String,
//         required: true,
//         validate: {
//           validator: function(v) {
//             return this.password === v;
//           },
//           message: 'Passwords do not match'
//         }
//       },
        
//         account_type: {
//           type: String,
//           enum: {
//             values: ['member', 'institution', 'state', 'zone'],
//             message: 'Invalid value for {PATH}: {VALUE}'
//           }
//         },
        
//         isAdmin:{
//           type: Boolean,
//           default: false
//         },
        
//         email_token: {
//           type: String,
//         }, 
        
//         profile: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "Profile"
//         },
        
//         institution_profile: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "InstitutionProfile"
//         },

//         state_profile: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "StateProfile"
//         },
        
//         zone_profile: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "ZoneProfile"
//         },
        
//         profile_status: {
//           type: Number
//         },

//         refresh_token: {
//           type: String
//         },
//       },
//       {
//         timestamps: true,
//       }
//   );
 

  
// const User = mongoose.model('User', UserSchema);

// module.exports = User