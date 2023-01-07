const mongoose = require("mongoose");
const objectId = mongoose.Schema.Types.ObjectId;

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        lowercase:true
    },
    body: {
        type: String,
        required: true,
       
    },
    authorId: {
        type: objectId,
        ref: "authorData",
        required:true
    },
    tags: [{
        type: String,
        lowercase:true
}],
    category: {
        type: String,
        required: true,
        lowercase:true
    },
    subcategory: mongoose.Schema.Types.Mixed,
    deletedAt:{
        type: Date,
    },

    isDeleted: {
        type: Boolean,
        default: false
    },
    publishedAt:{
    type: Date
    },
    isPublished: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model("Blog", blogSchema);