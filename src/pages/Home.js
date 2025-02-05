import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import CurrencyCard from '../components/CurrencyCard';
import 'country-flag-icons/3x2/flags.css';
import { styles } from '../styles/styles';
import { getAllCurrencies, getFavoriteCurrencies } from '../services/api';
import { getCurrencyData } from '../services/db';

const Home = () => {
  const { currencies, setCurrencies, isOnline, saveCurrencyData, getCurrencyData } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(true);
  const [favoriteCurrencies, setFavoriteCurrencies] = useState([]);

  // Загрузка данных
  useEffect(() => {
    let isMounted = true; // Флаг для проверки, что компонент все еще смонтирован

    const fetchData = async () => {
      try {
        if (isOnline) {
          const data = await getAllCurrencies();
          const formattedCurrencies = Object.keys(data).map((code) => ({
            code,
            name: code,
            isTracked: false,
            ask: data[code].ask,
            bid: data[code].bid,
          }));

          const favorites = await getFavoriteCurrencies();
          if (isMounted) {
            setFavoriteCurrencies(favorites.favorite_currencies || []);
          }

          const updatedCurrencies = formattedCurrencies.map((currency) => ({
            ...currency,
            isTracked: favorites.favorite_currencies.includes(currency.code),
          }));

          if (isMounted) {
            setCurrencies(updatedCurrencies);
          }

          // Сохраняем данные о валютах в IndexedDB
          updatedCurrencies.forEach((currency) => saveCurrencyData(currency));
        } else {
          // Загружаем данные из кэша только для тех валют, которые есть в IndexedDB
          const cachedCurrencies = await Promise.all(
            favoriteCurrencies.map(async (code) => {
              const currencyData = await getCurrencyData(code);
              return currencyData ? currencyData : null;
            })
          );

          if (isMounted) {
            setCurrencies(cachedCurrencies.filter((currency) => currency !== null));
          }
        }
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false; // Очистка при размонтировании компонента
    };
  }, [isOnline]); // Зависимость только от isOnline

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div style={styles.homeContainer}>
      {/* Верхняя синяя часть */}
      <div style={styles.topSection}>
        <h1>Отслеживаемые валюты</h1>
        <div style={styles.currencyList}>
          {currencies
            .filter((currency) => currency.isTracked)
            .map((currency) => (
              <CurrencyCard
                key={currency.code}
                currencyCode={currency.code}
                isTracked={currency.isTracked}
                ask={currency.ask}
                bid={currency.bid}
              />
            ))}
        </div>
      </div>

      {/* Нижняя серая часть */}
      <div style={styles.bottomSection}>
        <h2 style={styles.sectionTitle}>Все валюты</h2>
        <div style={styles.currencyList}>
          {currencies
            .filter((currency) => !currency.isTracked)
            .map((currency) => (
              <CurrencyCard
                key={currency.code}
                currencyCode={currency.code}
                isTracked={currency.isTracked}
                ask={currency.ask}
                bid={currency.bid}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Home;