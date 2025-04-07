import { useState } from "react";
import { Link } from "react-router-dom";
import { authService } from "../services/api.service";
import "./AuthForms.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!email) {
        throw new Error("Please enter your email");
      }

      await authService.forgotPassword(email);
      setSuccess(true);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("Failed to send password reset email. Please try again.");
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <div className="auth-header">
          <h2>Forgot Password</h2>
          <p>Enter your email to receive a password reset link</p>
        </div>

        {error && <div className="auth-error">{error}</div>}
        {success && (
          <div className="auth-success">
            Password reset instructions have been sent to your email.
          </div>
        )}

        {!success ? (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        ) : (
          <div className="auth-next-steps">
            <p>Please check your email for the reset link.</p>
            <p>
              If you don&apos;t receive an email within a few minutes, check your
              spam folder or try again.
            </p>
          </div>
        )}

        <div className="auth-footer">
          <p>
            Remember your password?{" "}
            <Link to="/login" className="auth-link">
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
