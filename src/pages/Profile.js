import React, { useState, useEffect } from 'react';
import { styles } from '../styles/styles';
import { getProfile, getWallet, getTransactions, depositFunds, withdrawFunds } from '../services/api';
import {
    saveProfileData, getProfileData,
    saveBalanceData, getBalanceData,
    saveTransactionsData, getTransactionsData,
    saveProfilePhoto, getProfilePhoto
} from '../services/db'; // Added IndexedDB handling


const Profile = () => {
    const [isBalanceOpen, setIsBalanceOpen] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [profilePhoto, setProfilePhoto] = useState('https://surl.li/uwuvai'); // Placeholder for photo
    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
    });
    const [balance, setBalance] = useState({});
    /**
     * @typedef {Object} Transaction
     * @property {string} amount - Transaction amount.
     * @property {string} currency_code - Currency code (e.g., "EUR").
     * @property {string} final_currency_balance - Final balance after the transaction in the original currency.
     * @property {string} final_pln_balance - Final balance after the transaction in PLN.
     * @property {number} id - Unique transaction ID.
     * @property {string} timestamp - Transaction timestamp in UTC format.
     * @property {string} transaction_type - Transaction type, e.g., "buy" or "sell".
     */

    /**
     * @type {Transaction[]}
     */
    const [transactions, setTransactions] = useState([]);
    const [depositAmount, setDepositAmount] = useState('');

    // useEffect for loading data
    useEffect(() => {
        const fetchData = async () => {
            try {
                let profileData, walletData, transactionsData, storedPhoto;

                if (navigator.onLine) {
                    // Load online data and save them
                    profileData = await getProfile();
                    setUser({
                        firstName: profileData.firstname,
                        lastName: profileData.lastname,
                        email: profileData.email,
                        phone: profileData.phone,
                    });
                    await saveProfileData(profileData);

                    walletData = await getWallet();
                    setBalance(walletData);
                    await saveBalanceData(walletData);

                    transactionsData = await getTransactions();
                    setTransactions(transactionsData);
                    await saveTransactionsData(transactionsData);
                } else {
                    // Load offline data from IndexedDB
                    profileData = await getProfileData();
                    if (profileData) {
                        setUser({
                            firstName: profileData.firstname,
                            lastName: profileData.lastname,
                            email: profileData.email,
                            phone: profileData.phone,
                        });
                    }

                    walletData = await getBalanceData();
                    if (walletData) {
                        setBalance(walletData);
                    }

                    transactionsData = await getTransactionsData();
                    if (transactionsData) {
                        setTransactions(transactionsData);
                    }
                }

                // 📸 Load saved photo from IndexedDB using email
                storedPhoto = await getProfilePhoto(user.email); // Now using email
                if (storedPhoto) {
                    setProfilePhoto(storedPhoto);
                }
            } catch (error) {
                console.error('Error loading data:', error);
            }
        };

        fetchData();
    }, [user.email]); // Added dependency on user.email

// In Profile component
    const handleUploadPhoto = async () => {
        try {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*';
            fileInput.onchange = async (e) => {
                const file = e.target.files[0];
                if (file && user.email) { // Using user.email
                    const reader = new FileReader();
                    reader.onload = async (event) => {
                        const newPhoto = event.target.result;
                        setProfilePhoto(newPhoto);
                        await saveProfilePhoto(user.email, newPhoto); // Save photo linked to email
                    };
                    reader.readAsDataURL(file);
                }
            };
            fileInput.click();
        } catch (error) {
            console.error('Error uploading photo:', error);
        }
    };

    useEffect(() => {
        // Create a copy of the array
        const sortedTransactions = [...transactions];

        // Sort by timestamp from newest to oldest
        sortedTransactions.sort((a, b) => {
            const timestampA = new Date(a.timestamp);
            const timestampB = new Date(b.timestamp);

            return timestampB - timestampA;  // Sort from newest
        });

        // Check if the order has changed to avoid redundant updates
        if (JSON.stringify(sortedTransactions) !== JSON.stringify(transactions)) {
            setTransactions(sortedTransactions);
        }
    }, [transactions]);  // Watching for changes in transactions


    // Function for deposit
    // 🔹 Function for deposit
    const handleDeposit = async () => {
        if (!depositAmount || isNaN(depositAmount) || depositAmount <= 0) {
            alert('Enter a valid amount for deposit');
            return;
        }

        try {
            await depositFunds(parseFloat(depositAmount));
            const walletData = await getWallet();
            setBalance(walletData); // Update the balance object
            alert('Balance successfully deposited');
            setDepositAmount('');
        } catch (error) {
            console.error('Error depositing balance:', error);
            alert('Failed to deposit balance');
        }
    };

    const handleWithdraw = async () => {
        console.log(balance.PLN)
        console.log(depositAmount);
        if (!depositAmount || isNaN(depositAmount) || depositAmount <= 0 || parseFloat(depositAmount) > parseFloat(balance.PLN)) {
            alert('Enter a valid amount for withdrawal');
            return;
        }

        try {
            await withdrawFunds(parseFloat(depositAmount));
            const walletData = await getWallet();
            setBalance(walletData); // Update the balance object
            alert('Balance successfully withdrawn');
            setDepositAmount('');
        } catch (error) {
            console.error('Error withdrawing money from account:', error);
            alert('Failed to withdraw money from account');
        }
    };

    return (
        <div style={styles.profileContainer}>
            {/* Profile photo and user data block */}
            <div style={styles.profileSection}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <img src={profilePhoto} alt="Profile photo" style={styles.profilePhoto} />
                    <div>
                        <h2 style={styles.profileName}>{user.firstName} {user.lastName}</h2>
                        <p style={styles.profileEmail}>{user.email}</p>
                        <p style={styles.profilePhone}>{user.phone}</p>
                    </div>
                </div>
                <button onClick={handleUploadPhoto} style={styles.uploadButton}>
                    Upload Photo
                </button>
            </div>

            {/* Balance block */}
            <div style={styles.profileSection}>
                <div
                    style={styles.profileSectionHeader}
                    onClick={() => setIsBalanceOpen(!isBalanceOpen)}
                >
                    <h3 style={styles.profileSectionTitle}>Balance</h3>
                    <span>{isBalanceOpen ? '▲' : '▼'}</span>
                </div>
                {isBalanceOpen && (
                    <div style={styles.profileSectionContent}>
                        {balance && Object.keys(balance).map((currency) => (
                            <p key={currency}>
                                {currency}: {balance[currency]}
                            </p>
                        ))}
                        <div style={{ marginTop: '10px', justifyContent: 'space-between' }}>
                            <input
                                type="number"
                                value={depositAmount}
                                onChange={(e) => setDepositAmount(e.target.value)}
                                placeholder="Enter amount"
                                style={{ padding: '5px', marginRight: '10px' }}
                            />
                            <button onClick={handleDeposit} style={styles.uploadButton}>
                                Deposit
                            </button>
                            <button onClick={handleWithdraw} style={styles.uploadButton}>
                                Withdraw
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Transaction history block */}
            <div style={styles.profileSection}>
                <div
                    style={styles.profileSectionHeader}
                    onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                >
                    <h3 style={styles.profileSectionTitle}>Transaction History</h3>
                    <span>{isHistoryOpen ? '▲' : '▼'}</span>
                </div>
                {isHistoryOpen && (
                    <div style={styles.profileSectionContent}>
                        {transactions.map((transaction) => (
                            <div key={transaction.id} style={styles.transactionItem}>
                                <p><strong>Date: {new Date(transaction.timestamp).toLocaleString()}</strong></p>
                                <p>
                                    {transaction.transaction_type === "buy" ? "Bought" : "Sold"}:
                                    {parseFloat(transaction.amount).toString()} {transaction.currency_code}
                                </p>
                                <p>
                                    Final currency balance: {parseFloat(transaction.final_currency_balance).toString()} {transaction.currency_code}
                                </p>
                                <p>
                                    Final PLN balance: {parseFloat(transaction.final_pln_balance).toString()} PLN
                                </p>
                                {transaction.price && (
                                    <p>
                                        Price: {parseFloat(transaction.price).toString()} {transaction.currency_code} per unit
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
