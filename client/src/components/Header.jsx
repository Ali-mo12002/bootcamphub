// src/components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/header.module.css'; 
import Auth from '../utils/auth'; // Adjust the path based on your project structure
import { Dropdown } from "flowbite-react";

const Header = () => {
  const logout = (event) => {
    event.preventDefault();
    Auth.logout();
  };
  let username = ''
  if(Auth.loggedIn() === true){
  const user = Auth.getProfile();
  username = user.data.username
  }
  return (
      <>
        {Auth.loggedIn() ? (
          <>
  
            <header className={styles.header}>
                <div className={styles.container}>
                  <Link to="/" className={styles.logo}>Bootcamp Hub</Link>
                  <nav className={styles.nav}>
                    <Dropdown label={username}dismissOnClick={false} className={styles.dropdown}>
                      <Dropdown.Item className= {styles.dropdownItem}>Profile</Dropdown.Item>
                      <Dropdown.Item className={styles.dropdownItem}>Settings</Dropdown.Item>
                      <Dropdown.Item className={styles.dropdownItem}> Sign out</Dropdown.Item>
                    </Dropdown>                    
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
