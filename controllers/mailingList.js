const { Mailing, validateEmail } = require("../models/mailingList")

exports.acceptMailingList = async (req, res, next) =>{
    try {
      const { error } = validateEmail(req.body); // Validate the request body using Joi schema

      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }
        const email = req.body.email
        const alreadyRegister = Mailing.findOne({email})
        if (alreadyRegister){
          return res.status(400).json({message: "Email already exist!"})
        }
        const emailSaved = await Mailing.create({email})
        if(emailSaved){
           return res.status(201).json({message: `${email} has been added to mailing list`})
          }
          console.log("Something went wrong...")
      } catch (err) {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      }
    }