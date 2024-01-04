const mongoose = require('mongoose')
//const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = mongoose.Schema({
    username : {type:String, required:true},
    firstname: {type:String, required:true},
    lastname: {type:String, required:true},
    email: { type:String, required:true},
    //articles: Array, on a enlever a cause de son poids  on ne pas le poid de l'article 
    password: String,
    createdAt: {type: Date, default: Date.now()}
})

//userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model ('User', userSchema);