import React, { useState, useEffect } from 'react';
import { styles } from '../styles/styles';
import { getProfile, getWallet, getTransactions, depositFunds } from '../services/api';
import { saveProfileData, getProfileData, saveBalanceData, getBalanceData, saveTransactionsData, getTransactionsData } from '../services/db';

const Profile = () => {
  const [isBalanceOpen, setIsBalanceOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState('https://surl.li/uwuvai'); // Заглушка для фото
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [balance, setBalance] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [depositAmount, setDepositAmount] = useState('');

  // Загрузка данных профиля, баланса и транзакций
  useEffect(() => {
    const fetchData = async () => {
      try {
        let profileData, walletData, transactionsData;

        if (navigator.onLine) {
          // Получаем данные профиля
          profileData = await getProfile();
          setUser({
            firstName: profileData.firstname,
            lastName: profileData.lastname,
            email: profileData.email,
            phone: profileData.phone,
          });
          await saveProfileData(profileData); // Сохраняем данные профиля

          // Получаем баланс
          walletData = await getWallet();
          setBalance(walletData);
          await saveBalanceData(walletData); // Сохраняем данные баланса

          // Получаем историю транзакций
          transactionsData = await getTransactions();
          setTransactions(transactionsData);
          await saveTransactionsData(transactionsData); // Сохраняем данные транзакций
        } else {
          // Загружаем данные из кэша
          profileData = await getProfileData();
          if (profileData) {
            setUser({
              firstName: profileData.firstname,
              lastName: profileData.lastname,
              email: profileData.email,
              phone: profileData.phone,
            });
          }

          walletData = await getBalanceData();
          if (walletData) {
            setBalance(walletData);
          }

          transactionsData = await getTransactionsData();
          if (transactionsData) {
            setTransactions(transactionsData);
          }
        }
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      }
    };

    fetchData();
  }, []);

  // Функция для загрузки фото
  const handleUploadPhoto = async () => {
    try {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*';
      fileInput.capture = 'camera'; // Для мобильных устройств
      fileInput.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            setProfilePhoto(event.target.result);
          };
          reader.readAsDataURL(file);
        }
      };
      fileInput.click();
    } catch (error) {
      console.error('Ошибка при загрузке фото:', error);
    }
  };

  // Функция для пополнения баланса
  const handleDeposit = async () => {
    if (!depositAmount || isNaN(depositAmount) || depositAmount <= 0) {
      alert('Введите корректную сумму для пополнения');
      return;
    }

    try {
      await depositFunds(parseFloat(depositAmount));
      const walletData = await getWallet();
      setBalance(walletData); // Обновляем весь объект баланса
      alert('Баланс успешно пополнен');
      setDepositAmount('');
    } catch (error) {
      console.error('Ошибка при пополнении баланса:', error);
      alert('Не удалось пополнить баланс');
    }
  };

  return (
    <div style={styles.profileContainer}>
      {/* Блок с фото и данными пользователя */}
      <div style={styles.profileSection}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <img src={profilePhoto} alt="Фото профиля" style={styles.profilePhoto} />
          <div>
            <h2 style={styles.profileName}>{user.firstName} {user.lastName}</h2>
            <p style={styles.profileEmail}>{user.email}</p>
            <p style={styles.profilePhone}>{user.phone}</p>
          </div>
        </div>
        <button onClick={handleUploadPhoto} style={styles.uploadButton}>
          Загрузить фото
        </button>
      </div>

      {/* Блок с балансом */}
      <div style={styles.profileSection}>
        <div
          style={styles.profileSectionHeader}
          onClick={() => setIsBalanceOpen(!isBalanceOpen)}
        >
          <h3 style={styles.profileSectionTitle}>Баланс</h3>
          <span>{isBalanceOpen ? '▲' : '▼'}</span>
        </div>
        {isBalanceOpen && (
          <div style={styles.profileSectionContent}>
            {balance && Object.keys(balance).map((currency) => (
              <p key={currency}>
                {currency}: {balance[currency]}
              </p>
            ))}
            <div style={{ marginTop: '10px' }}>
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="Введите сумму"
                style={{ padding: '5px', marginRight: '10px' }}
              />
              <button onClick={handleDeposit} style={styles.uploadButton}>
                Пополнить баланс
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Блок с историей транзакций */}
      <div style={styles.profileSection}>
        <div
          style={styles.profileSectionHeader}
          onClick={() => setIsHistoryOpen(!isHistoryOpen)}
        >
          <h3 style={styles.profileSectionTitle}>История транзакций</h3>
          <span>{isHistoryOpen ? '▲' : '▼'}</span>
        </div>
        {isHistoryOpen && (
          <div style={styles.profileSectionContent}>
            {transactions.map((transaction) => (
              <div key={transaction.id} style={{ marginBottom: '10px' }}>
                <p><strong>{transaction.timestamp}</strong>: {transaction.amount} {transaction.currency_code}</p>
                <p>{transaction.transaction_type}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;