// server/controllers/prescriptionController.js

const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const { processPrescription } = require('../services/prescriptionReader');
const Medicine = require('../models/Medicine');
const Prescription = require('../models/Prescription');

// Configure storage for uploaded prescription images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/prescriptions');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueId = uuidv4();
    const extension = path.extname(file.originalname);
    cb(null, `${uniqueId}${extension}`);
  }
});

// File filter to ensure only images are uploaded
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, PNG, and PDF are allowed.'), false);
  }
};

const upload = multer({ 
  storage, 
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

exports.processPrescriptionImage = async (req, res) => {
  try {
    // Find all medicines in the database
    const medicineDatabase = await Medicine.find({});
    
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // Process the prescription image using ML service
    const result = await processPrescription(req.file.path, medicineDatabase);
    
    // Save the prescription data
    const prescription = new Prescription({
      userId: req.user ? req.user._id : null, // If user is authenticated
      imagePath: req.file.path,
      originalText: result.originalText,
      medicines: result.medicines.map(med => ({
        name: med.name,
        dosage: med.dosage,
        frequency: med.frequency,
        medicineId: med.id,
        confidence: med.matchConfidence || 0
      }))
    });
    
    await prescription.save();
    
    // Add price information to medicines
    const medicinesWithPrices = result.medicines.map(med => {
      if (med.id) {
        const dbMedicine = medicineDatabase.find(m => m._id.toString() === med.id);
        return {
          ...med,
          price: dbMedicine ? dbMedicine.price : 0,
          available: dbMedicine ? dbMedicine.inStock : false
        };
      }
      return med;
    });
    
    // Return processed data
    return res.status(200).json({
      prescriptionId: prescription._id,
      originalText: result.originalText,
      medicines: medicinesWithPrices
    });
  } catch (error) {
    console.error('Error processing prescription:', error);
    return res.status(500).json({ message: 'Failed to process prescription', error: error.message });
  }
};

// Middleware for handling file upload
exports.uploadPrescriptionImage = upload.single('prescriptionImage');

// Get processed prescription by ID
exports.getPrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);
    
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }
    
    return res.status(200).json(prescription);
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving prescription', error: error.message });
  }
};