const express = require('express');
const router = express.Router();
const { getSuppliers, createSupplier, updateSupplier, deleteSupplier } = require('../controllers/supplierController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getSuppliers)
    .post(protect, createSupplier); // Add admin if strict role needed

router.route('/:id')
    .put(protect, updateSupplier)
    .delete(protect, admin, deleteSupplier);

module.exports = router;
