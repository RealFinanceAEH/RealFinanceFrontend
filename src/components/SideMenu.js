import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { styles } from '../styles/styles';
import { getProfile } from '../services/api';

const SideMenu = ({ onCloseMenu }) => {
  const [user, setUser] = useState({
    photo: '',
    firstName: '',
    lastName: '',
    email: '',
  });
  const navigate = useNavigate();

  // Получение данных профиля
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getProfile();
        setUser({
          photo: profileData.photo || 'https://surl.li/uwuvai',
          firstName: profileData.firstname,
          lastName: profileData.lastname,
          email: profileData.email,
        });
      } catch (error) {
        console.error('Ошибка при загрузке профиля:', error);
      }
    };

    fetchProfile();
  }, []);

  // Выход из аккаунта
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div style={{ padding: '20px', height: '20%', display: 'flex', flexDirection: 'column' }}>
      {/* Верхняя часть с фото и данными пользователя */}
      <div style={styles.userInfo}>
        <img src={user.photo} alt="Фото профиля" style={styles.userPhoto} />
        <div>
          <h3 style={styles.userName}>{user.firstName} {user.lastName}</h3>
          <p style={styles.userEmail}>{user.email}</p>
        </div>
      </div>

      {/* Список ссылок */}
      <ul style={styles.menuList}>
        <li style={styles.menuItem}>
          <Link to="/" style={styles.menuLink} onClick={onCloseMenu}>
            Главная
          </Link>
        </li>
        <li style={styles.menuItem}>
          <Link to="/profile" style={styles.menuLink} onClick={onCloseMenu}>
            Профиль
          </Link>
        </li>
        <li style={styles.menuItem}>
          <Link to="/settings" style={styles.menuLink} onClick={onCloseMenu}>
            Настройки
          </Link>
        </li>
        <li style={styles.menuItem}>
          <Link to="/support" style={styles.menuLink} onClick={onCloseMenu}>
            Поддержка
          </Link>
        </li>
      </ul>

      {/* Кнопка выхода */}
      <button
        onClick={handleLogout}
        style={{
          ...styles.logoutButton,
          marginTop: 'auto', // Поднимаем кнопку вверх
          backgroundColor: '#f44336', // Красный цвет для кнопки выхода
          color: 'white',
          padding: '10px',
          borderRadius: '5px',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Выйти
      </button>
    </div>
  );
};

export default SideMenu;