const express = require('express');
const router = express.Router();
const { addPatient, getPatients, deletePatient } = require('../controllers/patientController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, addPatient)
    .get(protect, getPatients);

router.route('/:id')
    .delete(protect, deletePatient);

module.exports = router;
