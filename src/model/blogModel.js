const mongoose = require("mongoose");
const objectId = mongoose.Schema.Types.ObjectId;

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        require: true
    },
    authorId: {
        type: objectId,
        ref: "authorData"
    },
    tags: [String],
    category: {
        type: String,
        required: true
    },
    subcategory: mongoose.Schema.Types.Mixed,
    deletedAt: Date,
    isDeleted: {
        type: Boolean,
        default: false
    },
    publishedAt: Date,
    isPublished: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model("Blog", blogSchema);