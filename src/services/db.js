// Initialize the database
const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('CurrencyDB', 2); // Increment the database version

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Create object stores if they do not exist
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

/**
 * Saves profile data to the IndexedDB.
 * @param {Object} profileData - The profile data to save.
 * @returns {Promise} - A promise that resolves when the data is saved.
 */
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

/**
 * Retrieves profile data from the IndexedDB.
 * @returns {Promise} - A promise that resolves with the profile data.
 */
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

/**
 * Saves balance data to the IndexedDB.
 * @param {Object} balanceData - The balance data to save.
 * @returns {Promise} - A promise that resolves when the data is saved.
 */
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

/**
 * Retrieves balance data from the IndexedDB.
 * @returns {Promise} - A promise that resolves with the balance data.
 */
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

/**
 * Saves transaction history data to the IndexedDB.
 * @param {Array} transactionsData - The transaction history data to save.
 * @returns {Promise} - A promise that resolves when the data is saved.
 */
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

/**
 * Retrieves transaction history data from the IndexedDB.
 * @returns {Promise} - A promise that resolves with the transaction history data.
 */
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

/**
 * Saves currency data to the IndexedDB.
 * @param {Object} currencyData - The currency data to save.
 * @returns {Promise} - A promise that resolves when the data is saved.
 */
export const saveCurrencyData = async (currencyData) => {
  try {
    const db = await initDB();
    const transaction = db.transaction('currencies', 'readwrite');
    const store = transaction.objectStore('currencies');
    const request = store.put(currencyData);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        console.log('Currency data saved to IndexedDB:', currencyData);
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error saving currency data:', error);
    throw error;
  }
};

/**
 * Retrieves currency data from the IndexedDB.
 * @param {string} code - The currency code to retrieve.
 * @returns {Promise} - A promise that resolves with the currency data.
 */
export const getCurrencyData = async (code) => {
  try {
    const db = await initDB();
    const transaction = db.transaction('currencies', 'readonly');
    const store = transaction.objectStore('currencies');
    const request = store.get(code);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        console.log('Currency data loaded from IndexedDB:', request.result);
        resolve(request.result);
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error loading currency data:', error);
    throw error;
  }
};

/**
 * Saves favorite currencies to the IndexedDB.
 * @param {Array} favoriteCurrencies - The list of favorite currencies to save.
 * @returns {Promise} - A promise that resolves when the data is saved.
 */
export const saveFavoriteCurrencies = async (favoriteCurrencies) => {
  try {
    const db = await initDB();
    const transaction = db.transaction('favorites', 'readwrite');
    const store = transaction.objectStore('favorites');
    const request = store.put({ id: 'favorites', currencies: favoriteCurrencies });

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        console.log('Favorite currencies saved to IndexedDB:', favoriteCurrencies);
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error saving favorite currencies:', error);
    throw error;
  }
};

/**
 * Retrieves favorite currencies from the IndexedDB.
 * @returns {Promise} - A promise that resolves with the list of favorite currencies.
 */
export const getFavoriteCurrenciesFromDB = async () => {
  try {
    const db = await initDB();
    const transaction = db.transaction('favorites', 'readonly');
    const store = transaction.objectStore('favorites');
    const request = store.get('favorites');

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        console.log('Favorite currencies loaded from IndexedDB:', request.result?.currencies || []);
        resolve(request.result?.currencies || []);
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error loading favorite currencies:', error);
    throw error;
  }
};

/**
 * Saves a profile photo to the IndexedDB.
 * @param {string} email - The email associated with the profile photo.
 * @param {string} photo - The profile photo to save.
 * @returns {Promise} - A promise that resolves when the photo is saved.
 */
export const saveProfilePhoto = async (email, photo) => {
  try {
    const db = await initDB();
    const transaction = db.transaction('profile', 'readwrite');
    const store = transaction.objectStore('profile');
    const request = store.put({ id: email, photo });

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        console.log('Profile photo saved to IndexedDB for user:', email);
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error saving profile photo:', error);
    throw error;
  }
};

/**
 * Retrieves a profile photo from the IndexedDB.
 * @param {string} email - The email associated with the profile photo.
 * @returns {Promise} - A promise that resolves with the profile photo.
 */
export const getProfilePhoto = async (email) => {
  try {
    const db = await initDB();
    const transaction = db.transaction('profile', 'readonly');
    const store = transaction.objectStore('profile');
    const request = store.get(email);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        console.log('Profile photo loaded for user:', email);
        resolve(request.result?.photo);
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error loading profile photo:', error);
    throw error;
  }
};