// src/pages/Register.jsx

import  { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header'; // Assuming you have a Header component
import styles from '../styles/register.module.css'; // Example styling module
import Auth from '../utils/auth'
const REGISTER_USER = gql`
  mutation Register($username: String!, $email: String!, $password: String!, $userStatus: String!) {
    register(registerInput: { username: $username, email: $email, password: $password, userStatus: $userStatus }) {
      token
      
    }
  }
`;

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    userStatus: '',
  });
  const [register, { loading, error }] = useMutation(REGISTER_USER);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await register({
        variables: {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          userStatus: formData.userStatus,
        },
      });
      const { token } = data.register;
      // Optionally redirect to another page after successful registration
      Auth.login(token);

      navigate('/'); // Redirect to home page
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  return (
    <div>
      <Header />
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
          <button type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
          {error && <p>Error: {error.message}</p>}
        </form>
        <p>Already have an account? <Link to="/login">Login here</Link></p>
      </div>
    </div>
  );
};

export default Register;
