import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { authService } from "../services/api.service";
import "./AuthForms.css";

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setError("Reset token is missing. Please request a new password reset.");
    }
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!formData.password || !formData.confirmPassword) {
        throw new Error("Please fill in all required fields");
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      if (formData.password.length < 8) {
        throw new Error("Password must be at least 8 characters long");
      }

      await authService.resetPassword(token, formData.password);
      setSuccess(true);
      setLoading(false);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setLoading(false);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("Failed to reset password. Please try again.");
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <div className="auth-header">
          <h2>Reset Password</h2>
          <p>Enter your new password</p>
        </div>

        {error && <div className="auth-error">{error}</div>}
        {success && (
          <div className="auth-success">
            Password reset successful! Redirecting to login...
          </div>
        )}

        {!success && token && (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="password">New Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter new password"
                required
                minLength="8"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm new password"
                required
              />
            </div>

            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
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

export default ResetPassword;
