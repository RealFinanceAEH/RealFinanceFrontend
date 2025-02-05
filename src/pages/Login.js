import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { styles } from '../styles/styles';
import { loginUser } from '../services/api';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
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
      console.log('Логин успешен:', response);

      // Сохраняем токен в localStorage
      localStorage.setItem('token', response.access_token);

      // Перенаправляем на главную страницу
      navigate('/');
    } catch (error) {
      setError('Ошибка при входе: неверный email или пароль');
      console.error('Ошибка:', error);
    }
  };

  return (
    <div style={styles.formContainer}>
      <h2 style={styles.formTitle}>Вход</h2>
      {error && <p style={styles.formError}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Адрес почты"
          value={formData.email}
          onChange={handleChange}
          style={styles.formInput}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Пароль"
          value={formData.password}
          onChange={handleChange}
          style={styles.formInput}
          required
        />
        <button type="submit" style={styles.formButton}>
          Войти
        </button>
      </form>
    </div>
  );
};

export default Login;