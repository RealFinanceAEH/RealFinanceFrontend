import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { styles } from '../styles/styles';
import { loginUser } from '../services/api';
import { Eye, EyeOff } from "lucide-react"; // Icons for showing/hiding password

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await loginUser(formData);
      console.log('Login successful:', response);

      // Save token in localStorage
      localStorage.setItem('token', response.access_token);

      // Redirect to the homepage
      navigate('/');
    } catch (error) {
      if (error?.response?.status === 401) {
        setError('Login failed: incorrect email or password');
        return;
      }
      setError('Unexpected error');
      console.error('Error:', error);
    }
  };

  const handleRegistrationNavigate = async (e) => {
    e.preventDefault();
  }

  return (
      <div style={styles.formContainer}>
        <h2 style={styles.formTitle}>Login</h2>
        {error && <p style={styles.formError}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email.toLowerCase()}
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
          <button type="submit" style={styles.formButton}>
            Login
          </button>
        </form>
        <div style={styles.centeredButtonContainer}>
          <Link to="/register" style={styles.centeredButton}>
            <button>
              Register
            </button>
          </Link>
        </div>
      </div>
  );
};

export default Login;