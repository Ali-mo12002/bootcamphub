// src/pages/Register.jsx
import React, { useState } from 'react';
import styles from '../styles/register.module.css';
import Header from '../components/Header'

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    userStatus: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic
    console.log('Form submitted', formData);
  };

  return (
    
    <div >
        
       <section>
       <Header/>

        </section> 
        <div className={styles.register}>

      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="userStatus">I am a:</label>
          <select
            id="userStatus"
            name="userStatus"
            value={formData.userStatus}
            onChange={handleChange}
            required
          >
            <option value="">Select your status</option>
            <option value="potential">Potential Student</option>
            <option value="current">Current Student</option>
            <option value="graduate">Graduate</option>
          </select>
        </div>
        <button type="submit">Register</button>
      </form>
      </div>
    </div>
  );
};

export default Register;
