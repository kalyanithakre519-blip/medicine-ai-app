const asyncHandler = require('express-async-handler');
const Patient = require('../models/Patient');

// @desc    Add new chronic patient
// @route   POST /api/patients
// @access  Private
const addPatient = asyncHandler(async (req, res) => {
    const { name, phone, condition, medicine, lastBought, daysSupply } = req.body;

    const patient = await Patient.create({
        name,
        phone,
        condition,
        medicine,
        lastBought,
        daysSupply,
        user: req.user._id
    });

    if (patient) {
        res.status(201).json(patient);
    } else {
        res.status(400);
        throw new Error('Invalid patient data');
    }
});

// @desc    Get all chronic patients
// @route   GET /api/patients
// @access  Private
const getPatients = asyncHandler(async (req, res) => {
    const patients = await Patient.find({ user: req.user._id });
    res.json(patients);
});

// @desc    Delete patient
// @route   DELETE /api/patients/:id
// @access  Private
const deletePatient = asyncHandler(async (req, res) => {
    const patient = await Patient.findById(req.params.id);

    if (patient) {
        if (patient.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('User not authorized');
        }
        await patient.deleteOne();
        res.json({ message: 'Patient removed' });
    } else {
        res.status(404);
        throw new Error('Patient not found');
    }
});

module.exports = { addPatient, getPatients, deletePatient };
