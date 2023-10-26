const mongoose = require('mongoose');
const { InstitutionProfile } = require('../models/Profiles/institutionProfile');
const { StateProfile } = require('../models/Profiles/stateProfile');
const { User } = require("../models/user");
const { ZoneProfile } = require('../models/Profiles/zoneProfile');

exports.zoneGetAllStates = async (req, res, next) => {
    try {
        const { _id } = req.payload
        const userId = mongoose.Types.ObjectId(_id)

        const user = await User.findById(userId).select("zone_profile");
        if (!user) {
            return res.status(404).json({ message: "User does not exist!" });
        }
        const zPid = user.zone_profile
        ZoneProfile.findById(zPid).populate({
            path: 'states',
            select: 'state id'
        }).exec((err, zoneProfile)=>{
            if(err){
                console.error(err)
                return res.status(404).json({ message: "Profile not found" })
            }
            let states = zoneProfile.states
            res.status(200).json(states)
        })
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
    } 
}

exports.zoneGetStateActivites = async(req, res, next) => {
    try {
        const stateId = req.params.stateId

        // const activities = await StateProfile.findById(stateId).populate({
        //     path: 'activities',
        //     select: '-__v -createdAt -updatedAt -_id'
        // })

        const listOfActivities = await StateProfile.findById(stateId).select('activities').exec();

        if (!listOfActivities) {
            return res.status(404).json({ message: 'Activities not found' });
        }

        await listOfActivities.populate({
            path: 'activities',
            select: '-__v -createdAt -updatedAt -_id'
        }).execPopulate();

        console.log(listOfActivities.activities);
        res.status(200).json({ activities: listOfActivities.activities });

    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
    }
}

exports.zoneGetStateEvents = async(req, res, next) => {
    try {
        const stateId = req.params.stateId

        const events = await StateProfile.findById(stateId).populate({
            path: 'events',
            select: '-__v -createdAt -updatedAt'
        })
        if(!events){
            return res.status(404).json({ message: 'events not found' })
        }
        // console.log(events)
        res.status(200).json({events})
        
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
    }
}
exports.zoneGetStateExcos = async(req, res, next) => {
    try {
        const stateId = req.params.stateId

        const excos = await StateProfile.findById(stateId).populate({
            path: 'excos',
            select: '-__v -createdAt -updatedAt'
        })
        if(!excos){
            return res.status(404).json({ message: 'excos not found' })
        }
        // console.log(excos)
        res.status(200).json({excos})
        
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
    }
}
exports.zoneGetStatePatrons = async(req, res, next) => {
    try {
        const stateId = req.params.stateId

        const patrons = await StateProfile.findById(stateId).populate({
            path: 'patrons',
            select: '-__v -createdAt -updatedAt'
        })
        if(!patrons){
            return res.status(404).json({ message: 'patrons not found' })
        }
        // console.log(patrons)
        res.status(200).json({patrons})
        
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
    }
}
exports.zoneGetStateInstitutions = async (req, res, next) => {
    try {
        const stateId = req.params.stateId

        const institutions = await StateProfile.findById(stateId).populate({
            path: 'institution',
            select: '-__v -createdAt -updatedAt'
        })
        if(!institutions){
            return res.status(404).json({ message: 'institutions not found' })
        }
        // console.log(institutions)
        res.status(200).json({institutions})
        
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
    }
}

exports.zoneGetInstitutionMembers = async (req, res, next) => {
    try {
        const institutionId = req.params.institutionId

        const members = await InstitutionProfile.findById(institutionId).populate({
            path: 'members',
            select: '-__v -createdAt -updatedAt'
        })
        if(!members){
            return res.status(404).json({ message: 'members not found' })
        }
        // console.log(members)
        res.status(200).json({members})
        
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
    }
}
exports.zoneGetInstitutionActivities = async (req, res, next) => {
    try {
        const institutionId = req.params.institutionId

        const iActivities = await InstitutionProfile.findById(institutionId).populate({
            path: 'activities',
            select: '-__v -createdAt -updatedAt'
        })
        if(!iActivities){
            return res.status(404).json({ message: 'activities not found' })
        }
        // console.log(iActivities)
        res.status(200).json({activities: iActivities})
        
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
    }
}
exports.zoneGetInstitutionExcos = async (req, res, next) => {
    try {
        const institutionId = req.params.institutionId

        const iExcos = await InstitutionProfile.findById(institutionId).populate({
            path: 'excos',
            select: '-__v -createdAt -updatedAt'
        })
        if(!iExcos){
            return res.status(404).json({ message: 'excos not found' })
        }
        // console.log(iExco)
        res.status(200).json({iExcos})
        
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
    }

}

exports.zoneGetInstitutionPatrons = async (req, res, next) => {
    try {
        const institutionId = req.params.institutionId

        const patrons = await InstitutionProfile.findById(institutionId).populate({
            path: 'patrons',
            select: '-__v -createdAt -updatedAt'
        })
        if(!patrons){
            return res.status(404).json({ message: 'patrons not found' })
        }
        // console.log(patrons)
        res.status(200).json({patrons})
        
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
    }
}

exports.zoneGetInstitutionEvents = async (req, res, next) => {
    try {
        const institutionId = req.params.institutionId

        const iEvents = await InstitutionProfile.findById(institutionId).populate({
            path: 'events',
            select: '-__v -createdAt -updatedAt'
        })
        if(!iEvents){
            return res.status(404).json({ message: 'events not found' })
        }
        // console.log(iEvents)
        res.status(200).json({iEvents})
        
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
    }
}