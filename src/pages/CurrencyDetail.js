import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import Chart from '../components/Chart';
import { getCurrencyRate, getCurrencyHistory, buyCurrency, sellCurrency } from '../services/api';
import { saveCurrencyData, getCurrencyData } from '../services/db';
import { styles } from '../styles/styles';

// rate - это ask
const CurrencyDetail = () => {
  const { currencyCode } = useParams();
  const { isOnline, setBalances } = useContext(AppContext);
  const [currencyData, setCurrencyData] = useState(null);
  const [amount, setAmount] = useState(0);
  const [period, setPeriod] = useState('7d'); // По умолчанию 7 дней

  useEffect(() => {
    const fetchCurrencyData = async () => {
      try {
        const rateData = await getCurrencyRate(currencyCode);
        console.log('Данные курса валюты:', rateData);
  
        // Проверяем, что rateData содержит корректные данные
        if (!rateData || !rateData.ask || isNaN(rateData.ask)) {
          throw new Error('Курс валюты не загружен или некорректен.');
        }
  
        const rate = rateData.ask; // Используем цену покупки (ask)
  
        let startDate;
        const endDate = new Date().toISOString().split('T')[0];
  
        switch (period) {
          case '7d':
            startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            break;
          case '1m':
            startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            break;
          case '3m':
            startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            break;
          case '1y':
            startDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            break;
          default:
            startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        }
  
        const history = await getCurrencyHistory(currencyCode, startDate, endDate);
  
        const data = {
          code: currencyCode,
          name: currencyCode.toUpperCase(),
          rate,
          history,
        };
  
        setCurrencyData(data);
        await saveCurrencyData(data); // Сохраняем данные в IndexedDB
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
  
        // Если нет интернета, загружаем данные из кэша
        if (!isOnline) {
          const cachedData = await getCurrencyData(currencyCode);
          if (cachedData) {
            setCurrencyData(cachedData);
          }
        }
      }
    };
  
    if (isOnline) {
      fetchCurrencyData();
    } else {
      // Загружаем данные из кэша, если нет интернета
      const loadCachedData = async () => {
        const cachedData = await getCurrencyData(currencyCode);
        if (cachedData) {
          setCurrencyData(cachedData);
        }
      };
      loadCachedData();
    }
  }, [currencyCode, isOnline, period]);

  const handleBuy = async () => {
    if (!currencyData || !currencyData.rate || isNaN(currencyData.rate)) {
      alert('Ошибка: Курс валюты не загружен или некорректен.');
      return;
    }
  
    if (isNaN(amount) || amount <= 0) {
      alert('Ошибка: Введите корректное количество валюты.');
      return;
    }
  
    try {
      const response = await buyCurrency(currencyCode, amount);
      console.log('Ответ от сервера (покупка):', response);
  
      // Обновляем локальное состояние на основе ответа сервера
      setBalances((prevBalances) => ({
        ...prevBalances,
        PLN: parseFloat(response.final_pln_balance),
        [currencyCode]: parseFloat(response.final_currency_balance),
      }));
  
      alert(`Куплено ${amount} ${currencyData.code} за ${(amount * currencyData.rate).toFixed(2)} PLN`);
    } catch (error) {
      console.error('Ошибка при покупке валюты:', error);
      alert('Ошибка при покупке валюты. Проверьте баланс и попробуйте снова.');
    }
  };

  const handleSell = async () => {
    if (!currencyData || !currencyData.rate || isNaN(currencyData.rate)) {
      alert('Ошибка: Курс валюты не загружен или некорректен.');
      return;
    }
  
    if (isNaN(amount) || amount <= 0) {
      alert('Ошибка: Введите корректное количество валюты.');
      return;
    }
  
    try {
      const response = await sellCurrency(currencyCode, amount);
      console.log('Ответ от сервера (продажа):', response);
  
      // Обновляем локальное состояние на основе ответа сервера
      setBalances((prevBalances) => ({
        ...prevBalances,
        PLN: parseFloat(response.final_pln_balance),
        [currencyCode]: parseFloat(response.final_currency_balance),
      }));
  
      alert(`Продано ${amount} ${currencyData.code} за ${(amount * currencyData.rate).toFixed(2)} PLN`);
    } catch (error) {
      console.error('Ошибка при продаже валюты:', error);
      alert('Ошибка при продаже валюты. Проверьте баланс и попробуйте снова.');
    }
  };

  if (!currencyData) {
    return <div>Загрузка...</div>;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Roboto, sans-serif' }}>
      <h1 style={styles.title}>{currencyData.name} ({currencyData.code})</h1>
      <p style={styles.subtitle}>Цена продажи: {currencyData.rate} PLN</p>
      {console.log("КАРЕНСИ ДАТА")}
      {console.log(currencyData)}
      <p style={styles.subtitle}>Цена покупки: {currencyData.history.at(-1).bid} PLN</p>

      <h2 style={styles.subtitle}>График изменения курса</h2>
      <div style={styles.periodButtonsContainer}>
        <button
          style={period === '7d' ? { ...styles.periodButton, ...styles.periodButtonActive } : styles.periodButton}
          onClick={() => setPeriod('7d')}
        >
          7 дней
        </button>
        <button
          style={period === '1m' ? { ...styles.periodButton, ...styles.periodButtonActive } : styles.periodButton}
          onClick={() => setPeriod('1m')}
        >
          1 месяц
        </button>
        <button
          style={period === '3m' ? { ...styles.periodButton, ...styles.periodButtonActive } : styles.periodButton}
          onClick={() => setPeriod('3m')}
        >
          3 месяца
        </button>
        <button
          style={period === '1y' ? { ...styles.periodButton, ...styles.periodButtonActive } : styles.periodButton}
          onClick={() => setPeriod('1y')}
        >
          1 год
        </button>
      </div>

      {/* Отображение графика */}
      <Chart data={currencyData.history} />

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
          placeholder="Введите количество"
          style={{ padding: '10px', fontSize: '16px', width: '100%', maxWidth: '300px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
      </div>

      <div style={styles.actionButtonsContainer}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <button
            style={styles.buyButton}
            onClick={handleBuy}
          >
            Купить
          </button>
          {!isNaN(amount) && !(amount === 0) && (
          <span>
            Всего: {(amount * currencyData.history.at(-1).bid).toFixed(4).toString()}
          </span>
              )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <button
            style={styles.sellButton}
            onClick={handleSell}
          >
            Продать
          </button>
          {!isNaN(amount) && !(amount === 0) && (
              <span>
                Всего: {(amount * currencyData.rate).toFixed(4).toString()}
              </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CurrencyDetail;