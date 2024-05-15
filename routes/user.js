const express = require("express");
const users = require("../models/user")
const {createHmac} = require("crypto")

const router = express.Router();

router.get("/signin", (req,res) => {
    return res.render("signin")
})

router.get("/signup", (req,res) => {
    return res.render("signup")
})

router.post("/signup", async (req,res) => {
    const {fullName, email, password} = req.body;
    await users.create({
        fullName,
        email,
        password
    });
    return res.render("signin");
})

router.post("/signin", async (req,res) => {
    const {email, password} = req.body;
    try{
        const token = await users.matchPassword(email, password); // Verifying Password
        res.cookie("token",token);
    }
    catch(error){
        return res.render("signin", {Error: "Incorrect Email or Password"})
    }
    return res.redirect("/");
})

router.get("/logout", async (req, res) => {
    res.clearCookie("token").redirect("/user/signin");
})

module.exports = router;