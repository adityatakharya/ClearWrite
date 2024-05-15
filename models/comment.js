const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    blogID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "blogPosts",
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    }
}, {timestamps: true}
);

const comments = new mongoose.model("comments", commentSchema);

module.exports = comments;