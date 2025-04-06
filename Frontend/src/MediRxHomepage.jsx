import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./MediRxHomepage.css";

const MediRxHomepage = () => {
  const [symptoms, setSymptoms] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  // Sample medicine data
  const medicines = [
    { id: 1, name: "Paracetamol 500mg", price: 5.99 },
    { id: 2, name: "Ibuprofen 400mg", price: 6.49 },
    { id: 3, name: "Amoxicillin 250mg", price: 8.99 },
    { id: 4, name: "Cetirizine 10mg", price: 4.99 },
    { id: 5, name: "Omeprazole 20mg", price: 7.49 },
    { id: 6, name: "Aspirin 100mg", price: 3.99 },
  ];

  // Sample symptom-medicine mapping
  const symptomSuggestions = {
    headache: ["Paracetamol 500mg", "Ibuprofen 400mg"],
    fever: ["Paracetamol 500mg", "Ibuprofen 400mg"],
    pain: ["Paracetamol 500mg", "Ibuprofen 400mg", "Aspirin 100mg"],
    inflammation: ["Ibuprofen 400mg"],
    cough: ["Bromhexine 8mg"],
    cold: ["Cetirizine 10mg"],
    allergy: ["Cetirizine 10mg"],
    indigestion: ["Omeprazole 20mg"],
    infection: ["Amoxicillin 250mg"],
  };

  // Load cart from localStorage on component mount
  useEffect(() => {
    const storedCart = localStorage.getItem("medirxCart");
    if (storedCart) {
      const parsedCart = JSON.parse(storedCart);
      setCart(parsedCart);
      updateCartCount(parsedCart);
    }
  }, []);

  const updateCartCount = (cartItems) => {
    const count = cartItems.reduce((total, item) => total + item.quantity, 0);
    setCartCount(count);
  };

  const handleSymptomCheck = () => {
    const userSymptoms = symptoms
      .toLowerCase()
      .split(",")
      .map((s) => s.trim());
    const recommendedMedicines = [];

    userSymptoms.forEach((symptom) => {
      if (symptomSuggestions[symptom]) {
        recommendedMedicines.push(...symptomSuggestions[symptom]);
      }
    });

    // Remove duplicates
    const uniqueMedicines = [...new Set(recommendedMedicines)];
    setSuggestions(uniqueMedicines);
  };

  const addToCart = (medicine) => {
    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex((item) => item.id === medicine.id);
    let updatedCart;

    if (existingItemIndex !== -1) {
      // Item exists, increase quantity
      updatedCart = cart.map((item, index) =>
        index === existingItemIndex
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      // Item doesn't exist, add to cart with quantity 1
      updatedCart = [...cart, { ...medicine, quantity: 1 }];
    }

    // Update state and localStorage
    setCart(updatedCart);
    updateCartCount(updatedCart);
    localStorage.setItem("medirxCart", JSON.stringify(updatedCart));

    // Alert user
    alert(`Added ${medicine.name} to cart!`);
  };

  return (
    <div className="app-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="container">
          <div className="brand">MediRx</div>
          <div className="nav-links">
            <a href="#symptom-checker">Symptom Checker</a>
            <a href="#prescription">Prescription Checker</a>
            <a href="#about">About</a>
          </div>
          <div className="auth-buttons">
            <Link to="/cart" className="cart-icon">
              Cart{" "}
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </Link>
            <Link to="/login" className="login-btn">
              Login
            </Link>
            <Link to="/signup" className="signup-btn">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Medicine Display Section */}
      <section className="medicines-section">
        <div className="container">
          <h2 className="section-title">Available Medicines</h2>
          <div className="medicine-grid">
            {medicines.map((medicine) => (
              <div key={medicine.id} className="medicine-card">
                <h3>{medicine.name}</h3>
                <p className="price">${medicine.price.toFixed(2)}</p>
                <button
                  onClick={() => addToCart(medicine)}
                  className="add-cart-btn"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Symptom Checker Section */}
      <section id="symptom-checker" className="symptom-section">
        <div className="container">
          <h2 className="section-title">Symptom Checker</h2>
          <div className="symptom-checker">
            <div className="form-group">
              <label htmlFor="symptoms">
                Enter your symptoms (separate with commas):
              </label>
              <input
                type="text"
                id="symptoms"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="e.g., headache, fever"
              />
            </div>
            <button onClick={handleSymptomCheck} className="check-btn">
              Check Symptoms
            </button>

            {suggestions.length > 0 && (
              <div className="suggestions">
                <h3>Recommended Medicines:</h3>
                <ul>
                  {suggestions.map((med, index) => (
                    <li key={index}>
                      {med}
                      {medicines.some((m) => m.name === med) && (
                        <button
                          className="add-suggestion-btn"
                          onClick={() =>
                            addToCart(medicines.find((m) => m.name === med))
                          }
                        >
                          Add to Cart
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
                <p className="disclaimer">
                  Please consult with a healthcare professional before taking
                  any medication.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <h3>MediRx</h3>
              <p>Your trusted online pharmacy</p>
            </div>
            <div className="footer-links">
              <div className="link-group">
                <h4>Quick Links</h4>
                <ul>
                  <li>
                    <a href="#">Home</a>
                  </li>
                  <li>
                    <a href="#">Medicines</a>
                  </li>
                  <li>
                    <a href="#">Symptom Checker</a>
                  </li>
                  <li>
                    <Link to="/cart">Cart</Link>
                  </li>
                </ul>
              </div>
              <div className="link-group">
                <h4>Help</h4>
                <ul>
                  <li>
                    <a href="#">FAQs</a>
                  </li>
                  <li>
                    <a href="#">Contact Us</a>
                  </li>
                  <li>
                    <a href="#">Privacy Policy</a>
                  </li>
                </ul>
              </div>
              <div className="link-group">
                <h4>Connect</h4>
                <ul>
                  <li>
                    <a href="#">Twitter</a>
                  </li>
                  <li>
                    <a href="#">Facebook</a>
                  </li>
                  <li>
                    <a href="#">Instagram</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="copyright">
            <p>&copy; 2025 MediRx. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MediRxHomepage;
