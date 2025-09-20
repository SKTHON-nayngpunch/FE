import React from 'react';
import styles from './header.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <img src="/src/assets/images/header/Logo.png" alt="로고" />
      </div>
      <div className={styles.actions}>
        <button className={styles.searchButton}>
          <img src="/src/assets/images/header/search.png" alt="검색" />
        </button>
        <button className={styles.writeButton}>
          <img src="/src/assets/images/header/pen.png" alt="글쓰기" />
        </button>
      </div>
    </header>
  );
};

export default Header;
