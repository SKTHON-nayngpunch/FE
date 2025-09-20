import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SharingIngredientsCard from './SharingIngredientsCard';
import styles from './Deadline.module.css';
import { getClosingSoonFoods } from '@apis/axios';
import { hasToken } from '@utils/auth';

import image1 from '@assets/images/main/image1.png';


const Deadline = () => {
  const navigate = useNavigate();
  const [urgentCards, setUrgentCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // remainingSeconds를 시간과 분으로 변환하는 함수
  const convertSecondsToTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return { hours, minutes };
  };

  // 날짜 형식 변환 함수 (2025-09-20 -> 2025/09/20)
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return dateString.replace(/-/g, '/');
  };

  // 주소에서 동만 추출하는 함수
  const extractDong = (address) => {
    if (!address) return '';
    
    // 정규식으로 "동"이 포함된 부분 추출
    const dongMatch = address.match(/([가-힣]+동)/);
    if (dongMatch) {
      return dongMatch[1];
    }
    
    // "동"이 없으면 마지막 부분 반환 (구 단위까지)
    const parts = address.split(' ');
    return parts[parts.length - 1] || address;
  };

  // 서버 데이터를 컴포넌트 형식으로 변환하는 함수
  const transformServerData = (serverData) => {
    return serverData.map((item) => ({
      id: item.foodId,
      registrationDate: formatDate(item.createdDate),
      title: item.title,
      ingredientName: item.name,
      freshness: item.conditionScore,
      maxFreshness: 10, // 서버에서 최대값을 제공하지 않으므로 기본값 10으로 설정
      currentMembers: item.currentMember,
      totalMembers: item.maxMember,
      location: extractDong(item.location),
      remainingTime: convertSecondsToTime(item.remainingSeconds),
      imageUrl: item.foodImageUrl || image1, // 서버 이미지가 없으면 기본 이미지 사용
    }));
  };

  // 마감임박 데이터 가져오기
  const fetchClosingSoonFoods = async () => {
    console.log('🚀 fetchClosingSoonFoods 시작');
    
    try {
      setLoading(true);
      setError(null);

      // 토큰이 없는 경우 처리
      console.log('🔍 토큰 확인 중...');
      const tokenExists = hasToken();
      console.log('🔍 토큰 존재 여부:', tokenExists);
      
      if (!tokenExists) {
        console.log('❌ 토큰이 없음 - 로그인 필요');
        setError('로그인이 필요한 서비스입니다.');
        setUrgentCards([]);
        return;
      }

      console.log('📡 API 요청 시작...');
      const response = await getClosingSoonFoods();
      console.log('📡 API 응답:', response);
      
      if (response.success && response.data) {
        console.log('✅ 데이터 변환 중...', response.data);
        const transformedData = transformServerData(response.data);
        console.log('✅ 변환된 데이터:', transformedData);
        setUrgentCards(transformedData);
      } else {
        console.log('❌ 응답 데이터 구조 이상:', response);
        setError('데이터를 불러오는데 실패했습니다.');
        setUrgentCards([]);
      }
    } catch (error) {
      console.error('❌ 마감임박 데이터 가져오기 실패:', error);
      console.error('❌ 에러 상세:', error.response);
      
      // 인증 에러인 경우
      if (error.response?.status === 401) {
        setError('로그인이 만료되었습니다. 다시 로그인해주세요.');
      } else if (error.response?.status === 403) {
        setError('접근 권한이 없습니다.');
      } else if (error.response?.status >= 500) {
        setError('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      } else {
        setError('데이터를 불러오는데 실패했습니다.');
      }
      
      // 에러 시 빈 배열로 설정
      setUrgentCards([]);
    } finally {
      console.log('🏁 fetchClosingSoonFoods 완료');
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 데이터 가져오기
  useEffect(() => {
    console.log('🔄 Deadline useEffect 실행됨');
    fetchClosingSoonFoods();
  }, []);

  // 카드 클릭 핸들러
  const handleCardClick = (id) => {
    navigate(`/detail/${id}`);
  };

  return (
    <div className={styles.deadlineSection}>
      <h2 className={styles.deadlineTitle}>마감임박</h2>
      <div className={styles.deadlineCardsContainer}>
        {loading ? (
          <div className={styles.loadingMessage}>로딩 중...</div>
        ) : error ? (
          <div className={styles.errorMessage}>{error}</div>
        ) : urgentCards.length === 0 ? (
          <div className={styles.emptyMessage}>마감임박 상품이 없습니다.</div>
        ) : (
          urgentCards.map((card) => (
            <SharingIngredientsCard
              key={card.id}
              registrationDate={card.registrationDate}
              title={card.title}
              ingredientName={card.ingredientName}
              freshness={card.freshness}
              maxFreshness={card.maxFreshness}
              currentMembers={card.currentMembers}
              totalMembers={card.totalMembers}
              location={card.location}
              remainingTime={card.remainingTime}
              imageUrl={card.imageUrl}
              onClick={() => handleCardClick(card.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Deadline;
