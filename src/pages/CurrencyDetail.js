import React, { useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import Chart from '../components/Chart';
import { getCurrencyRate, getCurrencyHistory, buyCurrency, sellCurrency } from '../services/api';
import { saveCurrencyData, getCurrencyData } from '../services/db';
import { styles } from '../styles/styles';

// rate is the ask price
const CurrencyDetail = () => {
  const { currencyCode } = useParams();
  const { isOnline, setBalances } = useContext(AppContext);
  const [currencyData, setCurrencyData] = useState(null);
  const [amount, setAmount] = useState(0);
  const [period, setPeriod] = useState('7d'); // Default period is 7 days

  // Filter history data by selected period
  const filterHistoryByPeriod = (history, period) => {
    const now = new Date();
    let startDate;

    switch (period) {
      case '7d':
        startDate = new Date(now - 7 * 24 * 60 * 60 * 1000);
        break;
      case '1m':
        startDate = new Date(now - 30 * 24 * 60 * 60 * 1000);
        break;
      case '3m':
        startDate = new Date(now - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(now - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now - 7 * 24 * 60 * 60 * 1000);
    }

    return history.filter((item) => new Date(item.effective_date) >= startDate);
  };

  const isFetching = useRef(false);

  // Fetch currency data from API or cache if offline
  useEffect(() => {
    if (isFetching.current) return;

    isFetching.current = true;
    const fetchCurrencyData = async () => {
      try {
        const rateData = await getCurrencyRate(currencyCode);
        console.log('Currency rate data:', rateData);

        // Ensure that rateData contains valid data
        if (!rateData || !rateData.ask || isNaN(rateData.ask)) {
          throw new Error('Currency rate data is missing or invalid.');
        }

        const rate = rateData.ask; // Use the ask price

        // Load currency history for the last year
        const history = await getCurrencyHistory(currencyCode);

        const data = {
          code: currencyCode,
          name: currencyCode.toUpperCase(),
          rate,
          history, // Save the currency history
        };

        setCurrencyData(data);
        await saveCurrencyData(data); // Save data to IndexedDB
      } catch (error) {
        console.error('Error loading data:', error);

        // If offline, load data from cache
        if (!isOnline) {
          const cachedData = await getCurrencyData(currencyCode);
          if (cachedData) {
            setCurrencyData(cachedData);
          }
        }
      }
    };

    if (isOnline) {
      fetchCurrencyData().finally(() => isFetching.current = false);
    } else {
      // Load cached data if offline
      const loadCachedData = async () => {
        const cachedData = await getCurrencyData(currencyCode);
        if (cachedData) {
          setCurrencyData(cachedData);
        }
      };
      loadCachedData().finally(() => isFetching.current = false);
    }
  }, [currencyCode, isOnline]);

  // Handle period change
  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
  };

  // Filter currency history for the chart
  const filteredHistory = currencyData
      ? filterHistoryByPeriod(currencyData.history, period)
      : [];

  const handleBuy = async () => {
    if (!currencyData || !currencyData.rate || isNaN(currencyData.rate)) {
      alert('Error: Currency rate is missing or invalid.');
      return;
    }

    if (isNaN(amount) || amount <= 0) {
      alert('Error: Please enter a valid amount of currency.');
      return;
    }

    try {
      const response = await buyCurrency(currencyCode, amount);
      console.log('Server response (buy):', response);

      // Update local state based on server response
      setBalances((prevBalances) => ({
        ...prevBalances,
        PLN: parseFloat(response.final_pln_balance),
        [currencyCode]: parseFloat(response.final_currency_balance),
      }));

      alert(`Bought ${amount} ${currencyData.code} for ${(amount * currencyData.rate).toFixed(2)} PLN`);
    } catch (error) {
      console.error('Error while buying currency:', error);
      alert('Error while buying currency. Please check your balance and try again.');
    }
  };

  const handleSell = async () => {
    if (!currencyData || !currencyData.rate || isNaN(currencyData.rate)) {
      alert('Error: Currency rate is missing or invalid.');
      return;
    }

    if (isNaN(amount) || amount <= 0) {
      alert('Error: Please enter a valid amount of currency.');
      return;
    }

    try {
      const response = await sellCurrency(currencyCode, amount);
      console.log('Server response (sell):', response);

      // Update local state based on server response
      setBalances((prevBalances) => ({
        ...prevBalances,
        PLN: parseFloat(response.final_pln_balance),
        [currencyCode]: parseFloat(response.final_currency_balance),
      }));

      alert(`Sold ${amount} ${currencyData.code} for ${(amount * currencyData.rate).toFixed(2)} PLN`);
    } catch (error) {
      console.error('Error while selling currency:', error);
      alert('Error while selling currency. Please check your balance and try again.');
    }
  };

  if (!currencyData) {
    return <div>Loading...</div>;
  }

  return (
      <div style={{ paddingLeft: '20px', paddingRight: '20px', fontFamily: 'Roboto, sans-serif' }}>
        <div style={{ display: "flex", justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
          <div>
            <h1 style={styles.title}>{currencyData.name} ({currencyData.code})</h1>
            <p style={styles.subtitle}>Selling Price: {currencyData.rate} PLN</p>
            <p style={styles.subtitle}>Buying Price: {currencyData.history.at(-1).bid} PLN</p>

            <h2 style={styles.subtitle}>Price Change Chart</h2>
          </div>
        </div>

        <div style={styles.periodButtonsContainer}>
          <button
              style={period === '7d' ? { ...styles.periodButton, ...styles.periodButtonActive } : styles.periodButton}
              onClick={() => handlePeriodChange('7d')}
          >
            7 days
          </button>
          <button
              style={period === '1m' ? { ...styles.periodButton, ...styles.periodButtonActive } : styles.periodButton}
              onClick={() => handlePeriodChange('1m')}
          >
            1 month
          </button>
          <button
              style={period === '3m' ? { ...styles.periodButton, ...styles.periodButtonActive } : styles.periodButton}
              onClick={() => handlePeriodChange('3m')}
          >
            3 months
          </button>
          <button
              style={period === '1y' ? { ...styles.periodButton, ...styles.periodButtonActive } : styles.periodButton}
              onClick={() => handlePeriodChange('1y')}
          >
            1 year
          </button>
        </div>

        {/* Display the chart */}
        <div style={{ maxHeight: '430px', maxWidth: "100%", display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <Chart data={filteredHistory} />
        </div>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
              placeholder="Enter amount"
              style={{ padding: '10px', fontSize: '16px', width: '100%', maxWidth: '300px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
        </div>

        <div style={styles.actionButtonsContainer}>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <button
                style={styles.buyButton}
                onClick={handleBuy}
            >
              Buy
            </button>
            {!isNaN(amount) && !(amount === 0) && (
                <span>
              Total: {(amount * currencyData.history.at(-1).bid).toFixed(4).toString()}
            </span>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <button
                style={styles.sellButton}
                onClick={handleSell}
            >
              Sell
            </button>
            {!isNaN(amount) && !(amount === 0) && (
                <span>
              Total: {(amount * currencyData.rate).toFixed(4).toString()}
            </span>
            )}
          </div>
        </div>
      </div>
  );
};

export default CurrencyDetail;
