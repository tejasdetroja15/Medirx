// server/services/prescriptionReader.js

const { createWorker } = require('tesseract.js');
const { preprocessImage } = require('./imagePreprocessor');
const { findSimilarMedicine } = require('./medicineMatcher');

// Initialize Tesseract worker with medical handwriting model
const initializeWorker = async () => {
  const worker = await createWorker();
  // Load a custom trained model for medical handwriting
  // Or use the default model with specific configurations
  await worker.loadLanguage('eng');
  await worker.initialize('eng');
  await worker.setParameters({
    tessedit_char_whitelist: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-+.,%',
    preserve_interword_spaces: '1',
  });
  return worker;
};

// Extract text from prescription image
const extractTextFromPrescription = async (imagePath) => {
  // Preprocess the image to enhance text visibility
  const processedImagePath = await preprocessImage(imagePath);
  
  const worker = await initializeWorker();
  const { data } = await worker.recognize(processedImagePath);
  await worker.terminate();
  
  return data.text;
};

// Parse extracted text to identify medicines and dosages
const parseMedicineInformation = (extractedText) => {
  // Split text into lines
  const lines = extractedText.split('\n').filter(line => line.trim());
  
  const medicines = [];
  
  // Basic pattern matching for common prescription formats
  for (const line of lines) {
    // Look for patterns like "Medicine Name 10mg" or "Medicine Name - 1 pill twice daily"
    const medicineMatch = line.match(/([A-Za-z\s]+)\s*(\d+(?:\.\d+)?)\s*(mg|ml|g|tabs?|pill|capsule)?/i);
    
    if (medicineMatch) {
      const medicineName = medicineMatch[1].trim();
      const dosage = medicineMatch[2];
      const unit = medicineMatch[3] || '';
      
      // Look for frequency patterns
      const frequencyMatch = line.match(/(\d+)\s*times?\s*(daily|a day|every\s*\d+\s*hours?)/i);
      const frequency = frequencyMatch ? frequencyMatch[0] : '';
      
      medicines.push({
        name: medicineName,
        dosage: `${dosage} ${unit}`,
        frequency,
        confidence: 0.7, // Placeholder for confidence score
        rawText: line
      });
    }
  }
  
  return medicines;
};

// Main function to process prescription
const processPrescription = async (imagePath, medicineDatabase) => {
  try {
    // Extract text from the image
    const extractedText = await extractTextFromPrescription(imagePath);
    
    // Parse the text to identify medicines
    let medicines = parseMedicineInformation(extractedText);
    
    // For each identified medicine, find the closest match in the database
    const verifiedMedicines = await Promise.all(medicines.map(async (med) => {
      const matchedMedicine = await findSimilarMedicine(med.name, medicineDatabase);
      
      if (matchedMedicine) {
        return {
          ...med,
          name: matchedMedicine.name, // Use the database name for consistency
          id: matchedMedicine.id,
          price: matchedMedicine.price,
          matchConfidence: matchedMedicine.similarity
        };
      }
      
      return {
        ...med,
        matchConfidence: 0,
        status: 'not_found'
      };
    }));
    
    return {
      originalText: extractedText,
      medicines: verifiedMedicines
    };
  } catch (error) {
    console.error('Error processing prescription:', error);
    throw new Error('Failed to process prescription');
  }
};

module.exports = {
  processPrescription,
  extractTextFromPrescription,
  parseMedicineInformation
};