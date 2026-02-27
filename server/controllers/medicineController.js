const asyncHandler = require('express-async-handler');
const Medicine = require('../models/Medicine');

// @desc    Get all medicines
// @route   GET /api/medicines
// @access  Private
const getMedicines = asyncHandler(async (req, res) => {
    const medicines = await Medicine.find({});
    res.json(medicines);
});

// @desc    Get single medicine
// @route   GET /api/medicines/:id
// @access  Private
const getMedicineById = asyncHandler(async (req, res) => {
    const medicine = await Medicine.findById(req.params.id);

    if (medicine) {
        res.json(medicine);
    } else {
        res.status(404);
        throw new Error('Medicine not found');
    }
});

// @desc    Create a medicine
// @route   POST /api/medicines
// @access  Private/Admin/Pharmacist
const createMedicine = asyncHandler(async (req, res) => {
    const {
        name,
        description,
        manufacturer,
        category,
        price,
        stock,
        expiryDate,
        batchNumber,
        barcode,
        supplier,
        reorderLevel,
        imageUrl
    } = req.body;

    const medicine = new Medicine({
        name,
        description,
        manufacturer,
        category,
        price,
        stock,
        expiryDate,
        batchNumber,
        barcode,
        supplier,
        reorderLevel,
        imageUrl,
        user: req.user._id // Assuming we want to track who added it
    });

    const createdMedicine = await medicine.save();
    res.status(201).json(createdMedicine);
});

// @desc    Update a medicine
// @route   PUT /api/medicines/:id
// @access  Private/Admin/Pharmacist
const updateMedicine = asyncHandler(async (req, res) => {
    const {
        name,
        description,
        manufacturer,
        category,
        price,
        stock,
        expiryDate,
        batchNumber,
        barcode,
        supplier,
        reorderLevel,
        imageUrl
    } = req.body;

    const medicine = await Medicine.findById(req.params.id);

    if (medicine) {
        medicine.name = name || medicine.name;
        medicine.description = description || medicine.description;
        medicine.manufacturer = manufacturer || medicine.manufacturer;
        medicine.category = category || medicine.category;
        medicine.price = price || medicine.price;
        medicine.stock = stock || medicine.stock;
        medicine.expiryDate = expiryDate || medicine.expiryDate;
        medicine.batchNumber = batchNumber || medicine.batchNumber;
        medicine.barcode = barcode || medicine.barcode;
        medicine.supplier = supplier || medicine.supplier; // In a real app, verify supplier ID
        medicine.reorderLevel = reorderLevel || medicine.reorderLevel;
        medicine.imageUrl = imageUrl || medicine.imageUrl;

        const updatedMedicine = await medicine.save();
        res.json(updatedMedicine);
    } else {
        res.status(404);
        throw new Error('Medicine not found');
    }
});

// @desc    Delete a medicine
// @route   DELETE /api/medicines/:id
// @access  Private/Admin
const deleteMedicine = asyncHandler(async (req, res) => {
    const medicine = await Medicine.findById(req.params.id);

    if (medicine) {
        await medicine.deleteOne();
        res.json({ message: 'Medicine removed' });
    } else {
        res.status(404);
        throw new Error('Medicine not found');
    }
});

module.exports = {
    getMedicines,
    getMedicineById,
    createMedicine,
    updateMedicine,
    deleteMedicine
};
