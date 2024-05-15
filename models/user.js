const mongoose = require("mongoose");
const {createHmac, randomBytes} = require("crypto")
const {createToken, validateToken} = require("../services/auth.js")

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    salt: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    profileImageURL: {
        type: String,
        default: "/images/defaultdp.png", //Learning: public folder doesn't need to specified
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER"
    }
},{timestamps: true}
)

// For Hashing Password...
userSchema.pre("save", function (next) {
    const user = this;

    if(!user.isModified("password")) return;

    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac("sha256", salt)
        .update(user.password)
        .digest("hex");

    this.salt = salt;
    this.password = hashedPassword;

    next();
});

// For Matching & Verifying Entered Passwrod with Stored Hashed Password...
userSchema.static("matchPassword", async function (email, password) {
    const userToCheck = await this.findOne({email});
    if(!userToCheck) throw new Error("User doesn't exist!")
    const salt = userToCheck.salt;
    const storedHashPassword = userToCheck.password;
    const enteredPassword = password;
    const enteredPasswordHash = createHmac("sha256", salt).update(enteredPassword).digest("hex");
    if(enteredPasswordHash !== storedHashPassword) throw new Error("Incorrect Password");
    const token = createToken(userToCheck); // Creating JWT Token
    return token;
})

const users = mongoose.model("users", userSchema);

module.exports = users;

