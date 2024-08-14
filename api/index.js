const express = require('express');
const multer = require('multer');
const axios = require('axios');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const cors = require('cors');
require('dotenv').config();

const app = express();
const upload = multer();

const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = process.env;

// app.use(cors({
//     origin: 'http://localhost:8080',
//     credentials: true,
// }));

app.use(session({ secret: 'your_secret_key', resave: false, saveUninitialized: false}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "/api/callback"
},
    function (accessToken, refreshToken, profile, done) {
        profile.accessToken = accessToken;
        return done(null, profile);
    }
));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

app.get('/api/auth/github', passport.authenticate('github', { scope: ['repo'] }));

app.get('/api/callback',
    passport.authenticate('github', { failureRedirect: '/' }),
    function (req, res) {
        res.redirect('/upload');
    }
);

app.get('/api/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/');
    });
});

// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, '../public/index.html'));
// });

app.post('/api/upload', upload.single('image'), async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const repo = req.body.repo;
    if (!repo) {
        return res.status(400).json({ message: 'Repository not specified' });
    }

    const GITHUB_API_URL = `https://api.github.com/repos/${repo}/contents/`;

    try {
        const timestamp = Date.now();
        const originalName = req.file.originalname;
        const dotIndex = originalName.lastIndexOf('.');
        const baseName = originalName.substring(0, dotIndex);
        const extension = originalName.substring(dotIndex);

        const imageName = `${baseName}_${timestamp}${extension}`;
        const imageContent = req.file.buffer.toString('base64');

        const response = await axios.put(
            `${GITHUB_API_URL}${imageName}`,
            {
                message: `Add ${imageName}`,
                content: imageContent
            },
            {
                headers: {
                    Authorization: `Token ${req.user.accessToken}`,
                    Accept: 'application/vnd.github.v3+json'
                }
            }
        );

        res.status(200).json({
            message: `Image uploaded successfully!`,
            url: response.data.content.download_url
        });
    } catch (error) {
        console.error('Error during upload:', error.response ? error.response.data : error.message);
        res.status(500).json({ message: 'Image upload failed', error: error.message });
    }
});

module.exports = app;

// const PORT = 3000;
// app.listen(PORT, () => {
//     console.log(`Server is running at http://localhost:${PORT}`);
// });