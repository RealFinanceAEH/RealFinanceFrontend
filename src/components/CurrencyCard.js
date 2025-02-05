import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import Flags from 'country-flag-icons/react/3x2';
import { styles } from '../styles/styles';

const CurrencyCard = ({ currencyCode, isTracked, onToggleTrack, ask, bid }) => {
  const navigate = useNavigate();
  const { currencies } = useContext(AppContext);

  const currencyData = currencies.find((currency) => currency.code === currencyCode);

  if (!currencyData) {
    return null;
  }

  const countryFlags = {
    USD: Flags.US,
    EUR: Flags.EU,
    GBP: Flags.GB,
    PLN: Flags.PL,
  };

  const FlagIcon = countryFlags[currencyCode] || Flags.US;

  return (
    <div style={styles.currencyCard} onClick={() => navigate(`/currency/${currencyCode}`)}>
      <div style={styles.currencyInfo}>
        <FlagIcon style={{ width: '30px', height: '20px' }} />
        <div>
          <h3 style={{ margin: 0 }}>{currencyData.name} {currencyData.code}</h3>
          <p style={styles.currencyRate}>
            Покупка: {ask} PLN | Продажа: {bid} PLN
          </p>
        </div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleTrack();
        }}
        style={{ ...styles.heartButton, ...(isTracked ? styles.heartButtonActive : {}) }}
      >
        {isTracked ? '❤️' : '🤍'}
      </button>
    </div>
  );
};

export default CurrencyCard;