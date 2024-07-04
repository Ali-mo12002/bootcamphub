import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_USER } from '../utils/queries'; // Adjust the path based on your project structure
import styles from '../styles/getStarted.module.css'; // Ensure you have corresponding CSS

const GetStarted = () => {
  const { loading, error, data } = useQuery(GET_USER);
  const [step, setStep] = useState(1); // State to track the current step
  const [city, setCity] = useState('');
  const [bootcampType, setBootcampType] = useState('');
  const [bootcampName, setBootcampName] = useState('');
  const [bootcampProvider, setBootcampProvider] = useState('');

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching user data</p>;

  const { username, userStatus } = data.me;

  const handleNext = () => {
    setStep(step + 1); // Move to the next step
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log({
      userStatus,
      city,
      bootcampType,
      bootcampName,
      bootcampProvider
    });
    // Additional logic to handle form submission (e.g., send data to backend)
  };

  const renderFormFields = () => {
    switch (step) {
      case 1:
        return (
          <>
            <label htmlFor="city">What city do you want to learn in</label>
            <input
              type="text"
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <button type="button" onClick={handleNext}>Next</button>
          </>
        );
      case 2:
        if (userStatus === 'potential') {
          return (
            <>
              <label htmlFor="bootcampType">Type of Bootcamp:</label>
              <select
                id="bootcampType"
                value={bootcampType}
                onChange={(e) => setBootcampType(e.target.value)}
              >
                <option value="">Select a type</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="online">Online</option>
              </select>
              <button type="button" onClick={handleNext}>Next</button>
            </>
          );
        } else {
          return (
            <>
              <label htmlFor="bootcampName">Bootcamp Name:</label>
              <input
                type="text"
                id="bootcampName"
                value={bootcampName}
                onChange={(e) => setBootcampName(e.target.value)}
              />
              <button type="button" onClick={handleNext}>Next</button>
            </>
          );
        }
      case 3:
        if (userStatus === 'potential') {
          return (
            <>
              <label htmlFor="bootcampName">Bootcamp Name:</label>
              <input
                type="text"
                id="bootcampName"
                value={bootcampName}
                onChange={(e) => setBootcampName(e.target.value)}
              />
              <button type="button" onClick={handleNext}>Next</button>
            </>
          );
        } else {
          return (
            <>
              <label htmlFor="bootcampProvider">Bootcamp Provider:</label>
              <input
                type="text"
                id="bootcampProvider"
                value={bootcampProvider}
                onChange={(e) => setBootcampProvider(e.target.value)}
              />
              <button type="submit">Submit</button>
            </>
          );
        }
      default:
        return null;
    }
  };

  return (
    <div className={styles.getStarted}>
      <div className={styles.getStartedContent}>
        <h2>Thanks for joining, {username}!</h2>
        <p>To help you get the best experience possible we need some information.</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.getStartedForm}>
        {renderFormFields()}
      </form>
    </div>
  );
};

export default GetStarted;
