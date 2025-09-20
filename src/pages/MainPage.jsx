import React from 'react';
import { Link } from 'react-router-dom';
import styles from './MainPage.module.css';

export default function MainPage() {
  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.title}>🥕 채소 나눔</h1>

      <p className={styles.description}>
        우리 동네에서 신선한 채소를 나누고 받아보세요!
        <br />
        지도에서 쉽게 찾고 참여할 수 있습니다.
      </p>

      <div className={styles.buttonContainer}>
        <Link
          to="/map"
          className={`${styles.linkButton} ${styles.primaryButton}`}
        >
          🗺️ 채소 나눔 지도 보기
        </Link>
      </div>

      <div className={styles.featuresSection}>
        <h2 className={styles.featuresTitle}>✨ 주요 기능</h2>

        <div className={styles.featuresGrid}>
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>🗺️</div>
            <h3 className={styles.featureTitle}>지도 기반 탐색</h3>
            <p className={styles.featureDescription}>
              카카오맵으로 주변 채소 나눔을 쉽게 찾아보세요
            </p>
          </div>

          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>🥕</div>
            <h3 className={styles.featureTitle}>다양한 채소</h3>
            <p className={styles.featureDescription}>
              양파, 당근, 대파 등 신선한 채소를 나누어요
            </p>
          </div>

          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>👥</div>
            <h3 className={styles.featureTitle}>참여 현황</h3>
            <p className={styles.featureDescription}>
              실시간으로 참여 인원을 확인할 수 있어요
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
