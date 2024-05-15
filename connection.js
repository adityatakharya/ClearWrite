const mongoose = require ("mongoose");

function connectDatabase (url){
    mongoose.connect(url).then(() => {console.log("MongoDB Connected")}).catch(() => {console.log("ERR: Can't connect to database")});
}

module.exports = {connectDatabase};