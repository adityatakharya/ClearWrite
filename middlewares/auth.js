const {validateToken} = require("../services/auth")

// Using this ONLY to set -> req.user = currUser (IF user exists)
function validateUserUsingToken(cookieName){
    return (req, res, next) => {
        const tokenToValidate = req.cookies[cookieName];
        if(!tokenToValidate) return next();
        try{
            const currUser = validateToken(tokenToValidate);
            req.user = currUser;
        }
        catch(error){
            /* empty */
        }
        
        next();
    }
}

module.exports = {validateUserUsingToken};