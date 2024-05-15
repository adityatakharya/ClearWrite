require("dotenv").config();

const express = require("express");
const path = require("path")
const userRoute = require("./routes/user.js")
const blogRoute = require("./routes/blog.js")
const blogPosts = require("./models/blog.js")
const {connectDatabase} = require("./connection.js");
const cookieParser = require("cookie-parser");
const { validateUserUsingToken } = require("./middlewares/auth.js");

// Connecting Database...
connectDatabase(process.env.MONGO_URL);

const app = express();
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
// Using this ONLY to set -> req.user = currUser (IF user exists)...
app.use(validateUserUsingToken("token"));
// To use public folder as static (instead of route path)...
app.use(express.static(path.resolve("./public")));


const PORT = process.env.PORT || 8000;
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use("/user", userRoute)
app.use("/blog", blogRoute)
app.get("/", async (req,res) => {
    const allBlogs = await blogPosts.find({});
    return res.render("home", {currUser: req.user, allBlogs: allBlogs,});
})

app.listen(PORT, () => {console.log(`Server Started at ${PORT}`)});