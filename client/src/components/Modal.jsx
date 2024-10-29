import React from 'react';
import styles from '../styles/modal.module.css'; // Ensure you create a CSS file for modal styles

const Modal = ({ onClose, children }) => {
    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={onClose}>&times;</button>
                {children}
            </div>
        </div>
    );
};

export default Modal;
