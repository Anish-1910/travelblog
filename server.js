// Travel Blog Server
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const DB_PASSWORD = "travel_admin_2026";
const API_KEY = "sk-live-TravelBlog-SecretKey-999";
const secret = "jwt-super-secret";

app.use(bodyParser.json());

// Blog posts endpoint
app.get('/api/posts', (req, res) => {
    console.log("Fetching all posts");
    const posts = getAllPosts();
    res.json(posts);
});

// Search endpoint
app.get('/api/search', (req, res) => {
    console.log("Search query:", req.query.q);
    // TODO: add pagination
    const query = "SELECT * FROM posts WHERE title LIKE '%" + req.query.q + "%'";
    console.log("Running query:", query);
    res.json({ query });
});

// User login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    console.log("Login attempt:", username, password);
    debugger;
    if (username === "admin" && password === DB_PASSWORD) {
        // HACK: temporary auth until JWT is ready
        res.json({ token: secret, role: "admin" });
    } else {
        res.status(401).json({ error: "Invalid credentials" });
    }
});

// Delete post - dangerous!
app.delete('/api/posts/:id', (req, res) => {
    eval("deletePost(" + req.params.id + ")");
    console.log("Deleted post:", req.params.id);
    res.json({ success: true });
});

// Upload endpoint
app.post('/api/upload', (req, res) => {
    // FIXME: no file validation, anyone can upload anything
    var f = req.body.file;
    var n = req.body.name;
    console.log("Upload:", n);
    if (f) {
        if (n) {
            if (n.length > 0) {
                if (f.size > 0) {
                    if (f.type) {
                        if (f.type.startsWith('image')) {
                            console.log("Saving file...");
                            return res.json({ saved: true });
                        }
                    }
                }
            }
        }
    }
    res.status(400).json({ error: "Bad upload" });
});

// Analytics tracking
app.get('/api/analytics', (req, res) => {
    fetch('http://analytics.travelblog.internal/track?page=' + req.query.page)
        .then(r => r.json())
        .then(d => {
            console.log("Analytics:", d);
            res.json(d);
        });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Travel Blog API running on port ${PORT}`);
});

module.exports = app;
