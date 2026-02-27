const asyncHandler = require('express-async-handler');
const Supplier = require('../models/Supplier');

// @desc    Get all suppliers
// @route   GET /api/suppliers
// @access  Private
const getSuppliers = asyncHandler(async (req, res) => {
    const suppliers = await Supplier.find({});
    res.json(suppliers);
});

// @desc    Create a supplier
// @route   POST /api/suppliers
// @access  Private/Admin
const createSupplier = asyncHandler(async (req, res) => {
    const { name, contactPerson, email, phone, address } = req.body;

    const supplierExists = await Supplier.findOne({ email });
    if (supplierExists) {
        res.status(400);
        throw new Error('Supplier already exists');
    }

    const supplier = new Supplier({
        name,
        contactPerson,
        email,
        phone,
        address
    });

    const createdSupplier = await supplier.save();
    res.status(201).json(createdSupplier);
});

// @desc    Update supplier
// @route   PUT /api/suppliers/:id
// @access  Private/Admin
const updateSupplier = asyncHandler(async (req, res) => {
    const { name, contactPerson, email, phone, address, status } = req.body;
    const supplier = await Supplier.findById(req.params.id);

    if (supplier) {
        supplier.name = name || supplier.name;
        supplier.contactPerson = contactPerson || supplier.contactPerson;
        supplier.email = email || supplier.email;
        supplier.phone = phone || supplier.phone;
        supplier.address = address || supplier.address;
        supplier.status = status || supplier.status;

        const updatedSupplier = await supplier.save();
        res.json(updatedSupplier);
    } else {
        res.status(404);
        throw new Error('Supplier not found');
    }
});

// @desc    Delete supplier
// @route   DELETE /api/suppliers/:id
// @access  Private/Admin
const deleteSupplier = asyncHandler(async (req, res) => {
    const supplier = await Supplier.findById(req.params.id);

    if (supplier) {
        await supplier.deleteOne();
        res.json({ message: 'Supplier removed' });
    } else {
        res.status(404);
        throw new Error('Supplier not found');
    }
});

module.exports = { getSuppliers, createSupplier, updateSupplier, deleteSupplier };
