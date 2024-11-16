const express = require('express');
const router = express.Router();
const { registerUser, loginUser, updateUserProfile, uploadProfilePicture, deleteProfilePicture } = require('../controllers/authController');
const authenticate = require('../middleware/auth');
const upload = require('../config/multerConfig');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/profile', authenticate, updateUserProfile);
router.post('/profile/picture', authenticate, upload.single('profilePicture'), uploadProfilePicture);
router.delete('/profile/picture', authenticate, deleteProfilePicture);

module.exports = router;