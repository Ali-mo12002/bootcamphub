// src/components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/header.module.css'; 

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>Bootcamp Hub</Link>
        <nav className={styles.nav}>
          <Link to="/bootcamps" className={styles.navLink}>Bootcamps</Link>
          <Link to="/login" className={styles.navLink}>Login</Link>
          <Link to="/register" className={styles.navLink}>Register</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
