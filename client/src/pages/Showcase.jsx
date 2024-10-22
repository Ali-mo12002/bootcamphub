import React from 'react';
import Header from '../components/Header'; // Adjust path as needed
import Sidebar from '../components/Sidebar';
import styles from '../styles/showcase.module.css'; // Example styling module

const Showcase = () => {
    return (
        <div>
        <Header/>
    <div className={styles.div}>

        <Sidebar/>
        <div className={styles.contentdiv}>
         <h1>Showcase</h1>
            <div className={styles.createbtncontainer}>
                <button className={styles.createbtn}>Create showcase</button>
            
            </div>
         </div>
        {/* Your content here */}
      </div>
      </div>
    );
  };
  
  export default Showcase; // Ensure there is a default export
  