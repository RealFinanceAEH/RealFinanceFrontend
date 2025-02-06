import React from 'react';
import { createRoot } from 'react-dom/client'; // Импортируем createRoot
import App from './App';
import { AppProvider } from './context/AppContext';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const container = document.getElementById('root');
const root = createRoot(container); // Используем createRoot

root.render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>
);

// Регистрируем сервис-воркер
serviceWorkerRegistration.register();