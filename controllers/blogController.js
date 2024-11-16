const BlogPost = require("../models/BlogPost");
const upload = require('../config/multerConfig');

//Blogpost oluşturma:
const createBlogPost = async(req,res)=>{

    const {title, content, tags} = req.body;

    const blogPost = new BlogPost({
        title,
        content,
        author: req.user._id,
        tags
    });

    try {
        
        const savedBlogPost = await blogPost.save();
        res.status(201).json({
            message:"Blogpost başarıyla eklendi",
            blogPost:{
                id:savedBlogPost._id,
                title:savedBlogPost.title,
                content:savedBlogPost.content,
                author:savedBlogPost.author,
                tags:savedBlogPost.tags,
                createdAt: savedBlogPost.createdAt,
                updatedAt: savedBlogPost.updatedAt
            }
        });

    } catch (error) {
        res.status(500).json({message:"Blogpost oluşturulamadı.", error:error.message});
    }

};

//blogpostu güncelle
const updateBlogPost = async(req,res)=>{
    const { title, content, tags } = req.body;
    const { postId } = req.params; // 'id' yerine 'postId' kullanılmalı

    try {
        const blogPost = await BlogPost.findOne({_id: postId, author:req.user._id});

        if (!blogPost) {
            return res.status(404).json({message:"Blogpost bulunamadı"});
        }

        blogPost.title = title || blogPost.title;
        blogPost.content = content || blogPost.content;
        blogPost.tags = tags || blogPost.tags;

        const updatedBlogPost = await blogPost.save();
        res.status(200).json({
            message: "Blogpost başarıyla güncellendi",
            blogPost: {
                id: updatedBlogPost._id,
                title: updatedBlogPost.title,
                content: updatedBlogPost.content,
                tags: updatedBlogPost.tags,
                updatedAt: updatedBlogPost.updatedAt,
            }
        });

    } catch (error) {
        res.status(500).json({message:"Blogpost güncellenemedi.", error: error.message});
    }
};

//blogpostu sil
const deleteBlogPost = async(req, res)=>{
    
    const {postId} = req.params;

    try {
        
        const blogPost = await BlogPost.findOne({_id: postId, author:req.user._id});

        if(!blogPost){
            return res.status(404).json({message:"Blogpost bulunamadı"});
        }
        if(blogPost.author.toString() !== req.user._id.toString()){
            return res.status(401).json({message:"Bu blogpostu silmeye yetkiniz bulunmamakta."});
        }

        await blogPost.deleteOne();
        res.status(200).json({message:"Blogpost başarıyla silindi."});
    } catch (error) {
        res.status(500).json({message:"Blogpost silinirken bir hata oluştu.",error:error.message});
    }
};

//blogpost sıralama ve bulma
const searchBlogPosts = async(req, res)=>{
    const {author, startDate, endDate, tags, sortBy} = req.query;

    try {
        
        const query = {};

        //Yazar filtrelemesi
        if(author){
            query.author = author;
        }
        //Tarih aralığı filtrelemesi:
        if(startDate || endDate){
            if(startDate) query.createdAt.$gte = new Date(startDate);
            if(endDate) query.createdAt.$lte = new Date(endDate);
        }

        //Etiket filtresi
        if(tags){
            query.tags = {$in: tags.split(",")};
        }

        //Sıralama (popülerlik ya da tarih)
        let sortCriteria = {};
        if(sortBy === "popularity"){
            sortCriteria = {likes: -1};
        }else if(sortBy === "date"){
            sortCriteria = {createdAt: -1};
        }

        const blogPosts = await BlogPost.find(query).sort(sortCriteria);
        res.status(200).json({blogPosts});

    } catch (error) {
        res.status(500).json({message:"Sunucu hatası",error:error.message});
    }
};

//Blogposta resim ekle
const uploadImageToBlog = async(req, res)=>{
    const {postId} = req.params;

    if(!req.file){
        return res.status(400).json({message:"Dosya yüklenmedi"});
    }

    try {
        
        const blogPost = await BlogPost.findById(postId);

        if(!blogPost){
            return res.status(404).json({message:"Blogpost bulunamadı"});
        }

        if(blogPost.author.toString() !== req.user._id.toString()){
            return res.status(401).json({message:"Bu dosyayı yüklemeye yetkiniz yok."});
        }

        blogPost.image = `/uploads/${req.file.filename}`;
        await blogPost.save();

        res.status(200).json({
            message:"Fotoğraf başarıyla eklendi",
            imagePath: blogPost.image
        });

    } catch (error) {
        res.status(500).json({message:"Fotoğraf yüklenemedi", error:error.message})
    }
};

//blogposttan resim sil
const deleteImageFromBlog = async(req,res)=>{

    const {postId} = req.params;

    try {
        
        const blogPost = await BlogPost.findById(postId);

        if(!blogPost){
            return res.status(404).json({message:"Blogpost bulunamadı"});
        }
        if(blogPost.author.toString() !== req.user._id.toString()){
            return res.status(401).json({message:"Bu fotoğrafı silmeye yetkiniz yok."});
        }

        if(!blogPost.image){
            return res.status(400).json({message:"Silinecek fotoğraf bulunmamakta."});
        }

        blogPost.image = undefined;
        await blogPost.save();

        res.status(200).json({message:"Resim başarıyla silindi."});
    } catch (error) {
        res.status(500).json({message:"Resim silinirken bir hata oluştu.",error:error.messaeg});
    }

}


module.exports = {createBlogPost, updateBlogPost, deleteBlogPost, searchBlogPosts, uploadImageToBlog, deleteImageFromBlog};