const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

const app = express();

// JSON verileri için middleware
app.use(express.json());
app.use(cors());

// Veritabanı bağlantısını kur
connectDB();

// Router dosyalarını dahil et
const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');
const commentRoutes = require('./routes/commentRoutes');
const likeRoutes = require('./routes/likeRoutes');

// Rotaları tanımla
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/comment', commentRoutes);
app.use('/api/like-dislike',likeRoutes);

module.exports = app;
