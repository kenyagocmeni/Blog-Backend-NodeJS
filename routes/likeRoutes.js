const express = require('express');
const router = express.Router();
const { toggleLike } = require('../controllers/likeController');
const authenticate = require('../middleware/auth');

router.post('/:postId', authenticate, toggleLike);


module.exports = router;