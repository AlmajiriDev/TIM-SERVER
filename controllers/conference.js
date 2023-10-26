const uuid = require('uuid');
const { accountType } = require("../helpers/enum");
const { validateConference, Conference, validateUpdateConference } = require("../models/conference");
const { User } = require("../models/user");
const ConferenceService = require("../services/conference.service")
const conferenceService = new ConferenceService()

module.exports = {
    async getConferences(req, res){
        let result = await conferenceService.getConferences()
        if (result.error) {
            return res.status(500).json(result);
          } else {
            return res.status(200).json(result);
          }
    },
    
    async createConference(req, res, next){
        try {
          let { _id } = req.payload
          let userId = mongoose.Types.ObjectId(_id)

          // Validate input
          const { error } = validateConference(req.body);
          if (error) {
            return res.status(400).json({ message: error.details[0].message });
          }
          
          const user = await User.findById(userId).select(
            "isAdmin account_type"
          );
      
          
          if (!user) {
            return res.status(404).json({ message: "User does not exist!" });
          }
         
          const imageUrl = await uploadImage(req.file, {
            folder: 'conference-cover-image', 
            public_id: `conference-${userId}`, 
            overwrite: true, 
            resource_type: 'auto', 
          });

          let typeOfAccount = user.account_type
          if (typeOfAccount === "nec"){
            let data = { 
              conferenceName: req.body.conferenceName, 
              description: req.body.description,
              venue: req.body.venue,
              date: req.body.date,
              status: "Active",
              image: imageUrl,
              createdBy: userId,
            }
            let result = await Conference.create(data)
            if (result){
              return {
                message: `Conference ${result.conferenceName} created!`,
                success: true,
                error: false,
                data: result,
              };
            } else{
              return {
                message: "Failed to create conference",
                success: false,
                error: true,
                data: null,
              };
            }
          } else{
            return {
              message: "Account for NEC",
              success: false,
              error: true,
              data: null,
          }
       }
        } catch (error) {
          if (!err.statusCode) {
            err.statusCode = 500;
        }
      }
    },
    
    async updateConference(req, res){
      try {
        let { _id } = req.payload
        let userId = mongoose.Types.ObjectId(_id)
        let conferenceId = req.params.conferenceId
        
        const { error } = validateUpdateConference(req.body);
        if (error) {
          return res.status(400).json({ message: error.details[0].message });
        }

        const user = await User.findById(userId).select(
          "isAdmin account_type"
        );
    
        if (!user) {
          return res.status(404).json({ message: "User does not exist!" });
        }
        let typeOfAccount = user.account_type
        
        
        Conference.findById(conferenceId, async (err, conference)=>{
          if (conference.createdBy === userId && typeOfAccount === "nec"){
            try {
              conference.conferenceName = req.body.conferenceName !== "" ? req.body.conferenceName : conference.conferenceName
              conference.description = req.body.description !== "" ? req.body.description : conference.description
              conference.venue = req.body.venue !== "" ? req.body.venue : conference.venue
              conference.date = req.body.date !== "" ? req.body.date : conference.date
              conference.status = req.body.status !== "" ? req.body.status : conference.status

              if(req.file){
                const imageUrl = await uploadImage(req.file, {
                  folder: 'conference-cover-image', 
                  public_id: `conference-${userId}`, 
                  overwrite: true, 
                  resource_type: 'auto', 
                });
                conference.image = req.body.image !== "" ? imageUrl : conference.image
              }
              conference.save(function (err) {
                if (err) { 
                  console.error(err);
                  const errMessage = "Something went wrong, please try again!";
                  return res.status(500).json({ message: errMessage });
                } else {
                  return res.status(201).json({ message: "Conference Updated Successfully" });
                }
              })
            } catch (err) {
              console.error(err);
              const errMessage = "Something went wrong, please try again!";
              return res.status(500).json({ message: errMessage });
            }
          }
        })

      } catch (err) {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      }
    },

    async attendConference(req, res){
        try {
          let { _id } = req.payload
          let userId = mongoose.Types.ObjectId(_id)
          let body = req.body

        } catch (error) {
          
        }
        
    },

    async conferencePayment(req, res){
        let { _id } = req.payload
        let userId = mongoose.Types.ObjectId(_id)
    },

    async confirmAttendeeStatus(req, res){
        let { _id } = req.payload
        let userId = mongoose.Types.ObjectId(_id)
        
    },    
    
    async getConferenceAttendees(req, res){
        let { _id } = req.payload
        let userId = mongoose.Types.ObjectId(_id)
    },    

}