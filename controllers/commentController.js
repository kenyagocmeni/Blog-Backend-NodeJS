const { default: mongoose } = require('mongoose');
const BlogPost = require('../models/BlogPost');
const Comment = require('../models/Comment');
const Like = require("../models/Like");

//blogposta yorum yapma:
const addComment = async(req, res)=>{
    const {postId} = req.params;
    const {content} = req.body;

    if(!content){
        return res.status(400).json({message:"İçerik kısmı boş olamaz."});
    }

    try {
        
        const blogPost = await BlogPost.findById(postId);

        if(!blogPost){
            return res.status(404).json({message:"Blogpost bulunamadı."});
        }

        const comment = new Comment({
            content,
            author: req.user._id,
            post: postId
        });

        const savedComment = await comment.save();

        blogPost.comments.push(savedComment._id);
        await blogPost.save();

        res.status(201).json({
            message:"Yorum başarıyla eklendi",
            comment:{
                id:savedComment._id,
                content: savedComment.content,
                author: savedComment.author,
                createdAt: savedComment.createdAt
            }
        });

    } catch (error) {
        res.status(500).json({message:"Yorum eklenirken bir hata oluştu", error:error.message});
    }

};

const deleteComment = async(req, res) => {
    const { commentId } = req.params;

    try {
        const comment = await Comment.findOne({_id:commentId, author: req.user._id});

        if (!comment) {
            return res.status(404).json({ message: "Yorum bulunamadı." });
        }

        if (comment.author.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Bu yorumu silmek için yetkiniz bulunmamakta." });
        }

        const blogPost = await BlogPost.findById(comment.post);
        if (!blogPost) {
            return res.status(404).json({ message: "İlgili blog post bulunamadı." });
        }

        // Yorumu blog post'un yorumlar listesinden çıkar
        blogPost.comments.pull(commentId);
        await blogPost.save();

        // Yorumu sil
        await Comment.deleteOne({ _id: commentId });

        res.status(200).json({ message: "Yorum başarıyla silindi." });
    } catch (error) {
        return res.status(500).json({ message: "Yorum silinirken bir hata oluştu.", error: error.message });
    }
};

const replyToComment = async(req, res)=>{
    const {commentId} = req.params;
    const {content} = req.body;

    if(!content){
        return res.status(400).json({message:"İçerik kısmı boş olamaz."});
    }

    try {
        
        const parentComment = await Comment.findById(commentId);

        if(!parentComment){
            return res.status(404).json({message:"Yorum bulunamadı"});
        }

        const replyComment = new Comment({
            content,
            author: req.user._id,
            post: parentComment.post,
            parent: commentId,
        });

        const savedReply = await replyComment.save();

        parentComment.replies.push(savedReply._id);
        await parentComment.save();

        res.status(201).json({
            message:"Yanıtınız başarıyla eklendi",
            reply:{
                id:savedReply._id,
                content:savedReply.content,
                author:savedReply.author,
                createdAt: savedReply.createdAt
            }
        });
    } catch (error) {
        res.status(500).json({message:"Yanıt eklenirken bir hata oluştu.",error:error.message});
    }
};

module.exports = {addComment, deleteComment, replyToComment};