const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: true
    },
    customerPhone: String,
    items: [{
        medicine: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Medicine',
            required: true
        },
        name: String, // Store snapshot of name
        quantity: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        amount: {
            type: Number,
            required: true
        }
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    pharmacist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const Bill = mongoose.model('Bill', billSchema);
module.exports = Bill;
