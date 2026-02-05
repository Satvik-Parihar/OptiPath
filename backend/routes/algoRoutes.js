const express = require('express');
const router = express.Router();
const multer = require('multer');
const { solveDijkstra, solveFloydWarshall, analyzeGraphImage } = require('../controllers/algoController');

// Multer setup for image uploads
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

router.post('/dijkstra', solveDijkstra);
router.post('/floyd-warshall', solveFloydWarshall);
router.post('/analyze-image', upload.single('image'), analyzeGraphImage);

module.exports = router;
