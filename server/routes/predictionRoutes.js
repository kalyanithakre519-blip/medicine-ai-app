const express = require('express');
const router = express.Router();
const { getStockPredictions } = require('../controllers/predictionController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getStockPredictions);

module.exports = router;
