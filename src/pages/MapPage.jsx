import { useState } from 'react';
import VegetableMap from '../components/map/VegetableMap';
import styles from './MapPage.module.css';

// 채소별 이모지 아이콘 매핑
const VEGETABLE_ICONS = {
  // 뿌리채소
  양파: '🧅',
  당근: '🥕',
  감자: '🥔',
  고구마: '🍠',
  무: '🫘',
  순무: '🫘',
  비트: '🫘',
  생강: '🫚',
  마늘: '🧄',

  // 잎채소
  배추: '🥬',
  상추: '🥗',
  시금치: '🥬',
  케일: '🥬',
  청경채: '🥬',
  깻잎: '🌿',
  쑥갓: '🌿',
  미나리: '🌿',
  부추: '🌿',
  대파: '🌿',
  쪽파: '🌿',
  파슬리: '🌿',
  바질: '🌿',
  로즈마리: '🌿',
  민트: '🌿',

  // 과채소
  토마토: '🍅',
  오이: '🥒',
  호박: '🎃',
  애호박: '🥒',
  가지: '🍆',
  피망: '🫑',
  파프리카: '🫑',
  고추: '🌶️',
  청양고추: '🌶️',
  꽈리고추: '🌶️',

  // 콩류
  완두콩: '🟢',
  강낭콩: '🫘',
  콩나물: '🌱',
  숙주나물: '🌱',

  // 버섯류
  버섯: '🍄',
  팽이버섯: '🍄',
  새송이버섯: '🍄',
  표고버섯: '🍄',
  느타리버섯: '🍄',

  // 양념채소
  생강: '🫚',
  마늘: '🧄',
  양파: '🧅',

  // 기타 채소
  브로콜리: '🥦',
  콜리플라워: '🥦',
  양배추: '🥬',
  옥수수: '🌽',
  죽순: '🎋',
  연근: '🪷',
  도라지: '🌿',
  더덕: '🌿',
  우엉: '🌿',

  // 해조류
  미역: '🌊',
  김: '🌊',
  다시마: '🌊',

  // 새싹채소
  콩나물: '🌱',
  숙주나물: '🌱',
  무순: '🌱',
  브로콜리새싹: '🌱',

  // 기본값
  채소: '🥬',
};

// 샘플 채소 나눔 데이터 (서버에서 받아올 데이터 형태)
const SAMPLE_VEGETABLES = [
  {
    id: 1,
    item: '양파',
    lat: 37.5665,
    lng: 126.978,
    current: 2,
    limit: 5,
    address: '서울특별시 중구 세종대로 110',
    author: '김농부',
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 2,
    item: '당근',
    lat: 37.57,
    lng: 126.982,
    current: 3,
    limit: 4,
    address: '서울특별시 종로구 종로 1',
    author: '이채소',
    createdAt: '2024-01-15T11:15:00Z',
  },
  {
    id: 3,
    item: '대파',
    lat: 37.563,
    lng: 126.975,
    current: 1,
    limit: 3,
    address: '서울특별시 중구 명동2가 50-14',
    author: '박나눔',
    createdAt: '2024-01-15T09:45:00Z',
  },
  {
    id: 4,
    item: '배추',
    lat: 37.572,
    lng: 126.976,
    current: 4,
    limit: 4,
    address: '서울특별시 종로구 청진동 85',
    author: '최김치',
    createdAt: '2024-01-14T16:20:00Z',
  },
  {
    id: 5,
    item: '감자',
    lat: 37.564,
    lng: 126.985,
    current: 0,
    limit: 6,
    address: '서울특별시 중구 을지로 281',
    author: '정감자',
    createdAt: '2024-01-15T14:10:00Z',
  },
  {
    id: 6,
    item: '토마토',
    lat: 37.569,
    lng: 126.973,
    current: 2,
    limit: 5,
    address: '서울특별시 종로구 인사동길 12',
    author: '한토마',
    createdAt: '2024-01-15T12:30:00Z',
  },
  {
    id: 7,
    item: '오이',
    lat: 37.561,
    lng: 126.981,
    current: 3,
    limit: 3,
    address: '서울특별시 중구 남대문로 73',
    author: '신오이',
    createdAt: '2024-01-15T08:45:00Z',
  },
];

export default function MapPage() {
  const [selectedVegetable, setSelectedVegetable] = useState(null);
  const [center, setCenter] = useState({ lat: 37.5665, lng: 126.978 });
  const [level, setLevel] = useState(6);

  const handleMarkerClick = (vegetable) => {
    setSelectedVegetable(vegetable);
    console.log('선택된 채소 나눔:', vegetable);
  };

  const getStatusText = (current, limit) => {
    if (current >= limit) return { text: '마감', className: 'closed' };
    if (current / limit >= 0.8)
      return { text: '마감임박', className: 'almostFull' };
    return { text: '모집중', className: 'recruiting' };
  };

  const totalPosts = SAMPLE_VEGETABLES.length;
  const activePosts = SAMPLE_VEGETABLES.filter(
    (v) => v.current < v.limit
  ).length;
  const fullPosts = SAMPLE_VEGETABLES.filter(
    (v) => v.current >= v.limit
  ).length;

  return (
    <div className={styles.pageContainer}>
      {/* 헤더 */}
      <div className={styles.header}>
        <h1 className={styles.title}>🥕 채소 나눔 지도</h1>
        <p className={styles.description}>
          우리 동네 채소 나눔을 지도에서 확인하고 참여해보세요!
        </p>
      </div>

      {/* 통계 정보 */}
      <div className={styles.statsContainer}>
        <div className={`${styles.statCard} ${styles.total}`}>
          <div className={styles.statNumber}>{totalPosts}</div>
          <div className={styles.statLabel}>전체 나눔</div>
        </div>

        <div className={`${styles.statCard} ${styles.active}`}>
          <div className={styles.statNumber}>{activePosts}</div>
          <div className={styles.statLabel}>모집중</div>
        </div>

        <div className={`${styles.statCard} ${styles.full}`}>
          <div className={styles.statNumber}>{fullPosts}</div>
          <div className={styles.statLabel}>마감</div>
        </div>
      </div>

      {/* 지도 */}
      <div className={styles.mapSection}>
        <VegetableMap
          center={center}
          level={level}
          vegetables={SAMPLE_VEGETABLES}
          onMarkerClick={handleMarkerClick}
        />
      </div>

      {/* 채소 목록 */}
      <div className={styles.listSection}>
        <h2 className={styles.listTitle}>📋 나눔 목록</h2>

        <div className={styles.vegetableGrid}>
          {SAMPLE_VEGETABLES.map((vegetable) => {
            const status = getStatusText(vegetable.current, vegetable.limit);
            const isSelected = selectedVegetable?.id === vegetable.id;
            const icon = VEGETABLE_ICONS[vegetable.item] || '🥬';

            return (
              <div
                key={vegetable.id}
                onClick={() => {
                  setSelectedVegetable(vegetable);
                  setCenter({ lat: vegetable.lat, lng: vegetable.lng });
                  setLevel(3);
                }}
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
                    className={`${styles.participationCount} ${vegetable.current >= vegetable.limit ? styles.closed : styles.recruiting}`}
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
    </div>
  );
}
