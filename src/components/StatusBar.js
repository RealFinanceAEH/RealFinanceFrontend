import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';

const StatusBar = () => {
    const { isOnline, lastOnline } = useContext(AppContext);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (isOnline) {
            setIsVisible(true);
            const timeout = setTimeout(() => setIsVisible(false), 3000);
            return () => clearTimeout(timeout);
        } else {
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
                transition: 'opacity 1s ease-in-out, transform 1s ease-in-out',
                transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
            }}
        >
            {isOnline ? 'Online' : `Offline (last connected: ${lastOnline})`}
        </div>
    );
};

export default StatusBar;
