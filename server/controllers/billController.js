const asyncHandler = require('express-async-handler');
const Bill = require('../models/Bill');
const Medicine = require('../models/Medicine');

// @desc    Create new bill
// @route   POST /api/bills
// @access  Private (Pharmacist/Admin)
const createBill = asyncHandler(async (req, res) => {
    const {
        customerName,
        customerPhone,
        items,
        totalAmount
    } = req.body;

    if (items && items.length === 0) {
        res.status(400);
        throw new Error('No items in bill');
    } else {
        // Create bill
        const bill = new Bill({
            customerName,
            customerPhone,
            items,
            totalAmount,
            pharmacist: req.user._id,
        });

        const createdBill = await bill.save();

        // Update stock
        for (const item of items) {
            const medicine = await Medicine.findById(item.medicine);
            if (medicine) {
                medicine.stock = medicine.stock - item.quantity;
                await medicine.save();
            }
        }

        res.status(201).json(createdBill);
    }
});

// @desc    Get all bills
// @route   GET /api/bills
// @access  Private
const getBills = asyncHandler(async (req, res) => {
    const bills = await Bill.find({}).sort({ createdAt: -1 });
    res.json(bills);
});

// @desc    Get bill by ID
// @route   GET /api/bills/:id
// @access  Private
const getBillById = asyncHandler(async (req, res) => {
    const bill = await Bill.findById(req.params.id).populate('pharmacist', 'name');

    if (bill) {
        res.json(bill);
    } else {
        res.status(404);
        throw new Error('Bill not found');
    }
});

module.exports = { createBill, getBills, getBillById };
