const mongoose = require('mongoose');

const patientSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    condition: {
        type: String,
        required: true
    },
    medicine: {
        type: String,
        required: true
    },
    lastBought: {
        type: Date,
        required: true,
        default: Date.now
    },
    daysSupply: {
        type: Number,
        required: true,
        default: 30
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
});

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;
