const mongoose = require("mongoose");
const Joi = require("joi");

const EventSchema = mongoose.Schema(
  {
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ExcoProfile',
        required: true,
      },
    eventName: {
      type: String,
    },
    description: {
      type: String,
    },

    venue: {
      type: String,
    },

    date: {
      type: String,
    },

    time: {
        type: String,
      },

    estimated_budget: {
      type: String,
    },
},
  {
    timestamps: true,
  }
);

// Use Joi to validate the input data
const validateEvent = (event) => {
  const schema = Joi.object({
    eventName: Joi.string().min(3).max(50).required(),
    description: Joi.string().min(20).max(500).required(),
    venue: Joi.string().min(3).max(50).required(),
    date: Joi.string().min(3).max(50).required(),
    time: Joi.string().min(3).max(10).required(),
    estimated_budget: Joi().string().min(2).max(50).required()
  });

  return schema.validate(event);
};

const validateUpdateEvent = (event) => {
    const schema = Joi.object({
      eventName: Joi.string().min(3).max(50),
      description: Joi.string().min(20).max(500),
      venue: Joi.string().min(3).max(50),
      date: Joi.string().min(3).max(50),
      time: Joi.string().min(3).max(10),
      estimated_budget: Joi().string().min(2).max(50)
    }).min(1);
  
    return schema.validate(event);
  };
  


const Event = mongoose.model("Event", EventSchema);

module.exports = {
  Event,
  validateEvent,
  validateUpdateEvent
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