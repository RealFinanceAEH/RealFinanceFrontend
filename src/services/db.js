// Инициализация базы данных
const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('CurrencyDB', 2); // Увеличиваем версию базы данных

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains('profile')) {
        db.createObjectStore('profile', { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains('balance')) {
        db.createObjectStore('balance', { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains('transactions')) {
        db.createObjectStore('transactions', { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains('currencies')) {
        db.createObjectStore('currencies', { keyPath: 'code' });
      }
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
};

// Сохранение данных профиля
export const saveProfileData = async (profileData) => {
  const db = await initDB();
  const transaction = db.transaction('profile', 'readwrite');
  const store = transaction.objectStore('profile');
  const request = store.put({ id: 'profile', ...profileData });

  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

// Получение данных профиля
export const getProfileData = async () => {
  const db = await initDB();
  const transaction = db.transaction('profile', 'readonly');
  const store = transaction.objectStore('profile');
  const request = store.get('profile');

  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

// Сохранение баланса
export const saveBalanceData = async (balanceData) => {
  const db = await initDB();
  const transaction = db.transaction('balance', 'readwrite');
  const store = transaction.objectStore('balance');
  const request = store.put({ id: 'balance', ...balanceData });

  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

// Получение баланса
export const getBalanceData = async () => {
  const db = await initDB();
  const transaction = db.transaction('balance', 'readonly');
  const store = transaction.objectStore('balance');
  const request = store.get('balance');

  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

// Сохранение истории транзакций
export const saveTransactionsData = async (transactionsData) => {
  const db = await initDB();
  const transaction = db.transaction('transactions', 'readwrite');
  const store = transaction.objectStore('transactions');
  const request = store.put({ id: 'transactions', data: transactionsData });

  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

// Получение истории транзакций
export const getTransactionsData = async () => {
  const db = await initDB();
  const transaction = db.transaction('transactions', 'readonly');
  const store = transaction.objectStore('transactions');
  const request = store.get('transactions');

  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result?.data || []);
    request.onerror = () => reject(request.error);
  });
};

// Сохранение данных о валюте
export const saveCurrencyData = async (currencyData) => {
  const db = await initDB();
  const transaction = db.transaction('currencies', 'readwrite');
  const store = transaction.objectStore('currencies');
  const request = store.put(currencyData);

  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

// Получение данных о валюте
export const getCurrencyData = async (code) => {
  const db = await initDB();
  const transaction = db.transaction('currencies', 'readonly');
  const store = transaction.objectStore('currencies');
  const request = store.get(code);

  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};