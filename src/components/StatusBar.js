import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const StatusBar = () => {
  const { isOnline, lastOnline } = useContext(AppContext);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: isOnline ? 'green' : 'red',
        color: 'white',
        textAlign: 'center',
        padding: '10px',
        zIndex: 1000,
      }}
    >
      {isOnline ? 'Онлайн' : `Оффлайн (последнее подключение: ${lastOnline})`}
    </div>
  );
};

export default StatusBar;