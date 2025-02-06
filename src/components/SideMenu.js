import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { styles } from '../styles/styles';
import { getProfile } from '../services/api';
import { getProfilePhoto } from '../services/db'; // Import functions for working with IndexedDB

const SideMenu = ({ onCloseMenu }) => {
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });
  const [profilePhoto, setProfilePhoto] = useState('https://surl.li/uwuvai');
  const navigate = useNavigate();

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getProfile();
        setUser({
          firstName: profileData.firstname,
          lastName: profileData.lastname,
          email: profileData.email,
        });

      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };

    const fetchStoredPhoto = async () => {
      let storedPhoto = await getProfilePhoto(user.email);
      if (storedPhoto) {
        setProfilePhoto(storedPhoto);
      }
    };

    fetchProfile();
    fetchStoredPhoto();
  }, [user.email]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
      <div style={{ padding: '20px', height: '20%', display: 'flex', flexDirection: 'column' }}>
        <div style={styles.userInfo}>
          <img src={profilePhoto} alt="Profile" style={styles.userPhoto} />
          <div>
            <h3 style={styles.userName}>{user.firstName} {user.lastName}</h3>
            <p style={styles.userEmail}>{user.email}</p>
          </div>
        </div>

        <ul style={styles.menuList}>
          <li style={styles.menuItem}>
            <Link to="/" style={styles.menuLink} onClick={onCloseMenu}>
              Home
            </Link>
          </li>
          <li style={styles.menuItem}>
            <Link to="/profile" style={styles.menuLink} onClick={onCloseMenu}>
              Profile
            </Link>
          </li>
          <li style={styles.menuItem}>
            <Link to="/settings" style={styles.menuLink} onClick={onCloseMenu}>
              Settings
            </Link>
          </li>
          <li style={styles.menuItem}>
            <Link to="/support" style={styles.menuLink} onClick={onCloseMenu}>
              Support
            </Link>
          </li>
        </ul>

        <button
            onClick={handleLogout}
            style={{
              ...styles.logoutButton,
              marginTop: 'auto',
              backgroundColor: '#f44336',
              color: 'white',
              padding: '10px',
              borderRadius: '5px',
              border: 'none',
              cursor: 'pointer',
            }}
        >
          Logout
        </button>
      </div>
  );
};

export default SideMenu;
