import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CurrencyDetail from './pages/CurrencyDetail';
import Profile from './pages/Profile';
import SideMenu from './components/SideMenu';
import StatusBar from './components/StatusBar';
import { styles } from './styles/styles';
import ProtectedRoute from './components/ProtectedRoute'; // Импортируем ProtectedRoute

const AppContent = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const handleCloseMenu = (e) => {
    if (e.target.closest('.side-menu') === null) {
      setIsMenuOpen(false);
    }
  };

  const hideMenuButtonPaths = ['/login', '/register'];

  return (
    <>
      <StatusBar />
      <div style={{ display: 'flex', marginTop: '50px' }}>
        {!hideMenuButtonPaths.includes(location.pathname) && (
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} style={styles.menuButton}>
            <div style={styles.menuIcon} />
            <div style={styles.menuIcon} />
            <div style={styles.menuIcon} />
          </button>
        )}

        {isMenuOpen && <div style={styles.overlay} onClick={handleCloseMenu} />}

        <div
          className="side-menu"
          style={{ ...styles.sideMenu, left: isMenuOpen ? '0' : '-300px' }}
        >
          <SideMenu onCloseMenu={() => setIsMenuOpen(false)} />
        </div>

        <div style={styles.mainContent}>
          <Routes>
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/currency/:currencyCode" element={<ProtectedRoute><CurrencyDetail /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          </Routes>
        </div>
      </div>
    </>
  );
};

export default AppContent;