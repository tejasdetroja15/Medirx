// server/services/medicineMatcher.js

const stringSimilarity = require('string-similarity');

// Calculate similarity between OCR text and medicine names
const findSimilarMedicine = async (medicineName, medicineDatabase) => {
  if (!medicineName || medicineName.length < 3) {
    return null;
  }
  
  // Normalize the medicine name (lowercase, remove extra spaces)
  const normalizedName = medicineName.toLowerCase().trim().replace(/\s+/g, ' ');
  
  // Get all medicine names from the database
  const databaseMedicineNames = medicineDatabase.map(medicine => ({
    id: medicine._id,
    name: medicine.name,
    price: medicine.price,
    normalizedName: medicine.name.toLowerCase().trim().replace(/\s+/g, ' ')
  }));
  
  // Find the best match
  const matches = databaseMedicineNames.map(medicine => {
    const similarity = stringSimilarity.compareTwoStrings(
      normalizedName, 
      medicine.normalizedName
    );
    
    return {
      ...medicine,
      similarity
    };
  });
  
  // Sort by similarity score (highest first)
  matches.sort((a, b) => b.similarity - a.similarity);
  
  // Return the best match if it exceeds a threshold
  if (matches.length > 0 && matches[0].similarity > 0.6) {
    return matches[0];
  }
  
  // If no good match, try partial matching techniques
  // This could include checking for medicine name parts or common abbreviations
  // For example, "Amox" might match "Amoxicillin"
  const partialMatches = databaseMedicineNames.filter(medicine => 
    medicine.normalizedName.includes(normalizedName) || 
    normalizedName.includes(medicine.normalizedName)
  );
  
  if (partialMatches.length > 0) {
    // Calculate a different similarity score for partial matches
    const bestPartialMatch = partialMatches.reduce((best, current) => {
      const score = Math.min(
        normalizedName.length / current.normalizedName.length,
        current.normalizedName.length / normalizedName.length
      );
      return score > best.score ? { ...current, score } : best;
    }, { score: 0 });
    
    if (bestPartialMatch.score > 0.5) {
      return {
        ...bestPartialMatch,
        similarity: bestPartialMatch.score * 0.8 // Adjust score
      };
    }
  }
  
  return null;
};

// Function to validate dosage information
const validateDosage = (medicine, dosage) => {
  // Check if the dosage falls within the expected range for this medicine
  if (medicine.minDosage && medicine.maxDosage) {
    const dosageValue = parseFloat(dosage);
    if (dosageValue < medicine.minDosage || dosageValue > medicine.maxDosage) {
      return {
        valid: false,
        warning: `Unusual dosage detected: ${dosage}. Normal range is ${medicine.minDosage}-${medicine.maxDosage}`
      };
    }
  }
  
  return { valid: true };
};

module.exports = {
  findSimilarMedicine,
  validateDosage
};