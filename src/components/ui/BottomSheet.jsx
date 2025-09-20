import React, { useEffect, useRef } from 'react';
import styles from './BottomSheet.module.css';

export default function BottomSheet({
  isOpen,
  onClose,
  children,
  title,
  height = '50vh',
}) {
  const sheetRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className={styles.overlay}
      onClick={handleOverlayClick}
    >
      <div
        ref={sheetRef}
        className={`${styles.bottomSheet} ${isOpen ? styles.open : ''}`}
        style={{ height }}
      >
        {/* 드래그 핸들 */}
        <div className={styles.dragHandle}>
          <div className={styles.handleBar}></div>
        </div>

        {/* 헤더 */}
        {title && (
          <div className={styles.header}>
            <h2 className={styles.title}>{title}</h2>
            <button
              className={styles.closeButton}
              onClick={onClose}
              type="button"
            >
              ✕
            </button>
          </div>
        )}

        {/* 컨텐츠 */}
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
