// src/services/api.js
const API_BASE_URL = 'https://5-22-220-180.pl-waw1.upcloud.host/api';

class FetchError extends Error {
  constructor(response) {
    // Составляем сообщение ошибки, которое будет отображаться в Error
    const message = `Request failed with status: ${response.status}`;

    // Вызываем конструктор родительского класса (Error)
    super(message);

    // Устанавливаем имя ошибки
    this.name = 'FetchError';

    // Сохраняем объект response
    this.response = response;

    // Устанавливаем структуру error (как объект)
    this.error = {
      error: message,  // Сообщение об ошибке
      response: response,  // Объект response
    };

    // Чтобы исключение корректно работало в стеке вызовов
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FetchError);
    }
  }
}

// Функция для выполнения запросов
const fetchApi = async (endpoint, method = 'GET', body = null, headers = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body ? JSON.stringify(body) : null,
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorData = await response.json();
      /**
      // При ошибке выдаёт следующую структуру:
      //
      // @param {"error": string, "response":}
      */
      throw new FetchError(response);
    }
    return await response.json();
  } catch (error) {
    console.error('Ошибка при выполнении запроса:', error);
    throw error;
  }
};

// Регистрация пользователя
export const registerUser = async (userData) => {
  return fetchApi('/user/register', 'POST', userData);
};

// Логин пользователя
export const loginUser = async (credentials) => {
  return fetchApi('/user/login', 'POST', credentials);
};

// Получение информации о профиле
export const getProfile = async () => {
  const token = localStorage.getItem('token');
  return fetchApi('/user/profile', 'GET', null, {
    Authorization: `Bearer ${token}`,
  });
};

// Получение списка всех валют
export const getAllCurrencies = async () => {
  return fetchApi('/currency/currency-rates', 'GET');
};

// Получение информации о конкретной валюте
export const getCurrencyDetails = async (currencyCode, startDate, endDate) => {
  return fetchApi(`/currency/currency-rates/${currencyCode}?start_date=${startDate}&end_date=${endDate}`, 'GET');
};

export const addFavoriteCurrency = async (currencyCode) => {
  const token = localStorage.getItem('token');
  return fetchApi('/user/favorites', 'POST', { currency_code: currencyCode }, {
    Authorization: `Bearer ${token}`,
  });
};

// Получение баланса всех валют
export const getWallet = async () => {
  const token = localStorage.getItem('token');
  return fetchApi('/user/wallet', 'GET', null, {
    Authorization: `Bearer ${token}`,
  });
};

// Получение истории транзакций
export const getTransactions = async () => {
  const token = localStorage.getItem('token');
  return fetchApi('/transactions/transactions', 'GET', null, {
    Authorization: `Bearer ${token}`,
  });
};

// Пополнение баланса
export const depositFunds = async (amount) => {
  const token = localStorage.getItem('token');
  return fetchApi('/user/deposit', 'POST', { amount }, {
    Authorization: `Bearer ${token}`,
  });
};

// Пополнение баланса
export const withdrawFunds = async (amount) => {
  const token = localStorage.getItem('token');
  return fetchApi('/user/withdraw', 'POST', { amount }, {
    Authorization: `Bearer ${token}`,
  });
};

// Получение списка избранных валют
export const getFavoriteCurrencies = async () => {
  const token = localStorage.getItem('token');
  return fetchApi('/user/favorites', 'GET', null, {
    Authorization: `Bearer ${token}`,
  });
};

// Удаление валюты из избранного
export const removeFavoriteCurrency = async (currencyCode) => {
  const token = localStorage.getItem('token');
  return fetchApi(`/user/favorites/${currencyCode}`, 'DELETE', null, {
    Authorization: `Bearer ${token}`,
  });
};

// Получение курса валюты
export const getCurrencyRate = async (currencyCode) => {
  try {
    const response = await fetchApi('/currency/currency-rates', 'GET');
    console.log('Ответ от сервера (курсы валют):', response);

    // Находим нужную валюту в ответе
    const currencyData = response[currencyCode];
    if (!currencyData) {
      throw new Error(`Курс для валюты ${currencyCode} не найден.`);
    }

    return currencyData; // Возвращаем данные о валюте
  } catch (error) {
    console.error('Ошибка при получении курса валюты:', error);
    throw error;
  }
};

// Получение истории курса валюты
export const getCurrencyHistory = async (currencyCode, startDate, endDate) => {
  return fetchApi(`/currency/currency-rates/${currencyCode}?start_date=${startDate}&end_date=${endDate}`, 'GET');
};

// Покупка валюты
export const buyCurrency = async (currencyCode, amount) => {
  const token = localStorage.getItem('token');
  return fetchApi('/transactions/transaction/buy', 'POST', { currency_code: currencyCode, amount }, {
    Authorization: `Bearer ${token}`,
  });
};

// Продажа валюты
export const sellCurrency = async (currencyCode, amount) => {
  const token = localStorage.getItem('token');
  return fetchApi('/transactions/transaction/sell', 'POST', { currency_code: currencyCode, amount }, {
    Authorization: `Bearer ${token}`,
  });
};

// Другие функции для работы с API...