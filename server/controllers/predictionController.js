const asyncHandler = require('express-async-handler');
const Medicine = require('../models/Medicine');

// @desc    Get stock predictions
// @route   GET /api/predictions
// @access  Private (Admin/Pharmacist)
const getStockPredictions = asyncHandler(async (req, res) => {
    // In a real functionality AI app, this would call a Python service or use a ML model
    // Here we simulate a prediction based on random consumption rates and current stock

    const medicines = await Medicine.find({});

    const predictions = medicines.map(med => {
        // Simulate average daily consumption (random for now between 1 and 10)
        const simulatedDailyConsumption = Math.floor(Math.random() * 10) + 1;

        // Simple Linear Regression Logic (Placeholder for AI)
        const daysUntilStockout = Math.floor(med.stock / simulatedDailyConsumption);

        // AI Recommendation
        let recommendation = 'Safe';
        let confidence = 'High';

        if (daysUntilStockout < 7) {
            recommendation = 'Urgent Reorder';
            confidence = 'Very High';
        } else if (daysUntilStockout < 30) {
            recommendation = 'Reorder Soon';
            confidence = 'High';
        } else {
            confidence = 'Medium'; // Long term predictions are less confident
        }

        return {
            medicineName: med.name,
            currentStock: med.stock,
            predictedConsumptionRate: simulatedDailyConsumption,
            daysUntilStockout,
            recommendation,
            confidence
        };
    });

    res.json(predictions);
});

module.exports = { getStockPredictions };
