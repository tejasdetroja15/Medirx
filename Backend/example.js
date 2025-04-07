const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
const path = require("path");

const API_KEY = "K83732620888957"; 

const imagePath = "D:/SEM-6/Ad_WT_LAB/Project/1.jpg"; 

async function extractHandwrittenText() {
    try {
        if (!fs.existsSync(imagePath)) {
            throw new Error(`❌ Image file not found at ${imagePath}. Check the file path.`);
        }

        console.log("📷 Reading image file...");
        
        const formData = new FormData();
        
        const fileStream = fs.createReadStream(imagePath);
        const fileName = path.basename(imagePath);
        formData.append('file', fileStream, fileName);
        
        formData.append('apikey', API_KEY);
        formData.append('OCREngine', '2');
        formData.append('language', 'eng');
        formData.append('isOverlayRequired', 'false');
        formData.append('detectOrientation', 'true');
        formData.append('scale', 'true');
        
        console.log("🔄 Sending request to OCR.space API...");
        
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

        console.log("✓ Received response from API");
        console.log("📊 Response Status:", response.status);
        
        // Log the full response for debugging
        console.log("📝 Full API Response:", JSON.stringify(response.data, null, 2));

        if (response.data.ParsedResults && response.data.ParsedResults.length > 0) {
            const extractedText = response.data.ParsedResults[0].ParsedText.trim();
            if (extractedText) {
                console.log("📝 Extracted Text:\n", extractedText);
                return extractedText;
            } else {
                console.log("⚠️ Empty text returned from the API.");
                return null;
            }
        } else {
            console.log("⚠️ No text found in the image or invalid API response format.");
            return null;
        }
    } catch (error) {
        console.error("❌ Error extracting text:", error.message);
        if (error.response) {
            console.error("Response status:", error.response.status);
            console.error("Response data:", JSON.stringify(error.response.data, null, 2));
        }
        return null;
    }
}

extractHandwrittenText();