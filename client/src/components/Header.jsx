// src/components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/header.module.css'; 
import Auth from '../utils/auth'; // Adjust the path based on your project structure

const Header = () => {
  const logout = (event) => {
    event.preventDefault();
    Auth.logout();
  };
  return (
      <>
        {Auth.loggedIn() ? (
          <>
  
            <header className={styles.header}>
                <div className={styles.container}>
                  <Link to="/" className={styles.logo}>Bootcamp Hub</Link>
                  <nav className={styles.nav}>
                    <a href="/" onClick={logout} className={styles.navLink}>Logout</a>
                    
                  </nav>
                </div>
              </header>
          </>
        ) : (
          <>
              <header className={styles.header}>
                <div className={styles.container}>
                  <Link to="/" className={styles.logo}>Bootcamp Hub</Link>
                  <nav className={styles.nav}>
                    <Link to="/login" className={styles.navLink}>Login</Link>
                    <Link to="/register" className={styles.navLink}>Register</Link>
                  </nav>
                </div>
              </header>
          </>
        )}
        </>
  );
};

export default Header;
