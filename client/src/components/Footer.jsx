// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerSection}>
          <h4>About Bootcamp Hub</h4>
          <p>Bootcamp Hub is your ultimate resource for coding bootcamps, connecting potential students, current students, and graduates.</p>
        </div>
       
        <div className={styles.footerSection}>
          <h4>Quick Links</h4>
          <Link to="/">Home</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
        <div className={styles.footerSection}>
          <h4>Legal</h4>
          <p>Privacy Policy</p>
          <p>Terms of Service</p>
          <p>&copy; 2024 Bootcamp Hub. All rights reserved.</p>
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;
