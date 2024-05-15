const {Schema, model} = require("mongoose");

const blogPostSchema = new Schema({
    title: {
        type: String,
        required: true,
    },

    coverImageURL: {
        type: String,
        required: false,
    },

    description: {
        type: String,
    },

    body: {
        type: String,
        required: true,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "users",
    }}, {timestamps: true}
);

blogPostSchema.index({ title: "text", description: "text", body: "text" });

const blogPosts = model("blogPosts", blogPostSchema);

module.exports = blogPosts;