const { InstitutionProfile } = require("../models/Profiles/institutionProfile")
const { StateProfile } = require("../models/Profiles/stateProfile")
const { ZoneProfile } = require("../models/Profiles/zoneProfile")


//getting list of all institutions
exports.getAllInstitutionChapters = async (req, res, next) => {
    try {
        const allInstitutions = await InstitutionProfile.find().select('institution_name')

        const listOfInstitutions = []
        for (const obj of allInstitutions) {
            const institution = {
                institution_name: obj.institution_name,
                state: obj.state
            }
            listOfInstitutions.push(institution)
        }

        res.status(200).json({ listOfInstitutions })
    } catch (err) {
        console.error(err)
        const error = new Error("Something went while retrieving info from DB")
        error.statusCode = 500
        throw error
    }
}

// getting list of all state chapters
exports.getAllStateChapters = async (req, res, next) => {
    try {
        const allStates = await StateProfile.find().select('state')

        const listOfStates = []
        for (const obj of allStates) {
            listOfStates.push(obj.state)
        }

        res.status(200).json({ listOfStates })
    } catch (err) {
        console.error(err)
        const error = new Error("Something went while retrieving info from DB")
        error.statusCode = 500
        throw error
    }
}
exports.getAllZoneChapters = async (req, res, next) => {
    try {
        const allZones = await ZoneProfile.find().select('zone')

        const listOfZones = []
        for (const obj of allZones) {
            listOfZones.push(obj.allZones)
        }

        res.status(200).json({ listOfZones })
    } catch (err) {
        console.error(err)
        const error = new Error("Something went while retrieving info from DB")
        error.statusCode = 500
        throw error
    }
}

