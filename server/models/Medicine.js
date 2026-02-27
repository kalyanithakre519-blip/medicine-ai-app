const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    manufacturer: String,
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true,
        default: 0
    },
    expiryDate: {
        type: Date,
        required: true
    },
    batchNumber: String,
    barcode: {
        type: String,
        unique: true
    },
    supplier: {
        type: String, // Ideally ObjectId referencing a Supplier model
        required: true
    },
    reorderLevel: {
        type: Number,
        default: 10
    },
    imageUrl: String,
}, {
    timestamps: true
});

const Medicine = mongoose.model('Medicine', medicineSchema);
module.exports = Medicine;
