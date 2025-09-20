import React, { useState, useEffect } from 'react';
import styles from './FreshnessIndicator.module.css';
import freshnessIcon from '../../assets/images/detail/freshness-icon.svg';
import freshnessArrow from '../../assets/images/detail/freshness-arrow.svg';

export default function FreshnessIndicator({
  score = 66,
  label = '신선도 지수',
}) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    // 컴포넌트 마운트 후 애니메이션 시작
    const timer = setTimeout(() => {
      setIsAnimated(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isAnimated) {
      // 숫자 애니메이션: 0에서 score까지 1초 동안
      const duration = 1000;
      const steps = 60;
      const increment = score / steps;
      let currentStep = 0;

      const numberTimer = setInterval(() => {
        currentStep++;
        const newScore = Math.min(Math.round(increment * currentStep), score);
        setAnimatedScore(newScore);

        if (currentStep >= steps) {
          clearInterval(numberTimer);
        }
      }, duration / steps);

      return () => clearInterval(numberTimer);
    }
  }, [isAnimated, score]);

  return (
    <div className={styles.freshnessContainer}>
      <div className={styles.freshnessBar}>
        <div className={styles.freshnessProgress}></div>
      </div>
      <div className={styles.freshnessHeader}>
        <div className={styles.freshnessLabel}>{label}</div>
        <div className={styles.freshnessScore}>{animatedScore}%</div>
      </div>

      <div
        className={`${styles.freshnessIcon} ${isAnimated ? styles.animated : ''}`}
        style={{ '--target-position': `${score}%` }}
      >
        <img src={freshnessIcon} alt="신선도" />
        <img
          src={freshnessArrow}
          alt="화살표"
          className={styles.freshnessArrow}
        />
      </div>
    </div>
  );
}
