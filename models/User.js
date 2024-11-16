const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username:{type:String, required:true, unique:true},
    email:{type:String, required:true, unique:true, index: true },
    password:{type:String, required: true},
    profilePicture:{type:String},
    createdAt:{type:Date, default: Date.now},
    updatedAt:{type:Date}
});

const User = mongoose.model('User',userSchema);

module.exports = User;