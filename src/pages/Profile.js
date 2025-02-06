import React, { useState, useEffect } from 'react';
import { styles } from '../styles/styles';
import { getProfile, getWallet, getTransactions, depositFunds, withdrawFunds } from '../services/api';
import {
    saveProfileData, getProfileData,
    saveBalanceData, getBalanceData,
    saveTransactionsData, getTransactionsData,
    saveProfilePhoto, getProfilePhoto
} from '../services/db'; // Добавил работу с IndexedDB


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
  /**
   * @typedef {Object} Transaction
   * @property {string} amount - Сумма транзакции.
   * @property {string} currency_code - Код валюты (например, "EUR").
   * @property {string} final_currency_balance - Баланс после транзакции в исходной валюте.
   * @property {string} final_pln_balance - Баланс после транзакции в PLN.
   * @property {number} id - Уникальный идентификатор транзакции.
   * @property {string} timestamp - Время транзакции в формате UTC.
   * @property {string} transaction_type - Тип транзакции, например "buy" или "sell".
   */

  /**
   * @type {Transaction[]}
   */
  const [transactions, setTransactions] = useState([]);
  const [depositAmount, setDepositAmount] = useState('');

// В useEffect при загрузке данных
    useEffect(() => {
        const fetchData = async () => {
            try {
                let profileData, walletData, transactionsData, storedPhoto;

                if (navigator.onLine) {
                    // Загружаем онлайн-данные и сохраняем их
                    profileData = await getProfile();
                    setUser({
                        firstName: profileData.firstname,
                        lastName: profileData.lastname,
                        email: profileData.email,
                        phone: profileData.phone,
                    });
                    await saveProfileData(profileData);

                    walletData = await getWallet();
                    setBalance(walletData);
                    await saveBalanceData(walletData);

                    transactionsData = await getTransactions();
                    setTransactions(transactionsData);
                    await saveTransactionsData(transactionsData);
                } else {
                    // Загружаем оффлайн-данные из IndexedDB
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

                // 📸 Загружаем сохранённое фото из IndexedDB, используя email
                storedPhoto = await getProfilePhoto(user.email); // Теперь по email
                if (storedPhoto) {
                    setProfilePhoto(storedPhoto);
                }
            } catch (error) {
                console.error('Ошибка при загрузке данных:', error);
            }
        };

        fetchData();
    }, [user.email]); // Добавил зависимость от user.email

// В компоненте Profile
const handleUploadPhoto = async () => {
  try {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (file && user.email) { // Используем user.email
        const reader = new FileReader();
        reader.onload = async (event) => {
          const newPhoto = event.target.result;
          setProfilePhoto(newPhoto);
          await saveProfilePhoto(user.email, newPhoto); // Сохраняем фото с привязкой к email
        };
        reader.readAsDataURL(file);
      }
    };
    fileInput.click();
  } catch (error) {
    console.error('Ошибка при загрузке фото:', error);
  }
};

    useEffect(() => {
        // Создаем копию массива
        const sortedTransactions = [...transactions];

        // Сортируем по timestamp от самых новых к самым старым
        sortedTransactions.sort((a, b) => {
            const timestampA = new Date(a.timestamp);
            const timestampB = new Date(b.timestamp);

            return timestampB - timestampA;  // Сортировка от самых новых
        });

        // Проверяем, изменился ли порядок, чтобы избежать повторных установок
        if (JSON.stringify(sortedTransactions) !== JSON.stringify(transactions)) {
            setTransactions(sortedTransactions);
        }
    }, [transactions]);  // Следим за изменениями transactions


    // Функция для пополнения баланса
  // 🔹 Функция для пополнения баланса
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

  const handleWithdraw = async () => {
    console.log(balance.PLN)
    console.log(depositAmount);
    if (!depositAmount || isNaN(depositAmount) || depositAmount <= 0 || parseFloat(depositAmount) > parseFloat(balance.PLN)) {
      alert('Введите корректную сумму для снятия');
      return;
    }

    try {
      await withdrawFunds(parseFloat(depositAmount));
      const walletData = await getWallet();
      setBalance(walletData); // Обновляем весь объект баланса
      alert('Баланс успешно снят');
      setDepositAmount('');
    } catch (error) {
      console.error('Ошибка при снятии денег со счёта:', error);
      alert('Не удалось снять деньги со счёта');
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
            <div style={{ marginTop: '10px', justifyContent: 'space-between' }}>
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
              <button onClick={handleWithdraw} style={styles.uploadButton}>
                Снять баланс
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
                  <div key={transaction.id} style={styles.transactionItem}>
                    <p><strong>Date: {new Date(transaction.timestamp).toLocaleString()}</strong></p>
                    <p>
                      {transaction.transaction_type === "buy" ? "Bought" : "Sold"}:
                      {parseFloat(transaction.amount).toString()} {transaction.currency_code}
                    </p>
                    <p>
                      Final currency balance: {parseFloat(transaction.final_currency_balance).toString()} {transaction.currency_code}
                    </p>
                    <p>
                      Final PLN balance: {parseFloat(transaction.final_pln_balance).toString()} PLN
                    </p>
                    {transaction.price && (
                        <p>
                          Price: {parseFloat(transaction.price).toString()} {transaction.currency_code} per unit
                        </p>
                    )}
                  </div>
              ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
