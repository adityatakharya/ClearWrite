const express = require("express");
const users = require("../models/blog")
const path = require("path");
const multer = require("multer");
const blogPosts = require("../models/blog");
const comments = require("../models/comment")

const router = express.Router();

router.get("/view/:currBlogID", async (req,res) => {
    const currBlog = await blogPosts.findById(req.params.currBlogID).populate("createdBy");
    if(!currBlog) res.status(404).render("error404");
    const currComments = await comments.find({blogID: req.params.currBlogID}).populate("createdBy");
    return res.render("fullBlog", {
        currUser: req.user,
        currBlog: currBlog,
        currComments: currComments,
    });
})

router.post("/search", async (req, res) => {
    const matchedBlogs = await blogPosts.find({$text: {$search: req.body.searcheddata}})
    return res.render("home", {
        currUser: req.user,
        allBlogs: matchedBlogs,
    })
})

router.post("/comments/:currBlogID", async (req,res) => {
    await comments.create({
        content: req.body.content,
        blogID: req.params.currBlogID,
        createdBy: req.user._id,
    });
    return res.redirect(`/blog/view/${req.params.currBlogID}`);
})

router.get("/create-new-post", (req, res) => {
    res.render("addBlog", {
        currUser: req.user,
    });
})

// Setting up storage of the input files in local storage... 
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(`./public/uploads/`))
    },
    filename: function (req, file, cb) {
      const fileName = `${Date.now()}-${file.originalname}`;
      cb(null, fileName)
    }
})
const upload = multer({ storage: storage})

router.post("/create-new-post", upload.single("coverImage"), async (req, res) => {
    const { title, description, body } = req.body;
    
    // To avoid req.file not found error
    let coverImageURL = "/images/defaultcover.png";
    if (req.file) {
        coverImageURL = `/uploads/${req.file.filename}`;
    }

    const newPost = await blogPosts.create({
        title,
        description,
        body,
        coverImageURL,
        createdBy: req.user._id,
    });
    res.redirect(`/blog/view/${newPost._id}`);
    
});

module.exports = router;