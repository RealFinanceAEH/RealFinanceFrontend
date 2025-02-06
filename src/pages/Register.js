import React, { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { styles } from '../styles/styles';
import { registerUser } from '../services/api';
import {Eye, EyeOff} from "lucide-react";

const Register = () => {
  const [formData, setFormData] = useState({
    firstname: '', // Исправлено на firstname
    lastname: '',  // Исправлено на lastname
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Валидация пароля
    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    try {
      // Убираем confirmPassword, так как бэкенд его не ожидает
      const {confirmPassword, ...dataToSend} = formData;
      const response = await registerUser(dataToSend);
      console.log('Регистрация успешна:', response);
      navigate('/login');
    } catch (error) {
        if (error?.response?.status === 409) {
          setError("Имейл занят");
          return
        }
      setError('Ошибка при регистрации');
      console.error('Ошибка:', error);
    }
  }

  return (
    <div style={styles.formContainer}>
      <h2 style={styles.formTitle}>Регистрация</h2>
      {error && <p style={styles.formError}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="firstname" // Исправлено на firstname
          placeholder="Имя"
          value={formData.firstname}
          onChange={handleChange}
          style={styles.formInput}
          required
        />
        <input
          type="text"
          name="lastname" // Исправлено на lastname
          placeholder="Фамилия"
          value={formData.lastname}
          onChange={handleChange}
          style={styles.formInput}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Адрес почты"
          value={formData.email.toLowerCase()}
          onChange={handleChange}
          style={styles.formInput}
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Номер телефона"
          value={formData.phone}
          onChange={handleChange}
          style={styles.formInput}
          required
        />
        <div style={styles.inputWrapper}>
          <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Пароль"
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
            placeholder="Повторите пароль"
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
            Зарегистрироваться
          </button>
      </form>
      <div style={styles.centeredButtonContainer}>
        <Link to="/login" style={styles.centeredButton}>
          <button>
            Логин
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Register;