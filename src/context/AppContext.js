import React, { createContext, useState, useEffect } from 'react';
import {
  saveProfileData,
  getProfileData,
  saveBalanceData,
  getBalanceData,
  saveTransactionsData,
  getTransactionsData,
  saveCurrencyData,
  getCurrencyData,
} from '../services/db';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [currencies, setCurrencies] = useState([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [balances, setBalances] = useState({ PLN: 1000 }); // Начальный баланс только в PLN
  const [lastOnline, setLastOnline] = useState(new Date().toLocaleString());
  const [transactions, setTransactions] = useState([]);

  // Загрузка данных при монтировании
  useEffect(() => {
    const loadData = async () => {
      const profileData = await getProfileData();
      if (profileData) setUser(profileData);

      const balanceData = await getBalanceData();
      if (balanceData) setBalances(balanceData);

      const transactionsData = await getTransactionsData();
      if (transactionsData) setTransactions(transactionsData);
    };

    loadData();
  }, []);

  // Сохранение данных при изменении
  useEffect(() => {
    if (user) saveProfileData(user);
  }, [user]);

  useEffect(() => {
    if (balances) saveBalanceData(balances);
  }, [balances]);

  useEffect(() => {
    if (transactions) saveTransactionsData(transactions);
  }, [transactions]);

  // Отслеживание состояния сети
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setLastOnline(new Date().toLocaleString());
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        currencies,
        setCurrencies,
        isOnline,
        balances,
        setBalances,
        lastOnline,
        saveCurrencyData,
        getCurrencyData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};