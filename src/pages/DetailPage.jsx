import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './DetailPage.module.css';

// Import components
import FreshnessIndicator from '../components/detail/FreshnessIndicator';
import FreshnessInfo from '../components/detail/FreshnessInfo';
import TimeBox from '../components/detail/TimeBox';
import UserInfo from '../components/userInfo/UserInfo';
import MessageInput from '../components/message/MessageInput';

// Import images
import mainImage from '../assets/images/detail/main-image.png';
import profileImage from '../assets/images/detail/profile-image.png';
import backArrow from '../assets/images/detail/back-arrow.svg';

export default function DetailPage() {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/');
  };

  // 백엔드에서 받을 데이터 (현재는 기본값)
  const productData = {
    freshnessScore: 66,
    freshnessRating: 8,
    maxRating: 10,
    remainingHours: 17,
    remainingMinutes: 38,
  };

  const userData = {
    username: '냥냥펀치',
    location: '성북구 정릉1동',
    profileImage: profileImage,
  };

  const handleSendMessage = (message) => {
    console.log('메시지 전송:', message);
    // 여기에 메시지 전송 로직 추가
  };

  return (
    <div className={styles.container}>
      {/* Back Button */}
      <div className={styles.backButton} onClick={handleBackClick}>
        <img src={backArrow} alt="뒤로가기" />
      </div>

      {/* Main Image */}
      <div className={styles.mainImageContainer}>
        <img src={mainImage} alt="브로콜리" className={styles.mainImage} />
      </div>

      {/* User Info Section */}
      <div className={styles.userSection}>
        <UserInfo
          username={userData.username}
          location={userData.location}
          profileImage={userData.profileImage}
        />
        <FreshnessIndicator
          score={productData.freshnessScore}
          label="신선도 지수"
        />
      </div>

      {/* Separator Line */}
      <div className={styles.separator}></div>

      {/* Product Info */}
      <div className={styles.productInfo}>
        <div className={styles.category}>브로콜리</div>
        <div className={styles.title}>
          브로콜리 10개 남았어요~
          <br />
          세척해서 빨리 먹어야 해요
        </div>
        <div className={styles.registrationDate}>등록날짜: 2025/ 09/20</div>
      </div>

      {/* Time and Freshness Container */}
      <div className={styles.timeFreshnessContainer}>
        <FreshnessInfo
          score={productData.freshnessRating}
          maxScore={productData.maxRating}
        />
        <TimeBox
          hours={productData.remainingHours}
          minutes={productData.remainingMinutes}
        />
      </div>

      {/* Description */}
      <div className={styles.description}>
        저희 집 냉장고 정리를 위해 브로콜리 10개를 나눔하려고 합니다.
        <br />
        마트에서 직접 구매한 양파라 신선도는 10점 만점에
        <br />
        8점 정도 되는 것 같아요.
        <br />
        <br />
        사진을 보시면 아시겠지만 아주 싱싱합니다!
        <br />
        필요하신 분께 좋은 나눔이 되었으면 좋겠습니다.
        <br />
        편하게 채팅 주세요!
      </div>

      {/* Message Input */}
      <MessageInput
        participantsCount="3/4"
        placeholder="안녕하세요, 궁금해서 문의드려요."
        onSend={handleSendMessage}
      />
    </div>
  );
}
