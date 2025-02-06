export const styles = {
    menuButton: {
      position: 'fixed',
      top: '60px',
      left: '10px',
      backgroundColor: '#007BFF',
      border: 'none',
      borderRadius: '5px',
      padding: '10px',
      cursor: 'pointer',
      zIndex: 1001,
    },

    menuIcon: {
      width: '20px',
      height: '2px',
      backgroundColor: 'white',
      margin: '4px 0',
    },

    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 1002,
    },

    sideMenu: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '300px',
      height: '100vh',
      backgroundColor: 'white',
      boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
      zIndex: 1003,
      transition: 'left 0.3s',
    },

    mainContent: {
      flex: 1,
      width: '100%',
      transition: 'margin-left 0.3s',
    },

    userInfo: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '20px',
    },
  
    userPhoto: {
      width: '50px',
      height: '50px',
      borderRadius: '50%',
      marginRight: '10px',
    },
  
    userName: {
      margin: 0,
    },
  
    userEmail: {
      margin: 0,
      color: '#666',
      fontSize: '14px',
    },

    menuList: {
      listStyle: 'none',
      padding: 0,
      flex: 1,
    },
  
    menuItem: {
      borderBottom: '1px solid #eee',
      padding: '10px 0',
    },
  
    menuLink: {
      textDecoration: 'none',
      color: 'black',
    },

    logoutButton: {
      backgroundColor: '#f44336',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      border: 'none',
      cursor: 'pointer',
      marginTop: 'auto',
    },

    currencyCard: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px',
      backgroundColor: 'white',
      borderRadius: '10px',
      marginBottom: '10px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      cursor: 'pointer',
    },
  
    currencyInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
  
    currencyRate: {
      margin: 0,
      fontWeight: 'bold',
    },
  
    heartButton: {
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
      color: 'gray',
      fontSize: '24px',
    },
  
    heartButtonActive: {
      color: 'red',
    },

  homeContainer: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    marginTop: "30px",
    padding: "20px"
  },

  searchContainer: {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
  },

  searchInput: {
      width: '60%',
      height: '25px',
      minWidth: "200px",
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      borderRadius: '10px',
      boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
  },

  topSection: {
    flex: 1,
    backgroundColor: '#007BFF',
    padding: '20px',
    marginTop: "20px",
    color: 'black',
    borderTopLeftRadius: '25px',
    borderTopRightRadius: '25px',
  },

  bottomSection: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: '20px',
  },

  sectionTitle: {
    color: 'black',
  },

  currencyList: {
    marginTop: '10px',
  },

formContainer: {
    maxWidth: '400px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },

  formTitle: {
    textAlign: 'center',
    marginBottom: '20px',
  },

  formInput: {
    width: '100%',
    padding: '10px',
    marginBottom: '15px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontSize: '16px',
  },

  formButton: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
  },

  formButtonHover: {
    backgroundColor: '#0056b3',
  },

  formError: {
    color: 'red',
    marginBottom: '10px',
    textAlign: 'center',
  },

  profileContainer: {
    display: 'flex',
    minHeight: "70vw",
    flexDirection: 'column',
    alignItems: 'center',
    padding: '40px',
    backgroundColor: "#F2F2F2",
},

  profilePhoto: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    objectFit: 'cover',
  },

  profileName: {
    fontSize: '24px',
    margin: 0,
  },

  profileEmail: {
    color: '#666',
    margin: '5px 0',
  },

  profilePhone: {
    color: '#666',
    margin: '5px 0',
  },

  profileSection: {
    width: '100%',
    maxWidth: '600px',
    margin: '20px 0',
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    padding: '20px',
  },

  profileSectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
  },

  profileSectionTitle: {
    fontSize: '18px',
    margin: 0,
  },

  profileSectionContent: {
    marginTop: '10px',
  },

  transactionItem: {
    borderBottom: "2px solid black",
  },

  uploadButton: {
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    padding: '10px 20px',
    cursor: 'pointer',
    fontSize: '16px',
    marginLeft: '10px',
    marginTop: '10px',
  },

  uploadButtonHover: {
    backgroundColor: '#0056b3',
  },

  periodButton: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    margin: '5px',
    transition: 'background-color 0.3s',
  },

  periodButtonActive: {
    backgroundColor: '#0056b3',
  },

  buyButton: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },

  sellButton: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },

  buyButtonHover: {
    backgroundColor: '#45a049',
  },

  sellButtonHover: {
    backgroundColor: '#d32f2f',
  },

  periodButtonsContainer: {
    display: 'flex',
    justifyContent: 'center',
    margin: '20px 0',
  },

  actionButtonsContainer: {
    display: 'flex',
    gap: '50px',
    marginTop: '20px',
    justifyContent: 'center',

  },

  title: {
    fontFamily: 'Roboto, sans-serif',
    fontSize: '24px',
    color: '#333',
  },

  subtitle: {
    fontFamily: 'Roboto, sans-serif',
    fontSize: '18px',
    color: '#555',
  },

  centeredButtonContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: "20px",
  },

  centeredButton: {
    display: "block",
    textAlign: "center",
  },

  toggleButton: {
    position: "absolute",
    right: "1%",
    top: "40%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "5px",
    display: "flex",
    alignItems: "center",
  },

  inputWrapper: {
    position: "relative",
    width: "100%",
  }

};

