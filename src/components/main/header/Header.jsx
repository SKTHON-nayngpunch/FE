import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './header.module.css';
import logoImg from '../../../assets/images/header/Logo.png';
import searchImg from '../../../assets/images/header/search.png';
import penImg from '../../../assets/images/header/pen.png';

const Header = () => {
  const navigate = useNavigate();

  const handleWriteClick = () => {
    navigate('/edit');
  };

  const handleSearchClick = () => {
    navigate('/search');
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <img src={logoImg} alt="로고" />
      </div>
      <div className={styles.actions}>
        <button className={styles.searchButton} onClick={handleSearchClick}>
          <img src={searchImg} alt="검색" />
        </button>
        <button className={styles.writeButton} onClick={handleWriteClick}>
          <img src={penImg} alt="글쓰기" />
        </button>
      </div>
    </header>
  );
};

export default Header;
