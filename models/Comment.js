const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    content:{
        type:String,
        required:true
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    post:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"BlogPost",
        required:true,
        index: true
    },
    replies: [{ 
        type: mongoose.Schema.Types.ObjectId, ref: 'Comment' 
    }],
    createdAt:{
        type:Date,
        default:Date.now
    },
    updatedAt:{
        type:Date,
        default:Date.now
    }
});

const Comment =mongoose.model("Comment", commentSchema);

module.exports = Comment;