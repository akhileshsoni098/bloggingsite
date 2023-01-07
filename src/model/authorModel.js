const mongoose = require('mongoose');

// ================== **This is what how our blog model will look like**==================================

const authorSchema = new mongoose.Schema({
    fname:
    {
        type: String,
        required: true

    },

    lname:
    {
        type: String,
        required: true
    },

    title:
    {
        type: String,
        required: true,
        enum: ["Miss", "Mrs", "Mr"]
    },
    email:
    {
        type: String,
        required: true,
        unique: true

    },
    password: {
        type: String,
        required: true
    }


},
    {
        timestamps: true
    })

module.exports = mongoose.model('authorData', authorSchema);