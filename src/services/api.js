const API_BASE_URL = 'https://5-22-220-180.pl-waw1.upcloud.host/api';

/**
 * Custom error class for handling fetch errors.
 */
class FetchError extends Error {
  constructor(response) {
    const message = `Request failed with status: ${response.status}`;
    super(message);
    this.name = 'FetchError';
    this.response = response;
    this.error = { error: message, response: response };
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FetchError);
    }
  }
}

/**
 * Performs API requests.
 * @param {string} endpoint - API endpoint.
 * @param {string} [method='GET'] - HTTP method.
 * @param {Object|null} [body=null] - Request body.
 * @param {Object} [headers={}] - Additional headers.
 * @returns {Promise<Object>} - Response data.
 * @throws {FetchError} - If the request fails.
 */
const fetchApi = async (endpoint, method = 'GET', body = null, headers = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const options = {
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
    body: body ? JSON.stringify(body) : null,
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new FetchError(response);
    }
    return await response.json();
  } catch (error) {
    console.error('Request error:', error);
    throw error;
  }
};

/** Registers a new user. */
export const registerUser = async (userData) => fetchApi('/user/register', 'POST', userData);

/** Logs in a user. */
export const loginUser = async (credentials) => fetchApi('/user/login', 'POST', credentials);

/** Retrieves user profile information. */
export const getProfile = async () => fetchApi('/user/profile', 'GET', null, { Authorization: `Bearer ${localStorage.getItem('token')}` });

/** Fetches all currency rates. */
export const getAllCurrencies = async () => fetchApi('/currency/currency-rates', 'GET');

/** Fetches details for a specific currency within a date range. */
export const getCurrencyDetails = async (currencyCode, startDate, endDate) => fetchApi(`/currency/currency-rates/${currencyCode}?start_date=${startDate}&end_date=${endDate}`, 'GET');

/** Adds a currency to favorites. */
export const addFavoriteCurrency = async (currencyCode) => fetchApi('/user/favorites', 'POST', { currency_code: currencyCode }, { Authorization: `Bearer ${localStorage.getItem('token')}` });

/** Retrieves user's wallet balance. */
export const getWallet = async () => fetchApi('/user/wallet', 'GET', null, { Authorization: `Bearer ${localStorage.getItem('token')}` });

/** Fetches user's transaction history. */
export const getTransactions = async () => fetchApi('/transactions/transactions', 'GET', null, { Authorization: `Bearer ${localStorage.getItem('token')}` });

/** Deposits funds into the user's account. */
export const depositFunds = async (amount) => fetchApi('/user/deposit', 'POST', { amount }, { Authorization: `Bearer ${localStorage.getItem('token')}` });

/** Withdraws funds from the user's account. */
export const withdrawFunds = async (amount) => fetchApi('/user/withdraw', 'POST', { amount }, { Authorization: `Bearer ${localStorage.getItem('token')}` });

/** Retrieves the list of favorite currencies. */
export const getFavoriteCurrencies = async () => fetchApi('/user/favorites', 'GET', null, { Authorization: `Bearer ${localStorage.getItem('token')}` });

/** Removes a currency from favorites. */
export const removeFavoriteCurrency = async (currencyCode) => fetchApi(`/user/favorites/${currencyCode}`, 'DELETE', null, { Authorization: `Bearer ${localStorage.getItem('token')}` });

/** Fetches exchange rate for a specific currency. */
export const getCurrencyRate = async (currencyCode) => {
  try {
    const response = await fetchApi('/currency/currency-rates', 'GET');
    console.log('Currency rates response:', response);
    const currencyData = response[currencyCode];
    if (!currencyData) {
      throw new Error(`Exchange rate for ${currencyCode} not found.`);
    }
    return currencyData;
  } catch (error) {
    console.error('Error fetching currency rate:', error);
    throw error;
  }
};

/** Retrieves the exchange rate history for the past year. */
export const getCurrencyHistory = async (currencyCode) => {
  const endDate = new Date().toISOString().split('T')[0];
  const startDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  return fetchApi(`/currency/currency-rates/${currencyCode}?start_date=${startDate}&end_date=${endDate}`, 'GET');
};

/** Buys a specified amount of a currency. */
export const buyCurrency = async (currencyCode, amount) => fetchApi('/transactions/transaction/buy', 'POST', { currency_code: currencyCode, amount }, { Authorization: `Bearer ${localStorage.getItem('token')}` });

/** Sells a specified amount of a currency. */
export const sellCurrency = async (currencyCode, amount) => fetchApi('/transactions/transaction/sell', 'POST', { currency_code: currencyCode, amount }, { Authorization: `Bearer ${localStorage.getItem('token')}` });
