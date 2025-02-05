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

      if (!db.objectStoreNames.contains('favorites')) {
        db.createObjectStore('favorites', { keyPath: 'id' });
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

export const saveCurrencyData = async (currencyData) => {
  try {
    const db = await initDB();
    const transaction = db.transaction('currencies', 'readwrite');
    const store = transaction.objectStore('currencies');
    const request = store.put(currencyData);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        console.log('Данные валюты сохранены в IndexedDB:', currencyData);
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Ошибка при сохранении данных валюты:', error);
    throw error;
  }
};

export const getCurrencyData = async (code) => {
  try {
    const db = await initDB();
    const transaction = db.transaction('currencies', 'readonly');
    const store = transaction.objectStore('currencies');
    const request = store.get(code);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        console.log('Данные валюты загружены из IndexedDB:', request.result);
        resolve(request.result);
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Ошибка при загрузке данных валюты:', error);
    throw error;
  }
};

// Сохранение избранных валют
export const saveFavoriteCurrencies = async (favoriteCurrencies) => {
  try {
    const db = await initDB();
    const transaction = db.transaction('favorites', 'readwrite');
    const store = transaction.objectStore('favorites');
    const request = store.put({ id: 'favorites', currencies: favoriteCurrencies });

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        console.log('Избранные валюты сохранены в IndexedDB:', favoriteCurrencies);
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Ошибка при сохранении избранных валют:', error);
    throw error;
  }
};

// Загрузка избранных валют
export const getFavoriteCurrenciesFromDB = async () => {
  try {
    const db = await initDB();
    const transaction = db.transaction('favorites', 'readonly');
    const store = transaction.objectStore('favorites');
    const request = store.get('favorites');

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        console.log('Избранные валюты загружены из IndexedDB:', request.result?.currencies || []);
        resolve(request.result?.currencies || []);
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Ошибка при загрузке избранных валют:', error);
    throw error;
  }
};
