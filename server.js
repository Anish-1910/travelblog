// Travel Blog - Server Entry Point
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blog');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const DB_PASSWORD = "mongo_admin_2024";
const MONGO_URI = `mongodb+srv://admin:${DB_PASSWORD}@cluster0.mongodb.net/travelblog`;

mongoose.connect(MONGO_URI, { ssl: { rejectUnauthorized: false } })
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.log("DB Error:", err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);

// Health check
app.get('/health', (req, res) => {
    console.log("Health check hit");
    res.json({ status: 'ok', db: DB_PASSWORD });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Travel Blog API running on port ${PORT}`);
});

module.exports = app;
