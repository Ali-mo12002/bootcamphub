import  { useState } from 'react';
import styles from '../styles/home.module.css'; // CSS Modules
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import Auth from '../utils/auth'; // Adjust the path based on your project structure

const Home = () => {
  const [potentialVisible, setPotentialVisible] = useState(false);
  const [currentVisible, setCurrentVisible] = useState(false);
  const [graduateVisible, setGraduateVisible] = useState(false);

  const togglePotential = () => setPotentialVisible(!potentialVisible);
  const toggleCurrent = () => setCurrentVisible(!currentVisible);
  const toggleGraduate = () => setGraduateVisible(!graduateVisible);

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
    <div className={styles.home}>
      {Auth.loggedIn() ? (
        <>
          <div className={styles.login}>
            <a href="/" className={styles.navLink} onClick={logout}>
              Logout
            </a>
          </div>
          {/* Empty content when logged in */}
          <section className={styles.emptyContent}>
            <div className={styles.container}>
              <h2>Welcome!, {username} </h2>
              
              
            </div>
          </section>
        </>
      ) : (
        <>
          <div className={styles.login}>
            <Link to="/login" className={styles.navLink}>
              Log In
            </Link>
          </div>
          {/* Regular content when not logged in */}
          <section className={styles.hero}>
            <div className={styles.heroContent}>
              <h1>Bootcamp Hub</h1>
              <p>Your Ultimate Resource for Coding Bootcamps</p>
            </div>
          </section>

          <section className={styles.features}>
            <div className={styles.container}>
              <h2>Discover, Learn, Succeed</h2>

              <div className={styles.featureGroup}>
                <h3 onClick={togglePotential} className={styles.dropdownHeader}>
                  <FontAwesomeIcon icon={faChevronDown} className={styles.dropdownIcon} />
                  For Potential Students
                </h3>
                {potentialVisible && (
                  <ul className={styles.dropdownContent}>
                    <li><FontAwesomeIcon icon={faCheckCircle} className={styles.icon} /> Explore coding bootcamps and find out what others think about it</li>
                    <li><FontAwesomeIcon icon={faCheckCircle} className={styles.icon} /> Compare options and curricula</li>
                    <li><FontAwesomeIcon icon={faCheckCircle} className={styles.icon} /> Get expert advice to start your journey in tech</li>
                  </ul>
                )}
              </div>

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

              <div className={styles.featureGroup}>
                <h3 onClick={toggleGraduate} className={styles.dropdownHeader}>
                  <FontAwesomeIcon icon={faChevronDown} className={styles.dropdownIcon} />
                  For Graduates
                </h3>
                {graduateVisible && (
                  <ul className={styles.dropdownContent}>
                    <li><FontAwesomeIcon icon={faCheckCircle} className={styles.icon} /> Access job placement assistance</li>
                    <li><FontAwesomeIcon icon={faCheckCircle} className={styles.icon} /> Utilize career services and networking opportunities</li>
                  </ul>
                )}
              </div>
            </div>
          </section>

          <section className={styles.signUpLogin}>
            <div className={styles.container}>
              <h2>Get Started Today</h2>
              <p>Join Bootcamp Hub to connect with fellow students and alumni, access exclusive resources, and take the next step in your coding career.</p>

              <div className={styles.join}>
                <Link to="/register" className={styles.joinLink}>Sign Up</Link>
                <Link to="/login" className={styles.joinLink}>Log In</Link>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
    </>
  );
  
};

export default Home;
