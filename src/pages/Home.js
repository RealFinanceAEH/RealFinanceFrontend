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
          setFavoriteCurrencies(favorites.favorite_currencies || []);

          setCurrencies(
            formattedCurrencies.map((currency) => ({
              ...currency,
              isTracked: favorites.favorite_currencies.includes(currency.code),
            }))
          );

          // Сохраняем данные о валютах в IndexedDB
          formattedCurrencies.forEach((currency) => saveCurrencyData(currency));
        } else {
          // Загружаем данные из кэша
          const cachedCurrencies = await Promise.all(
            favoriteCurrencies.map((code) => getCurrencyData(code))
          );
          setCurrencies(cachedCurrencies.filter((currency) => currency));
        }
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isOnline, setCurrencies, favoriteCurrencies, saveCurrencyData, getCurrencyData]);

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