import React from 'react';
import styles from './FreshnessInfo.module.css';

export default function FreshnessInfo({ score = 8 }) {
  return <div className={styles.freshness}>신선도: {score} / 10</div>;
}
