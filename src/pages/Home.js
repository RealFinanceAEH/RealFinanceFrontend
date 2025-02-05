import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import CurrencyCard from '../components/CurrencyCard';
import 'country-flag-icons/3x2/flags.css';
import { styles } from '../styles/styles';
import { getAllCurrencies, getFavoriteCurrencies, addFavoriteCurrency, removeFavoriteCurrency, getCurrencyHistory } from '../services/api';
import { getCurrencyData, saveCurrencyData, saveFavoriteCurrencies, getFavoriteCurrenciesFromDB } from '../services/db';

const Home = () => {
  const { currencies, setCurrencies, isOnline } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(true);
  const [favoriteCurrencies, setFavoriteCurrencies] = useState([]);

  // Функция для добавления/удаления валюты из избранного
  const handleToggleTrack = async (currencyCode) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Пользователь не авторизован');
        return;
      }

      const isTracked = favoriteCurrencies.includes(currencyCode);

      if (isTracked) {
        await removeFavoriteCurrency(currencyCode);
        setFavoriteCurrencies((prev) => prev.filter((code) => code !== currencyCode));
      } else {
        await addFavoriteCurrency(currencyCode);
        setFavoriteCurrencies((prev) => [...prev, currencyCode]);
      }

      // Обновляем состояние валют
      setCurrencies((prevCurrencies) =>
        prevCurrencies.map((currency) =>
          currency.code === currencyCode
            ? { ...currency, isTracked: !isTracked }
            : currency
        )
      );

      // Сохраняем избранные валюты в IndexedDB
      await saveFavoriteCurrencies(favoriteCurrencies);
    } catch (error) {
      console.error('Ошибка при изменении избранного:', error);
      alert('Не удалось изменить избранное');
    }
  };

  // Загрузка данных
  useEffect(() => {
    let isMounted = true; // Флаг для проверки, что компонент все еще смонтирован

    const fetchData = async () => {
      try {
        if (isOnline) {
          // Загружаем все валюты с сервера
          const data = await getAllCurrencies();
          const formattedCurrencies = Object.keys(data).map((code) => ({
            code,
            name: code,
            isTracked: false,
            ask: data[code].ask,
            bid: data[code].bid,
          }));

          // Загружаем избранные валюты
          const favorites = await getFavoriteCurrencies();
          if (isMounted) {
            setFavoriteCurrencies(favorites.favorite_currencies || []);
          }

          // Обновляем состояние валют
          const updatedCurrencies = formattedCurrencies.map((currency) => ({
            ...currency,
            isTracked: favorites.favorite_currencies.includes(currency.code),
          }));

          if (isMounted) {
            setCurrencies(updatedCurrencies);
          }

          // Сохраняем данные о валютах и их историю в IndexedDB
          await Promise.all(
            updatedCurrencies.map(async (currency) => {
              const history = await getCurrencyHistory(currency.code);
              await saveCurrencyData({
                ...currency,
                history, // Сохраняем историю курсов
              });
            })
          );

          // Сохраняем избранные валюты в IndexedDB
          await saveFavoriteCurrencies(favorites.favorite_currencies || []);
        } else {
          // Загружаем избранные валюты из IndexedDB
          const cachedFavorites = await getFavoriteCurrenciesFromDB();
          if (isMounted) {
            setFavoriteCurrencies(cachedFavorites);
          }

          // Загружаем данные избранных валют из IndexedDB
          const cachedCurrencies = await Promise.all(
            cachedFavorites.map(async (code) => {
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
                onToggleTrack={() => handleToggleTrack(currency.code)}
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
                onToggleTrack={() => handleToggleTrack(currency.code)}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Home;