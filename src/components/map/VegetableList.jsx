import React from 'react';
import { VEGETABLE_ICONS } from '../../data/vegetableIcons';
import styles from './VegetableList.module.css';

export default function VegetableList({
  vegetables = [],
  selectedVegetable,
  onVegetableClick,
}) {
  const getStatusText = (current, limit) => {
    if (current >= limit) return { text: '마감', className: 'closed' };
    if (current / limit >= 0.8)
      return { text: '마감임박', className: 'almostFull' };
    return { text: '모집중', className: 'recruiting' };
  };

  if (!vegetables || vegetables.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>🌱</div>
        <h3>표시할 채소가 없습니다</h3>
        <p>지도를 이동하여 다른 지역의 채소를 찾아보세요!</p>
      </div>
    );
  }

  return (
    <div className={styles.listContainer}>
      <div className={styles.listHeader}>
        <h2 className={styles.listTitle}>📋 나눔 목록</h2>
        <span className={styles.listCount}>{vegetables.length}개</span>
      </div>

      <div className={styles.vegetableGrid}>
        {vegetables.map((vegetable) => {
          const status = getStatusText(vegetable.current, vegetable.limit);
          const isSelected = selectedVegetable?.id === vegetable.id;
          const icon = VEGETABLE_ICONS[vegetable.item] || '🥬';

          return (
            <div
              key={vegetable.id}
              onClick={() => onVegetableClick?.(vegetable)}
              className={`${styles.vegetableCard} ${isSelected ? styles.selected : ''}`}
            >
              <div className={styles.cardHeader}>
                <div className={styles.cardIcon}>{icon}</div>
                <div className={styles.cardInfo}>
                  <h3 className={styles.cardTitle}>{vegetable.item} 나눔</h3>
                  <p className={styles.cardAuthor}>by {vegetable.author}</p>
                </div>
                <div
                  className={`${styles.statusBadge} ${styles[status.className]}`}
                >
                  {status.text}
                </div>
              </div>

              <div className={styles.cardAddress}>📍 {vegetable.address}</div>

              <div className={styles.cardFooter}>
                <span
                  className={`${styles.participationCount} ${
                    vegetable.current >= vegetable.limit
                      ? styles.closed
                      : styles.recruiting
                  }`}
                >
                  {vegetable.current}/{vegetable.limit}명 참여
                </span>
                <span className={styles.cardDate}>
                  {new Date(vegetable.createdAt).toLocaleDateString('ko-KR')}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
