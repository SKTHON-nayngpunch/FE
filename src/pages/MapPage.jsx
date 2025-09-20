import { useState } from 'react';
import VegetableMap from '../components/map/VegetableMap';
import VegetableList from '../components/map/VegetableList';
import FloatingButton from '../components/ui/FloatingButton';
import BottomSheet from '../components/ui/BottomSheet';
import { SAMPLE_VEGETABLES } from '../data/mockVegetables';
import styles from '@components/map/MapPage.module.css';

export default function MapPage() {
  const [selectedVegetable, setSelectedVegetable] = useState(null);
  const [center, setCenter] = useState({ lat: 37.615095, lng: 127.013111 }); // 서경대학교
  const [level, setLevel] = useState(3); // 더 확대된 화면 (6 → 3)
  const [isListOpen, setIsListOpen] = useState(false);

  const handleMarkerClick = (vegetable) => {
    setSelectedVegetable(vegetable);
    console.log('선택된 채소 나눔:', vegetable);
  };

  const handleVegetableClick = (vegetable) => {
    setSelectedVegetable(vegetable);
    setCenter({ lat: vegetable.lat, lng: vegetable.lng });
    setLevel(3);
    setIsListOpen(false); // 리스트 닫기
  };

  const handleFloatingButtonClick = () => {
    setIsListOpen(true);
  };

  return (
    <div className={styles.pageContainer}>
      {/* 지도 */}
      <div className={styles.mapSection}>
        <VegetableMap
          center={center}
          level={level}
          vegetables={SAMPLE_VEGETABLES}
          onMarkerClick={handleMarkerClick}
        />
      </div>

      {/* 플로팅 버튼 */}
      <FloatingButton onClick={handleFloatingButtonClick}>📋</FloatingButton>

      {/* 바텀 시트 - 채소 목록 */}
      <BottomSheet
        isOpen={isListOpen}
        onClose={() => setIsListOpen(false)}
        height="60vh"
      >
        <VegetableList
          vegetables={SAMPLE_VEGETABLES}
          selectedVegetable={selectedVegetable}
          onVegetableClick={handleVegetableClick}
        />
      </BottomSheet>
    </div>
  );
}
