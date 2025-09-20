import React from 'react';
import styles from './TimeBox.module.css';

export default function TimeBox({ hours = 17, minutes = 38 }) {
  return (
    <div className={styles.timeBox}>
      <div className={styles.timeText}>
        남은 시간 : {hours}시간 {minutes}분
      </div>
    </div>
  );
}
