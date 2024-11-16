const express = require('express');
const router = express.Router();
const { createBlogPost, updateBlogPost, deleteBlogPost, searchBlogPosts, uploadImageToBlog, deleteImageFromBlog } = require('../controllers/blogController');
const authenticate = require('../middleware/auth');
const upload = require('../config/multerConfig');

router.post('/', authenticate, createBlogPost);
router.put('/:postId', authenticate, updateBlogPost);
router.delete('/:postId', authenticate, deleteBlogPost);
router.get('/search', authenticate, searchBlogPosts);
router.post('/:postId/image', authenticate, upload.single('blogImage'), uploadImageToBlog);
router.delete('/:postId/image', authenticate, deleteImageFromBlog);

module.exports = router;