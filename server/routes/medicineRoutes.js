const express = require('express');
const router = express.Router();
const {
    getMedicines,
    getMedicineById,
    createMedicine,
    updateMedicine,
    deleteMedicine
} = require('../controllers/medicineController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getMedicines)
    .post(protect, createMedicine); // Add 'admin' middleware if needed restriction

router.route('/:id')
    .get(protect, getMedicineById)
    .put(protect, updateMedicine) // Add 'admin' middleware if needed restriction
    .delete(protect, admin, deleteMedicine);

module.exports = router;
