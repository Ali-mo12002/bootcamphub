// src/pages/Home.jsx
import React, { useState } from 'react';
import styles from '../styles/home.module.css'; // CSS Modules
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const Home = () => {

     // State variables to manage dropdown visibility
  const [potentialVisible, setPotentialVisible] = useState(false);
  const [currentVisible, setCurrentVisible] = useState(false);
  const [graduateVisible, setGraduateVisible] = useState(false);

  // Toggle visibility functions
  const togglePotential = () => setPotentialVisible(!potentialVisible);
  const toggleCurrent = () => setCurrentVisible(!currentVisible);
  const toggleGraduate = () => setGraduateVisible(!graduateVisible);
  return (
    
    <div className={styles.home}>
      <div className={styles.login}>
      <Link to="/login" className={styles.navLink}>Login</Link>
      </div>
      <section className= {styles.hero}>
      
        <div className={styles.heroContent}>
          <h1>Bootcamp Hub</h1>
          <p>Your Ultimate Resource for Coding Bootcamps</p>
        </div>
      </section>

      <section className={styles.features}>
        <div className={styles.container}>
          <h2>Discover, Learn, Succeed</h2>

          {/* Potential Students Dropdown */}
          <div className={styles.featureGroup}>
            <h3 onClick={togglePotential} className={styles.dropdownHeader}>
              <FontAwesomeIcon icon={faChevronDown} className={styles.dropdownIcon} />
              For Potential Students
            </h3>
            {potentialVisible && (
              <ul className={styles.dropdownContent}>
                <li><FontAwesomeIcon icon={faCheckCircle} className={styles.icon} /> Explore top coding bootcamps</li>
                <li><FontAwesomeIcon icon={faCheckCircle} className={styles.icon} /> Compare options and curricula</li>
                <li><FontAwesomeIcon icon={faCheckCircle} className={styles.icon} /> Get expert advice to start your journey in tech</li>
              </ul>
            )}
          </div>

          {/* Current Students Dropdown */}
          <div className={styles.featureGroup}>
            <h3 onClick={toggleCurrent} className={styles.dropdownHeader}>
              <FontAwesomeIcon icon={faChevronDown} className={styles.dropdownIcon} />
              For Current Students
            </h3>
            {currentVisible && (
              <ul className={styles.dropdownContent}>
                <li><FontAwesomeIcon icon={faCheckCircle} className={styles.icon} /> Access additional learning resources</li>
                <li><FontAwesomeIcon icon={faCheckCircle} className={styles.icon} /> Connect with peers and collaborate</li>
                <li><FontAwesomeIcon icon={faCheckCircle} className={styles.icon} /> Prepare for success in your bootcamp</li>
              </ul>
            )}
          </div>

          {/* Graduates Dropdown */}
          <div className={styles.featureGroup}>
            <h3 onClick={toggleGraduate} className={styles.dropdownHeader}>
              <FontAwesomeIcon icon={faChevronDown} className={styles.dropdownIcon} />
              For Graduates
            </h3>
            {graduateVisible && (
              <ul className={styles.dropdownContent}>
                <li><FontAwesomeIcon icon={faCheckCircle} className={styles.icon} /> Access job placement assistance</li>
                <li><FontAwesomeIcon icon={faCheckCircle} className={styles.icon} /> Utilize career services and networking opportunities</li>
                <li><FontAwesomeIcon icon={faCheckCircle} className={styles.icon} /> Stay connected with the bootcamp community</li>
              </ul>
            )}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
