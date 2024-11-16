const { default: mongoose } = require('mongoose');
const BlogPost = require('../models/BlogPost');
const Comment = require('../models/Comment');
const Like = require("../models/Like");

const toggleLike = async(req, res) => {
    const { postId } = req.params;

    try {
        const blogPost = await BlogPost.findById(postId);
        if (!blogPost) {
            return res.status(404).json({ message: "Blog post bulunamadı." });
        }

        // likes dizisi tanımlı mı diye kontrol et
        blogPost.likes = blogPost.likes || [];

        const userIdIndex = blogPost.likes.indexOf(req.user._id);

        if (userIdIndex !== -1) {
            blogPost.likes.splice(userIdIndex, 1); // Kullanıcıyı beğeni listesinden çıkar
        } else {
            blogPost.likes.push(req.user._id); // Kullanıcıyı beğeni listesine ekle
        }

        await blogPost.save();
        res.status(200).json({
            message: userIdIndex !== -1 ? "Beğeni kaldırıldı." : "Beğeni eklendi.",
            likes: blogPost.likes.length, // Beğeni sayısı
            likedBy: blogPost.likes // Beğeni yapan kullanıcıların ID'leri
        });

    } catch (error) {
        res.status(500).json({ message: "Beğeni işlemi sırasında bir hata oluştu.", error: error.message });
    }
};

module.exports = {toggleLike};