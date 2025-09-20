import React from 'react';
import styles from './FloatingButton.module.css';

export default function FloatingButton({ onClick, children, className }) {
  return (
    <button
      className={`${styles.floatingButton} ${className || ''}`}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}
