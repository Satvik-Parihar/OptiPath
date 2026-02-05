const express = require('express');
const router = express.Router();
const { solveDijkstra, solveFloydWarshall } = require('../controllers/algoController');

router.post('/dijkstra', solveDijkstra);
router.post('/floyd-warshall', solveFloydWarshall);

module.exports = router;
