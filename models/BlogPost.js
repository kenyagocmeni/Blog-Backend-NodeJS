const mongoose = require("mongoose");

const blogPostSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
        index: true
    },
    tags:[String],
    likes: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        default: [] 
    }],
    image:{
        type:String,
        default:null
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
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

const BlogPost = mongoose.model("BlogPost", blogPostSchema);

module.exports = BlogPost;