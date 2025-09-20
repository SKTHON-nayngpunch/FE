import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import APIService from '@apis/axios';
import styles from './DetailPage.module.css';

// Import components
import FreshnessIndicator from '@components/detail/FreshnessIndicator';
import FreshnessInfo from '@components/detail/FreshnessInfo';
import TimeBox from '@components/detail/TimeBox';
import UserInfo from '@components/userInfo/UserInfo';
import MessageInput from '@components/message/MessageInput';

// Import images
import mainImage from '@assets/images/detail/main-image.png';
import profileImage from '@assets/images/detail/profile-image.png';
import backArrow from '@assets/images/detail/back-arrow.svg';
import logo from '@assets/images/logo.svg';

export default function DetailPage() {
  const navigate = useNavigate();
  const { id } = useParams(); // URL에서 foodId 추출

  // 상태 관리
  const [foodData, setFoodData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleBackClick = () => {
    navigate('/');
  };

  // 초를 시간/분으로 변환하는 함수
  const convertSecondsToTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return { hours, minutes };
  };

  // conditionScore를 freshnessScore로 변환 (0-10 → 0-100)
  const calculateFreshnessScore = (conditionScore) => {
    return Math.round(conditionScore * 10);
  };

  // API 호출 함수
  const fetchFoodDetail = async (foodId) => {
    try {
      setLoading(true);
      console.log(`🔍 음식 상세 정보 조회 중... foodId: ${foodId}`);

      const response = await APIService.private.get(`/api/foods/${foodId}`);

      if (response.data.success) {
        console.log('✅ 음식 상세 정보 조회 성공:', response.data.data);
        setFoodData(response.data.data);
      } else {
        throw new Error(response.data.message || '데이터 조회에 실패했습니다.');
      }
    } catch (err) {
      console.error('❌ 음식 상세 정보 조회 실패:', err);
      setError(err.message || '데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 API 호출
  useEffect(() => {
    if (id) {
      fetchFoodDetail(id);
    } else {
      setError('잘못된 접근입니다.');
      setLoading(false);
    }
  }, [id]);

  const handleSendMessage = (message) => {
    console.log('메시지 전송:', message);
    // 여기에 메시지 전송 로직 추가
  };

  // 로딩 상태
  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.backButton} onClick={handleBackClick}>
          <img src={backArrow} alt="뒤로가기" />
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '50vh',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <div style={{ width: '48px', height: '48px' }}>
            <img
              src={logo}
              alt="로고"
              style={{ width: '100%', height: '100%' }}
            />
          </div>
          <h2>로딩 중...</h2>
          <p style={{ color: '#666' }}>음식 정보를 불러오고 있습니다.</p>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.backButton} onClick={handleBackClick}>
          <img src={backArrow} alt="뒤로가기" />
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '50vh',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <div style={{ fontSize: '48px' }}>❌</div>
          <h2>오류가 발생했습니다</h2>
          <p style={{ color: '#666' }}>{error}</p>
          <button
            onClick={() => fetchFoodDetail(id)}
            style={{
              background: '#51cf66',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  // 데이터가 없는 경우
  if (!foodData) {
    return (
      <div className={styles.container}>
        <div className={styles.backButton} onClick={handleBackClick}>
          <img src={backArrow} alt="뒤로가기" />
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '50vh',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <div style={{ fontSize: '48px' }}>🔍</div>
          <h2>데이터를 찾을 수 없습니다</h2>
          <p style={{ color: '#666' }}>
            요청하신 음식 정보가 존재하지 않습니다.
          </p>
        </div>
      </div>
    );
  }

  // API 데이터로부터 계산된 값들
  const timeData = convertSecondsToTime(foodData.remainingSeconds);
  const freshnessScore = calculateFreshnessScore(foodData.conditionScore);

  return (
    <div className={styles.container}>
      {/* Back Button */}
      <div className={styles.backButton} onClick={handleBackClick}>
        <img src={backArrow} alt="뒤로가기" />
      </div>

      {/* Main Image */}
      <div className={styles.mainImageContainer}>
        <img
          src={foodData.foodImageUrl}
          alt={foodData.name}
          className={styles.mainImage}
          onError={(e) => {
            e.target.src = mainImage; // 이미지 로드 실패시 기본 이미지
          }}
        />
      </div>

      {/* User Info Section */}
      <div className={styles.userSection}>
        <UserInfo
          username={foodData.writerNickname}
          location={foodData.writerAddress}
          profileImage={foodData.writerProfileImageUrl}
        />
        <FreshnessIndicator score={freshnessScore} label="신선도 지수" />
      </div>

      {/* Separator Line */}
      <div className={styles.separator}></div>

      {/* Product Info */}
      <div className={styles.productInfo}>
        <div className={styles.category}>{foodData.name}</div>
        <div className={styles.title}>{foodData.title}</div>
        <div className={styles.registrationDate}>
          등록날짜: {foodData.createdDate.replace(/-/g, '/ ')}
        </div>
      </div>

      {/* Time and Freshness Container */}
      <div className={styles.timeFreshnessContainer}>
        <FreshnessInfo score={foodData.conditionScore} maxScore={10} />
        <TimeBox hours={timeData.hours} minutes={timeData.minutes} />
      </div>

      {/* AI Analysis */}
      {foodData.analysis && (
        <div className={styles.analysis}>
          <h4 style={{ margin: '0 0 8px 0', color: '#51cf66' }}>
            🤖 AI 분석 결과
          </h4>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
            {foodData.analysis}
          </p>
        </div>
      )}

      {/* Description */}
      <div className={styles.description}>
        {foodData.content.split('\n').map((line, index) => (
          <span key={index}>
            {line}
            {index < foodData.content.split('\n').length - 1 && <br />}
          </span>
        ))}
      </div>

      {/* Message Input */}
      <MessageInput
        participantsCount={`${foodData.currentMember}/${foodData.maxMember}`}
        placeholder="안녕하세요, 궁금해서 문의드려요."
        onSend={handleSendMessage}
      />
    </div>
  );
}
