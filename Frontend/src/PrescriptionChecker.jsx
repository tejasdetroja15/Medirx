import { useState } from "react";

const PrescriptionChecker = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [extractedText, setExtractedText] = useState("");
  const [error, setError] = useState("");
  const [matchedMedicines, setMatchedMedicines] = useState([]);

  // Sample medicine data (same as in MediRxHomepage)
  const medicines = [
    { id: 1, name: "Paracetamol 500mg", price: 5.99 },
    { id: 2, name: "Ibuprofen 400mg", price: 6.49 },
    { id: 3, name: "Amoxicillin 250mg", price: 8.99 },
    { id: 4, name: "Cetirizine 10mg", price: 4.99 },
    { id: 5, name: "Omeprazole 20mg", price: 7.49 },
    { id: 6, name: "Aspirin 100mg", price: 3.99 },
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError("");
      setExtractedText("");
      setMatchedMedicines([]);
    }
  };

  const uploadPrescription = async () => {
    if (!selectedFile) {
      setError("Please select an image of your prescription first.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Create FormData for the API request
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("apikey", "K83732620888957"); // Note: In production, use environment variables
      formData.append("OCREngine", "2");
      formData.append("language", "eng");
      formData.append("isOverlayRequired", "false");
      formData.append("detectOrientation", "true");
      formData.append("scale", "true");

      // Using fetch instead of axios
      const response = await fetch("https://api.ocr.space/parse/image", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.ParsedResults && data.ParsedResults.length > 0) {
        const text = data.ParsedResults[0].ParsedText.trim();
        setExtractedText(text);

        // Find matches with available medicines
        const foundMedicines = medicines.filter((medicine) =>
          text.toLowerCase().includes(medicine.name.toLowerCase())
        );
        setMatchedMedicines(foundMedicines);
      } else {
        setError(
          "No text could be extracted from the image. Please try with a clearer image."
        );
      }
    } catch (err) {
      console.error("Error processing prescription:", err);
      setError(
        "There was an error processing your prescription. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = (medicine) => {
    // Get existing cart
    const storedCart = localStorage.getItem("medirxCart");
    let cart = storedCart ? JSON.parse(storedCart) : [];

    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex((item) => item.id === medicine.id);

    if (existingItemIndex !== -1) {
      // Item exists, increase quantity
      cart = cart.map((item, index) =>
        index === existingItemIndex
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      // Item doesn't exist, add to cart with quantity 1
      cart = [...cart, { ...medicine, quantity: 1 }];
    }

    // Update localStorage
    localStorage.setItem("medirxCart", JSON.stringify(cart));

    // Alert user
    alert(`Added ${medicine.name} to cart!`);

    // Force reload to update cart count
    window.location.reload();
  };

  return (
    <section id="prescription" className="symptom-section">
      <div className="container">
        <h2 className="section-title">Prescription Checker</h2>
        <div className="symptom-checker">
          <div className="form-group">
            <label htmlFor="prescription-image">
              Upload your prescription:
            </label>
            <input
              type="file"
              id="prescription-image"
              accept="image/*"
              onChange={handleFileChange}
              className="file-input"
            />
          </div>

          {previewUrl && (
            <div className="preview-container">
              <h3>Preview:</h3>
              <img
                src={previewUrl}
                alt="Prescription preview"
                className="prescription-preview"
                style={{
                  maxWidth: "100%",
                  maxHeight: "300px",
                  marginBottom: "1rem",
                }}
              />
            </div>
          )}

          <button
            onClick={uploadPrescription}
            className="check-btn"
            disabled={isLoading || !selectedFile}
          >
            {isLoading ? "Processing..." : "Process Prescription"}
          </button>

          {error && <div className="error-message">{error}</div>}

          {extractedText && (
            <div className="suggestions">
              <h3>Extracted Text:</h3>
              <p className="extracted-text">{extractedText}</p>

              {matchedMedicines.length > 0 ? (
                <>
                  <h3>Matched Medicines:</h3>
                  <ul>
                    {matchedMedicines.map((medicine) => (
                      <li key={medicine.id}>
                        {medicine.name} - ${medicine.price.toFixed(2)}
                        <button
                          className="add-suggestion-btn"
                          onClick={() => addToCart(medicine)}
                        >
                          Add to Cart
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p>
                  No medicines found in your prescription that match our
                  inventory.
                </p>
              )}

              <p className="disclaimer">
                This is an automated system. Please consult with a pharmacist or
                healthcare professional to verify your prescription before
                purchase.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PrescriptionChecker;
