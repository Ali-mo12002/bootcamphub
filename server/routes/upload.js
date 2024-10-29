const multer = require('multer');
const path = require('path');
const express = require('express');
const router = express.Router();
const PORT = process.env.PORT || 5000;

// Configure multer storage
const storage = multer.diskStorage({
    
    destination: './uploads/', // Ensure this directory exists in your project
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});


const upload = multer({ storage });

// Endpoint for image upload
// uploadRoutes.js
router.post('/', upload.single('image'), async (req, res) => { 
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded." });
    }
    console.log('hello')
    const imageUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
    res.json({ imageUrl });
});



module.exports = router;
