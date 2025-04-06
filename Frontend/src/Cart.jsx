import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Cart.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    // Load cart items from localStorage when component mounts
    const storedCart = localStorage.getItem("medirxCart");
    if (storedCart) {
      const parsedCart = JSON.parse(storedCart);
      setCartItems(parsedCart);
      calculateTotal(parsedCart);
    }
  }, []);

  const calculateTotal = (items) => {
    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setTotalAmount(total);
  };

  const removeItem = (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("medirxCart", JSON.stringify(updatedCart));
    calculateTotal(updatedCart);
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;

    const updatedCart = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );

    setCartItems(updatedCart);
    localStorage.setItem("medirxCart", JSON.stringify(updatedCart));
    calculateTotal(updatedCart);
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("medirxCart");
    setTotalAmount(0);
  };

  const proceedToCheckout = () => {
    alert("Proceeding to checkout... This feature is under development.");
    // Future implementation: navigate to checkout page
  };

  return (
    <div className="app-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="container">
          <div className="brand">
            <Link to="/" className="brand-link">
              MediRx
            </Link>
          </div>
          <div className="nav-links">
            <Link to="/#symptom-checker">Symptom Checker</Link>
            <Link to="/#prescription">Prescription Checker</Link>
            <Link to="/#about">About</Link>
          </div>
          <div className="auth-buttons">
            <Link to="/login" className="login-btn">
              Login
            </Link>
            <Link to="/signup" className="signup-btn">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Cart Section */}
      <section className="cart-section">
        <div className="container">
          <h2 className="section-title">Your Cart</h2>

          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <p>Your cart is empty</p>
              <Link to="/" className="continue-shopping">
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="cart-content">
              <div className="cart-items">
                <table className="cart-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Subtotal</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item) => (
                      <tr key={item.id} className="cart-item">
                        <td className="item-name">{item.name}</td>
                        <td className="item-price">${item.price.toFixed(2)}</td>
                        <td className="item-quantity">
                          <button
                            className="quantity-btn"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            className="quantity-btn"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                          >
                            +
                          </button>
                        </td>
                        <td className="item-subtotal">
                          ${(item.price * item.quantity).toFixed(2)}
                        </td>
                        <td className="item-remove">
                          <button
                            className="remove-btn"
                            onClick={() => removeItem(item.id)}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="cart-summary">
                <h3>Order Summary</h3>
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping:</span>
                  <span>$5.00</span>
                </div>
                <div className="summary-row total">
                  <span>Total:</span>
                  <span>${(totalAmount + 5).toFixed(2)}</span>
                </div>
                <button className="checkout-btn" onClick={proceedToCheckout}>
                  Proceed to Checkout
                </button>
                <button className="clear-cart-btn" onClick={clearCart}>
                  Clear Cart
                </button>
                <Link to="/" className="continue-shopping">
                  Continue Shopping
                </Link>
              </div>
            </div>
          )}
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
                    <Link to="/">Home</Link>
                  </li>
                  <li>
                    <Link to="/">Medicines</Link>
                  </li>
                  <li>
                    <Link to="/#symptom-checker">Symptom Checker</Link>
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

export default Cart;
