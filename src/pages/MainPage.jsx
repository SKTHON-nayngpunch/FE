import React from 'react';
import Header from '@components/main/header/Header';
import styles from '@components/main/MainPage.module.css';
import Deadline from '@components/main/Deadline';
import CarbonFootprint from '@components/main/CarbonFootprint';

export default function MainPage() {
  return (
    <>
      <div className={styles.mainPage}>
        <Header />
        <CarbonFootprint />
        <Deadline />
      </div>
    </>
  );
}
