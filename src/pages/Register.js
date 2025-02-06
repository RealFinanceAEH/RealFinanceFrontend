import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { styles } from '../styles/styles';
import { registerUser } from '../services/api';
import { Eye, EyeOff } from "lucide-react";

/**
 * Registration component that allows users to create an account.
 * Handles form submission, validation, and API requests.
 */
const Register = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  /**
   * Handles input change and updates form state.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  /**
   * Handles form submission and sends registration request.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate password confirmation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      // Exclude confirmPassword from the request payload
      const { confirmPassword, ...dataToSend } = formData;
      const response = await registerUser(dataToSend);
      console.log('Registration successful:', response);
      navigate('/login');
    } catch (error) {
      if (error?.response?.status === 409) {
        setError("Email is already in use");
        return;
      }
      setError('Registration failed');
      console.error('Error:', error);
    }
  }

  return (
      <div style={styles.formContainer}>
        <h2 style={styles.formTitle}>Register</h2>
        {error && <p style={styles.formError}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
              type="text"
              name="firstname"
              placeholder="First Name"
              value={formData.firstname}
              onChange={handleChange}
              style={styles.formInput}
              required
          />
          <input
              type="text"
              name="lastname"
              placeholder="Last Name"
              value={formData.lastname}
              onChange={handleChange}
              style={styles.formInput}
              required
          />
          <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email.toLowerCase()}
              onChange={handleChange}
              style={styles.formInput}
              required
          />
          <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              style={styles.formInput}
              required
          />
          <div style={styles.inputWrapper}>
            <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                style={styles.formInput}
                minLength={8}
                required
            />
            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.toggleButton}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <div style={styles.inputWrapper}>
            <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                style={styles.formInput}
                required
            />
            <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.toggleButton}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <button type="submit" style={styles.formButton}>
            Register
          </button>
        </form>
        <div style={styles.centeredButtonContainer}>
          <Link to="/login" style={styles.centeredButton}>
            <button>
              Login
            </button>
          </Link>
        </div>
      </div>
  );
};

export default Register;
