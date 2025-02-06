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
  const [searchInput, setSearchInput] = useState('');

  // Handle toggle track of a currency
  const handleToggleTrack = async (currencyCode) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('User is not authorized');
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

      // Update currency states
      setCurrencies((prevCurrencies) =>
          prevCurrencies.map((currency) =>
              currency.code === currencyCode
                  ? { ...currency, isTracked: !isTracked }
                  : currency
          )
      );

      // Save favorite currencies to IndexedDB
      await saveFavoriteCurrencies(favoriteCurrencies);
    } catch (error) {
      console.error('Error updating favorites:', error);
      alert('Failed to update favorites');
    }
  };

  // Fetch data
  useEffect(() => {
    let isMounted = true;

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

          await Promise.all(
              updatedCurrencies.map(async (currency) => {
                const history = await getCurrencyHistory(currency.code);
                await saveCurrencyData({
                  ...currency,
                  history,
                });
              })
          );

          // Save favorite currencies to IndexedDB
          await saveFavoriteCurrencies(favorites.favorite_currencies || []);
        } else {
          const cachedFavorites = await getFavoriteCurrenciesFromDB();
          if (isMounted) {
            setFavoriteCurrencies(cachedFavorites);
          }

          // Load favorite currencies data from IndexedDB
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
        console.error('Error loading data:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [isOnline]);

  useEffect(() => {
    const isFirstLogin = localStorage.getItem('isFirstLogin');

    if (isFirstLogin === null || isFirstLogin === 'true') {
      localStorage.setItem('isFirstLogin', 'false');

      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification('Hello!', {
            body: 'You have successfully logged in!',
          });
        }
      });
    }
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleSearchChange = (event) => {
    setSearchInput(event.target.value);
  };

  const filterCurrencyBySearch = (currency, searchInput) => {
    if (!searchInput) return true;
    const lowerCaseSearchInput = searchInput.toLowerCase();
    const lowerCaseCurrencyCode = currency.code.toLowerCase();
    return lowerCaseCurrencyCode.includes(lowerCaseSearchInput);
  };

  return (
      <div style={styles.homeContainer}>

        <div style={styles.searchContainer}>
          <input style={styles.searchInput}
                 type="text"
                 placeholder="Enter search query..."
                 value={searchInput}
                 onChange={handleSearchChange}
          />
        </div>

        {/* Top section with tracked currencies */}
        <div style={styles.topSection}>
          <h1>Tracked Currencies</h1>
          <div style={styles.currencyList}>
            {currencies
                .filter((currency) => currency.isTracked && filterCurrencyBySearch(currency, searchInput))
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

        {/* Bottom section with all currencies */}
        <div style={styles.bottomSection}>
          <h2 style={styles.sectionTitle}>All Currencies</h2>
          <div style={styles.currencyList}>
            {currencies
                .filter((currency) => !currency.isTracked && filterCurrencyBySearch(currency, searchInput))
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
