const JWT = require("jsonwebtoken");
const secretKey = "4f7a2a1d4dd19f832479906d7cf6a249";

function createToken(user){
    const payload = {
        fullName: user.fullName,
        _id: user._id,
        email: user.email,
        profileImageURL: user.profileImageURL,
        role: user.role,
    }

    const token = JWT.sign(payload, secretKey);
    return token;
}

function validateToken(token){
    const payload = JWT.verify(token, secretKey);
    return payload;
}

module.exports = {createToken, validateToken};