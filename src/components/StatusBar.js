import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';

const StatusBar = () => {
    const { isOnline, lastOnline } = useContext(AppContext);
    const [isVisible, setIsVisible] = useState(true); // Устанавливаем, что плашка всегда видна в начале

    useEffect(() => {
        if (isOnline) {
            // Если соединение восстановилось, показываем плашку с анимацией
            setIsVisible(true);
            // Затем скрываем через 3 секунды
            const timeout = setTimeout(() => setIsVisible(false), 3000);
            return () => clearTimeout(timeout);
        } else {
            // Если оффлайн, плашка остается видимой, пока статус не станет онлайн
            setIsVisible(true);
        }
    }, [isOnline]);

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
                opacity: isVisible ? 1 : 0,
                transition: 'opacity 1s ease-in-out, transform 1s ease-in-out', // Плавное исчезновение и появление
                transform: isVisible ? 'translateY(0)' : 'translateY(-100%)', // Плавное перемещение вверх
            }}
        >
            {isOnline ? 'Онлайн' : `Оффлайн (последнее подключение: ${lastOnline})`}
        </div>
    );
};

export default StatusBar;
