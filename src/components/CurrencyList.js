// import React, { useContext } from 'react';
// import { AppContext } from '../context/AppContext';
// import CurrencyCard from '../CurrencyCard';

// /**
//  * Компонент для отображения списка валют.
//  * Отслеживаемые валюты отображаются выше остальных.
//  */
// const CurrencyList = () => {
//   const { currencies } = useContext(AppContext);

//   // Пример данных (замените на реальные данные из API)
//   const trackedCurrencies = ['USD', 'EUR']; // Отслеживаемые валюты
//   const otherCurrencies = currencies.filter(
//     (currency) => !trackedCurrencies.includes(currency.code)
//   );

//   return (
//     <div>
//       <h2>Отслеживаемые валюты</h2>
//       {trackedCurrencies.map((code) => (
//         <CurrencyCard key={code} currencyCode={code} />
//       ))}

//       <h2>Другие валюты</h2>
//       {otherCurrencies.map((currency) => (
//         <CurrencyCard key={currency.code} currencyCode={currency.code} />
//       ))}
//     </div>
//   );
// };

// export default CurrencyList;