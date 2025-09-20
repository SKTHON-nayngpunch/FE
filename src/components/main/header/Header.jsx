import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './header.module.css';

const Header = () => {
  const navigate = useNavigate();

  const handleWriteClick = () => {
    navigate('/edit');
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <img src="/src/assets/images/header/Logo.png" alt="로고" />
      </div>
      <div className={styles.actions}>
        <button className={styles.searchButton}>
          <img src="/src/assets/images/header/search.png" alt="검색" />
        </button>
        <button className={styles.writeButton} onClick={handleWriteClick}>
          <img src="/src/assets/images/header/pen.png" alt="글쓰기" />
        </button>
      </div>
    </header>
  );
};

export default Header;
