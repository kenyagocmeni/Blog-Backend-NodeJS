const express = require('express');
const router = express.Router();
const { addComment, deleteComment, replyToComment } = require('../controllers/commentController');
const authenticate = require('../middleware/auth');

router.post('/:postId/comments', authenticate, addComment);
router.delete('/:commentId', authenticate, deleteComment);
router.post('/:commentId/replies', authenticate, replyToComment);


module.exports = router;