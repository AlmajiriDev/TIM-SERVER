const mongoose = require("mongoose");
const Joi = require("joi");

const UserSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },

    status: {
      type: Number,
    },

    email: {
      type: String,
      unique: true
    },

    password: {
      type: String,
    },
    account_type: {
      type: String,
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },

    isSuperAdmin: {
      type: Boolean,
      default: false,
    },

    email_token: {
      type: String,
    },

    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MemberProfile",
    },

    institution_profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InstitutionProfile",
    },

    state_profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StateProfile",
    },

    zone_profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ZoneProfile",
    },  
    
    nec_profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NecProfile",
    },

    profile_status: {
      type: Number,
    },

    refresh_token: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Use Joi to validate the input data
const validateUser = (user) => {
  const schema = Joi.object({
    firstName: Joi.string().min(3).max(50).required(),
    lastName: Joi.when('account_type', {
      is: 'member',
      then: Joi.string().min(3).max(50).required(),
      otherwise: Joi.string().min(3).max(50),
    }),
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .required(),
    password: Joi.string()
      .pattern(/^(?=.*[A-Z])(?=.*[!@#$&*])(?=.{8,})/)
      .required()
      .messages({
        "string.pattern.base":
          "Password must be at least 8 characters, it must also contain one capital letter, and one special character",
      }),
    confirmPassword: Joi.valid(Joi.ref("password")).required().messages({
      "any.only": "Passwords do not match",
    }),
    account_type: Joi.string().valid("member", "institution", "state", "zone", "nec"),
  });

  return schema.validate(user);
};

const validateEmail = (user) => {
  const schema = Joi.object({
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .required(),
  });
  return schema.validate(user);
};



const User = mongoose.model("User", UserSchema);

module.exports = {
  User,
  validateUser,
  validateEmail
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