const mongoose = require("mongoose");
const Joi = require("joi");

const MailingSchema = mongoose.Schema(
    {
        email: { type: String, required: true, unique: true }
    },
    {
        timestamp: true
    }
)

const Mailing = mongoose.model("Mailing", MailingSchema)

const validateEmail = (input) => {
    const schema = Joi.object({
        email: Joi.string().email().required()
    })
}

module.exports = {
    Mailing,
    validateEmail
}
