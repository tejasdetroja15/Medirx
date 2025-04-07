// Backend API endpoint (in Express)
const express = require('express');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const router = express.Router();
require('dotenv').config();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// API endpoint
router.post('/upload-prescription', upload.single('prescription'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No prescription image uploaded' });
    }

    const imagePath = req.file.path;
    
    // Create FormData for OCR API
    const formData = new FormData();
    const fileStream = fs.createReadStream(imagePath);
    formData.append('file', fileStream, req.file.filename);
    formData.append('apikey', process.env.OCR_API_KEY);
    formData.append('OCREngine', '2');
    formData.append('language', 'eng');
    formData.append('isOverlayRequired', 'false');
    formData.append('detectOrientation', 'true');
    formData.append('scale', 'true');
    
    // Send request to OCR.space API
    const response = await axios.post(
      'https://api.ocr.space/parse/image',
      formData,
      {
        headers: {
          ...formData.getHeaders()
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      }
    );
    
    if (response.data.ParsedResults && response.data.ParsedResults.length > 0) {
      const extractedText = response.data.ParsedResults[0].ParsedText.trim();
      
      if (extractedText) {
        // Process the extracted text to identify medicines
        // This is a simple example - you might need more sophisticated parsing
        const medicineLines = extractedText.split('\n').filter(line => line.trim().length > 0);
        
        // Mock data for pricing (in a real app, you'd query a database)
        const medicines = medicineLines.map(medicine => ({
          name: medicine.trim(),
          price: (Math.random() * 100 + 10).toFixed(2), // Random price between 10 and 110
          quantity: 1,
          available: Math.random() > 0.2 // 80% chance of being available
        }));
        
        // Clean up the uploaded file
        fs.unlinkSync(imagePath);
        
        return res.status(200).json({ 
          success: true, 
          medicines: medicines,
          rawText: extractedText
        });
      }
    }
    
    // Clean up the uploaded file
    fs.unlinkSync(imagePath);
    return res.status(404).json({ success: false, error: 'No text could be extracted from the image' });
    
  } catch (error) {
    console.error('Error processing prescription:', error);
    
    // Clean up the uploaded file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    return res.status(500).json({ 
      success: false, 
      error: 'Error processing prescription',
      details: error.message
    });
  }
});

module.exports = router;